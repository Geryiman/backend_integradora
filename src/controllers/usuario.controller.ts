import fs from "fs";
import { Request, Response } from "express";
import db from "../config/db"; // Importar la conexión a MySQL
import { ResultSetHeader, RowDataPacket } from "mysql2";
import bcrypt from "bcrypt";
import multer from "multer";
import path from "path";

const BASE_URL = "http://192.168.1.27:3000";
const UPLOADS_FOLDER = path.join(__dirname, "../../uploads");

// ✅ Verificar si `uploads/` existe y crearlo si no
if (!fs.existsSync(UPLOADS_FOLDER)) {
  fs.mkdirSync(UPLOADS_FOLDER, { recursive: true });
}

// 📌 Configuración de `multer` para subir imágenes
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Carpeta donde se guardan las imágenes
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

export const upload = multer({ storage });

// 📌 Inicio de Sesión
export const loginUsuario = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ error: "Todos los campos son obligatorios." });
    return;
  }

  try {
    const [rows] = await db.execute("SELECT * FROM Usuarios WHERE email = ? LIMIT 1", [email]);
    const data = rows as RowDataPacket[];

    if (data.length === 0) {
      res.status(401).json({ error: "Usuario no encontrado." });
      return;
    }

    const usuario = data[0];

    // ✅ Comparar contraseña encriptada con `bcrypt`
    const passwordCorrecto = await bcrypt.compare(password, usuario.password);
    if (!passwordCorrecto) {
      res.status(401).json({ error: "Contraseña incorrecta." });
      return;
    }

    res.json({
      message: "Inicio de sesión exitoso",
      usuario: {
        id_usuario: usuario.id_usuario,
        nombre: usuario.nombre,
        email: usuario.email,
        puntos_totales: usuario.puntos_totales,
        profileImage: usuario.profileImage || null,
      },
    });

  } catch (error) {
    console.error("❌ Error en loginUsuario:", error);
    res.status(500).json({ error: "Error interno al iniciar sesión." });
  }
};

// 📌 Obtener todos los usuarios
export const getUsuarios = async (req: Request, res: Response): Promise<void> => {
  try {
    const [rows] = await db.execute("SELECT id_usuario, nombre, email, puntos_totales, profileImage FROM Usuarios");
    res.json(rows as RowDataPacket[]);
  } catch (error) {
    console.error("❌ Error en getUsuarios:", error);
    res.status(500).json({ error: "Error obteniendo los usuarios." });
  }
};

// 📌 Crear un nuevo usuario
export const createUsuario = async (req: Request, res: Response): Promise<void> => {
  const { nombre, email, password } = req.body;

  if (!nombre || !email || !password) {
    res.status(400).json({ error: "Todos los campos son obligatorios" });
    return;
  }

  try {
    // ✅ Encriptar la contraseña antes de guardarla
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const [results] = await db.execute(
      "INSERT INTO Usuarios (nombre, email, password) VALUES (?, ?, ?)",
      [nombre, email, hashedPassword]
    );

    const result = results as ResultSetHeader;
    res.status(201).json({ message: "Usuario creado", id: result.insertId });

  } catch (error) {
    console.error("❌ Error en createUsuario:", error);
    res.status(500).json({ error: "Error interno al crear el usuario." });
  }
};

// 📌 Obtener usuario por ID
export const getUsuarioById = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const [rows] = await db.execute(
      "SELECT id_usuario, nombre, email, puntos_totales, profileImage FROM Usuarios WHERE id_usuario = ?",
      [id]
    );

    const data = rows as RowDataPacket[];
    if (data.length === 0) {
      res.status(404).json({ error: "Usuario no encontrado" });
      return;
    }

    const user = data[0];
    user.profileImage = user.profileImage ? user.profileImage : `${BASE_URL}/uploads/default-profile.jpg`;

    res.json(user);

  } catch (error) {
    console.error("❌ Error en getUsuarioById:", error);
    res.status(500).json({ error: "Error obteniendo el usuario." });
  }
};

// 📌 Subir o Actualizar Imagen de Perfil
export const uploadProfileImage = async (req: Request & { file?: Express.Multer.File }, res: Response): Promise<void> => {
  const { id_usuario } = req.params;

  if (!req.file) {
    res.status(400).json({ error: "No se subió ninguna imagen" });
    return;
  }

  const profileImage = `${BASE_URL}/uploads/${req.file.filename}`;

  try {
    const [results] = await db.execute(
      "UPDATE Usuarios SET profileImage = ? WHERE id_usuario = ?",
      [profileImage, id_usuario]
    );

    const result = results as ResultSetHeader;
    if (result.affectedRows === 0) {
      res.status(404).json({ error: "Usuario no encontrado" });
      return;
    }

    res.json({ message: "Imagen actualizada correctamente", profileImage });

  } catch (error) {
    console.error("❌ Error en uploadProfileImage:", error);
    res.status(500).json({ error: "Error al actualizar la imagen de perfil." });
  }
};

// 📌 Actualizar un usuario
export const updateUsuario = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { nombre, email, password, puntos_totales } = req.body;

  try {
    let query = "UPDATE Usuarios SET nombre = ?, email = ?, puntos_totales = ? WHERE id_usuario = ?";
    let params: any[] = [nombre, email, puntos_totales, id];

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      query = "UPDATE Usuarios SET nombre = ?, email = ?, password = ?, puntos_totales = ? WHERE id_usuario = ?";
      params = [nombre, email, hashedPassword, puntos_totales, id];
    }

    const [results] = await db.execute(query, params);
    const result = results as ResultSetHeader;

    if (result.affectedRows === 0) {
      res.status(404).json({ error: "Usuario no encontrado" });
      return;
    }

    res.json({ message: "Usuario actualizado correctamente" });

  } catch (error) {
    console.error("❌ Error en updateUsuario:", error);
    res.status(500).json({ error: "Error al actualizar el usuario." });
  }
};

// 📌 Eliminar un usuario
export const deleteUsuario = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const [results] = await db.execute("DELETE FROM Usuarios WHERE id_usuario = ?", [id]);
    const result = results as ResultSetHeader;

    if (result.affectedRows === 0) {
      res.status(404).json({ error: "Usuario no encontrado" });
      return;
    }

    res.json({ message: "Usuario eliminado correctamente" });

  } catch (error) {
    console.error("❌ Error en deleteUsuario:", error);
    res.status(500).json({ error: "Error al eliminar el usuario." });
  }
};
