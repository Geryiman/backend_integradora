import fs from "fs";
import path from "path";
import bcrypt from "bcrypt";
import multer from "multer";
import { Request, Response } from "express";
import pool from "../config/db";
import { RowDataPacket, ResultSetHeader } from "mysql2";
import { PutObjectCommand, PutObjectCommandInput } from "@aws-sdk/client-s3";
import s3Client from "../config/s3Client";

const BASE_URL = "https://salud-magenes.sfo2.digitaloceanspaces.com";
const BUCKET_NAME = "salud-magenes";

// 📦 Configuración multer (para buffer en memoria)
const storage = multer.memoryStorage();
export const upload = multer({ storage });

// =======================
// 📌 Inicio de sesión
// =======================
export const loginUsuario = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ error: "Todos los campos son obligatorios." });
    return;
  }

  try {
    const [result] = await pool.query<RowDataPacket[]>(
      "SELECT * FROM Usuarios WHERE email = ? LIMIT 1",
      [email]
    );

    if (result.length === 0) {
      res.status(401).json({ error: "Usuario no encontrado." });
      return;
    }

    const usuario = result[0];
    const valid = await bcrypt.compare(password, usuario.password);
    if (!valid) {
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
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// =======================
// 📌 Obtener todos los usuarios
// =======================
export const getUsuarios = async (_req: Request, res: Response): Promise<void> => {
  try {
    const [rows] = await pool.query<RowDataPacket[]>(
      "SELECT id_usuario, nombre, email, puntos_totales, profileImage FROM Usuarios"
    );
    res.json(rows);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// =======================
// 📌 Crear nuevo usuario
// =======================
export const createUsuario = async (req: Request, res: Response): Promise<void> => {
  const { nombre, email, password } = req.body;

  if (!nombre || !email || !password) {
    res.status(400).json({ error: "Todos los campos son obligatorios" });
    return;
  }

  try {
    const hash = await bcrypt.hash(password, 10);
    const [result] = await pool.query<ResultSetHeader>(
      "INSERT INTO Usuarios (nombre, email, password) VALUES (?, ?, ?)",
      [nombre, email, hash]
    );
    res.status(201).json({ message: "Usuario creado", id: result.insertId });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// =======================
// 📌 Obtener usuario por ID
// =======================
export const getUsuarioById = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const [result] = await pool.query<RowDataPacket[]>(
      "SELECT id_usuario, nombre, email, puntos_totales, profileImage FROM Usuarios WHERE id_usuario = ?",
      [id]
    );

    if (result.length === 0) {
      res.status(404).json({ error: "Usuario no encontrado" });
      return;
    }

    const user = result[0];
    user.profileImage = user.profileImage || `${BASE_URL}/default-profile.jpg`;

    res.json(user);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// =======================
// 📌 Subir/Actualizar imagen de perfil a DigitalOcean Spaces
// =======================
export const uploadProfileImage = async (
  req: Request & { file?: Express.Multer.File },
  res: Response
): Promise<void> => {
  const { id_usuario } = req.params;

  if (!req.file) {
    res.status(400).json({ error: "No se subió ninguna imagen" });
    return;
  }

  try {
    const fileName = `perfil-${Date.now()}-${req.file.originalname}`;
    const key = `ecopet/perfiles/${id_usuario}/${fileName}`;

    const uploadParams: PutObjectCommandInput = {
      Bucket: BUCKET_NAME,
      Key: key,
      Body: req.file.buffer,
      ACL: "public-read",
      ContentType: req.file.mimetype,
    };

    await s3Client.send(new PutObjectCommand(uploadParams));

    const imageUrl = `${BASE_URL}/${key}`;

    const [result] = await pool.query<ResultSetHeader>(
      "UPDATE Usuarios SET profileImage = ? WHERE id_usuario = ?",
      [imageUrl, id_usuario]
    );

    if (result.affectedRows === 0) {
      res.status(404).json({ error: "Usuario no encontrado" });
      return;
    }

    res.json({ message: "Imagen actualizada correctamente", profileImage: imageUrl });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// =======================
// 📌 Actualizar usuario
// =======================
export const updateUsuario = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { nombre, email, password, puntos_totales } = req.body;

  try {
    let query: string;
    let params: any[];

    if (password) {
      const hash = await bcrypt.hash(password, 10);
      query = `UPDATE Usuarios SET nombre = ?, email = ?, password = ?, puntos_totales = ? WHERE id_usuario = ?`;
      params = [nombre, email, hash, puntos_totales, id];
    } else {
      query = `UPDATE Usuarios SET nombre = ?, email = ?, puntos_totales = ? WHERE id_usuario = ?`;
      params = [nombre, email, puntos_totales, id];
    }

    const [result] = await pool.query<ResultSetHeader>(query, params);

    if (result.affectedRows === 0) {
      res.status(404).json({ error: "Usuario no encontrado" });
      return;
    }

    res.json({ message: "Usuario actualizado correctamente" });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// =======================
// 📌 Eliminar usuario
// =======================
export const deleteUsuario = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const [result] = await pool.query<ResultSetHeader>(
      "DELETE FROM Usuarios WHERE id_usuario = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      res.status(404).json({ error: "Usuario no encontrado" });
      return;
    }

    res.json({ message: "Usuario eliminado correctamente" });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
