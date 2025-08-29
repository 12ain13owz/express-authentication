# Use an official Node.js runtime as a parent image
FROM node:22-slim AS build

# Install dependencies for wait and prisma
RUN apt-get update -y && apt-get install -y openssl netcat-openbsd && rm -rf /var/lib/apt/lists/*

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy application files
COPY src/ ./src/
COPY tsconfig.json ./
COPY .env.development ./
COPY prisma ./prisma

# Generate Prisma client
RUN npx prisma generate

# Build the TypeScript/JavaScript code to generate dist/
RUN npm run build

# Copy entrypoint
COPY entrypoint.sh ./
RUN chmod +x entrypoint.sh

# Expose port
EXPOSE 3000

# Use entrypoint
ENTRYPOINT ["sh", "/app/entrypoint.sh"]