FROM node:lts-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm i
COPY . .
RUN npm run build

FROM node:lts-alpine AS runtime
USER node
WORKDIR /app
ENV NODE_ENV production
ENV HOST 0.0.0.0
ENV PORT 4321
COPY --chown=node:node package*.json ./
RUN npm ci --omit=dev
COPY --from=build --chown=node:node /app/dist ./dist
EXPOSE 4321
CMD ["node", "./dist/server/entry.mjs"]
