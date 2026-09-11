import express from "express";
import http from "http";
import path from "path";
import { createServer as createViteServer } from "vite";
import "dotenv/config";

const NEWS_API_KEY = process.env.NEWS_API_KEY || "1b085171d35e4331828c4890609c5b3a";

async function startServer() {
  const app = express();
  const server = http.createServer(app);
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

  // Client IP location detection for accurate regional fallback
  app.get("/api/detect-location", async (req, res) => {
    try {
      const forwarded = req.headers['x-forwarded-for'];
      const clientIp = typeof forwarded === 'string' 
        ? forwarded.split(',')[0].trim() 
        : (req.socket.remoteAddress || '');
      
      // If clientIp is public IPv4/IPv6
      const isPrivate = !clientIp || clientIp.startsWith('127.') || clientIp === '::1' || clientIp.startsWith('10.') || clientIp.startsWith('192.168.');
      if (!isPrivate) {
        const response = await fetch(`https://api.weatherapi.com/v1/ip.json?key=8418358e19a94f2fadc175103260905&q=${clientIp}`);
        if (response.ok) {
          const ipData = await response.json();
          if (ipData && ipData.city) {
            return res.json({
              status: "ok",
              city: ipData.city,
              region: ipData.region,
              country: ipData.country_name || ipData.country,
              lat: ipData.lat,
              lon: ipData.lon,
              ip: clientIp,
            });
          }
        }
      }
      
      return res.json({
        status: "default_india",
        city: "New Delhi",
        region: "Delhi",
        country: "India",
        lat: 28.6139,
        lon: 77.2090
      });
    } catch (e) {
      return res.json({
        status: "default_india",
        city: "New Delhi",
        region: "Delhi",
        country: "India",
        lat: 28.6139,
        lon: 77.2090
      });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { 
        middlewareMode: true,
        hmr: false,
      },
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

  server.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
