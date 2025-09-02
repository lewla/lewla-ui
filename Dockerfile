FROM node:20-bullseye AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM caddy:2.10.2-alpine AS production
COPY --from=builder /app/dist /usr/share/caddy
EXPOSE 80