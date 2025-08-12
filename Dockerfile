# Use an official Node.js runtime as a parent image
FROM node:22-slim AS build

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy source code and configuration files
COPY src/ ./src/
COPY tsconfig.json ./
COPY .env.development ./

# # Expose port
EXPOSE 3000

# # Command to run the application
CMD ["npm", "run", "dev"]