import * as path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src")
    }
  },
  build: {
    rollupOptions: {
      external: ['*.mp4']
    }
  },
  server: {
    port: 5173,
    strictPort: true,
    proxy: {
      "/uploads": {
        target: "http://localhost:5002",
        changeOrigin: true,
        secure: false,
      },
      "/api": {
        target: "http://localhost:5002",
        changeOrigin: true,
        secure: false,
        ws: true,
        configure: (proxy, options) => {
          proxy.on('proxyReq', (proxyReq, req, res) => {
            // Forward cookies from the original request
            if (req.headers.cookie) {
              proxyReq.setHeader('Cookie', req.headers.cookie);
            }
            if (req.headers['content-type']) {
              proxyReq.setHeader('Content-Type', req.headers['content-type']);
            }
          });
          proxy.on('proxyRes', (proxyRes, req, res) => {
            // Forward Set-Cookie headers as-is, don't modify them
            // The proxy should handle cookies automatically
            // Add CORS headers
            proxyRes.headers['Access-Control-Allow-Credentials'] = 'true';
            proxyRes.headers['Access-Control-Allow-Origin'] = req.headers.origin || 'http://localhost:5173';
            proxyRes.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, PATCH, OPTIONS';
            proxyRes.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization, X-Requested-With';
          });
          proxy.on('error', (err, req, res) => {
            console.log('proxy error', err);
            res.writeHead(500, {
              'Content-Type': 'application/json',
            });
            res.end(JSON.stringify({ message: 'Backend server is not running. Please start the server.' }));
          });
        }
      }
    },
    headers: {
      'Accept-Ranges': 'bytes'
    },
    cors: false
  },
  assetsInclude: ['.mp4'],
  optimizeDeps: {
    exclude: ['*.mp4']
  }
});