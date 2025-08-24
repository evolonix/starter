# syntax = docker/dockerfile:1

# Build with:
# docker build -t ~~_starter.name_~~:dev -f apps/web/Dockerfile .
# Run with:
# docker run -it --rm -p 4200:4200 --name ~~_starter.name_~~-~~_starter.name_~~-dev --label com.docker.compose.project=~~_starter.name_~~ ~~_starter.name_~~:dev

# Adjust NODE_VERSION as desired
ARG NODE_VERSION=24.5.0
FROM node:${NODE_VERSION}-slim AS base

# Install Python and pip, clean up apt cache
RUN apt-get update && apt-get install -y python3 python3-pip \
    && rm -rf /var/lib/apt/lists/*

# Node.js app lives here
WORKDIR /app

# Install node modules
COPY package-lock.json package.json ./
RUN npm install --ignore-scripts

# Set environment
ENV NODE_ENV="development"

# Copy application code
COPY . .

# Run setup
RUN bash /app/scripts/setup.sh

# Start the server by default, this can be overwritten at runtime
EXPOSE 4200
CMD [ "npx", "nx", "dev", "web", "--host" ]
