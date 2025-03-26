"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.canjearPremioUsuario = exports.getPremios = void 0;
const premio_model_1 = require("../models/premio.model");
const getPremios = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const premios = yield (0, premio_model_1.obtenerPremios)();
        res.json(premios);
    }
    catch (error) {
        res.status(500).json({ error: "Error al obtener los premios" });
    }
});
exports.getPremios = getPremios;
const canjearPremioUsuario = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id_usuario, id_premio } = req.body;
    if (!id_usuario || !id_premio) {
        res.status(400).json({ error: "Faltan datos en la solicitud" });
        return;
    }
    try {
        const resultado = yield (0, premio_model_1.canjearPremio)(id_usuario, id_premio);
        if (resultado) {
            res.json({ mensaje: "Premio canjeado con éxito" });
        }
        else {
            res.status(400).json({ error: "No se pudo canjear el premio" });
        }
    }
    catch (error) {
        res.status(400).json({ error });
    }
});
exports.canjearPremioUsuario = canjearPremioUsuario;
