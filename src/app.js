import express from "express";
import cors from "cors";
import morgan from "morgan";
import authRoutes from "./routes/auth.routes.js";
import taskRoutes from "./routes/task.routes.js";
import { connectToDB } from "./db/connect.js";

const app = express();

// Configuración de CORS mejorada
app.use(cors({
  origin: [
    "http://localhost:5173",
    process.env.FRONT_IASE || "" // Asegúrate de que en Vercel se llame exactamente FRONT_IASE
  ].filter(Boolean),
  credentials: true
}));

// ¡ESTA LÍNEA ES CLAVE! Responde a las peticiones preflight (OPTIONS)
app.options("*", cors()); 

app.use(express.json());
app.use(morgan("dev"));

// Conexión a mongo DB
app.use(async (_req, _res, next) => {
  try {
    await connectToDB();
    next();
  } catch (e) {
    next(e);
  }
});

app.get("/", (_req, res) => res.json({ ok: true, 
  valorVariable: process.env.FRONT_IASE || "No definida" }));
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

export default app;