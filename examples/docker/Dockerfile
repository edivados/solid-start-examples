FROM node:lts-buster-slim as build
WORKDIR /usr/local/src/basic
COPY ./ ./
RUN npm i && npm run build

FROM node:lts-buster-slim
ENV NODE_ENV=production
WORKDIR /app
COPY --from=build /usr/local/src/basic/.output/ ./
EXPOSE 3000
CMD ["node", "/app/server/index.mjs"]