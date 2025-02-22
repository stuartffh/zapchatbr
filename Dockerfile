FROM node:18-alpine AS builder

# Definir diretório de trabalho
WORKDIR /app

# Copiar package.json e package-lock.json
COPY package*.json ./

# Instalar dependências
RUN npm install

# Copiar código da aplicação
COPY . .

# Criar build de produção
RUN npm run build

# Criar imagem final
FROM node:18-alpine
WORKDIR /app

# Copiar build gerado
COPY --from=builder /app .

# Expor a porta do Next.js
EXPOSE 3000

# Comando para iniciar o servidor
CMD ["npm", "run", "start"]
