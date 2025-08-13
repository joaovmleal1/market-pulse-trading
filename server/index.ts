import express, { type Request, type Response, type NextFunction } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';

// helpers de log e (talvez) decode
const DEBUG_PROXY = process.env.DEBUG_PROXY === '1';

const mask = (s: string, keep = 2) =>
  s.length <= keep ? '*'.repeat(s.length) : s.slice(0, keep) + '*'.repeat(Math.max(0, s.length - keep));

const looksBase64 = (s: string) => /^[A-Za-z0-9+/=]+$/.test(s) && s.length % 4 === 0 && !s.includes('@');
const maybeDecodeBase64 = (s: string) => {
  try {
    return looksBase64(s) ? Buffer.from(s, 'base64').toString('utf8') : s;
  } catch {
    return s;
  }
};

async function forwardFetch(upstream: globalThis.Response, res: Response): Promise<void> {
  const contentType = upstream.headers.get('content-type') || 'application/json';
  const text = await upstream.text();

  if (!upstream.ok) {
    console.error('[proxy] upstream NOT OK', {
      status: upstream.status,
      contentType,
      sample: text.slice(0, 300)
    });
  }

  res.status(Number(upstream.status)).type(contentType).send(text);
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// ===== Rotas internas (proxy) =====

// AVALON: POST /internal/avalon/balance
app.post('/internal/avalon/balance', async (req: Request, res: Response) => {
  try {
    let { email, password } = req.body ?? {};
    if (!email || !password) {
      res.status(400).json({ error: 'email e password são obrigatórios' });
      return;
    }

    const orig = password;
    password = maybeDecodeBase64(password);

    console.log('[avalon] payload recebido', {
      email,
      passwordMasked: mask(password, 0),
      wasBase64: orig !== password
    });

    const upstream = await fetch('http://localhost:3001/api/account/balance', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    await forwardFetch(upstream, res);
  } catch (err) {
    console.error('[proxy avalon] erro:', err);
    res.status(502).json({ error: 'Upstream Avalon indisponível' });
  }
});

// POLARIUM: POST /internal/polarium/balance
app.post('/internal/polarium/balance', async (req: Request, res: Response) => {
  try {
    let { email, password } = req.body ?? {};
    if (!email || !password) {
      res.status(400).json({ error: 'email e password são obrigatórios' });
      return;
    }

    const orig = password;
    password = maybeDecodeBase64(password);

    console.log('[polarium] payload recebido', {
      email,
      passwordMasked: mask(password, 0),
      wasBase64: orig !== password
    });

    const upstream = await fetch('http://localhost:3002/api/account/balance', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    await forwardFetch(upstream, res);
  } catch (err) {
    console.error('[proxy polarium] erro:', err);
    res.status(502).json({ error: 'Upstream Polarium indisponível' });
  }
});

// XOFRE: GET /internal/xofre/wallets
app.get('/internal/xofre/wallets', async (req: Request, res: Response) => {
  try {
    const apiKeyB64 = req.header('X-Api-Key');
    if (!apiKeyB64) {
      res.status(400).json({ error: 'Header X-Api-Key obrigatório' });
      return;
    }

    let decoded = '';
    try {
      decoded = Buffer.from(apiKeyB64, 'base64').toString('utf8');
    } catch {
      decoded = apiKeyB64;
    }

    console.log('[xofre] chamada /wallets', {
      tokenMasked: mask(decoded, 4),
      cameBase64: decoded !== apiKeyB64,
    });

    const upstream = await fetch('https://broker-api.mybroker.dev/token/wallets', {
      method: 'GET',
      headers: { 'api-token': decoded },
    });

    await forwardFetch(upstream, res);
  } catch (err) {
    console.error('[proxy xofre] erro:', err);
    res.status(502).json({ error: 'Upstream Xofre indisponível' });
  }
});

// ===== App estático (React build) =====
const distPath = path.join(__dirname, '../dist');
app.use(express.static(distPath));

app.get('*', (_: Request, res: Response) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
