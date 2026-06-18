FROM node:24-alpine

# Set working directory
WORKDIR /usr/src/app

# Install dependencies first for better caching
COPY package*.json ./
RUN npm ci --omit=dev

# Copy application source
COPY . .

# Expose port
EXPOSE 5000

# Start command
CMD ["npm", "start"]
