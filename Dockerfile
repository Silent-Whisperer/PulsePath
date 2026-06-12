# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package descriptors and lockfile
COPY package*.json ./

# Install development dependencies
RUN npm ci

# Copy full source code
COPY . .

# Run production build (compiles react client and bundles express server)
RUN npm run build

# Production stage
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Copy package descriptors
COPY package*.json ./

# Install production dependencies only
RUN npm ci --only=production

# Copy built assets from builder stage
COPY --from=builder /app/dist ./dist

# Expose port (Cloud Run sets PORT env variable automatically)
EXPOSE 3000

# Start server
CMD ["npm", "run", "start"]
