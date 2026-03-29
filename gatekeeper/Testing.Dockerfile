FROM mcr.microsoft.com/playwright AS base

FROM base AS deps

WORKDIR /app
COPY package.json ./

RUN npm install
RUN npx playwright install --with-deps

FROM deps AS builder
WORKDIR /app
COPY . .

CMD ["/bin/sh", "-c", "npx playwright test --reporter=list"]
