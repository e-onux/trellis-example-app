// HTTP wiring only. Each route delegates to exactly one capability:
//   GET  /health -> health-report            (src/health.js)
//   POST /quote  -> calculate-shipping-quote (src/quote.js)
//   GET  /zones  -> resolve-destination-zone (src/zones.js)
// Business rules live in the capability modules, not here.

import http from 'node:http';
import { calculateShippingQuote } from './quote.js';
import { listZones } from './zones.js';
import { healthReport } from './health.js';

const PORT = Number(process.env.PORT) || 8080;
const state = { ready: false };

function send(res, status, body) {
  res.writeHead(status, { 'content-type': 'application/json' });
  res.end(JSON.stringify(body));
}

function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    let raw = '';
    req.on('data', (chunk) => { raw += chunk; });
    req.on('end', () => {
      try {
        resolve(JSON.parse(raw));
      } catch {
        reject(new Error('INVALID_JSON'));
      }
    });
    req.on('error', reject);
  });
}

export const server = http.createServer(async (req, res) => {
  const { method, url } = req;

  if (method === 'GET' && url === '/health') {
    const report = healthReport(state);
    return send(res, report.error ? 503 : 200, report);
  }

  if (method === 'GET' && url === '/zones') {
    return send(res, 200, listZones());
  }

  if (method === 'POST' && url === '/quote') {
    let input;
    try {
      input = await readJsonBody(req);
    } catch {
      return send(res, 400, { error: { code: 'INVALID_JSON' } });
    }
    const result = calculateShippingQuote(input);
    return send(res, result.error ? 400 : 200, result);
  }

  send(res, 404, { error: { code: 'NOT_FOUND' } });
});

server.listen(PORT, () => {
  state.ready = true;
  console.log(`shipping-quotes listening on http://localhost:${PORT}`);
});
