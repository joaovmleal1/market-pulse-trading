import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Serve arquivos estáticos da build do Vite
app.use(express.static(path.join(__dirname, '../dist')));

// Fallback para SPA (React Router)
app.get('*', (_, res) => {
  res.sendFile(path.join(__dirname, '../dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Servidor React rodando em http://localhost:${PORT}`);
});
