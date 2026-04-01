FROM public.ecr.aws/amazonlinux/amazonlinux:2023

RUN dnf -y update \
    && dnf -y install \
    nodejs22 \
    nodejs22-npm \
    tar \
    gzip \
    R-4.5.3 \
    gcc-c++ \
    gcc-gfortran \
    make \
    libcurl-devel \
    openssl-devel \
    libxml2-devel \
    git \
    && dnf clean all

RUN ln -s -f /usr/bin/node-22 /usr/bin/node; ln -s -f /usr/bin/npm-22 /usr/bin/npm;
RUN mkdir -p /app/server

WORKDIR /app/server

# Install R packages (slow layer — cached unless setup.R changes)
COPY server/setup/setup.R /app/server/setup/setup.R
RUN Rscript -e "install.packages('devtools', repos='https://cran.r-project.org')"
RUN Rscript setup/setup.R

# Install server npm dependencies
COPY server/package.json server/package-lock.json ./
RUN npm install

# Copy config and create microarray_setting.json
COPY server/config ./config
RUN cp config/microarray_setting-local.json config/microarray_setting.json

# Copy server source
COPY server/index.js server/routes.js ./
COPY server/service ./service
COPY server/components ./components

EXPOSE 9220

CMD ["node", "index.js"]
