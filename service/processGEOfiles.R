library(jsonlite)
library(GEOquery)
library(oligo)
library(Biobase)

process = function(){
	args <- commandArgs(trailingOnly=TRUE)
	code <- toString(args[2])
	
	id = gsub(" ","",code,fixed=TRUE)
	gds <- getGEO(id, GSEMatrix = F,getGPL=T,AnnotGPL=T)              #get meta data
	mytable=matrix("",length(GSMList(gds)),3)
    colnames(mytable)=c("gsm","title","description")
    for (k in 1:length(GSMList(gds)))
    {
      if (is.null(Meta(GSMList(gds)[[k]])$description)) {    
        mytable[k,] <-c(Meta(GSMList(gds)[[k]])$geo_accession[1], Meta(GSMList(gds)[[k]])$title[1], 'No data available')
      } else {
        mytable[k,] <-c(Meta(GSMList(gds)[[k]])$geo_accession[1], Meta(GSMList(gds)[[k]])$title[1], Meta(GSMList(gds)[[k]])$description[1])
      }
    }

    list(files=as.data.frame(apply(mytable,c(1,2),utils::URLencode)),tableOrder=colnames(mytable))
}

toJSON(process(), auto_unbox = T)



