FROM public.ecr.aws/amazonlinux/amazonlinux:2023

RUN dnf -y update \
    && dnf -y install \
    nodejs20 \
    nodejs20-npm \
    gcc-c++ \
    make \
    nginx \
    && dnf clean all

RUN ln -s -f /usr/bin/node-20 /usr/bin/node; ln -s -f /usr/bin/npm-20 /usr/bin/npm;
RUN mkdir -p /app/client

WORKDIR /app/client

# Install client dependencies
COPY client/package.json client/package-lock.json ./
RUN npm install

# Copy client source
COPY client/ ./

# Build React app (needs legacy OpenSSL for old Webpack in react-scripts 3.x)
ENV NODE_OPTIONS=--openssl-legacy-provider
RUN npm run build

# Copy nginx config
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf

# Move build output to nginx serve directory
RUN mkdir -p /usr/share/nginx/html
RUN cp -r build/* /usr/share/nginx/html/

EXPOSE 3000

CMD ["nginx", "-g", "daemon off;"]
