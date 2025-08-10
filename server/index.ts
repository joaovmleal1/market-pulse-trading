// server/index.tsx
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import type { Request, Response } from 'express';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// ---- Middlewares ----
app.use(express.json({ limit: '1mb' }));

// Helper para chamar os serviços locais com timeout e JSON
async function forwardJSON(
  url: string,
  body: any,
  method: 'POST' | 'GET' = 'POST',
  extraHeaders: Record<string, string> = {},
  timeoutMs = 10000
) {
  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), timeoutMs);

  const res = await fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json', ...extraHeaders },
    body: method === 'POST' ? JSON.stringify(body) : undefined,
    signal: controller.signal,
  }).catch((err) => {
    clearTimeout(t);
    throw err;
  });

  clearTimeout(t);

  const text = await res.text();
  let data: any;
  try { data = text ? JSON.parse(text) : null; } catch { data = text; }

  if (!res.ok) {
    const msg = typeof data === 'object' && data?.message ? data.message : res.statusText;
    const error: any = new Error(`Upstream error ${res.status}: ${msg}`);
    error.status = res.status;
    error.data = data;
    throw error;
  }

  return data;
}

// -------------------- Rotas internas (proxy) --------------------
// AVALON (POST interno no container local em 127.0.0.1:3001)
app.post('/internal/avalon/balance', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body ?? {};
    if (!email || !password) return res.status(400).json({ error: 'email e password são obrigatórios' });

    const data = await forwardJSON(
      'http://127.0.0.1:3001/api/account/balance',
      { email, password },
      'POST'
    );
    res.json(data);
  } catch (err: any) {
    res.status(err?.status || 502).json({ error: err?.message || 'Erro ao consultar Avalon', details: err?.data });
  }
});

// POLARIUM (POST interno no container local em 127.0.0.1:3002)
app.post('/internal/polarium/balance', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body ?? {};
    if (!email || !password) return res.status(400).json({ error: 'email e password são obrigatórios' });

    const data = await forwardJSON(
      'http://127.0.0.1:3002/api/account/balance',
      { email, password },
      'POST'
    );
    res.json(data);
  } catch (err: any) {
    res.status(err?.status || 502).json({ error: err?.message || 'Erro ao consultar Polarium', details: err?.data });
  }
});

// XOFRE (GET com header de api-token para endpoint externo da corretora)
app.get('/internal/xofre/wallets', async (req: Request, res: Response) => {
  try {
    // Aceita via header X-Api-Key ou query ?apiKey=
    const apiKeyHeader = (req.header('X-Api-Key') || req.query.apiKey) as string | undefined;
    if (!apiKeyHeader) return res.status(400).json({ error: 'X-Api-Key (ou ?apiKey=) é obrigatório' });

    // Tenta decodificar base64; se falhar, usa como está
    let decoded = '';
    try {
      decoded = Buffer.from(String(apiKeyHeader), 'base64').toString('utf-8');
      // Heurística simples: se continuar com caracteres estranhos, mantém original
      if (!decoded || /[\u0000-\u001F]/.test(decoded)) decoded = String(apiKeyHeader);
    } catch {
      decoded = String(apiKeyHeader);
    }

    const data = await forwardJSON(
      'https://broker-api.mybroker.dev/token/wallets', // troque se a URL da Xofre for outra
      null,
      'GET',
      { 'api-token': decoded }
    );
    res.json(data);
  } catch (err: any) {
    res.status(err?.status || 502).json({ error: err?.message || 'Erro ao consultar Xofre', details: err?.data });
  }
});

// (Opcional) healthcheck interno
app.get('/internal/health', (_: Request, res: Response) => {
  res.json({ ok: true });
});

// -------------------- Static + SPA fallback --------------------
const distPath = path.join(__dirname, '../dist');
app.use(express.static(distPath));

// SPA fallback — mantenha por último
app.get('*', (_: Request, res: Response) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
