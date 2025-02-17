import { Request, Response } from "express";
import connection from "../config/db";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import bcrypt from "bcrypt";

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
        },
      });
    }
  );
};

// =======================
// 📌 Obtener todos los usuarios
// =======================
export const getUsuarios = (req: Request, res: Response): void => {
  connection.query("SELECT id_usuario, nombre, email, puntos_totales FROM Usuarios", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });

    res.json(results as RowDataPacket[]);
  });
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
// 📌 Obtener usuario por ID
// =======================
export const getUsuarioById = (req: Request, res: Response): void => {
  const { id } = req.params;

  connection.query(
    "SELECT id_usuario, nombre, email, puntos_totales FROM Usuarios WHERE id_usuario = ?",
    [id],
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });

      const data = results as RowDataPacket[];
      if (data.length === 0) {
        res.status(404).json({ error: "Usuario no encontrado" });
        return;
      }

      res.json(data[0]);
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
