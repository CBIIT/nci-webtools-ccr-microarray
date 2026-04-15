FROM public.ecr.aws/amazonlinux/amazonlinux:2023

RUN dnf -y update \
    && dnf -y install spal-release \
    && dnf -y install \
    dnf-plugins-core \
    nodejs22 \
    nodejs22-npm \
    tar \
    gzip \
    git \
    glpk \
    ImageMagick-c++ \
    gcc-c++ \
    gcc-gfortran \
    make \
    libcurl-devel \
    openssl-devel \
    libxml2-devel \
    harfbuzz-devel \
    fribidi-devel \
    freetype-devel \
    libtiff-devel \
    libgit2-devel \
    mesa-libGLU \
    pcre \
    pandoc \
    && dnf clean all

RUN ln -s -f /usr/bin/node-22 /usr/bin/node; ln -s -f /usr/bin/npm-22 /usr/bin/npm;

# Install R via Posit RPM (matching docker branch)
ENV R_VER="4.5.3"
ENV PATH="/opt/R/${R_VER}/bin:${PATH}"
RUN ARCH=$(uname -m) \
    && curl -O https://cdn.posit.co/r/rhel-9/pkgs/R-${R_VER}-1-1.${ARCH}.rpm \
    && dnf install -y R-${R_VER}-1-1.${ARCH}.rpm \
    && echo 'options(repos = c(CRAN = sprintf("https://packagemanager.posit.co/cran/latest/bin/linux/rhel9-%s/%s", R.version["arch"], substr(getRversion(), 1, 3))))' \
       >> /opt/R/${R_VER}/lib/R/etc/Rprofile.site

RUN mkdir -p /app/server

WORKDIR /app/server

# Install R packages (slow layer — cached unless setup.R changes)
COPY server/setup/setup.R /app/server/setup/setup.R
RUN Rscript setup/setup.R

# Install server npm dependencies
COPY server/package.json server/package-lock.json ./
RUN npm install

# Copy config and create microarray_setting.json
COPY server/config ./config
RUN cp config/microarray_setting-local.json config/microarray_setting.json

# Copy server source
COPY server/index.js server/routes.js server/worker.js ./
COPY server/service ./service
COPY server/services ./services
COPY server/components ./components

EXPOSE 9220

CMD ["node", "index.js"]
