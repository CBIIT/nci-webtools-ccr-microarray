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
