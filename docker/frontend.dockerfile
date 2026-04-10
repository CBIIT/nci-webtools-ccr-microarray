FROM node:22-slim

RUN mkdir -p /app/client

WORKDIR /app/client

# Install dependencies
COPY client-next/package.json client-next/package-lock.json ./
RUN npm install

# Copy source
COPY client-next/ ./

# Build Next.js app — API_BASE_URL tells rewrites where to proxy
ENV API_BASE_URL=http://backend:9220

ARG NEXT_PUBLIC_APP_VERSION=local
ENV NEXT_PUBLIC_APP_VERSION=${NEXT_PUBLIC_APP_VERSION}

RUN npm run build

ENV PORT=80
EXPOSE 80

CMD ["npm", "run", "start"]
