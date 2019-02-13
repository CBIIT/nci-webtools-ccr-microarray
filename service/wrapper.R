library(jsonlite)
library(mpstr)
library(limma)
library(GEOquery)
library(oligo)
library(Biobase)
#source('./service/MAAPster_functions.R')




process = function(){

  #args --van  --args code projectID groups action pDEGs foldDEGs pPathways  contrast-group1 contract-group2
  args <- commandArgs(trailingOnly=TRUE)
  action<-toString(args[2])
  projectId <- toString(args[3])

  # access_code <- toString(args[2])

  # projectId <- toString(args[3])

  # listGroups<-c()
  # if(args[4]!=""){
  #   listGroups<-unlist((strsplit(args[4],",")))
  # }else{
  #   listGroups<-toString(args[4])
  # }
  
  # action<-toString(args[5])
  
  # cgroup1<-toString(args[9])

  # cgroup2<-toString(args[10])

  # species<-toString(args[11])

  # geneSet<-toString(args[12])

  # pSsGSEA<-toString(args[13])

  # foldSsGSEA<-toString(args[14])

  # source<-toString(args[15])

  # upOrDown<-toString(args[16])

  # pathway_name<-toString(args[17]) 

  #return(args)

  data_repo_path<-paste0(toString(args[4]),"/",projectId,sep="")
  setwd(toString(args[4]))



  # access_code <- "GSE37874/GSE20489"
  # projectId <- "TTT"
  # listGroups<-c('Ctl','Ctl','Ctl','Ctl','RNA_1','RNA_1','RNA_1','RNA_1','RNA_2','RNA_2','RNA_2','RNA_2')
  # action<-"runContrast"
  # workspace<-paste0(getwd(),'/',projectId,'/',sep="")
  # cgroup2<-"RNA_2"
  # cgroup2<-"RNA_1"

  if(action == "loadGSE"){
      
      access_code<-toString(args[5])
      listGroups<-c()
      if(args[6]!=""){
        listGroups<-unlist((strsplit(args[6],",")))
      }else{
        listGroups<-toString(args[6])
      }
      if(access_code==""||projectId==""){
        return ("Request field(s) is missing")
      }

      celfiles<-tryCatch(
        {
          # get geo files from upstream
          return(processGEOfiles(projectId,access_code,listGroups,data_repo_path))
          # remove downloaded tar file
          fn<-paste0(data_repo_path,"/",access_code,"/",access_code, '_RAW.tar',sep="")
          if (file.exists(fn)) file.remove(fn)
        },
        error =function(cond){
          # add logger?
          return(NULL)
        },
        warning = function(cond){
          # add logger?
          return(NULL)
        },
        finally={

        }
      
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

    celfiles <-tryCatch(
        { 
        processCELfiles(projectId,listGroups,data_repo_path)
        },
        error =function(cond){
          # add logger?
          return(NULL)
        },
        warning = function(cond){
          # add logger?
          return(NULL)
        },
        finally={

        }
      
    return(celfiles)  
  }



  if(action=="runContrast"){
    i<-5
    access_code<-toString(args[i])
    i<-i+1
    listGroups<-c()
    if(args[i]!=""){
      listGroups<-unlist((strsplit(args[i],",")))
    }else{
      listGroups<-toString(args[i])
    }
    i<-i+1
    cgroup1<-toString(args[i])
    i<-i+1
    cgroup2<-toString(args[i])
    i<-i+1
    species<-toString(args[i])
    i<-i+1
    geneSet<-toString(args[i])
    i<-i+1
    source<-toString(args[i])
     i<-i+1
    config_path<-toString(args[i])


    #If user selects 'ANALYZE CEL FILES', call this function, input path of files (length of group assignments must match number of files for testing purposes):
    #celfiles = processCELfiles('/Users/valdezkm/Documents/2___Combined',c('Ctl_1','Ctl_1','Ctl_1','KO_1','KO_1','KO_1','Ctl_2','Ctl_2','Ctl_2','KO_2','KO_2','KO_2'))

    #### 2) QC / Normalize data function takes ExpressionFeatureSet from above and prints pre-normalization plots, QC plots, post-normalization plots.  Returns normalized data ExpressionFeatureSet ####

    #celfiles = getLocalGEOfiles('pid','GSE37874', c('Ctl','Ctl','Ctl','Ctl','RNA_1','RNA_1','RNA_1','RNA_1','RNA_2','RNA_2','RNA_2','RNA_2'))    
   
  celfiles<-tryCatch(
        { 
    if(source=="upload"){
          return (getCELfiles(projectId,listGroups,data_repo_path))
       }else{
          celfiles = getLocalGEOfiles(projectId,access_code,listGroups,data_repo_path) 
       }
    },
    error =function(cond){
        # add logger?
        return(NULL)
    },
    warning = function(cond){
        # add logger?
        return(NULL)
    },
    finally={

    }
    if(celfiles == NULL){
      return("Get celfiles fails")

    }
    saveRDS(celfiles, file = paste0(data_repo_path,"/celfiles.rds"))

    norm_celfiles <-tryCatch({

        return(QCnorm(celfiles,data_repo_path))
    },
    error =function(cond){
        # add logger?
        return(NULL)
    },
    warning = function(cond){
        # add logger?
        return(NULL)
    },
    finally={

    }
    if(norm_celfiles == NULL){
      return("QCnorm fails")
    }

    col_name<-pData(celfiles)$title

    boxplot_DataBN<-list(col=col_name,data=t(norm_celfiles@listData[[3]]),color=pData(norm_celfiles[[11]])$colors)

    RLE_data<-list(col=col_name,data=t(norm_celfiles@listData[[4]]),color=pData(norm_celfiles[[11]])$colors)


    NUSE_data<-list(col=col_name,data=t(norm_celfiles@listData[[5]]),color=pData(norm_celfiles[[11]])$colors)
    
    boxplot_DataAN<-list(col=col_name,data=t(norm_celfiles@listData[[8]]),color=pData(norm_celfiles[[11]])$colors)
    
    tmp_pca<-norm_celfiles[[9]]
    pcaData<-list(
      col=colnames(tmp_pca$x[,1:3]),
      row=col_name,
      x=tmp_pca$x[,1:3][,1],
      y=tmp_pca$x[,1:3][,2],
      z=tmp_pca$x[,1:3][,3],
      xlable=round(tmp_pca$sdev[1]^2/sum(tmp_pca$sdev^2)*100,2),
      ylable=round(tmp_pca$sdev[2]^2/sum(tmp_pca$sdev^2)*100,2),
      zlable=round(tmp_pca$sdev[3]^2/sum(tmp_pca$sdev^2)*100,2),
      color=pData(norm_celfiles[[11]])$colors
      )

    return_plot_data <- List(
        norm_celfiles[[1]],
        norm_celfiles[[2]]@listData,
        boxplot_DataBN,
        RLE_data,
        NUSE_data,
        norm_celfiles[[6]],
        norm_celfiles[[7]]@listData,
        boxplot_DataAN,
        pcaData,
        norm_celfiles[[10]]
        )

    saveRDS(return_plot_data,file = paste0(data_repo_path,"/return_plot_data.rds"))

 
    #### 3) Differentially Expressed Genes function takes files, group and contrast data. Returns list of DEGs for each contrast, annotated normalized data, and pheno data ####
    # Output should dynamically respond to user-selected contrast

    # # if using processGEOfiles() function for test example, create this contrasts variable:
    cons <-c(paste0(cgroup1,"-",cgroup2))
    #cons <-c("RNA_1-RNA_2")
    # # or if using processCELfiles() function for test example, create this contrasts variable:
    # #cons = c("KO_1-Ctl_1","KO_2-Ctl_2")
 
    diff_expr_genes  <-tryCatch(
    { 
      return(diffExprGenes(norm_celfiles[[11]],cons,projectId,data_repo_path))      #Call function
    },error =function(cond){
        # add logger?
        return(NULL)
    },
    warning = function(cond){
        # add logger?
        return(NULL)
    },
    finally={

    }
    if(diff_expr_genes == NULL){
      re<-list(
      ss_name="",
      ss_data="",
      uppath="",
      downpath="",
      deg="",
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
      groups=listGroups,
      group_1=cgroup1,
      group_2=cgroup2,
      genSet=geneSet,
      projectId=projectId,
      GSM=celfiles@phenoData@data
      )

    write(toJSON(re),paste0(data_repo_path,"/result.txt",sep=""))
    return(list(norm_celfiles=return_plot_data,diff_expr_genes="diffExprGenes fails",pathways="",ssGSEA="",ssColumn=""))

    }
    # # #### 4) l2p pathway analysis function, takes DEGs and species as input, returns list of up and downregulated pathways for each contrast ####
    # # # Output should dynamically respond to user-selected contrast
    saveRDS(diff_expr_genes, file = paste0(data_repo_path,"/diff_expr_genes.rds"))
    ## auto correct species

    
    l2p_pathways <-tryCatch(
    {
      return(l2pPathways(diff_expr_genes,species,data_repo_path,projectId,config_path))
     },error =function(cond){
        # add logger?
        return(NULL)
    },warning = function(cond){
        # add logger?
        return(NULL)
    },finally={

    }
    if(l2p_pathways == NULL){
      re<-list(
      ss_name="",
      ss_data="",
      uppath="",
      downpath="",
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
      groups=listGroups,
      group_1=cgroup1,
      group_2=cgroup2,
      genSet=geneSet,
      projectId=projectId,
      GSM=celfiles@phenoData@data
      )

    write(toJSON(re),paste0(data_repo_path,"/result.txt",sep=""))
    return(list(norm_celfiles=return_plot_data,diff_expr_genes=diff_expr_genes[1],pathways="l2p_pathways fails",ssGSEA="",ssColumn=""))

    }

    saveRDS(l2p_pathways, file = paste0(data_repo_path,"/l2p_pathways.rds"))

    # # #### 6) ssGSEA function, takes as input: output from deg function, species, and gene set modules(.gmt). Outputs one table of enrichment scores and tables of diff expr pathways per contrast. Prints ssGSEA heatmap ####
    # # # Output should dynamically respond to user-selected contrast
    write(c(species,geneSet,config_path), paste0(data_repo_path,"/save_ssgsea_input.txt",sep=""))

    ssGSEA_results <-tryCatch(
    {
      return(ssgseaPathways(diff_expr_genes,species,geneSet,data_repo_path,projectId,config_path))
    },error =function(cond){
        # add logger?
        return(NULL)
    },
    warning = function(cond){
        # add logger?
        return(NULL)
    },
    finally={

    }
    if(ssGSEA_results == NULL){
    
        re<-list(
                  ss_name="",
                  ss_data="",
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
                  groups=listGroups,
                  group_1=cgroup1,
                  group_2=cgroup2,
                  genSet=geneSet,
                  projectId=projectId,
                  GSM=celfiles@phenoData@data
                )

    write(toJSON(re),paste0(data_repo_path,"/result.txt",sep=""))
    return(list(norm_celfiles=return_plot_data,diff_expr_genes=diff_expr_genes[1],pathways=pathways=l2p_pathways,ssGSEA="ssgseaPathways fails",ssColumn=""))

    }

    saveRDS(ssGSEA_results,file = paste0(data_repo_path,"/ssGSEA_results.rds"))

    ss_result<-ssGSEA_results$DEss
    re<-list(
      ss_name=names(ss_result),
      ss_data=ss_result[[1]],
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
      groups=listGroups,
      group_1=cgroup1,
      group_2=cgroup2,
      genSet=geneSet,
      projectId=projectId,
      GSM=celfiles@phenoData@data
      )

    write(toJSON(re),paste0(data_repo_path,"/result.txt",sep=""))
    return(list(norm_celfiles=return_plot_data,diff_expr_genes=diff_expr_genes[1],pathways=l2p_pathways,ssGSEA=ssGSEA_results,ssColumn=ssGSEA_results[["DEss"]][[cons]][0]))

  }


  if(action=="runSSGSEA"){
   
    # # #### 6) ssGSEA function, takes as input: output from deg function, species, and gene set modules(.gmt). Outputs one table of enrichment scores and tables of diff expr pathways per contrast. Prints ssGSEA heatmap ####
    # # # Output should dynamically respond to user-selected contrast
    diff_expr_genes<-readRDS(file = paste0(data_repo_path,"/diff_expr_genes.rds"))


    species<-toString(args[5])
    geneSet<-toString(args[6])
    config_path<-toString(args[7])

    write(c(species,geneSet,config_path), "saveImageFileName.txt", sep="\t")
    ssGSEA_results = ssgseaPathways(diff_expr_genes,species,geneSet,data_repo_path,projectId,config_path)
    return(list(ssGSEA=ssGSEA_results))
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

}

toJSON(process(), auto_unbox = T,force = TRUE)  