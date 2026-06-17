FROM node:20-alpine

WORKDIR /app

# Copy package files first for layer caching
COPY package*.json ./
RUN npm ci --omit=dev

# Copy application source
COPY index.js ./

EXPOSE 3000

ENV NODE_ENV=production

HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget -qO- http://localhost:3000/health || exit 1

CMD ["node", "index.js"]
