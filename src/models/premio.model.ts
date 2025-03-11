import { RowDataPacket } from "mysql2";
import connection from "../config/db";

export interface Premio {
    id_premio?: number;
    nombre: string;
    descripcion: string;
    puntos_necesarios: number;
}

export const obtenerPremios = async (): Promise<Premio[]> => {
    return new Promise((resolve, reject) => {
        connection.query("SELECT * FROM Recompensas", (err, results) => {
            if (err) {
                reject(err);
            } else {
                resolve(results as Premio[]);
            }
        });
    });
};

export const canjearPremio = async (id_usuario: number, id_premio: number): Promise<boolean> => {
    return new Promise((resolve, reject) => {
        connection.query(
            "SELECT puntos_totales FROM Usuarios WHERE id_usuario = ?",
            [id_usuario],
            (err, results: RowDataPacket[]) => {
                if (err) {
                    reject(err);
                } else if (results.length === 0) {
                    reject("Usuario no encontrado");
                } else {
                    const puntosUsuario = results[0].puntos_totales;
                    connection.query(
                        "SELECT puntos_necesarios FROM Recompensas WHERE id_recompensa = ?",
                        [id_premio],
                        (err, results: RowDataPacket[]) => {
                            if (err) {
                                reject(err);
                            } else if (results.length === 0) {
                                reject("Premio no encontrado");
                            } else {
                                const puntosRequeridos = results[0].puntos_necesarios;
                                if (puntosUsuario >= puntosRequeridos) {
                                    connection.query(
                                        "UPDATE Usuarios SET puntos_totales = puntos_totales - ? WHERE id_usuario = ?",
                                        [puntosRequeridos, id_usuario],
                                        (err) => {
                                            if (err) reject(err);
                                            else resolve(true);
                                        }
                                    );
                                } else {
                                    reject("Puntos insuficientes");
                                }
                            }
                        }
                    );
                }
            }
        );
    });
};
