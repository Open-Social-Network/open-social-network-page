import { createReadStream, existsSync } from 'node:fs';
import { createServer } from 'node:http';
import { extname, join, normalize } from 'node:path';

const root = 'public';
const port = Number(process.env.PORT || 4173);
const contentTypes = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
};

createServer((request, response) => {
  const requestedPath = decodeURIComponent(new URL(request.url || '/', 'http://localhost').pathname);
  const safePath = normalize(requestedPath).replace(/^(\.\.[/\\])+/, '');
  const filePath = join(root, safePath === '/' ? 'index.html' : safePath);
  const finalPath = existsSync(filePath) ? filePath : join(root, 'index.html');
  const extension = extname(finalPath);

  response.setHeader('Content-Type', contentTypes[extension] || 'application/octet-stream');
  createReadStream(finalPath).pipe(response);
}).listen(port, '127.0.0.1', () => {
  console.log(`OpenSocial page running at http://127.0.0.1:${port}/`);
});
