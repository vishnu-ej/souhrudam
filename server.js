const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = path.resolve(__dirname);

// Whitelisted static file extensions and their exact Content-Type headers
const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp'
};

// Files that must never be served directly to the public (protect server code and configs)
const BLOCKED_FILES = new Set([
  'server.js',
  'package.json',
  'package-lock.json',
  'design-tokens.json',
  'design.md'
]);

// Security headers applied to all responses to protect against XSS, clickjacking,
// drive-by malware downloads, MIME confusion, trojan payloads, and data leakage.
const SECURITY_HEADERS = {
  // Content Security Policy: Only allow scripts and styles from self and trusted origins (Google Fonts).
  // Blocks inline eval, arbitrary remote script injections, unauthorized plugins, and malicious iframe wrappers.
  'Content-Security-Policy': [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline'",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com data:",
    "img-src 'self' data: blob: https:",
    "connect-src 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self' https://wa.me",
    "frame-ancestors 'none'"
  ].join('; '),

  // Prevents browsers from MIME-sniffing away from the declared content-type,
  // blocking malicious files/trojans disguised as images or stylesheets.
  'X-Content-Type-Options': 'nosniff',

  // Protects against Clickjacking attacks by forbidding framing.
  'X-Frame-Options': 'DENY',

  // Cross-Site Scripting filter for legacy browsers.
  'X-XSS-Protection': '1; mode=block',

  // Protects user privacy and sensitive transaction data from leaking in referrers.
  'Referrer-Policy': 'strict-origin-when-cross-origin',

  // Restricts hardware and sensor APIs from rogue scripts or malicious browser extensions.
  'Permissions-Policy': 'geolocation=(), camera=(), microphone=(), payment=(), usb=(), interest-cohort=()',

  // Isolates browsing context against Spectre and cross-origin leaks.
  'Cross-Origin-Opener-Policy': 'same-origin',
  'Cross-Origin-Resource-Policy': 'same-origin',

  // Cache control for live local author storefront updates
  'Cache-Control': 'no-cache, must-revalidate'
};

const server = http.createServer((req, res) => {
  // 1. HTTP Method Restriction (only safe read methods allowed)
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.writeHead(405, Object.assign({}, SECURITY_HEADERS, { 'Content-Type': 'text/plain; charset=utf-8' }));
    res.end('405 Method Not Allowed');
    return;
  }

  // 2. URL Length Guard (prevents buffer and URI overflow attacks)
  if (req.url && req.url.length > 2048) {
    res.writeHead(414, Object.assign({}, SECURITY_HEADERS, { 'Content-Type': 'text/plain; charset=utf-8' }));
    res.end('414 URI Too Long');
    return;
  }

  // 3. Safe URI Decoding with try-catch (prevents crash DoS on malformed escape sequences)
  let decodedPath = '';
  try {
    const rawPath = req.url.split('?')[0];
    decodedPath = decodeURI(rawPath);
  } catch (err) {
    res.writeHead(400, Object.assign({}, SECURITY_HEADERS, { 'Content-Type': 'text/plain; charset=utf-8' }));
    res.end('400 Bad Request: Malformed URI');
    return;
  }

  // Map root to /index.html
  if (decodedPath === '/' || decodedPath === '') {
    decodedPath = '/index.html';
  }

  // 4. Robust Directory Traversal Prevention
  // Normalize and resolve canonical path strictly inside PUBLIC_DIR
  const normalizedRel = path.normalize('/' + decodedPath).replace(/^(\.\.[\/\\])+/, '');
  const filePath = path.resolve(PUBLIC_DIR, '.' + normalizedRel);

  // Verify the target path resides strictly inside PUBLIC_DIR
  const isInsidePublicDir = filePath.startsWith(PUBLIC_DIR + path.sep) || filePath === PUBLIC_DIR || filePath === path.resolve(PUBLIC_DIR, 'index.html');
  if (!isInsidePublicDir) {
    res.writeHead(403, Object.assign({}, SECURITY_HEADERS, { 'Content-Type': 'text/plain; charset=utf-8' }));
    res.end('403 Forbidden: Directory traversal blocked');
    return;
  }

  // 5. Block Hidden Files, Dotfiles, and Sensitive Server Configuration
  const baseName = path.basename(filePath).toLowerCase();
  if (baseName.startsWith('.') || BLOCKED_FILES.has(baseName)) {
    res.writeHead(403, Object.assign({}, SECURITY_HEADERS, { 'Content-Type': 'text/plain; charset=utf-8' }));
    res.end('403 Forbidden: Protected resource');
    return;
  }

  // 6. Whitelist File Extension Check
  const ext = path.extname(filePath).toLowerCase();
  if (!MIME_TYPES[ext]) {
    res.writeHead(404, Object.assign({}, SECURITY_HEADERS, { 'Content-Type': 'text/plain; charset=utf-8' }));
    res.end('404 Not Found');
    return;
  }

  // 7. Safe File Stat & Streaming
  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, Object.assign({}, SECURITY_HEADERS, { 'Content-Type': 'text/plain; charset=utf-8' }));
      res.end('404 Not Found');
      return;
    }

    const contentType = MIME_TYPES[ext];
    const headers = Object.assign({}, SECURITY_HEADERS, {
      'Content-Type': contentType,
      'Content-Length': stats.size
    });

    res.writeHead(200, headers);

    if (req.method === 'HEAD') {
      res.end();
      return;
    }

    const stream = fs.createReadStream(filePath);
    stream.on('error', () => {
      if (!res.headersSent) {
        res.writeHead(500, Object.assign({}, SECURITY_HEADERS, { 'Content-Type': 'text/plain; charset=utf-8' }));
      }
      res.end('500 Internal Server Error');
    });
    stream.pipe(res);
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`====================================================`);
  console.log(`  Souhrudam (സൗഹൃദം) is live & secure on localhost!`);
  console.log(`  Security Headers: CSP, X-Content-Type-Options,`);
  console.log(`                    X-Frame-Options, X-XSS-Protection`);
  console.log(`  URL: http://localhost:${PORT}`);
  console.log(`====================================================`);
});
