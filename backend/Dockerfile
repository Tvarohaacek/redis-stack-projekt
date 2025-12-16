FROM node:20-slim

# Install OpenSSL and other dependencies for Prisma
RUN apt-get update -y && \
    apt-get install -y openssl ca-certificates && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy prisma schema
COPY prisma ./prisma/

# Generate Prisma Client with correct binary
RUN npx prisma generate

# Copy rest of the code
COPY . .

# Build TypeScript
RUN npm run build

# Expose port
EXPOSE 5000

# Healthcheck
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:5000/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start script
CMD ["sh", "-c", "echo '⏳ Waiting 15s for DB...' && sleep 15 && echo '🔄 Running migrations...' && npx prisma db push --accept-data-loss && echo '🌱 Seeding...' && npm run prisma:seed && echo '🚀 Starting server...' && npm start"]