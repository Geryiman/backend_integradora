  import connection from "../config/db";
  import { RowDataPacket, ResultSetHeader } from "mysql2"; // Importa los tipos correctos

  export class TareaModel {
    // Obtener todas las tareas
    static getAllTareas(): Promise<any> {
      return new Promise((resolve, reject) => {
        connection.query("SELECT * FROM Tareas", (err, results) => {
          if (err) reject(err);
          else resolve(results as RowDataPacket[]); // ⚡ Especificamos el tipo correcto
        });
      });
    }

    // Obtener una tarea por ID
    static getTareaById(id: number): Promise<any> {
      return new Promise((resolve, reject) => {
        connection.query(
          "SELECT * FROM Tareas WHERE id_tarea = ?",
          [id],
          (err, results) => {
            if (err) reject(err);
            else resolve((results as RowDataPacket[])[0]); // ⚡ Especificamos el tipo correctamente
          }
        );
      });
    }

    // Crear una nueva tarea
    static createTarea(
      descripcion: string,
      puntos: number,
      tipo: string,
      fecha_inicio?: string,
      fecha_fin?: string
    ): Promise<any> {
      return new Promise((resolve, reject) => {
        connection.query(
          "INSERT INTO Tareas (descripcion, puntos, tipo, fecha_inicio, fecha_fin) VALUES (?, ?, ?, ?, ?)",
          [descripcion, puntos, tipo, fecha_inicio || null, fecha_fin || null],
          (err, results) => {
            if (err) reject(err);
            else {
              const insertId = (results as ResultSetHeader).insertId; // ⚡ Accedemos correctamente al insertId
              resolve({ id_tarea: insertId, descripcion, puntos, tipo, fecha_inicio, fecha_fin });
            }
          }
        );
      });
    }

    // Actualizar una tarea
    static updateTarea(
      id: number,
      descripcion: string,
      puntos: number,
      tipo: string,
      fecha_inicio?: string,
      fecha_fin?: string
    ): Promise<any> {
      return new Promise((resolve, reject) => {
        connection.query(
          "UPDATE Tareas SET descripcion = ?, puntos = ?, tipo = ?, fecha_inicio = ?, fecha_fin = ? WHERE id_tarea = ?",
          [descripcion, puntos, tipo, fecha_inicio || null, fecha_fin || null, id],
          (err, results) => {
            if (err) reject(err);
            else resolve({ id_tarea: id, descripcion, puntos, tipo, fecha_inicio, fecha_fin });
          }
        );
      });
    }

    // Eliminar una tarea
    static deleteTarea(id: number): Promise<any> {
      return new Promise((resolve, reject) => {
        connection.query("DELETE FROM Tareas WHERE id_tarea = ?", [id], (err, results) => {
          if (err) reject(err);
          else resolve({ message: "Tarea eliminada correctamente", id_tarea: id });
        });
      });
    }

    // Obtener todas las tareas de un usuario específico
static getTareasByUsuario(id_usuario: number): Promise<any> {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT T.*
      FROM Tareas T
      INNER JOIN Usuario_Tarea UT ON T.id_tarea = UT.id_tarea
      WHERE UT.id_usuario = ?;
    `;
    connection.query(query, [id_usuario], (err, results) => {
      if (err) reject(err);
      else resolve(results as RowDataPacket[]);
    });
  });
}

// Obtener tareas que aún no ha completado un usuario
static getTareasPendientes(id_usuario: number): Promise<any> {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT T.*
      FROM Tareas T
      LEFT JOIN Usuario_Tarea UT ON T.id_tarea = UT.id_tarea AND UT.id_usuario = ?
      WHERE UT.id_usuario IS NULL;
    `;
    connection.query(query, [id_usuario], (err, results) => {
      if (err) reject(err);
      else resolve(results as RowDataPacket[]);
    });
  });
}

// Obtener tareas COMPLETADAS por un usuario
static getTareasCompletadas(id_usuario: number): Promise<any> {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT T.*
      FROM Tareas T
      INNER JOIN Usuario_Tarea UT ON T.id_tarea = UT.id_tarea
      WHERE UT.id_usuario = ?;
    `;
    connection.query(query, [id_usuario], (err, results) => {
      if (err) reject(err);
      else resolve(results as RowDataPacket[]);
    });
  });
}



    // Convertir una tarea normal en especial
    static makeTareaEspecial(id: number, fecha_inicio: string, fecha_fin: string): Promise<any> {
      return new Promise((resolve, reject) => {
        connection.query(
          "UPDATE Tareas SET tipo = 'Especial', fecha_inicio = ?, fecha_fin = ? WHERE id_tarea = ?",
          [fecha_inicio, fecha_fin, id],
          (err, results) => {
            if (err) reject(err);
            else resolve({ message: "Tarea convertida en especial correctamente", id_tarea: id });
          }
        );
      });
    }
  }

  