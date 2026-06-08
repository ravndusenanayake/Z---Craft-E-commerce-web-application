FROM node:18-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install --frozen-lockfile

# Copy source code
COPY . .

# Generate Prisma Client to interact with the database
RUN npx prisma generate

# Build Next.js application
RUN npm run build

# Expose port and run
EXPOSE 3000
CMD ["npm", "run", "start"]
