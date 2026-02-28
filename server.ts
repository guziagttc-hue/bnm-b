import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;
  const API_URL = "https://motherpanel.com/api/v2";

  app.use(express.json());

  // Helper for API calls with timeout
  const callSmmApi = async (action: string, data: any = {}) => {
    // Use the key from env or fallback to the one provided by user in chat for immediate demo
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

    console.log(`[Server] Calling MotherPanel API: ${action} ...`);
    
    return axios.post(API_URL, params.toString(), {
      timeout: 10000,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "User-Agent": "Mozilla/4.0 (compatible; MSIE 5.01; Windows NT 5.0)",
      },
    });
  };

  // Proxy API routes to MotherPanel
  app.post("/api/smm/:action", async (req, res) => {
    const { action } = req.params;
    try {
      const response = await callSmmApi(action, req.body);
      res.json(response.data);
    } catch (error: any) {
      console.error(`[Server] SMM API Error (${action}):`, error.message);
      res.status(error.code === 'ECONNABORTED' ? 504 : 500).json({ 
        error: error.message === "API_KEY_MISSING" ? "API Key is missing" : "Connection failed",
        details: error.message 
      });
    }
  });

  app.get("/api/balance", async (req, res) => {
    try {
      const response = await callSmmApi("balance");
      res.json(response.data);
    } catch (error: any) {
      console.error("[Server] Balance API Error:", error.message);
      res.status(error.message === "API_KEY_MISSING" ? 401 : 500).json({ error: error.message });
    }
  });

  app.get("/api/services", async (req, res) => {
    try {
      const response = await callSmmApi("services");
      res.json(response.data);
    } catch (error: any) {
      console.error("[Server] Services API Error:", error.message);
      res.status(error.message === "API_KEY_MISSING" ? 401 : 500).json({ error: error.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    console.log("[Server] Vite middleware mounted (Development)");
  } else {
    app.use(express.static(path.join(process.cwd(), "dist")));
    app.get(/^(?!\/api).+/, (req, res) => {
      res.sendFile(path.join(process.cwd(), "dist", "index.html"));
    });
    console.log("[Server] Serving static files (Production)");
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Server] BD Service running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error("[Server] Failed to start:", err);
});
