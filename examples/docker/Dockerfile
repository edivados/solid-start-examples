FROM node:lts-alpine3.16 as build
WORKDIR /usr/local/src/bare
COPY ./ ./
RUN npm ci && npm run build

FROM node:lts-alpine3.16
ENV NODE_ENV=production
WORKDIR /app
COPY --from=build /usr/local/src/bare/dist/ ./
COPY --from=build /usr/local/src/bare/package.json /usr/local/src/bare/package-lock.json ./
RUN npm ci && npm cache clean --force
EXPOSE 3000
CMD ["node", "/app/server.js"]