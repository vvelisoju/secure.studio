# Stage 1: Build dependencies and generate Prisma client
FROM node:18-alpine AS build-env

# Set the working directory
WORKDIR /app

# Copy package files first to leverage Docker caching
COPY package.json package-lock.json ./

# Install all dependencies (including dev for TypeScript build)
RUN npm ci  

# Copy Prisma schema separately (ensures it's available before copying the full project)
COPY prisma ./prisma

# Generate Prisma client
RUN npx prisma generate --schema=prisma/schema.prisma

# Copy the rest of the project files
COPY . .

# Build the TypeScript project (ensures 'dist' folder is created)
RUN npm run build

# Remove dev dependencies to reduce image size
RUN npm prune --production

# Stage 2: Create a lightweight production image
FROM node:18-alpine AS runtime

WORKDIR /app

# Copy only necessary files from the build stage
COPY --from=build-env /app/package.json ./
COPY --from=build-env /app/node_modules ./node_modules
COPY --from=build-env /app/dist ./dist
COPY --from=build-env /app/prisma ./prisma
COPY --from=build-env /app/data ./data

RUN mkdir -p dist/data
RUN cp -r data dist/ 

# Set production environment
ENV NODE_ENV=production

# Expose the application port
EXPOSE 5000

# Start the Node.js server
CMD ["node", "dist/server.js"]
