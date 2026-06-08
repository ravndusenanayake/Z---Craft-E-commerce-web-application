FROM node:18-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Build TypeScript server code
RUN npm run build

# Expose port and start production backend
EXPOSE 5000
CMD ["npm", "run", "start"]
