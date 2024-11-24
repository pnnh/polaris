FROM node:22

ENV NODE_ENV=production
ENV PORT=8202

WORKDIR /data

COPY dist ./dist
COPY package.json ./
COPY package-lock.json ./
COPY .env.production ./

RUN npm ci --omit=dev

CMD ["node", "dist/main.mjs"]