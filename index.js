import { WebSocketServer } from 'ws';
import net from 'net';
import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// =========================
// Configuration
// =========================
const MUD_HOST = 'game.wotmud.org';
const MUD_PORT = 2224;
const PROXY_PORT = 8080;
const STATIC_DIR = './public';

// =========================
// Static file helpers
// =========================
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const mimeTypes = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.css': 'text/css',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml'
};

// =========================
// HTTP Server (static files)
// =========================
const server = http.createServer((req, res) => {
  let filePath = path.join(
    __dirname,
    STATIC_DIR,
    req.url === '/' ? 'index.html' : req.url
  );

  const ext = path.extname(filePath);
  const contentType = mimeTypes[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(404);
      res.end('Not Found');
      return;
    }

    res.writeHead(200, { 'Content-Type': contentType });
    res.end(content);
  });
});

// =========================
// WebSocket Server
// =========================
const wss = new WebSocketServer({ server });

server.listen(PROXY_PORT, () => {
  console.log(`[Proxy] HTTP + WS running on http://localhost:${PROXY_PORT}`);
});

wss.on('connection', (ws) => {
  console.log('[Client] Connected');

  // ---- Per-client state ----
  const mudSocket = new net.Socket();
  let mudConnected = false;

  // =========================
  // Browser -> Proxy -> MUD
  // =========================
  ws.on('message', (raw) => {
    const msg = JSON.parse(raw.toString());
    switch (msg.type) {
      case 'cmd': {
        if (!mudConnected) return;
        mudSocket.write(msg.data + '\n');
        break;
      }
    }
  });

  // =========================
  // MUD -> Proxy -> Browser
  // =========================
  mudSocket.on('data', (chunk) => {
    console.log(chunk.toString());

    let buffer = chunk.toString();

    ws.send(JSON.stringify({
      type: 'incoming',
      data: buffer
    }));
  });

  // =========================
  // Cleanup / Error Handling
  // =========================
  ws.on('close', () => {
    console.log('[Client] Disconnected');
    if (!mudSocket.destroyed) {
      mudSocket.destroy();
    }
    mudConnected = false;
  });

  mudSocket.on('close', () => {
    console.error('[MUD] Disconnected');
    if (ws.readyState === ws.OPEN) {
      ws.send(JSON.stringify({ type: 'disconnected' }));
    }
    mudConnected = false;
  });

  mudSocket.on('error', (err) => {
    console.error('[MUD] Error', err.message);
    if (ws.readyState === ws.OPEN) {
      ws.send(JSON.stringify({ type: 'disconnected' }));
    }
    if (!mudSocket.destroyed) {
      mudSocket.destroy();
    }
    mudConnected = false;
  });

  mudSocket.connect(MUD_PORT, MUD_HOST, () => {
    mudConnected = true;
    console.log('[MUD] Connected');
  });
});
