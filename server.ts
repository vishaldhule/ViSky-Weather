import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import "dotenv/config";

const NEWS_API_KEY = process.env.NEWS_API_KEY || "1b085171d35e4331828c4890609c5b3a";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Proxy NewsAPI requests to bypass CORS/Browser restrictions on Developer plan
  app.get("/api/news", async (req, res) => {
    const { q, language, sortBy, pageSize, from, to } = req.query;
    
    if (!q) {
      return res.status(400).json({ status: "error", message: "Missing query parameter 'q'" });
    }

    let url = `https://newsapi.org/v2/everything?q=${q}&language=${language || 'en'}&sortBy=${sortBy || 'publishedAt'}&pageSize=${pageSize || 6}&apiKey=${NEWS_API_KEY}`;
    
    if (from) url += `&from=${from}`;
    if (to) url += `&to=${to}`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error("Proxy error:", error);
      res.status(500).json({ status: "error", message: "Failed to fetch from news network" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
