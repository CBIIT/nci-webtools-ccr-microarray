library(jsonlite)
library(GEOquery)
library(oligo)
library(rgl)
library(Biobase)
library(heatmaply)

calc = function(){
	args <- commandArgs(trailingOnly=TRUE)
	code <- toString(args[2])
  wd <- toString(args[3])         #"H:/MicroArray/RData"
  #listGroups <- as.list(strsplit(toString(args[3]), ",")[[1]])
  listGroups <- c('Ctl','Ctl','Ctl','Ctl','RNA_1','RNA_1','RNA_1','RNA_1','RNA_2','RNA_2','RNA_2','RNA_2')
	
  setwd(wd)
  #generate celfiles
  id = gsub(" ","",code,fixed=TRUE) 
  system(paste0('rm *.[cC][eE][lL].gz'))                           #removes previous CEL files if run consecutively
  getGEOSuppFiles(id, makeDirectory = T, baseDir = getwd())
  fileID = paste0(id, '_RAW.tar')
  untar(paste0(getwd(),'/',id,'/',fileID))
  SampleName = list.files(pattern = '/*CEL.gz', ignore.case = T)    #list contents of new directory with zipped CEL files
  celfiles = read.celfiles(SampleName)
  gds <- getGEO(id, GSEMatrix = F,getGPL=T,AnnotGPL=T)              #get meta data 
  tableNames=c("gsm","title","description","groups")
  pData(celfiles)[tableNames] = NA
  for (k in 1:length(GSMList(gds)))                                 #fill table with meta data
  {
    if (is.null(Meta(GSMList(gds)[[k]])$description)) {    
      pData(celfiles)[k,2:4] <-c(Meta(GSMList(gds)[[k]])$geo_accession[1], Meta(GSMList(gds)[[k]])$title[1], 'No data available')
    } else {
      pData(celfiles)[k,2:4] <-c(Meta(GSMList(gds)[[k]])$geo_accession[1], Meta(GSMList(gds)[[k]])$title[1], Meta(GSMList(gds)[[k]])$description[1])
    }
  }
  pData(celfiles)$groups = listGroups                               #assign groups to samples
  ####creates a list of colors specific to each group
  fs = factor(pData(celfiles)$groups)
  lFs=levels(fs)
  numFs=length(lFs)
  colors = list()
  for (i in 1:numFs){
    colors[which(fs==lFs[i])] = i*5
  }
  colors = unlist(colors)
  pData(celfiles)$colors = colors
  # end celfiles
  raw <- celfiles

  svg("rawhist.svg",width=8, height=8)
  hist(raw,which="all", main =" Raw Samples distribution")                            #Raw histogram
  dev.off()
  nbfacs=nrow(pData(raw))
  for (i in 1:nbfacs) {
    svg(paste(paste("rawplot_",i,sep=""),".svg",sep=""),width=8, height=8)
    MAplot(raw,which=i,plotFun=smoothScatter,refSamples=c(1:nbfacs), main='', cex=2)  #Raw MAplots
    dev.off()
  }
  svg("rawbox.svg",width=8, height=8)
  boxplot(raw, which="all", main="Boxplots before normalization",
          las=2,names=pData(raw)$title, col=pData(raw)$colors)                        #Raw boxplot
  dev.off()
  qc = fitProbeLevelModel(raw)                                                        #Calculate QC
  svg("rle.svg",width=8, height=8)
  RLE(qc, main="RLE plot",names=pData(raw)$title, las=2, col=pData(raw)$colors)       #RLE
  dev.off()
  svg("nuse.svg",width=8, height=8)
  NUSE(qc, main="NUSE plot",names=pData(raw)$title, las=2, col=pData(raw)$colors)     #NUSE
  dev.off()
  #Normalize data
  if (raw@annotation=="pd.hg.u133.plus.2" | raw@annotation=="pd.clariom.s.human.ht" | raw@annotation=="pd.clariom.s.human" | raw@annotation=="pd.clariom.s.mouse.ht" | raw@annotation=="pd.clariom.s.mouse" | raw@annotation=='pd.mouse430.2' | raw@annotation=='pd.hg.u133a' | raw@annotation=='pd.hg.u133a.2' | raw@annotation=='pd.hg.u219' | raw@annotation=='pd.mg.u74av2' | raw@annotation=='pd.mouse430a.2' | raw@annotation=='pd.moe430a' | raw@annotation=='pd.hg.u95av2' | raw@annotation=='pd.hg.u133b') {
    norm =rma(raw, background=TRUE, normalize=TRUE, subset=NULL)
  } else {
    norm =rma(raw, background=TRUE, normalize=TRUE, subset=NULL, target="core")
  }
  svg("rmahist.svg",width=8, height=8)
  hist(norm, main ="Distribution after Normalization")                                #Normalized histogram
  dev.off()
  for (i in 1:nbfacs) {
    svg(paste(paste("rmaplot_",i,sep=""),".svg",sep=""),width=8, height=8)
    MAplot(norm,which=i,plotFun=smoothScatter,refSamples=c(1:nbfacs), main='', cex=2) #Normalized MAplots
    dev.off()
  }
  svg("rmabox.svg",width=8, height=8)
  boxplot(norm, main="Boxplots after RMA normalization",las=2,
          names=pData(raw)$title, col=pData(raw)$colors)                              #Normalized boxplot
  dev.off()
  # 3D PCA #                                                                          #3D PCA
  tedf= t(exprs(norm))
  if (length(which(apply(tedf, 2, var)==0)) >= 0){
    tedf = tedf[ , apply(tedf, 2, var) != 0]
  }
  pca=prcomp(tedf, scale. = T)
  open3d()
  bg3d('white')
  plot3d(pca$x[,1:3], type='s',size=2, col=pData(raw)$colors)
  group.v=as.vector(pData(raw)$title)
  text3d(pca$x, pca$y, pca$z, group.v, cex=0.6, adj=1.5)
  par3d(mouseMode = "trackball")
  # END 3D PCA / BEGIN HEATMAP #                                                      #Heatmap
  mat=as.matrix(dist(t(exprs(norm))))
  rownames(mat)=pData(norm)$title
  colnames(mat)=rownames(mat)
  save(norm, file = "norm.rda")
  rm(norm)
  value <- c("ok")
  return (value)
}

toJSON(calc(), auto_unbox = T)