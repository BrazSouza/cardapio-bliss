# Estágio de construção para o frontend
FROM node:18-alpine AS frontend-build

WORKDIR /app/frontend

# Copiar arquivos de package.json e instalar dependências
COPY frontend/package*.json ./
RUN npm ci

# Copiar o restante dos arquivos do frontend
COPY frontend/ ./

# Construir o frontend
RUN npm run build

# Estágio de construção para o backend
FROM node:18-alpine AS backend-build

WORKDIR /app/backend

# Copiar arquivos de package.json e instalar dependências
COPY backend/package*.json ./
RUN npm ci

# Copiar o restante dos arquivos do backend
COPY backend/ ./

# Gerar Prisma Client
RUN npx prisma generate

# Estágio final
FROM node:18-alpine

WORKDIR /app

# Copiar dependências e build do backend
COPY --from=backend-build /app/backend/node_modules ./node_modules
COPY --from=backend-build /app/backend/prisma ./prisma
COPY --from=backend-build /app/backend/package*.json ./
COPY --from=backend-build /app/backend/dist ./dist
COPY --from=backend-build /app/backend/.env.production ./.env

# Copiar build do frontend para a pasta pública do backend
COPY --from=frontend-build /app/frontend/build ./public

# Criar diretório para uploads
RUN mkdir -p uploads && chmod 755 uploads

# Expor porta usada pelo servidor
EXPOSE 3000

# Comando para iniciar o servidor
CMD ["npm", "start"]