// Mimics Vercel's static hosting for local verification: filesystem only
// (including directory index.html), no SPA catch-all rewrite -- matching
// production now that vercel.json's blanket rewrite has been removed in
// favor of real static files per route (see scripts/prerender-meta.ts) and
// a real 404 for anything that isn't one of them.
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
  ];
  for (const c of candidates) {
    if (!c.startsWith(root)) continue;
    if (fs.existsSync(c) && fs.statSync(c).isFile()) {
      res.writeHead(200, { 'Content-Type': types[path.extname(c)] || 'application/octet-stream' });
      return res.end(fs.readFileSync(c));
    }
  }
  const notFoundPage = path.join(root, '404.html');
  if (fs.existsSync(notFoundPage)) {
    res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
    return res.end(fs.readFileSync(notFoundPage));
  }
  res.writeHead(404).end('not found');
}).listen(4173, () => console.log('serving dist/public on http://localhost:4173'));
