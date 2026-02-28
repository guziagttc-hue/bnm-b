import express from "express";
import path from "path";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  console.log("[Server] Initializing BD Service Server...");
  const app = express();
  const PORT = 3000;
  const API_URL = "https://motherpanel.com/api/v2";

  app.use(express.json());

  // Request logging middleware
  app.use((req, res, next) => {
    console.log(`[Server] ${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
  });

  // Helper for SMM API calls
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

    console.log(`[Server] Proxying ${action} to MotherPanel...`);
    
    try {
      const response = await axios.post(API_URL, params.toString(), {
        timeout: 15000,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "User-Agent": "Mozilla/4.0 (compatible; MSIE 5.01; Windows NT 5.0)",
        },
      });
      return response.data;
    } catch (error: any) {
      console.error(`[Server] Axios Error (${action}):`, error.message);
      throw error;
    }
  };

  // API Routes - Defined BEFORE Vite middleware
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", time: new Date().toISOString() });
  });

  app.get("/api/balance", async (req, res) => {
    try {
      const data = await callSmmApi("balance");
      res.json(data);
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Failed to fetch balance" });
    }
  });

  app.get("/api/services", async (req, res) => {
    try {
      const data = await callSmmApi("services");
      res.json(data);
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Failed to fetch services" });
    }
  });

  app.post("/api/smm/:action", async (req, res) => {
    const { action } = req.params;
    try {
      const data = await callSmmApi(action, req.body);
      res.json(data);
    } catch (error: any) {
      res.status(500).json({ error: error.message || `Failed to perform ${action}` });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    console.log("[Server] Running in DEVELOPMENT mode with Vite middleware");
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("[Server] Running in PRODUCTION mode");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Server] BD Service is live at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error("[Server] Critical error during startup:", err);
});
