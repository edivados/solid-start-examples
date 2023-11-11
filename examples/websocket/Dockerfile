FROM node:lts-alpine3.16 as build
WORKDIR /usr/local/src/app
COPY ./ ./
RUN npm ci && npm run build

FROM node:lts-alpine3.16
ENV NODE_ENV=production
WORKDIR /app
COPY --from=build /usr/local/src/app/dist/ ./
COPY --from=build /usr/local/src/app/package.json /usr/local/src/app/package-lock.json ./
EXPOSE 3000
CMD ["node", "/app/server.js"]