#!/bin/bash

echo "🔄 Atualizando repositório..."
git pull

echo "🔄 Intalando deps..."
npm install

echo "⚙️  Compilando projeto front-end..."
npm run build

echo "🚀 Compilando servidor..."
npm run build:server

echo "✅ Tudo finalizado com sucesso!"