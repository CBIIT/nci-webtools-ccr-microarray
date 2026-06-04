FROM public.ecr.aws/amazonlinux/amazonlinux:2023

RUN dnf -y update \
    && dnf -y install \
    nodejs22 \
    nodejs22-npm \
    && dnf clean all

RUN ln -s -f /usr/bin/node-22 /usr/bin/node; ln -s -f /usr/bin/npm-22 /usr/bin/npm;

# Restrict Python 3.9 to root only (security mitigation)
RUN chmod 700 /usr/bin/python3.9

# Patch vulnerable packages bundled in system npm
RUN set -eux; \
    npm_root="$(npm root -g)"; \
    npm install --prefix /tmp/npm-patch --install-strategy=nested --ignore-scripts --no-audit --no-fund \
        picomatch@4.0.4 brace-expansion@2.0.3 ip-address@10.1.1; \
    rm -rf "${npm_root}/npm/node_modules/picomatch"; \
    cp -a /tmp/npm-patch/node_modules/picomatch "${npm_root}/npm/node_modules/picomatch"; \
    rm -rf "${npm_root}/npm/node_modules/brace-expansion"; \
    cp -a /tmp/npm-patch/node_modules/brace-expansion "${npm_root}/npm/node_modules/brace-expansion"; \
    rm -rf "${npm_root}/npm/node_modules/ip-address"; \
    cp -a /tmp/npm-patch/node_modules/ip-address "${npm_root}/npm/node_modules/ip-address"; \
    rm -rf /tmp/npm-patch

RUN mkdir -p /app/client

WORKDIR /app/client

# Install dependencies
COPY client-next/package.json client-next/package-lock.json ./
RUN npm install

# Copy source
COPY client-next/ ./

ARG API_BASE_URL
ENV API_BASE_URL=${API_BASE_URL}

ARG NEXT_PUBLIC_APP_VERSION=local
ENV NEXT_PUBLIC_APP_VERSION=${NEXT_PUBLIC_APP_VERSION}

ARG NEXT_PUBLIC_GA_MEASUREMENT_ID
ENV NEXT_PUBLIC_GA_MEASUREMENT_ID=${NEXT_PUBLIC_GA_MEASUREMENT_ID}

RUN npm run build

ENV PORT=80
EXPOSE 80

CMD ["npm", "run", "start"]
