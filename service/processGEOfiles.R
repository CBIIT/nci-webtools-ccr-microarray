library(jsonlite)
library(GEOquery)
library(oligo)
library(Biobase)
#### 1) Process GEO files function takes gseid and returns ExpressionFeatureSet object  ####
#### CMD looks like 
#### processGEOfiles(
####       'GSE37874',
####   c('Ctl','Ctl','Ctl','Ctl','RNA_1','RNA_1','RNA_1','RNA_1','RNA_2','RNA_2','RNA_2','RNA_2')
####   )    
process = function(){
  args <- commandArgs(trailingOnly=TRUE)
  #args0 --van
  #args 1 -- --args
  #args 2 --- access code
  #args 3 -- pid
  access_code <- toString(args[2])
  pid <- toString(args[3])
 
  log<- c("processGEOfiles.R")
  # get working space 
  # wd service/Data/GSE37874
  workspace<-paste0(getwd(),"/service/Data/",pid,sep="")
  log <- c(log,workspace)
  if(dir.exists(workspace)) {
    log <- c(log,"Dir exist,delete this dir.")
    unlink(workspace,recursive = TRUE)                                     #Delete the directory and files in that dir 
  }
  log <- c(log,"Creating dir.")
  dir.create(workspace)                                                    #Create a directory 


  id = gsub(" ","",access_code,fixed=TRUE) 
  
  getGEOSuppFiles(access_code, makeDirectory = T, baseDir =workspace)
  fileID = paste0(access_code, '_RAW.tar')
  untar(paste0(workspace,'/',access_code,'/',fileID),exdir=workspace)
  gds <- getGEO(access_code, GSEMatrix = F,getGPL=T,AnnotGPL=T)              #get meta data 
  mytable=matrix("",length(GSMList(gds)),4)
  colnames(mytable)=c("gsm","title","description","groups")
  for (k in 1:length(GSMList(gds))) {
       if (is.null(Meta(GSMList(gds)[[k]])$description)) {    
           mytable[k,] <-c(Meta(GSMList(gds)[[k]])$geo_accession[1], Meta(GSMList(gds)[[k]])$title[1], 'No data available',"")
        } else {
           mytable[k,] <-c(Meta(GSMList(gds)[[k]])$geo_accession[1], Meta(GSMList(gds)[[k]])$title[1], Meta(GSMList(gds)[[k]])$description[1],"")
        }
      } # end for
 return <- list(
      files=as.data.frame(apply(mytable,c(1,2),utils::URLencode)),
      tableOrder=colnames(mytable),
      log=log
      )
 
}

toJSON(process(), auto_unbox = T)



