import pool from "../config/db";
import { RowDataPacket, OkPacket } from "mysql2";

export class TareaModel {
  static async getAllTareas() {
    const [rows] = await pool.query<RowDataPacket[]>("SELECT * FROM Tareas");
    return rows;
  }

  static async getTareaById(id: number) {
    const [rows] = await pool.query<RowDataPacket[]>(
      "SELECT * FROM Tareas WHERE id_tarea = ?",
      [id]
    );
    return rows[0] || null;
  }

  static async createTarea(
    descripcion: string,
    puntos: number,
    tipo: string,
    fecha_inicio?: string,
    fecha_fin?: string,
    botellas_necesarias: number = 1
  ) {
    const [result] = await pool.query<OkPacket>(
      `INSERT INTO Tareas (descripcion, puntos, tipo, fecha_inicio, fecha_fin, botellas_necesarias)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [descripcion, puntos, tipo, fecha_inicio || null, fecha_fin || null, botellas_necesarias]
    );

    return {
      id_tarea: result.insertId,
      descripcion,
      puntos,
      tipo,
      fecha_inicio,
      fecha_fin,
      botellas_necesarias
    };
  }

  static async updateTarea(
    id: number,
    descripcion: string,
    puntos: number,
    tipo: string,
    fecha_inicio?: string,
    fecha_fin?: string,
    botellas_necesarias: number = 1
  ) {
    await pool.query<OkPacket>(
      `UPDATE Tareas
       SET descripcion = ?, puntos = ?, tipo = ?, fecha_inicio = ?, fecha_fin = ?, botellas_necesarias = ?
       WHERE id_tarea = ?`,
      [descripcion, puntos, tipo, fecha_inicio || null, fecha_fin || null, botellas_necesarias, id]
    );

    return {
      message: "Tarea actualizada correctamente",
      id_tarea: id,
      botellas_necesarias
    };
  }

  static async deleteTarea(id: number) {
    await pool.query<OkPacket>("DELETE FROM Tareas WHERE id_tarea = ?", [id]);
    return { message: "Tarea eliminada correctamente", id_tarea: id };
  }

  static async makeTareaEspecial(id: number, fecha_inicio: string, fecha_fin: string) {
    await pool.query<OkPacket>(
      `UPDATE Tareas SET tipo = 'Especial', fecha_inicio = ?, fecha_fin = ?
       WHERE id_tarea = ?`,
      [fecha_inicio, fecha_fin, id]
    );
    return { message: "Tarea convertida en especial correctamente", id_tarea: id };
  }

  static async getTareasByUsuario(id_usuario: number) {
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT t.*
       FROM Tareas t
       JOIN Usuario_Tarea ut ON t.id_tarea = ut.id_tarea
       WHERE ut.id_usuario = ?`,
      [id_usuario]
    );
    return rows;
  }

  static async getTareasPendientes(id_usuario: number) {
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT t.*
       FROM Tareas t
       WHERE t.id_tarea NOT IN (
         SELECT id_tarea FROM Usuario_Tarea WHERE id_usuario = ?
       )`,
      [id_usuario]
    );
    return rows;
  }

  static async getTareasCompletadas(id_usuario: number) {
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT t.*, ut.fecha_completada
       FROM Tareas t
       JOIN Usuario_Tarea ut ON t.id_tarea = ut.id_tarea
       WHERE ut.id_usuario = ?`,
      [id_usuario]
    );
    return rows;
  }
}
