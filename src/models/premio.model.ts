import pool from "../config/db";
import { RowDataPacket, OkPacket } from "mysql2";

// ✅ Obtener todos los premios (recompensas)
export const obtenerPremios = async (): Promise<RowDataPacket[]> => {
  const [rows] = await pool.query<RowDataPacket[]>(
    "SELECT * FROM Recompensas"
  );
  return rows;
};

// ✅ Canjear un premio (resta puntos al usuario si tiene suficientes)
export const canjearPremio = async (
  id_usuario: number,
  id_recompensa: number
): Promise<boolean> => {
  try {
    // 1. Obtener puntos necesarios del premio
    const [recompensaResult] = await pool.query<RowDataPacket[]>(
      "SELECT puntos_necesarios FROM Recompensas WHERE id_recompensa = ?",
      [id_recompensa]
    );

    if (recompensaResult.length === 0) {
      throw new Error("Recompensa no encontrada");
    }

    const puntosNecesarios = recompensaResult[0].puntos_necesarios;

    // 2. Obtener puntos actuales del usuario
    const [usuarioResult] = await pool.query<RowDataPacket[]>(
      "SELECT puntos_totales FROM Usuarios WHERE id_usuario = ?",
      [id_usuario]
    );

    if (usuarioResult.length === 0) {
      throw new Error("Usuario no encontrado");
    }

    const puntosActuales = usuarioResult[0].puntos_totales;

    if (puntosActuales < puntosNecesarios) {
      throw new Error("Puntos insuficientes");
    }

    // 3. Actualizar puntos del usuario (restar)
    await pool.query<OkPacket>(
      "UPDATE Usuarios SET puntos_totales = puntos_totales - ? WHERE id_usuario = ?",
      [puntosNecesarios, id_usuario]
    );

    return true;
  } catch (error) {
    console.error("❌ Error al canjear premio:", error);
    return false;
  }
};
