import express from "express";
import path from "path";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;
  const API_URL = "https://motherpanel.com/api/v2";

  app.use(express.json());

  // Request logging
  app.use((req, res, next) => {
    console.log(`[Server] ${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
  });

  // Helper for API calls with timeout
  const callSmmApi = async (action: string, data: any = {}) => {
    const keyToUse = process.env.MOTHERPANEL_API_KEY || "007a7dc7bbe2f516cc7e166767722626";
    
    if (!keyToUse || keyToUse === "YOUR_API_KEY_HERE") {
      throw new Error("API_KEY_MISSING");
    }

    const params = new URLSearchParams();
    params.append("key", keyToUse);
    params.append("action", action);
    Object.entries(data).forEach(([key, value]) => {
      params.append(key, String(value));
    });

    console.log(`[Server] Proxying to MotherPanel: ${action}`);
    
    return axios.post(API_URL, params.toString(), {
      timeout: 15000, // 15 seconds
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "User-Agent": "Mozilla/4.0 (compatible; MSIE 5.01; Windows NT 5.0)",
      },
    });
  };

  // API Router
  const apiRouter = express.Router();

  apiRouter.get("/test", (req, res) => {
    res.json({ status: "ok", message: "API is working", timestamp: new Date().toISOString() });
  });

  apiRouter.get("/balance", async (req, res) => {
    try {
      const response = await callSmmApi("balance");
      res.json(response.data);
    } catch (error: any) {
      console.error("[Server] Balance Error:", error.message);
      res.status(error.message === "API_KEY_MISSING" ? 401 : 500).json({ error: error.message });
    }
  });

  apiRouter.get("/services", async (req, res) => {
    try {
      const response = await callSmmApi("services");
      res.json(response.data);
    } catch (error: any) {
      console.error("[Server] Services Error:", error.message);
      res.status(error.message === "API_KEY_MISSING" ? 401 : 500).json({ error: error.message });
    }
  });

  apiRouter.post("/smm/:action", async (req, res) => {
    const { action } = req.params;
    try {
      const response = await callSmmApi(action, req.body);
      res.json(response.data);
    } catch (error: any) {
      console.error(`[Server] SMM Action Error (${action}):`, error.message);
      res.status(error.code === 'ECONNABORTED' ? 504 : 500).json({ 
        error: error.message === "API_KEY_MISSING" ? "API Key is missing" : "Connection failed",
        details: error.message 
      });
    }
  });

  // Mount API router
  app.use("/api", apiRouter);

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    console.log("[Server] Starting in DEVELOPMENT mode");
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("[Server] Starting in PRODUCTION mode");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res, next) => {
      if (req.path.startsWith("/api")) return next();
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Server] BD Service running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error("[Server] Critical failure during startup:", err);
});
