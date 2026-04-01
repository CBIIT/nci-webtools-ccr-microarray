FROM public.ecr.aws/amazonlinux/amazonlinux:2023

RUN dnf -y update \
    && dnf -y install \
    nodejs22 \
    nodejs22-npm \
    gcc-c++ \
    make \
    httpd \
    && dnf clean all

RUN ln -s -f /usr/bin/node-22 /usr/bin/node; ln -s -f /usr/bin/npm-22 /usr/bin/npm;
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

# Copy httpd config and move build output to serve directory
COPY docker/httpd.conf /etc/httpd/conf.d/app.conf
RUN cp -r build/* /var/www/html/

# Forward httpd logs to docker stdout/stderr
RUN ln -sf /dev/stdout /var/log/httpd/access_log \
    && ln -sf /dev/stderr /var/log/httpd/error_log

EXPOSE 3000

CMD ["httpd", "-D", "FOREGROUND"]
