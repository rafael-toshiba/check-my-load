FROM node:22-alpine
WORKDIR /app
COPY package.json package-lock.json* bun.lockb* ./
RUN npm install
COPY . .
EXPOSE 8080
CMD ["npm", "run", "dev"]