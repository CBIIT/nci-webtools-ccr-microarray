install.packages(
    c("remotes", "jsonlite", "gplots", "rglwidget", "DT", "getopt", "knitr",
    "reshape", "RColorBrewer", "calibrate", "rmarkdown", "ggplot2", "ggfortify",
    "shinyRGL", "plotly", "htmltools", "heatmaply", "pheatmap", "viridis", "dendsort",
    "amap", "RCurl", "mvtnorm", "BiocManager")
)

install.packages("rgl", configure.args="--disable-ftgl")

# Pin the Bioconductor release for reproducible builds. Bioc 3.18 pairs with R 4.3
# and yields oligo 1.66 (known-good). Without this, BiocManager follows the installed
# R to the newest Bioc -> oligo 1.74, which SIGSEGVs in the CEL reader.
# See docs/incident-2026-06-24-r-sigsegv.md.
BiocManager::install(version = "3.18", update = FALSE, ask = FALSE)

# Install Bioconductor packages BEFORE mpstr (mpstr depends on these)
BiocManager::install(
    c("Biobase", "GEOquery", "GSEABase", "GSVA", "annotate", "sva",
    "clariomshumanhttranscriptcluster.db", "clariomshumantranscriptcluster.db",
    "clariomsmousehttranscriptcluster.db", "clariomsmousetranscriptcluster.db",
    "clariomsrattranscriptcluster.db", "geneplotter", "hgu133a.db", "hgu133a2.db",
    "hgu133b.db", "hgu133plus2.db", "hgu219.db", "hgu95av2.db",
    "hta20transcriptcluster.db", "huex10sttranscriptcluster.db",
    "hugene10sttranscriptcluster.db", "hugene11sttranscriptcluster.db",
    "hugene20sttranscriptcluster.db", "hugene21sttranscriptcluster.db",
    "limma", "mgu74av2.db", "mixOmics", "moe430a.db",
    "moex10sttranscriptcluster.db", "mogene10sttranscriptcluster.db",
    "mogene11sttranscriptcluster.db", "mogene20sttranscriptcluster.db",
    "mouse4302.db", "mouse430a2.db", "multtest", "oligo",
    "pd.clariom.s.human", "pd.clariom.s.human.ht", "pd.clariom.s.mouse",
    "pd.clariom.s.mouse.ht", "pd.clariom.s.rat", "pd.hg.u133.plus.2",
    "pd.hg.u133a", "pd.hg.u133a.2", "pd.hg.u133b", "pd.hg.u219",
    "pd.hg.u95av2", "pd.hta.2.0", "pd.huex.1.0.st.v2", "pd.hugene.1.0.st.v1",
    "pd.hugene.1.1.st.v1", "pd.hugene.2.0.st", "pd.hugene.2.1.st",
    "pd.mg.u74av2", "pd.moe430a", "pd.moex.1.0.st.v1", "pd.mogene.1.0.st.v1",
    "pd.mogene.1.1.st.v1", "pd.mogene.2.0.st", "pd.mouse430.2", "pd.mouse430a.2",
    "pd.ht.hg.u133a", "hthgu133a.db", "pd.clariom.d.human",
    "clariomdhumantranscriptcluster.db"),
    version = "3.18", update = FALSE, ask = FALSE)

# Install mpstr AFTER Bioconductor (mpstr depends on packages above).
# Pinned to a commit (was floating on master) so rebuilds are reproducible.
# 5cf10ee = mpstr 1.4.3, the known-good build.
remotes::install_github("CBIIT/MAAPster/mpstr@5cf10ee216b44f56d1cc2d8bfb2741072ba5e4ae")
if (!requireNamespace("mpstr", quietly = TRUE)) stop("mpstr package failed to install")

# Use latest version from https://github.com/CCBR/l2p
tryCatch({
    install.packages("https://github.com/CCBR/l2p/raw/master/l2p_0.0-14.tar.gz", repos=NULL)
    install.packages("https://github.com/CCBR/l2p/raw/master/l2psupp_0.0-14.tar.gz", repos=NULL)
}, error = function(e) {
    print('L2P install failed. Make sure URL is up-to-date')
})
