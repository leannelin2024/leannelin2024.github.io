const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = path.join(__dirname, 'public');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css':  'text/css; charset=utf-8',
  '.js':   'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.mp4':  'video/mp4',
  '.webm': 'video/webm',
  '.mov':  'video/quicktime',
  '.svg':  'image/svg+xml',
  '.png':  'image/png',
  '.jpg':  'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif':  'image/gif',
  '.webp': 'image/webp',
  '.ico':  'image/x-icon',
  '.woff': 'font/woff',
  '.woff2':'font/woff2',
  '.ttf':  'font/ttf',
};

function send(res, status, body, contentType = 'text/plain; charset=utf-8') {
  res.writeHead(status, { 'Content-Type': contentType });
  res.end(body);
}

function sendFile(res, filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';
  res.writeHead(200, { 'Content-Type': contentType, 'Cache-Control': 'no-cache' });
  fs.createReadStream(filePath).pipe(res);
}

function send404(res) {
  const notFound = path.join(PUBLIC_DIR, '404.html');
  fs.readFile(notFound, (err, html) => {
    if (err) return send(res, 404, '404 Not Found');
    res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(html);
  });
}

function resolveFile(urlPath) {
  let clean = decodeURIComponent(urlPath.split('?')[0]);
  if (!clean.startsWith('/')) clean = '/' + clean;
  const safe = path.normalize(clean).replace(/^(\.\.[/\\])+/, '');
  const exact = path.join(PUBLIC_DIR, safe);
  if (fs.existsSync(exact) && fs.statSync(exact).isFile()) return exact;
  const html = path.join(PUBLIC_DIR, safe.replace(/\/$/, '') + '.html');
  if (fs.existsSync(html) && fs.statSync(html).isFile()) return html;
  const idx = path.join(PUBLIC_DIR, safe.replace(/\/$/, ''), 'index.html');
  if (fs.existsSync(idx) && fs.statSync(idx).isFile()) return idx;
  return null;
}

function handleContact(req, res) {
  let body = '';
  req.on('data', (chunk) => {
    body += chunk;
    if (body.length > 1e5) req.destroy();
  });
  req.on('end', () => {
    let data = {};
    try { data = JSON.parse(body || '{}'); }
    catch { return send(res, 400, JSON.stringify({ error: 'Invalid JSON' }), 'application/json'); }
    const { name = '', email = '', message = '' } = data;
    if (!name.trim() || !email.trim() || !message.trim()) {
      return send(res, 400, JSON.stringify({ error: 'Name, email, and message are required.' }), 'application/json');
    }
    console.log('\nNew contact message');
    console.log('   From:   ', name, '<' + email + '>');
    console.log('   Message:', message);
    console.log('');
    send(res, 200, JSON.stringify({ ok: true, message: 'Thanks - your message was received locally.' }), 'application/json');
  });
}

const server = http.createServer((req, res) => {
  const urlPath = req.url.split('?')[0];
  if (req.method !== 'GET' && req.method !== 'HEAD') return send(res, 405, '405 Method Not Allowed');
  const filePath = resolveFile(urlPath);
  if (!filePath) return send404(res);
  sendFile(res, filePath);
});

server.listen(PORT, () => {
  console.log('');
  console.log('  LeAnne Lin site running at:');
  console.log('');
  console.log('      http://localhost:' + PORT);
  console.log('');
  console.log('  Press Ctrl+C to stop.');
  console.log('');
});
