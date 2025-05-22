#!/bin/bash

# Script para migrar um projeto CRA para Vite
# Execute este script na raiz do seu projeto CRA

# Cores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Iniciando migração de Create React App para Vite...${NC}\n"

# Backup do projeto
echo -e "${YELLOW}Fazendo backup do projeto...${NC}"
BACKUP_DIR="../cardapio_bliss_cra_backup_$(date +%Y%m%d_%H%M%S)"
mkdir -p "$BACKUP_DIR"
cp -r ./* "$BACKUP_DIR"
echo -e "${GREEN}✓ Backup criado em $BACKUP_DIR${NC}\n"

# Salvar dependências atuais usando Node.js em vez de jq
echo -e "${YELLOW}Salvando dependências atuais...${NC}"
DEPS=$(node -e "const pkg = require('./package.json'); Object.keys(pkg.dependencies || {}).filter(d => d !== 'react-scripts').forEach(d => console.log(d))")
DEV_DEPS=$(node -e "const pkg = require('./package.json'); Object.keys(pkg.devDependencies || {}).forEach(d => console.log(d))" 2>/dev/null)
echo -e "${GREEN}✓ Dependências salvas${NC}\n"

# Instalar Vite e dependências de desenvolvimento
echo -e "${YELLOW}Instalando Vite e dependências de desenvolvimento...${NC}"
npm install -D vite @vitejs/plugin-react eslint eslint-plugin-react eslint-plugin-react-hooks eslint-plugin-react-refresh
echo -e "${GREEN}✓ Vite instalado${NC}\n"

# Criar arquivo vite.config.js
echo -e "${YELLOW}Criando arquivo vite.config.js...${NC}"
cat > vite.config.js << 'EOL'
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      }
    },
  },
  build: {
    outDir: 'build',
    sourcemap: true,
  },
  define: {
    'process.env': {
      NODE_ENV: JSON.stringify(process.env.NODE_ENV)
    },
  },
});
EOL
echo -e "${GREEN}✓ vite.config.js criado${NC}\n"

# Mover index.html da pasta public para raiz
echo -e "${YELLOW}Criando index.html na raiz do projeto...${NC}"
cat > index.html << 'EOL'
<!DOCTYPE html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/png" href="/logo.png" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="theme-color" content="#8e1c1a" />
    <meta name="description" content="Cardápio digital Bliss Burger" />
    <link rel="apple-touch-icon" href="/logo.png" />
    <title>Bliss Burger - Cardápio Digital</title>
  </head>
  <body>
    <noscript>Você precisa habilitar JavaScript para executar este aplicativo.</noscript>
    <div id="root"></div>
    <script type="module" src="/src/index.js"></script>
  </body>
</html>
EOL
echo -e "${GREEN}✓ index.html criado${NC}\n"

# Atualizar package.json
echo -e "${YELLOW}Atualizando package.json...${NC}"
VERSION=$(node -p "require('./package.json').version")
NAME=$(node -p "require('./package.json').name")

cat > package.json << EOL
{
  "name": "$NAME",
  "private": true,
  "version": "$VERSION",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "lint": "eslint . --ext js,jsx --report-unused-disable-directives --max-warnings 0",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.15",
    "@types/react-dom": "^18.2.7",
    "@vitejs/plugin-react": "^4.0.3",
    "eslint": "^8.45.0",
    "eslint-plugin-react": "^7.32.2",
    "eslint-plugin-react-hooks": "^4.6.0",
    "eslint-plugin-react-refresh": "^0.4.3",
    "vite": "^4.4.5"
  }
}
EOL
echo -e "${GREEN}✓ package.json atualizado${NC}\n"

# Reinstalar dependências salvas anteriormente
echo -e "${YELLOW}Reinstalando dependências do projeto...${NC}"
for dep in $DEPS; do
  if [ "$dep" != "react" ] && [ "$dep" != "react-dom" ] && [ "$dep" != "react-scripts" ]; then
    npm install $dep
  fi
done
echo -e "${GREEN}✓ Dependências reinstaladas${NC}\n"

# Ajustar arquivo de entrada src/index.js
echo -e "${YELLOW}Ajustando arquivo src/index.js...${NC}"
if [ -f "src/index.js" ]; then
  # Backup do arquivo original
  cp src/index.js src/index.js.bak
  
  # Checar se o arquivo usa BrowserRouter
  USE_ROUTER=$(grep -c "BrowserRouter" src/index.js || true)
  
  if [ "$USE_ROUTER" -gt 0 ]; then
    # Versão com Router
    cat > src/index.js << 'EOL'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css'

// Importações globais de CSS, se existirem
// Ajuste conforme necessário para seu projeto
import 'bootstrap/dist/css/bootstrap.min.css'

// Polyfill para process.env (se necessário)
window.process = {
  env: {
    NODE_ENV: import.meta.env.MODE
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
)
EOL
  else
    # Versão sem Router
    cat > src/index.js << 'EOL'
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

// Importações globais de CSS, se existirem
// Ajuste conforme necessário para seu projeto
import 'bootstrap/dist/css/bootstrap.min.css'

// Polyfill para process.env (se necessário)
window.process = {
  env: {
    NODE_ENV: import.meta.env.MODE
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
EOL
  fi
  echo -e "${GREEN}✓ src/index.js ajustado${NC}\n"
else
  echo -e "${RED}× Arquivo src/index.js não encontrado${NC}\n"
fi

# Criar arquivo .env para variáveis de ambiente
echo -e "${YELLOW}Criando arquivo .env para variáveis de ambiente...${NC}"
touch .env

# Converter variáveis de ambiente existentes
if [ -f ".env" ]; then
  cp .env .env.bak
  cat .env.bak | sed 's/REACT_APP_/VITE_/g' > .env
fi

# Adicionar regras de .gitignore específicas para Vite
echo -e "${YELLOW}Atualizando .gitignore...${NC}"
if [ -f ".gitignore" ]; then
  cp .gitignore .gitignore.bak
  
  # Adicionar regras do Vite se não existirem
  if ! grep -q "# Vite" .gitignore; then
    cat >> .gitignore << 'EOL'

# Vite
*.local
dist
dist-ssr
.env.local
.env.development.local
.env.test.local
.env.production.local
EOL
  fi
fi
echo -e "${GREEN}✓ .gitignore atualizado${NC}\n"

# Mover arquivos estáticos
echo -e "${YELLOW}Movendo arquivos estáticos da pasta public...${NC}"
if [ -d "public" ]; then
  # Copiar todos os arquivos da pasta public, exceto index.html
  mkdir -p public_temp
  find public -type f -not -name "index.html" -exec cp {} public_temp/ \;
  rm -rf public
  mv public_temp public
  echo -e "${GREEN}✓ Arquivos estáticos organizados${NC}\n"
fi

echo -e "${GREEN}Migração concluída!${NC}"
echo -e "${YELLOW}Passos finais manuais:${NC}"
echo -e "1. Verifique e ajuste os imports de arquivos estáticos em seus componentes"
echo -e "2. Altere as referências de variáveis de ambiente de process.env.REACT_APP_X para import.meta.env.VITE_X"
echo -e "3. Execute 'npm run dev' para iniciar o servidor de desenvolvimento"
echo -e "\n${GREEN}Bom trabalho!${NC}"