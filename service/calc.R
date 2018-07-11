library(jsonlite)
library(GEOquery)
library(oligo)
library(Biobase)
library(rgl)
library(heatmaply)
library(tools)


#### 2) QC / Normalize data function takes ExpressionFeatureSet from above 
####       and prints pre-normalization plots, QC plots, post-normalization plots.  
####       Returns normalized data ExpressionFeatureSet 

#norm_celfiles = calc(celfiles)      
process = function(){
 #args --van
 #args --args
 # arg code
 # arg projectID
 # arg groups
 # arg pDEGs
 # arg foldDEGs
 # arg pPathways
  args <- commandArgs(trailingOnly=TRUE)
  
  access_code <- toString(args[2])
  pid <- toString(args[3])
  listGroups<-toString(args[4])
  path<-paste0(getwd(),"/service/data/",pid,sep="")

  print ("---------------")
  print(path)

  start_time <- Sys.time()        
  print (start_time)                                              # calcuate running time
  SampleName = list.files(path = path, pattern = '/*CEL*.gz', ignore.case = T, full.names=T)
  raw = read.celfiles(SampleName)
  pData(raw)$title = basename(file_path_sans_ext(SampleName))                   #add sample name to pheno
  pData(raw)$groups = listGroups                                                #add groups to pheno
  ####creates a list of colors specific to each group
  fs = factor(pData(raw)$groups)
  lFs=levels(fs)
  numFs=length(lFs)
  colors = list()
  for (i in 1:numFs){
    colors[which(fs==lFs[i])] = i*5
  }
  colors = unlist(colors)
  pData(raw)$colors = colors

  HistplotBN<-c("/histBeforeNorm.svg")
  svg(paste0(path,"/histBeforeNorm.svg"),width=8, height=8)
  hist(raw,which="all", main =" Raw Samples distribution")
  dev.off()                            #Raw histogram                            #Raw histogram
  nbfacs=nrow(pData(raw))
  MAplotBN<-List()
  for (i in 1:nbfacs) {
     MAplotBN<-c(MAplotBN,paste0("/MAplotsBeforeNorm",i,".jpg"))
     jpeg(paste0(path,"/MAplotsBeforeNorm",i,".jpg"),width=6, height=6,units = "in", res = 300)
     MAplot(raw,which=i,plotFun=smoothScatter,refSamples=c(1:nbfacs), main='', cex=2)  #Raw MAplots
     dev.off()   
   }

  BoxplotBN<-c("/boxplotBeforeNorm.svg")
  svg(paste0(path,"/boxplotBeforeNorm.svg"),width=8, height=8) 
  boxplot(raw, which="all", main="Boxplots before normalization",
          las=2,names=pData(raw)$title, col=pData(raw)$colors)                        #Raw boxplot
  dev.off() 
  
  qc = fitProbeLevelModel(raw)                                                        #Calculate QC
 
  RLEplotBN<-c("/RLEBeforeNorm.svg")
  svg(paste0(path,"/RLEBeforeNorm.svg"),width=8, height=8) 
  RLE(qc, main="RLE plot",names=pData(raw)$title, las=2, col=pData(raw)$colors)       #RLE
  dev.off() 
 
  NUSEplotBN<-c("/NUSEBeforeNorm.svg")
  svg(paste0(path,"/NUSEBeforeNorm.svg"),width=8, height=8) 
  NUSE(qc, main="NUSE plot",names=pData(raw)$title, las=2, col=pData(raw)$colors)     #NUSE
  dev.off()

  #Normalize data
  if (raw@annotation=="pd.hg.u133.plus.2" | raw@annotation=="pd.clariom.s.human.ht" | raw@annotation=="pd.clariom.s.human" | raw@annotation=="pd.clariom.s.mouse.ht" | raw@annotation=="pd.clariom.s.mouse" | raw@annotation=='pd.mouse430.2' | raw@annotation=='pd.hg.u133a' | raw@annotation=='pd.hg.u133a.2' | raw@annotation=='pd.hg.u219' | raw@annotation=='pd.mg.u74av2' | raw@annotation=='pd.mouse430a.2' | raw@annotation=='pd.moe430a' | raw@annotation=='pd.hg.u95av2' | raw@annotation=='pd.hg.u133b') {
     norm =rma(raw, background=TRUE, normalize=TRUE, subset=NULL)
   } else {
     norm =rma(raw, background=TRUE, normalize=TRUE, subset=NULL, target="core")
   }

   HistplotAN<-c("/histAfterNorm.svg")
   svg(paste0(path,"/histAfterNorm.svg"),width=8, height=8)
   hist(norm, main ="Distribution after Normalization")                                #Normalized histogram
   dev.off() 
   MAplotAN<-List()
    for (i in 1:nbfacs) {
      MAplotAN<-c(MAplotAN,paste0("/MAplotsAfterNorm",i,".jpg"))
       jpeg(paste0(path,"/MAplotsAfterNorm",i,".jpg"),width=6, height=6,units = "in", res = 300)
       MAplot(norm,which=i,plotFun=smoothScatter,refSamples=c(1:nbfacs), main='', cex=2) #Normalized MAplots
       dev.off() 
    }


    BoxplotAN<-c("/boxplotsAfterNorm.svg")
    svg(paste0(path,"/boxplotsAfterNorm.svg"),width=8, height=8)
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
    writeWebGL(dir = file.path(path, "webGL"),width = 500, reuse = TRUE)

    PCA<-c("/webGL/index.html")

    mat=as.matrix(dist(t(exprs(norm))))
    rownames(mat)=pData(norm)$title
    colnames(mat)=rownames(mat)

    heatmaply(
      mat,margins = c(80,120,60,40),
      colorRampPalette(colors = c("red", "yellow")),
      file = paste0(path,"/heatmapAfterNorm.html")
              )
    Heatmapolt<-c("/heatmapAfterNorm.html")
    # #return(norm)

    end_time <- Sys.time()  
    print (end_time)                                                          # calcuate running time
    time_cost <-c(end_time-start_time)
    print (time_cost)

    print ("&&##$$")
    return (List(HistplotBN,MAplotBN,BoxplotBN,RLEplotBN,NUSEplotBN,HistplotAN,MAplotAN,BoxplotAN,PCA,Heatmapolt,time_cost))
  }

#process()
toJSON(process(), auto_unbox = T,force = TRUE)  