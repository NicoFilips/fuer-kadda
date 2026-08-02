# Build-Stage
FROM node:20-alpine AS build
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
# base auf "/" überschreiben, damit das Image lokal unter Root läuft
# (statt unter /fuer-kadda/ wie auf GitHub Pages)
RUN npx vite build --base=/

# Serve-Stage
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
