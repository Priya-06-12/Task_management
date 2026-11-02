const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

// Load variables from .env before anything reads process.env
dotenv.config();

const connectDB = require("./config/db");
const taskRoutes = require("./routes/taskRoutes");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

const app = express();

// ---------------------------------------------------------------------------
// CORS — origin is driven by CLIENT_URL so the same build works in every
// environment without code changes:
//   • Development  → CLIENT_URL=http://localhost:5174
//   • Production   → CLIENT_URL=https://your-app.vercel.app
// ---------------------------------------------------------------------------
const clientOrigin = process.env.CLIENT_URL;
if (!clientOrigin) {
  console.warn(
    "[CORS] WARNING: CLIENT_URL is not set. " +
      "Set it in .env (dev) or the hosting dashboard (production)."
  );
}

app.use(
  cors({
    origin: clientOrigin || "http://localhost:5174",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

// Health-check — Render and uptime monitors hit this to verify the service is up
app.get("/api/health", (_req, res) =>
  res.json({ success: true, message: "API is running", env: process.env.NODE_ENV || "development" })
);

app.use("/api/tasks", taskRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
// Bind to 0.0.0.0 so Render (and other container hosts) can route traffic in.
// On a local machine this is identical to binding on localhost.
const HOST = "0.0.0.0";

connectDB().then(() => {
  app.listen(PORT, HOST, () =>
    console.log(`Server running on http://${HOST}:${PORT}  (NODE_ENV=${process.env.NODE_ENV || "development"})`)
  );
});
