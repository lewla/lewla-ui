FROM node:20-bullseye AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:1.29-alpine AS production
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80