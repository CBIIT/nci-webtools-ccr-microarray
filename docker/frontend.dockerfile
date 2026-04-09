FROM public.ecr.aws/amazonlinux/amazonlinux:2023

RUN dnf -y update \
    && dnf -y install \
    nodejs22 \
    nodejs22-npm \
    && dnf clean all

RUN ln -s -f /usr/bin/node-22 /usr/bin/node; ln -s -f /usr/bin/npm-22 /usr/bin/npm;
RUN mkdir -p /app/client

WORKDIR /app/client

# Install dependencies
COPY client-next/package.json client-next/package-lock.json ./
RUN npm install

# Copy source
COPY client-next/ ./

# Build Next.js app — API_BASE_URL tells rewrites where to proxy
ENV API_BASE_URL=http://backend:9220
RUN npm run build

ENV PORT=80
EXPOSE 80

CMD ["npm", "run", "start"]
