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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const dotenv_1 = __importDefault(require("dotenv"));
const axios_1 = __importDefault(require("axios"));
const db_1 = __importDefault(require("./config/db")); // ✅ Import correcto
const usuario_routes_1 = __importDefault(require("./routes/usuario.routes"));
const tarea_routes_1 = __importDefault(require("./routes/tarea.routes"));
const deposito_routes_1 = __importDefault(require("./routes/deposito.routes"));
const recompensa_routes_1 = __importDefault(require("./routes/recompensa.routes"));
const canje_routes_1 = __importDefault(require("./routes/canje.routes"));
const qr_routes_1 = __importDefault(require("./routes/qr.routes"));
const videos_routes_1 = __importDefault(require("./routes/videos.routes"));
const premios_routes_1 = __importDefault(require("./routes/premios.routes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
const certPath = path_1.default.join(__dirname, "../ca-certificate.crt");
function descargarCertificado() {
    return __awaiter(this, void 0, void 0, function* () {
        if (!fs_1.default.existsSync(certPath)) {
            try {
                const url = "https://salud-magenes.sfo2.digitaloceanspaces.com/ca-certificate.crt";
                const response = yield axios_1.default.get(url, { responseType: "arraybuffer" });
                fs_1.default.writeFileSync(certPath, response.data);
                console.log("✅ Certificado descargado correctamente.");
            }
            catch (error) {
                console.error("❌ Error al descargar certificado:", error.message);
                process.exit(1);
            }
        }
    });
}
function iniciarServidor() {
    return __awaiter(this, void 0, void 0, function* () {
        yield descargarCertificado();
        // ✅ Asigna el pool de conexión al app
        app.locals.pool = db_1.default;
        app.use((0, cors_1.default)());
        app.use(express_1.default.json());
        app.use("/uploads", express_1.default.static(path_1.default.join(__dirname, "../uploads")));
        app.get("/", (req, res) => {
            res.send("✅ Servidor corriendo correctamente.");
        });
        // 📦 Rutas
        app.use("/api", tarea_routes_1.default);
        app.use("/usuarios", usuario_routes_1.default);
        app.use("/tareas", tarea_routes_1.default);
        app.use("/depositos", deposito_routes_1.default);
        app.use("/recompensas", recompensa_routes_1.default);
        app.use("/canjes", canje_routes_1.default);
        app.use("/api/qr", qr_routes_1.default);
        app.use("/api/videos", videos_routes_1.default);
        app.use("/premios", premios_routes_1.default);
        app.listen(PORT, () => {
            console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
        });
    });
}
iniciarServidor();
