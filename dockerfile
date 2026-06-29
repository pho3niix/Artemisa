FROM node:20-alpine

# Directorio de trabajo
WORKDIR /app

# Copiar dependencias primero (cache)
COPY package*.json ./

# Instalar dependencias
RUN yarn install

# Copiar resto del código
COPY . .

# Exponer puerto
EXPOSE 5003

# Modo desarrollo
CMD ["yarn", "dev"]