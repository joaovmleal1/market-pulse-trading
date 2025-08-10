// server/index.ts
import express, { type Request, type Response, type NextFunction } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json()); // <- importante pra ler req.body

// ===== Rotas internas (proxy) =====

// AVALON: POST /internal/avalon/balance  -> localhost:3001
app.post(
  '/internal/avalon/balance',
  async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
    try {
      const { email, password } = req.body ?? {};
      if (!email || !password) {
        res.status(400).json({ error: 'email e password são obrigatórios' });
        return;
      }

      const upstream = await fetch('http://localhost:3001/api/account/balance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const text = await upstream.text(); // preserva payload como vier
      res.status(upstream.status).type(upstream.headers.get('content-type') || 'application/json').send(text);
    } catch (err) {
      console.error('[proxy avalon] erro:', err);
      res.status(502).json({ error: 'Upstream Avalon indisponível' });
    }
  }
);

// POLARIUM: POST /internal/polarium/balance -> localhost:3002
app.post(
  '/internal/polarium/balance',
  async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
    try {
      const { email, password } = req.body ?? {};
      if (!email || !password) {
        res.status(400).json({ error: 'email e password são obrigatórios' });
        return;
      }

      const upstream = await fetch('http://localhost:3002/api/account/balance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const text = await upstream.text();
      res.status(upstream.status).type(upstream.headers.get('content-type') || 'application/json').send(text);
    } catch (err) {
      console.error('[proxy polarium] erro:', err);
      res.status(502).json({ error: 'Upstream Polarium indisponível' });
    }
  }
);

// XOFRE: GET /internal/xofre/wallets -> broker-api com X-Api-Key (base64) -> decodifica e passa como api-token
app.get(
  '/internal/xofre/wallets',
  async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
    try {
      const apiKeyB64 = req.header('X-Api-Key');
      if (!apiKeyB64) {
        res.status(400).json({ error: 'Header X-Api-Key obrigatório' });
        return;
      }

      // se sua api_key já estiver em base64 no banco, decodifique aqui
      let decoded = '';
      try {
        decoded = Buffer.from(apiKeyB64, 'base64').toString('utf8');
      } catch {
        // se já vier “puro”, usa direto
        decoded = apiKeyB64;
      }

      const upstream = await fetch('https://broker-api.mybroker.dev/token/wallets', {
        method: 'GET',
        headers: { 'api-token': decoded },
      });

      const text = await upstream.text();
      res.status(upstream.status).type(upstream.headers.get('content-type') || 'application/json').send(text);
    } catch (err) {
      console.error('[proxy xofre] erro:', err);
      res.status(502).json({ error: 'Upstream Xofre indisponível' });
    }
  }
);

// ===== App estático (React build) =====
const distPath = path.join(__dirname, '../dist');
app.use(express.static(distPath));

app.get('*', (_: Request, res: Response) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
