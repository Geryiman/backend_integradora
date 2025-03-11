import { Request, Response } from "express";
import { obtenerPremios, canjearPremio } from "../models/premio.model";

export const getPremios = async (req: Request, res: Response): Promise<void> => {
    try {
        const premios = await obtenerPremios();
        res.json(premios);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener los premios" });
    }
};

export const canjearPremioUsuario = async (req: Request, res: Response): Promise<void> => {
    const { id_usuario, id_premio } = req.body;
    if (!id_usuario || !id_premio) {
        res.status(400).json({ error: "Faltan datos en la solicitud" });
        return;
    }

    try {
        const resultado = await canjearPremio(id_usuario, id_premio);
        if (resultado) {
            res.json({ mensaje: "Premio canjeado con éxito" });
        } else {
            res.status(400).json({ error: "No se pudo canjear el premio" });
        }
    } catch (error) {
        res.status(400).json({ error });
    }
};
