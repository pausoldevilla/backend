# ─── Stage 1: Builder ───────────────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# Copiem primer els fitxers de dependències per aprofitar la cache de Docker
COPY package*.json ./

# npm ci és més ràpid i reproduïble que npm install (usat en CI/CD i prod)
RUN npm ci

# Copiem el codi font
COPY . .

# ─── Stage 2: Production ────────────────────────────────────────────────────
FROM node:20-alpine AS production

WORKDIR /app

ENV NODE_ENV=production

# Copiem package.json per instal·lar només dependències de producció
COPY package*.json ./
RUN npm ci --omit=dev

# Copiem el codi font des de l'etapa builder (no node_modules de dev)
COPY --from=builder /app/src ./src

# Exposem el port del backend
EXPOSE 3000

# Arranquem directament amb node (sense nodemon en producció)
CMD ["node", "src/index.js"]
