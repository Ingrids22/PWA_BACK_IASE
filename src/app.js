import express from "express";
import cors from "cors";
import morgan from "morgan";
import authRoutes from "./routes/auth.routes.js";
import taskRoutes from "./routes/task.routes.js";
import { connectToDB } from "./db/connect.js";

const app = express();

const corsOptions = {
  origin: [
    "http://localhost:5173",
    process.env.FRONT_IASE || ""
  ].filter(Boolean),
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
};

// Un solo cors con la misma config para todo, incluyendo OPTIONS
app.use(cors(corsOptions));

app.use(express.json());
app.use(morgan("dev"));

app.use(async (_req, _res, next) => {
  try {
    await connectToDB();
    next();
  } catch (e) {
    next(e);
  }
});

app.get("/", (_req, res) => res.json({ 
  ok: true, 
  valorVariable: process.env.FRONT_IASE || "No definida" 
}));
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

export default app;