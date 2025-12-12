# Use Node.js 22 LTS
FROM node:22-alpine

# Set working directory
WORKDIR /app

# Copy backend package files
COPY backend/package*.json ./backend/

# Install backend dependencies
WORKDIR /app/backend
RUN npm ci --only=production

# Copy backend source code
COPY backend/ ./

# Expose port
EXPOSE 3000

# Set environment variable
ENV NODE_ENV=production

# Start the server
CMD ["npm", "start"]