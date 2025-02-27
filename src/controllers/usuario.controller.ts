import fs from 'fs';
import { Request, Response } from "express";
import connection from "../config/db";
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


// =======================
// 📌 Configuración de `multer` para subir imágenes
// =======================
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Carpeta donde se guardan las imágenes
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

export const upload = multer({ storage });

// =======================
// 📌 Inicio de Sesión
// =======================
export const loginUsuario = (req: Request, res: Response): void => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ error: "Todos los campos son obligatorios." });
    return;
  }

  connection.query(
    "SELECT * FROM Usuarios WHERE email = ? LIMIT 1",
    [email],
    async (err, results) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }

      const data = results as RowDataPacket[];
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
    }
  );
};

// =======================
// 📌 Obtener todos los usuarios
// =======================
export const getUsuarios = (req: Request, res: Response): void => {
  connection.query(
    "SELECT id_usuario, nombre, email, puntos_totales, profileImage FROM Usuarios",
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });

      res.json(results as RowDataPacket[]);
    }
  );
};

// =======================
// 📌 Crear un nuevo usuario
// =======================
export const createUsuario = async (req: Request, res: Response): Promise<void> => {
  const { nombre, email, password } = req.body;

  if (!nombre || !email || !password) {
    res.status(400).json({ error: "Todos los campos son obligatorios" });
    return;
  }

  // ✅ Encriptar la contraseña antes de guardarla
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  connection.query(
    "INSERT INTO Usuarios (nombre, email, password) VALUES (?, ?, ?)",
    [nombre, email, hashedPassword],
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });

      const result = results as ResultSetHeader;
      res.status(201).json({ message: "Usuario creado", id: result.insertId });
    }
  );
};

// =======================
// 📌 Obtener usuario por ID con imagen de perfil
// =======================
export const getUsuarioById = (req: Request, res: Response): void => {
  const { id } = req.params;

  connection.query(
    "SELECT id_usuario, nombre, email, puntos_totales, profileImage FROM Usuarios WHERE id_usuario = ?",
    [id],
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });

      const data = results as RowDataPacket[];
      if (data.length === 0) {
        res.status(404).json({ error: "Usuario no encontrado" });
        return;
      }

      // ✅ Verifica que `profileImage` tenga una URL válida
      const user = data[0];
      user.profileImage = user.profileImage ? user.profileImage : `${BASE_URL}/uploads/default-profile.jpg`;

      res.json(user);
    }
  );
};

// =======================
// 📌 Subir o Actualizar Imagen de Perfil
// =======================
export const uploadProfileImage = async (req: Request & { file?: Express.Multer.File }, res: Response): Promise<void> => {
  const { id_usuario } = req.params;

  if (!req.file) {
    res.status(400).json({ error: "No se subió ninguna imagen" });
    return;
  }

  // ✅ Guardar la URL completa de la imagen
  const profileImage = `${BASE_URL}/uploads/${req.file.filename}`;

  connection.query(
    "UPDATE Usuarios SET profileImage = ? WHERE id_usuario = ?",
    [profileImage, id_usuario],
    (err, results) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }

      const result = results as ResultSetHeader;
      if (result.affectedRows === 0) {
        res.status(404).json({ error: "Usuario no encontrado" });
        return;
      }

      res.json({ message: "Imagen actualizada correctamente", profileImage });
    }
  );
};
// =======================
// 📌 Actualizar un usuario
// =======================
export const updateUsuario = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { nombre, email, password, puntos_totales } = req.body;

  let query = "UPDATE Usuarios SET nombre = ?, email = ?, puntos_totales = ? WHERE id_usuario = ?";
  let params: any[] = [nombre, email, puntos_totales, id];

  if (password) {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    query = "UPDATE Usuarios SET nombre = ?, email = ?, password = ?, puntos_totales = ? WHERE id_usuario = ?";
    params = [nombre, email, hashedPassword, puntos_totales, id];
  }

  connection.query(query, params, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });

    const result = results as ResultSetHeader;
    if (result.affectedRows === 0) {
      res.status(404).json({ error: "Usuario no encontrado" });
      return;
    }

    res.json({ message: "Usuario actualizado correctamente" });
  });
};

// =======================
// 📌 Eliminar un usuario
// =======================
export const deleteUsuario = (req: Request, res: Response): void => {
  const { id } = req.params;

  connection.query("DELETE FROM Usuarios WHERE id_usuario = ?", [id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });

    const result = results as ResultSetHeader;
    if (result.affectedRows === 0) {
      res.status(404).json({ error: "Usuario no encontrado" });
      return;
    }

    res.json({ message: "Usuario eliminado correctamente" });
  });
};
