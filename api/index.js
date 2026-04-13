import server from '../dist/server/server.js';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default async function handler(req, res) {
  try {
    const { pathname } = new URL(req.url, `http://${req.headers.host}`);
    
    // Check if the file exists in dist/client
    const filePath = path.join(__dirname, '..', 'dist', 'client', pathname);
    if (fs.existsSync(filePath) && fs.lstatSync(filePath).isFile()) {
       const ext = path.extname(filePath);
       const contentTypes = {
         '.js': 'application/javascript',
         '.css': 'text/css',
         '.png': 'image/png',
         '.jpg': 'image/jpeg',
         '.svg': 'image/svg+xml',
         '.ico': 'image/x-icon',
       };
       res.setHeader('Content-Type', contentTypes[ext] || 'application/octet-stream');
       res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
       fs.createReadStream(filePath).pipe(res);
       return;
    }

    const protocol = req.headers['x-forwarded-proto'] || 'http';
    const host = req.headers['host'];
    const fullUrl = `${protocol}://${host}${req.url}`;
    
    const request = new Request(fullUrl, {
      method: req.method,
      headers: req.headers,
    });

    const response = await server.fetch(request);

    // Forward status code and headers
    res.statusCode = response.status;
    response.headers.forEach((value, key) => {
      res.setHeader(key, value);
    });

    // Stream the body back to the Node.js response
    const reader = response.body.getReader();
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      res.write(value);
    }
    res.end();
  } catch (error) {
    console.error('SSR Error:', error);
    res.statusCode = 500;
    res.end('Internal Server Error');
  }
}
