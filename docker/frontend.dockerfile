# ---------- build stage: full toolchain (npm + dev dependencies) ----------
FROM public.ecr.aws/amazonlinux/amazonlinux:2023 AS build

RUN dnf -y update \
    && dnf -y install \
    nodejs24 \
    nodejs24-npm \
    && dnf clean all

RUN ln -s -f /usr/bin/node-24 /usr/bin/node; ln -s -f /usr/bin/npm-24 /usr/bin/npm;

WORKDIR /app/client

# Install dependencies
COPY client/package.json client/package-lock.json ./
RUN npm ci

# Copy source
COPY client/ ./

ARG API_BASE_URL
ENV API_BASE_URL=${API_BASE_URL}

ARG NEXT_PUBLIC_APP_VERSION=local
ENV NEXT_PUBLIC_APP_VERSION=${NEXT_PUBLIC_APP_VERSION}

ARG NEXT_PUBLIC_DEPLOY_DATE=Unknown
ENV NEXT_PUBLIC_DEPLOY_DATE=${NEXT_PUBLIC_DEPLOY_DATE}

ARG NEXT_PUBLIC_GA_MEASUREMENT_ID
ENV NEXT_PUBLIC_GA_MEASUREMENT_ID=${NEXT_PUBLIC_GA_MEASUREMENT_ID}

# output: "standalone" (next.config.ts) writes .next/standalone with a minimal
# server.js and only the node_modules the server needs at runtime. The
# API_BASE_URL rewrites are resolved here, at build time.
RUN npm run build

# ---------- runtime stage: Node only — no npm, no Python, no dev deps ----------
FROM public.ecr.aws/amazonlinux/amazonlinux:2023

# nodejs24 only; weak deps off so nodejs24-npm (and npm's vendored packages)
# is not pulled in. Python is removed last: it exists only for dnf, nothing at
# runtime uses it, and AL2023's 3.9 build carries unfixed CVEs.
RUN dnf -y update \
    && dnf -y install --setopt=install_weak_deps=False nodejs24 \
    && dnf clean all \
    && ln -s -f /usr/bin/node-24 /usr/bin/node \
    && rm -f /usr/bin/npm /usr/bin/npx \
    && rpm -e --nodeps $(rpm -qa 'python3*') \
    && rm -rf /usr/lib/python3.9 /usr/lib64/python3.9 /var/cache/dnf

WORKDIR /app/client

COPY --from=build /app/client/.next/standalone ./
COPY --from=build /app/client/.next/static ./.next/static
COPY --from=build /app/client/public ./public

ENV NODE_ENV=production
ENV PORT=80
# ECS sets HOSTNAME to the task's hostname; the standalone server binds to it,
# so pin it to all interfaces.
ENV HOSTNAME=0.0.0.0
EXPOSE 80

CMD ["node", "server.js"]
