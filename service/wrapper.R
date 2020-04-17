
library(jsonlite)
library(mpstr)
library(limma)
library(GEOquery)
library(oligo)
library(Biobase)
library(rgl)
library(Biobase)
library(heatmaply)
library(reshape2)
library(plotly)
library(reshape2)
library(amap)
library(RCurl)

# get directory list of server as string and evaluate if README.txt exists 
ftpServerUp <- function() {
    server <- 'ftp://ftp.ncbi.nlm.nih.gov/geo/'
    
    tryCatch({
        dirlist <- strsplit(getURL(server, ftp.use.epsv = FALSE, dirlistonly = TRUE), '\n')
        return(is.element('README.txt', dirlist[[1]]))
    }, error = function(e) {
        return(FALSE)
    })
}

process = function(){
 tryCatch({
        # GSE53163
        # GSE66660
        # GSE54336
        #  GSE60518
        # // GSE53552
        # // GSE54017
        # // GSE55457
        # // GSE55584
        # // GSE55235
        # // GSE50790
        # // GSE49800
        # // GSE51143
        # // GSE25628
        #args --van  --args code projectID groups action pDEGs foldDEGs pPathways  contrast-group1 contract-group2
        args <- commandArgs(trailingOnly=TRUE)
        action<-toString(args[2])
        projectId <- toString(args[3])

        data_repo_path<-paste0(toString(args[4]),"/",projectId,sep="")
        setwd(toString(args[4]))
        if(action == "loadGSE"){
            access_code<-toString(args[5])
            listGroups<-c()
            listBatches<-c()

            if(args[6]!=""){
              listGroups<-unlist((strsplit(args[6],",")))
            }else{
              listGroups<-toString(args[6])
            }
            if(access_code==""||projectId==""){
              return ("Request field(s) is missing")
            }
            if (args[7]!= "") {
              listBatches<-unlist((strsplit(args[7], ",")))
            } else {
              listBatches<-NULL
            }
            chip <- toString(args[8])
            if (chip == "") {
              chip <- NULL 
            }

            celfiles = 'The GEO FTP server is currently unavailable. Please try again at a later time.'
            if (ftpServerUp()) {
              # change library path to work around write permissions for temporary install of affy chips
              .libPaths(getwd())
              celfiles = processGEOfiles(projectId=projectId,id=access_code,listGroups=listGroups,listBatches=listBatches,workspace=data_repo_path, chip=chip)  
              # remove downloaded tar file
              fn<-paste0(data_repo_path,"/",access_code,"/",access_code, '_RAW.tar',sep="")
              if (file.exists(fn)) file.remove(fn)
            }
            print('wrapperReturn')
            return(celfiles)  
        }
        if(action =="loadCEL"){
          #If user selects 'ANALYZE CEL FILES', call this function, input path of files (length of group assignments must match number of files for testing purposes):
          #celfiles = processCELfiles('pid',c('Ctl_1','Ctl_1','Ctl_1','KO_1','KO_1','KO_1','Ctl_2','Ctl_2','Ctl_2','KO_2','KO_2','KO_2'))
            listGroups<-c()
            if(args[5]!=""){
              listGroups<-unlist((strsplit(args[5],",")))
            }else{
              listGroups<-toString(args[5])
            }

            if(projectId==""||listGroups==""){
              return ("Request field(s) is missing")
            }
          celfiles = processCELfiles(projectId=projectId,listGroups=listGroups,listBatches=NULL,workspace=data_repo_path) 
          return(celfiles)  
        }

        if(action=="runContrast"){
          access_code<-toString(args[5])
          listGroups<-c()
          if(args[6]!=""){
            listGroups<-unlist((strsplit(args[6],",")))
          }else{
            listGroups<-toString(args[6])
          }
          cgroup1 <- toString(args[7])
          cgroup2 <- toString(args[8])
          species <- toString(args[9])
          geneSet <- toString(args[10])
          normal <- toString(args[11])
          source <- toString(args[12])
          config_path <- toString(args[13])
          realGroups <- toString(args[14])
          index <- as.integer(unlist(strsplit(args[15], ",")))
          listBatches <- c()
          if (args[16]!= "") {
            listBatches<-unlist((strsplit(args[16], ",")))
          } else {
            listBatches<-NULL
          }
          chip <- toString(args[17])
          if (chip == "") {
            chip <- NULL
          }
          
          write(args, paste0(data_repo_path,"/test123.txt",sep=""),append=TRUE)
       
          #If user selects 'ANALYZE CEL FILES', call this function, input path of files (length of group assignments must match number of files for testing purposes):
          #celfiles = processCELfiles('/Users/valdezkm/Documents/2___Combined',c('Ctl_1','Ctl_1','Ctl_1','KO_1','KO_1','KO_1','Ctl_2','Ctl_2','Ctl_2','KO_2','KO_2','KO_2'))

          #### 2) QC / Normalize data function takes ExpressionFeatureSet from above and prints pre-normalization plots, QC plots, post-normalization plots.  Returns normalized data ExpressionFeatureSet ####

          #celfiles = getLocalGEOfiles('pid','GSE37874', c('Ctl','Ctl','Ctl','Ctl','RNA_1','RNA_1','RNA_1','RNA_1','RNA_2','RNA_2','RNA_2','RNA_2'))    
          if(source=="upload"){
                celfiles = getCELfiles(projectId=projectId,listGroups=listGroups,listBatches=listBatches,workspace=data_repo_path) 
             }else{
                celfiles = getLocalGEOfiles(projectId=projectId,id=access_code,listGroups=listGroups,listBatches=listBatches,workspace=data_repo_path, chip=chip) 
          }

          cons <-c(paste0(cgroup1,"-",cgroup2))
          saveRDS(celfiles, file = paste0(data_repo_path,"/celfiles.rds"))

          if(normal=="RMA"){
             norm_celfiles = RMA_QCnorm(raw=celfiles[,index],path=data_repo_path,contrast=cons,listBatches=listBatches)
             hisAfter <-"histAfterRMAnorm.html"
           }else{
             norm_celfiles =loess_QCnorm(raw=celfiles[,index],path=data_repo_path,contrast=cons,listBatches=listBatches)
              hisAfter <-"histAfterLoessNorm.html"
          }
            
          # saveRDS(norm_celfiles, file = paste0(data_repo_path,"/normCellFiles.rds"))

          # norm_celfiles = RMA_QCnorm(celfiles,data_repo_path)
          col_name<-pData(celfiles)$title
          boxplot_DataBN<-list(col=col_name,data=t(norm_celfiles@listData[[2]][[1]]),ylable=norm_celfiles@listData[[2]][[2]],color=pData(norm_celfiles[[10]])$colors)
          RLE_data<-list(col=col_name,data=t(norm_celfiles@listData[[3]][[1]]),ylable=norm_celfiles@listData[[3]][[2]],color=pData(norm_celfiles[[10]])$colors)
          NUSE_data<-list(col=col_name,data=t(norm_celfiles@listData[[4]][[1]]),ylable=norm_celfiles@listData[[4]][[2]],color=pData(norm_celfiles[[10]])$colors)
          boxplot_DataAN<-list(col=col_name,data=t(norm_celfiles@listData[[7]][[1]]),ylable=norm_celfiles@listData[[7]][[2]],color=pData(norm_celfiles[[10]])$colors)
          tmp_pca<-norm_celfiles[[8]]
          pcaData<-list(
            col=colnames(tmp_pca$x[,1:3]),
            row=col_name,
            x=tmp_pca$x[,1:3][,1],
            y=tmp_pca$x[,1:3][,2],
            z=tmp_pca$x[,1:3][,3],
            xlable=round(tmp_pca$sdev[1]^2/sum(tmp_pca$sdev^2)*100,2),
            ylable=round(tmp_pca$sdev[2]^2/sum(tmp_pca$sdev^2)*100,2),
            zlable=round(tmp_pca$sdev[3]^2/sum(tmp_pca$sdev^2)*100,2),
            color=pData(norm_celfiles[[10]])$colors
            )

          return_plot_data <- List(
              "histBeforeNorm.html",
              norm_celfiles[[1]]@listData,
              boxplot_DataBN,
              RLE_data,
              NUSE_data,
              hisAfter,
              norm_celfiles[[6]]@listData,
              boxplot_DataAN,
              pcaData,
              norm_celfiles[[9]]
              )
          #saveRDS(return_plot_data,file = paste0(data_repo_path,"/return_plot_data.rds"))
       
          #### 3) Differentially Expressed Genes function takes files, group and contrast data. Returns list of DEGs for each contrast, annotated normalized data, and pheno data ####
          # Output should dynamically respond to user-selected contrast

          # # if using processGEOfiles() function for test example, create this contrasts variable:
        
          #cons <-c("RNA_1-RNA_2")
          # # or if using processCELfiles() function for test example, create this contrasts variable:
          # #cons = c("KO_1-Ctl_1","KO_2-Ctl_2")
       
          diff_expr_genes = diffExprGenes(norm=norm_celfiles[[10]],norm_plots=norm_celfiles[[13]],cons=cons,projectId=projectId,workspace=data_repo_path)       #Call function
          # # #### 4) l2p pathway analysis function, takes DEGs and species as input, returns list of up and downregulated pathways for each contrast ####
          # # # Output should dynamically respond to user-selected contrast
          saveRDS(diff_expr_genes, file = paste0(data_repo_path,"/diff_expr_genes.rds"))
         

          if(typeof(diff_expr_genes) == "character"){
              write(toJSON(diff_expr_genes),paste0(data_repo_path,"/overall_error.txt",sep=""))
              return(NULL)
          }


          ## auto correct species
          species2<-"human"
          if(grepl("mouse",celfiles@annotation)){
              species2<-"mouse"
            }

          if(grepl("human",celfiles@annotation)){
              species2<-"human"
          }
          
          l2p_pathways = l2pPathways(diff_expr_genes,species2,data_repo_path,projectId,config_path)

          saveRDS(l2p_pathways, file = paste0(data_repo_path,"/l2p_pathways.rds"))

          # # #### 6) ssGSEA function, takes as input: output from deg function, species, and gene set modules(.gmt). Outputs one table of enrichment scores and tables of diff expr pathways per contrast. Prints ssGSEA heatmap ####
          # # # Output should dynamically respond to user-selected contrast
         
           tryCatch({
             
              ssGSEA_results = ssgseaPathways(diff_expr_genes,species,geneSet,data_repo_path,projectId,config_path)

            },error =function(cond){
                 # message(cond)

            },finally={
                  ss_result<-""
                  file<-paste0(data_repo_path,"/",projectId,"_",cons,"_ssGSEA_pathways.txt")
                  #write(c(file), paste0(data_repo_path,"/save_ssgsea_input.txt",sep=""),append=TRUE)

                   if (file.exists(file)) {
                      ss_result<-read.table(file, header = FALSE, sep = "", dec = ".") 
                       write(toJSON(ss_result), paste0(data_repo_path,"/save_ssgsea_input.txt",sep=""),append=TRUE)
                    }else{
                      write(c("no find"), paste0(data_repo_path,"/save_ssgsea_input.txt",sep=""),append=TRUE)
                   }
                   if(typeof(ss_result)!="list"){
                        ss_name_d= ""
                        ss_data_d =""
                    }else{
                        ss_name_d=names(ss_result)
                        ss_data_d=ss_result[2:length(ss_result[,1]),]
                    }

                    normalData<-list(data= norm_celfiles[[12]],col=colnames(norm_celfiles[[12]]),row=rownames(norm_celfiles[[12]]))

                    re<-list(
                    normal=normal,
                    source=source,
                    ss_name=ss_name_d,
                    ss_data= ss_data_d,
                    uppath=l2p_pathways[[1]][[1]],
                    downpath=l2p_pathways[[1]][[2]],
                    deg=diff_expr_genes$listDEGs[[1]],
                    maplotBN=return_plot_data[[2]],
                    hisBefore=return_plot_data[[1]],
                    boxplotDataBN=return_plot_data[[3]],
                    RLE=return_plot_data[[4]],
                    NUSE=return_plot_data[[5]],
                    hisAfter=return_plot_data[[6]],
                    maplotAfter=return_plot_data[[7]],
                    boxplotDataAN=return_plot_data[[8]],
                    pcaData=return_plot_data[[9]],
                    heatmapAfterNorm=return_plot_data[[10]],
                    accessionCode=access_code,
                    groups=realGroups,
                    group_1=cgroup1,
                    group_2=cgroup2,
                    genSet=geneSet,
                    projectId=projectId,
                    GSM=celfiles@phenoData@data,
                    colors=col2hex(celfiles@phenoData@data$colors),
                    normCelfiles=diff_expr_genes$norm_annotated,
                    chip=chip
                    )
                 

                  write(toJSON(re),paste0(data_repo_path,"/result.txt",sep=""))
            })
        }


        if(action=="runSSGSEA"){
        tryCatch({
          # # #### 6) ssGSEA function, takes as input: output from deg function, species, and gene set modules(.gmt). Outputs one table of enrichment scores and tables of diff expr pathways per contrast. Prints ssGSEA heatmap ####
          # # # Output should dynamically respond to user-selected contrast
          diff_expr_genes<-readRDS(file = paste0(data_repo_path,"/diff_expr_genes.rds"))
          species<-toString(args[5])
          geneSet<-toString(args[6])
          cgroup1<-toString(args[7])
          cgroup2<-toString(args[8])
          cons <-c(paste0(cgroup1,"-",cgroup2))
          config_path<-toString(args[9])
          write(c(species,geneSet,config_path), "saveImageFileName.txt", sep="\t")
          ssGSEA_results = ssgseaPathways(diff_expr_genes,species,geneSet,data_repo_path,projectId,config_path)
         
           },error =function(cond){
                # message(cond)
           },finally={
                   message("runSSGSEA finally")
                   file<-paste0(data_repo_path,"/",projectId,"_",cons,"_ssGSEA_pathways.txt")
                   if (file.exists(file)) {
                     ss_result<-read.table(file, header = FALSE, sep = "", dec = ".") 
                    re<-list(
                    ss_name=names(ss_result),
                    ss_data= ss_result[2:length(ss_result[,1]),]
                    )
                    write(toJSON(re),paste0(data_repo_path,"/ss_result.txt",sep=""))
                  }
                  
            })
        }

        if(action=="pathwaysHeapMap"){
         
          diff_expr_genes<-readRDS(file = paste0(data_repo_path,"/diff_expr_genes.rds"))

          l2p_pathways<-readRDS(file = paste0(data_repo_path,"/l2p_pathways.rds"))
          
          cgroup1<-toString(args[5])
          cgroup2<-toString(args[6])
          upOrDown<-toString(args[7])
          pathway_name<-toString(args[8])
          config_path<-toString(args[9])

          contrast <-c(paste0(cgroup1,"-",cgroup2))
          
          pic_name<-paste0("pathwaysHeapMap",sample(1:99999,1,replace=T),".jpg")
          saveImageFileName<-pic_name

          #write(saveImageFileName, "saveImageFileName.txt", sep="\t")

          #print("test  console")
          celfiles<-readRDS(file = paste0(data_repo_path,"/celfiles.rds"))

          if(grepl("mouse",celfiles@annotation)){
            species<-"mouse"
          }

          if(grepl("human",celfiles@annotation)){
            species<-"human"
          }
          write(species, "species", sep="\t")

          geneHeatmap(diff_expr_genes, l2p_pathways, contrast, upOrDown, pathway_name,saveImageFileName,config_path,data_repo_path,species)

          return(list(pic_name=pic_name))
        }
    },error =function(cond){
          # add logger?
          # message(cond)
          # message("error")
          write(toJSON(cond$message),paste0(data_repo_path,"/overall_error.txt",sep=""))
    },
    finally={
       #message("finally")
       #return(NULL)
    })

}



toJSON(process(), auto_unbox = T,force = TRUE)  