FROM node:20-alpine

# Crear usuario no-root para seguridad
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

# Crear carpeta de trabajo
WORKDIR /app

# Copiar archivos de dependencias primero (para mejor cache)
COPY package*.json ./

# Instalar dependencias
RUN npm ci --only=production && npm cache clean --force

# Copiar archivo .env (si existe)
COPY .env* ./

# Copiar el resto del código
COPY . .

# Cambiar ownership al usuario no-root
RUN chown -R nodejs:nodejs /app
USER nodejs

# Exponer el puerto
EXPOSE 3000

# Variables de entorno para Node.js
ENV NODE_ENV=production

# Comando para iniciar la app
CMD ["npm", "start"]
