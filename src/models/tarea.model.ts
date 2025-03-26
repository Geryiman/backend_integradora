import db from "../config/db";
import { RowDataPacket, ResultSetHeader } from "mysql2";

export class TareaModel {
  // 📌 Obtener todas las tareas
  static async getAllTareas(): Promise<RowDataPacket[]> {
    try {
      const [rows] = await db.execute("SELECT * FROM Tareas");
      return rows as RowDataPacket[];
    } catch (error) {
      throw new Error(`Error obteniendo tareas: ${error}`);
    }
  }

  // 📌 Obtener una tarea por ID
  static async getTareaById(id: number): Promise<RowDataPacket | null> {
    try {
      const [rows] = await db.execute("SELECT * FROM Tareas WHERE id_tarea = ?", [id]);
      const tareas = rows as RowDataPacket[];
      return tareas.length > 0 ? tareas[0] : null;
    } catch (error) {
      throw new Error(`Error obteniendo tarea: ${error}`);
    }
  }

  // 📌 Crear una nueva tarea
  static async createTarea(
    descripcion: string,
    puntos: number,
    tipo: string,
    fecha_inicio?: string,
    fecha_fin?: string
  ): Promise<{ id_tarea: number; descripcion: string; puntos: number; tipo: string; fecha_inicio?: string; fecha_fin?: string }> {
    try {
      const [results] = await db.execute(
        "INSERT INTO Tareas (descripcion, puntos, tipo, fecha_inicio, fecha_fin) VALUES (?, ?, ?, ?, ?)",
        [descripcion, puntos, tipo, fecha_inicio || null, fecha_fin || null]
      );

      const result = results as ResultSetHeader;
      return { id_tarea: result.insertId, descripcion, puntos, tipo, fecha_inicio, fecha_fin };
    } catch (error) {
      throw new Error(`Error creando tarea: ${error}`);
    }
  }

  // 📌 Actualizar una tarea
  static async updateTarea(
    id: number,
    descripcion: string,
    puntos: number,
    tipo: string,
    fecha_inicio?: string,
    fecha_fin?: string
  ): Promise<{ message: string; id_tarea: number }> {
    try {
      const [results] = await db.execute(
        "UPDATE Tareas SET descripcion = ?, puntos = ?, tipo = ?, fecha_inicio = ?, fecha_fin = ? WHERE id_tarea = ?",
        [descripcion, puntos, tipo, fecha_inicio || null, fecha_fin || null, id]
      );

      const result = results as ResultSetHeader;
      if (result.affectedRows === 0) {
        throw new Error("Tarea no encontrada.");
      }

      return { message: "Tarea actualizada correctamente.", id_tarea: id };
    } catch (error) {
      throw new Error(`Error actualizando tarea: ${error}`);
    }
  }

  // 📌 Eliminar una tarea
  static async deleteTarea(id: number): Promise<{ message: string; id_tarea: number }> {
    try {
      const [results] = await db.execute("DELETE FROM Tareas WHERE id_tarea = ?", [id]);
      const result = results as ResultSetHeader;

      if (result.affectedRows === 0) {
        throw new Error("Tarea no encontrada.");
      }

      return { message: "Tarea eliminada correctamente.", id_tarea: id };
    } catch (error) {
      throw new Error(`Error eliminando tarea: ${error}`);
    }
  }

  // 📌 Obtener todas las tareas de un usuario específico
  static async getTareasByUsuario(id_usuario: number): Promise<RowDataPacket[]> {
    try {
      const [rows] = await db.execute(
        `SELECT T.*
        FROM Tareas T
        INNER JOIN Usuario_Tarea UT ON T.id_tarea = UT.id_tarea
        WHERE UT.id_usuario = ?`,
        [id_usuario]
      );
      return rows as RowDataPacket[];
    } catch (error) {
      throw new Error(`Error obteniendo tareas del usuario: ${error}`);
    }
  }

  // 📌 Obtener tareas que aún no ha completado un usuario
  static async getTareasPendientes(id_usuario: number): Promise<RowDataPacket[]> {
    try {
      const [rows] = await db.execute(
        `SELECT T.*
        FROM Tareas T
        WHERE T.id_tarea NOT IN (
          SELECT UT.id_tarea FROM Usuario_Tarea UT WHERE UT.id_usuario = ?
        )`,
        [id_usuario]
      );
      return rows as RowDataPacket[];
    } catch (error) {
      throw new Error(`Error obteniendo tareas pendientes del usuario: ${error}`);
    }
  }

  // 📌 Obtener tareas COMPLETADAS por un usuario
  static async getTareasCompletadas(id_usuario: number): Promise<RowDataPacket[]> {
    try {
      const [rows] = await db.execute(
        `SELECT T.*
        FROM Tareas T
        INNER JOIN Usuario_Tarea UT ON T.id_tarea = UT.id_tarea
        WHERE UT.id_usuario = ?`,
        [id_usuario]
      );
      return rows as RowDataPacket[];
    } catch (error) {
      throw new Error(`Error obteniendo tareas completadas del usuario: ${error}`);
    }
  }

  // 📌 Convertir una tarea normal en especial
  static async makeTareaEspecial(id: number, fecha_inicio: string, fecha_fin: string): Promise<{ message: string; id_tarea: number }> {
    try {
      const [results] = await db.execute(
        "UPDATE Tareas SET tipo = 'Especial', fecha_inicio = ?, fecha_fin = ? WHERE id_tarea = ?",
        [fecha_inicio, fecha_fin, id]
      );

      const result = results as ResultSetHeader;
      if (result.affectedRows === 0) {
        throw new Error("Tarea no encontrada.");
      }

      return { message: "Tarea convertida en especial correctamente.", id_tarea: id };
    } catch (error) {
      throw new Error(`Error modificando la tarea: ${error}`);
    }
  }
}
