FROM mcr.microsoft.com/playwright AS base

FROM base AS deps

WORKDIR /app
COPY package.json package-lock.json ./

RUN npm install
RUN npx playwright install --with-deps

FROM deps AS builder
WORKDIR /app
COPY . .

CMD ["sleep", "10", "&&", "npx", "playwright", "test"]
