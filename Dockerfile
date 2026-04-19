# Use official Node.js runtime as base image
FROM node:22-alpine

# Set working directory
WORKDIR /app

# Copy entire project
COPY . .

# Change to backend directory and install dependencies
WORKDIR /app/backend

# Install dependencies
RUN npm install

# Expose port
EXPOSE 4000

# Start the application
CMD ["npm", "start"]
