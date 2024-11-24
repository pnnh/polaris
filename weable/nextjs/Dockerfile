FROM node:22

ENV NODE_ENV=production
ENV PORT=8200

WORKDIR /data

COPY public ./public
COPY .next/standalone ./
COPY .next/static ./.next/static

CMD ["node", "server.js"]
