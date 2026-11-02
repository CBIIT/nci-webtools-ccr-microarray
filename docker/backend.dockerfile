FROM public.ecr.aws/amazonlinux/amazonlinux:2023

RUN dnf -y update \
    && dnf -y install spal-release \
    && dnf -y install \
    dnf-plugins-core \
    nodejs24 \
    nodejs24-npm \
    tar \
    gzip \
    git \
    glpk \
    ImageMagick-c++ \
    ImageMagick-c++-devel \
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

RUN ln -s -f /usr/bin/node-24 /usr/bin/node; ln -s -f /usr/bin/npm-24 /usr/bin/npm;

# Install R — PINNED to 4.3.2 (Amazon Linux 2023 native; no Posit SIGSEGV).
# Pinning R is the linchpin for reproducible builds: BiocManager selects the
# Bioconductor release from the installed R, so an unpinned `dnf install R` lets a
# clean (cache-free) rebuild pull a newer R -> newer Bioconductor -> newer oligo,
# which regressed with a SIGSEGV in oligo's CEL reader on 2026-06-24.
# See docs/incident-2026-06-24-r-sigsegv.md.
ENV TAR="/usr/bin/tar --no-same-owner"
RUN dnf install -y R-4.3.2 \
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

# Install server npm dependencies, then strip the build-only tooling from the
# image: npm (its vendored node_modules keep carrying CVEs) and Python 3.9
# (only there for dnf; AL2023's build carries unfixed CVEs). The app runs only
# `node` and `Rscript`, so no dnf/npm/python step may come after this one.
COPY server/package.json server/package-lock.json ./
RUN npm ci \
    && npm cache clean --force \
    && dnf remove -y nodejs24-npm \
    && dnf clean all \
    && rm -f /usr/bin/npm /usr/bin/npx \
    && rpm -e --nodeps $(rpm -qa 'python3*') \
    && rm -rf /usr/lib/python3.9 /usr/lib64/python3.9 /var/cache/dnf

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
