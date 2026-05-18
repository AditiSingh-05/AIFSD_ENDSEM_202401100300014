const path = require("path");

require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const employeeRoutes = require("./routes/employeeRoutes");
const aiRoutes = require("./routes/aiRoutes");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

const app = express();

const allowedOrigins = [
  process.env.CLIENT_URL,
  "http://localhost:5173",
  "http://127.0.0.1:5173"
].filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }
      callback(new Error("Not allowed by CORS"));
    },
    credentials: true
  })
);
app.use(express.json({ limit: "1mb" }));

app.get("/", (_req, res) => {
  const clientUrl = process.env.CLIENT_URL || "https://employee-performance-client-oqfj.onrender.com";

  res.type("html").send(`<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>TalentIQ API</title>
    <style>
      :root {
        color-scheme: light;
        font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        color: #111827;
        background: #eef6f7;
      }
      body {
        margin: 0;
        min-height: 100vh;
        display: grid;
        place-items: center;
        background:
          radial-gradient(circle at 18% 18%, rgba(20, 184, 166, 0.18), transparent 28rem),
          linear-gradient(135deg, #effafa 0%, #f7f9ff 100%);
      }
      main {
        width: min(92vw, 720px);
        padding: 44px;
        border: 1px solid #d7e4ea;
        border-radius: 24px;
        background: rgba(255, 255, 255, 0.88);
        box-shadow: 0 28px 80px rgba(15, 23, 42, 0.14);
      }
      .brand {
        display: inline-flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 24px;
        font-weight: 800;
        font-size: 26px;
      }
      .mark {
        display: grid;
        place-items: center;
        width: 48px;
        height: 48px;
        border-radius: 16px;
        background: #0f9f98;
        color: white;
        font-weight: 900;
      }
      h1 {
        margin: 0 0 12px;
        font-size: clamp(32px, 5vw, 54px);
        line-height: 1;
      }
      p {
        margin: 0;
        color: #526173;
        font-size: 18px;
        line-height: 1.6;
      }
      .actions {
        display: flex;
        flex-wrap: wrap;
        gap: 12px;
        margin-top: 32px;
      }
      a {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-height: 46px;
        padding: 0 18px;
        border-radius: 12px;
        border: 1px solid #cbd8e1;
        color: #0f766e;
        font-weight: 800;
        text-decoration: none;
        background: white;
      }
      a.primary {
        border-color: #0f9f98;
        background: #0f9f98;
        color: white;
      }
      .status {
        margin-top: 28px;
        padding-top: 22px;
        border-top: 1px solid #e1e8ee;
        font-size: 14px;
        color: #66758a;
      }
    </style>
  </head>
  <body>
    <main>
      <div class="brand"><span class="mark">TIQ</span> TalentIQ</div>
      <h1>Employee Performance API</h1>
      <p>
        This backend powers the TalentIQ employee dashboard, authentication,
        employee records, analytics, and AI recommendation endpoints.
      </p>
      <div class="actions">
        <a class="primary" href="${clientUrl}">Open Dashboard</a>
        <a href="/health">Check API Health</a>
        <a href="/api/health">API Health JSON</a>
      </div>
      <div class="status">Service is online and ready for requests.</div>
    </main>
  </body>
</html>`);
});

app.get("/health", (_req, res) => {
  res.json({ ok: true, service: "employee-performance-api" });
});

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, service: "employee-performance-api" });
});

app.use("/api/auth", authRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/ai", aiRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
