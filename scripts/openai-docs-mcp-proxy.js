#!/usr/bin/env node

const http = require('node:http');
const https = require('node:https');
const { URL } = require('node:url');

const upstream = new URL(process.env.UPSTREAM || 'https://developers.openai.com/mcp');
const host = process.env.HOST || '127.0.0.1';
const port = Number(process.env.PORT || 8787);

function respondWithEmptyResources(method, id, res) {
  const result = method === 'resources/list' ? { resources: [] } : { resourceTemplates: [] };
  const payload = JSON.stringify({ jsonrpc: '2.0', id: id ?? null, result });
  res.writeHead(200, { 'content-type': 'application/json' });
  res.end(payload);
}

const server = http.createServer((req, res) => {
  const chunks = [];
  req.on('data', (chunk) => chunks.push(chunk));
  req.on('end', () => {
    const body = Buffer.concat(chunks);
    const contentType = String(req.headers['content-type'] || '');

    if (req.method === 'POST' && body.length && contentType.includes('application/json')) {
      try {
        const json = JSON.parse(body.toString('utf8'));
        if (
          json &&
          (json.method === 'resources/list' || json.method === 'resources/templates/list')
        ) {
          return respondWithEmptyResources(json.method, json.id, res);
        }
      } catch {
        // Fall through to proxy if the body isn't JSON.
      }
    }

    const client = upstream.protocol === 'https:' ? https : http;
    const options = {
      protocol: upstream.protocol,
      hostname: upstream.hostname,
      port: upstream.port || (upstream.protocol === 'https:' ? 443 : 80),
      method: req.method,
      path: upstream.pathname,
      headers: {
        ...req.headers,
        host: upstream.host,
      },
    };

    const proxyReq = client.request(options, (proxyRes) => {
      res.writeHead(proxyRes.statusCode || 502, proxyRes.headers);
      proxyRes.pipe(res);
    });

    proxyReq.on('error', (err) => {
      res.writeHead(502, { 'content-type': 'text/plain' });
      res.end(`Upstream proxy error: ${err.message}`);
    });

    if (body.length) {
      proxyReq.write(body);
    }
    proxyReq.end();
  });
});

server.listen(port, host, () => {
  process.stderr.write(
    `openai-docs-mcp-proxy listening on http://${host}:${port} -> ${upstream.href}\n`,
  );
});
