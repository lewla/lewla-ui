FROM node:20-bullseye AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM caddy:2.10.2-alpine AS production
ARG COMMIT_SHA
LABEL org.opencontainers.image.title="lewla chat client" \
      org.opencontainers.image.description="client components for lewla chat" \
      org.opencontainers.image.vendor="lewla" \
      org.opencontainers.image.url="https://lew.la" \
      org.opencontainers.image.source="https://github.com/lewla/lewla-ui" \
      org.opencontainers.image.licenses="MIT" \
      org.opencontainers.image.revision=$COMMIT_SHA
COPY --from=builder /app/dist /usr/share/caddy
EXPOSE 80