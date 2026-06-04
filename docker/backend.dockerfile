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
    libuv-devel \
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

# Install R (Amazon Linux 2023 native — x86_64 compatible, no Posit SIGSEGV)
ENV TAR="/usr/bin/tar --no-same-owner"
RUN dnf install -y R \
    && echo 'options(repos = c(CRAN = "https://cloud.r-project.org"))' \
       >> /usr/lib64/R/etc/Rprofile.site

RUN mkdir -p /app/server

WORKDIR /app/server

# Install R packages (slow layer — cached unless setup.R changes)
COPY server/setup/setup.R /app/server/setup/setup.R
RUN Rscript setup/setup.R

# Replace webshot (bundles casperjs/CVE-2020-7679) with webshot2-backed stub
# webshot2 uses Chrome instead of PhantomJS — no CVE
# Stub named 'webshot' satisfies heatmaply's Imports: webshot requirement
RUN set -e; \
    Rscript -e "install.packages('webshot2')"; \
    PKG=/tmp/webshot_stub; \
    mkdir -p "${PKG}/R"; \
    printf 'Package: webshot\nVersion: 0.5.5\nTitle: Stub\nDescription: Delegates to webshot2.\nLicense: MIT\nImports: webshot2\n' > "${PKG}/DESCRIPTION"; \
    printf 'importFrom(webshot2,webshot)\nimportFrom(webshot2,appshot)\nimportFrom(webshot2,resize)\nimportFrom(webshot2,shrink)\nimportFrom(webshot2,rmdshot)\nexport(webshot)\nexport(appshot)\nexport(resize)\nexport(shrink)\nexport(rmdshot)\nexport(install_phantomjs)\nexport(is_phantomjs_installed)\n' > "${PKG}/NAMESPACE"; \
    printf 'install_phantomjs <- function(...) invisible(NULL)\nis_phantomjs_installed <- function(...) FALSE\n' > "${PKG}/R/stubs.R"; \
    Rscript -e "remove.packages('webshot'); install.packages('${PKG}', repos=NULL, type='source')"; \
    rm -rf "${PKG}"

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
