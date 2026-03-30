FROM public.ecr.aws/amazonlinux/amazonlinux:2023

RUN dnf -y update \
    && dnf -y install \
    nodejs20 \
    nodejs20-npm \
    tar \
    gzip \
    R \
    gcc-c++ \
    gcc-gfortran \
    make \
    libcurl-devel \
    openssl-devel \
    libxml2-devel \
    && dnf clean all

RUN ln -s -f /usr/bin/node-20 /usr/bin/node; ln -s -f /usr/bin/npm-20 /usr/bin/npm;
RUN mkdir -p /app

WORKDIR /app

# Install R packages (slow layer — cached unless setup.R changes)
COPY setup/setup.R /app/setup/setup.R
RUN Rscript -e "install.packages('devtools', repos='https://cran.r-project.org')"
RUN Rscript setup/setup.R

# Install server npm dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy config and create microarray_setting.json
COPY config ./config
RUN cp config/microarray_setting-local.json config/microarray_setting.json

# Copy server source
COPY index.js routes.js ./
COPY service ./service
COPY components ./components

EXPOSE 9220

CMD ["node", "index.js"]
