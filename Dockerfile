# Use Node.js 22 LTS
FROM node:22-alpine

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Set working directory
WORKDIR /app

# Copy backend package files
COPY backend/package*.json ./backend/

# Install backend dependencies
WORKDIR /app/backend
RUN npm ci --only=production

# Copy backend source code
COPY backend/ ./

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs
RUN adduser -S fitlife -u 1001
RUN chown -R fitlife:nodejs /app
USER fitlife

# Expose port (Railway will override this)
EXPOSE $PORT

# Set environment variables
ENV NODE_ENV=production
ENV HOST=0.0.0.0

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]

# Start the server
CMD ["npm", "start"]