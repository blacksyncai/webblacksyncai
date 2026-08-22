// Mimics Vercel's static hosting for local verification:
// filesystem first (including directory index.html), then the SPA rewrite.
const http = require('http');
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..', 'dist', 'public');
const types = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css',
  '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg',
  '.xml': 'application/xml', '.txt': 'text/plain', '.json': 'application/json',
};

http.createServer((req, res) => {
  const url = decodeURIComponent(req.url.split('?')[0]);
  const candidates = [
    path.join(root, url),
    path.join(root, url, 'index.html'),
    path.join(root, 'index.html'), // SPA fallback, evaluated last
  ];
  for (const c of candidates) {
    if (!c.startsWith(root)) continue;
    if (fs.existsSync(c) && fs.statSync(c).isFile()) {
      res.writeHead(200, { 'Content-Type': types[path.extname(c)] || 'application/octet-stream' });
      return res.end(fs.readFileSync(c));
    }
  }
  res.writeHead(404).end('not found');
}).listen(4173, () => console.log('serving dist/public on http://localhost:4173'));
