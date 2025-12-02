FROM node:25-bullseye-slim

WORKDIR /app

RUN apt-get update && apt-get install -y \
    curl \
    build-essential \
    ca-certificates \
    libpq-dev \
    git \
    && rm -rf /var/lib/apt/lists/*

RUN npm install -g pnpm@10.10.0

COPY package.json pnpm-lock.yaml* ./

RUN pnpm install --frozen-lockfile

COPY . .

ENV NEXT_TELEMETRY_DISABLED=1

# build Next app
RUN pnpm build

# production env
ENV NODE_ENV=production
EXPOSE 3000

# start Next in production mode
CMD ["node", "node_modules/next/dist/bin/next", "start", "-p", "3000"]
