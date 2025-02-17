FROM node:18-alpine

WORKDIR /app

COPY package.json ./
COPY tsconfig.json ./
COPY vite.config.ts ./
RUN npm install

COPY . .

CMD ["sh", "-c", "npm run dev -- --host 0.0.0.0"]
