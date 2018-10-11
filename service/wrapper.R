library(jsonlite)
library(mpstr)
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

  # pDEGs<-toString(args[6])

  # foldDEGs<-toString(args[7])
  
  # pPathways<-toString(args[8])

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



  # access_code <- "GSE37874"
  # projectId <- "TTT"
  # listGroups<-c('Ctl','Ctl','Ctl','Ctl','RNA_1','RNA_1','RNA_1','RNA_1','RNA_2','RNA_2','RNA_2','RNA_2')
  # action<-"runContrast"
  # workspace<-paste0(getwd(),'/',projectId,'/',sep="")
  # cgroup2<-"RNA_2"
  # cgroup2<-"RNA_1"

  if(action == "loadGSE"){
     
      #### 1) Process GEO files function takes gseid and returns ExpressionFeatureSet object  ####
      #celfiles = processGEOfiles('pid','GSE37874', c('Ctl','Ctl','Ctl','Ctl','RNA_1','RNA_1','RNA_1','RNA_1','RNA_2','RNA_2','RNA_2','RNA_2'))    
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

      celfiles = processGEOfiles(projectId,access_code,listGroups,data_repo_path)  
      # remove downloaded tar file
      fn<-paste0(data_repo_path,"/",access_code,"/",access_code, '_RAW.tar',sep="")
      if (file.exists(fn)) file.remove(fn)
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

    celfiles = processCELfiles(projectId,listGroups,data_repo_path) 
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
    pDEGs<-toString(args[i])
    i<-i+1
    foldDEGs<-toString(args[i])
    i<-i+1
    pPathways<-toString(args[i])
    i<-i+1
    cgroup1<-toString(args[i])
    i<-i+1
    cgroup2<-toString(args[i])
    i<-i+1
    species<-toString(args[i])
    i<-i+1
    geneSet<-toString(args[i])
    i<-i+1
    pSsGSEA<-toString(args[i])
    i<-i+1
    foldSsGSEA<-toString(args[i])
    i<-i+1
    source<-toString(args[i])
     i<-i+1
    config_path<-toString(args[i])
      i<-i+1
    mode<-toString(args[i])

    if(mode=="dev"){
      data_repo_path<-"/Users/cheny39/Documents/GitHub/apps/microarray/tmp/test_data"
      return_plot_data<-readRDS(file = paste0(data_repo_path,"/return_plot_data.rds"))
      l2p_pathways<-readRDS(file = paste0(data_repo_path,"/l2p_pathways.rds"))
      diff_expr_genes<-readRDS(file = paste0(data_repo_path,"/diff_expr_genes.rds"))
      ssGSEA_results<-readRDS(file = paste0(data_repo_path,"/ssGSEA_results.rds"))
      ssColumn<-readRDS(file = paste0(data_repo_path,"/ssColumn.rds"))

      return(list(
        norm_celfiles=return_plot_data,
        diff_expr_genes=diff_expr_genes,
        pathways=l2p_pathways,
        ssGSEA=ssGSEA_results,
        ssColumn=ssColumn
        ))
    }

    #copy configuration files into data repo 



    #If user selects 'ANALYZE CEL FILES', call this function, input path of files (length of group assignments must match number of files for testing purposes):
    #celfiles = processCELfiles('/Users/valdezkm/Documents/2___Combined',c('Ctl_1','Ctl_1','Ctl_1','KO_1','KO_1','KO_1','Ctl_2','Ctl_2','Ctl_2','KO_2','KO_2','KO_2'))

    #### 2) QC / Normalize data function takes ExpressionFeatureSet from above and prints pre-normalization plots, QC plots, post-normalization plots.  Returns normalized data ExpressionFeatureSet ####

    #celfiles = getLocalGEOfiles('pid','GSE37874', c('Ctl','Ctl','Ctl','Ctl','RNA_1','RNA_1','RNA_1','RNA_1','RNA_2','RNA_2','RNA_2','RNA_2'))    
   

    if(source=="upload"){
          celfiles = getCELfiles(projectId,listGroups,data_repo_path) 
       }else{
          celfiles = getLocalGEOfiles(projectId,access_code,listGroups,data_repo_path) 
       }
    
    norm_celfiles = QCnorm(celfiles,data_repo_path)

    col_name<-pData(celfiles)$title

    boxplot_DataBN<-list(col=col_name,data=t(norm_celfiles@listData[[3]]),color=pData(norm_celfiles[[11]])$colors)

    RLE_data<-list(col=col_name,data=t(norm_celfiles@listData[[4]]),color=pData(norm_celfiles[[11]])$colors)


    NUSE_data<-list(col=col_name,data=t(norm_celfiles@listData[[5]]),color=pData(norm_celfiles[[11]])$colors)
    
    boxplot_DataAN<-list(col=col_name,data=t(norm_celfiles@listData[[8]]),color=pData(norm_celfiles[[11]])$colors)
    
    pcaData<-list(
      col=colnames(norm_celfiles[[9]]),
      row=col_name,
      x=norm_celfiles[[9]][,1],
      y=norm_celfiles[[9]][,2],
      z=norm_celfiles[[9]][,3],
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

  
    #### 3) Differentially Expressed Genes function takes files, group and contrast data. Returns list of DEGs for each contrast, annotated normalized data, and pheno data ####
    # Output should dynamically respond to user-selected contrast

    # # if using processGEOfiles() function for test example, create this contrasts variable:
    cons <-c(paste0(cgroup1,"-",cgroup2))
    #cons <-c("RNA_1-RNA_2")
    # # or if using processCELfiles() function for test example, create this contrasts variable:
    # #cons = c("KO_1-Ctl_1","KO_2-Ctl_2")
 
    diff_expr_genes = diffExprGenes(norm_celfiles[[11]],cons,projectId,data_repo_path)       #Call function

    # # #### 4) l2p pathway analysis function, takes DEGs and species as input, returns list of up and downregulated pathways for each contrast ####
    # # # Output should dynamically respond to user-selected contrast

    ## auto correct species
    if(grepl("mouse",celfiles@annotation)){
      species<-"mouse"
    }

    if(grepl("human",celfiles@annotation)){
      species<-"human"
    }
    
    l2p_pathways = l2pPathways(diff_expr_genes,species,data_repo_path,projectId,config_path)

    # # #### 6) ssGSEA function, takes as input: output from deg function, species, and gene set modules(.gmt). Outputs one table of enrichment scores and tables of diff expr pathways per contrast. Prints ssGSEA heatmap ####
    # # # Output should dynamically respond to user-selected contrast
    
    
    ssGSEA_results = ssgseaPathways(diff_expr_genes,species,geneSet,data_repo_path,projectId,config_path)

    saveRDS(return_plot_data, file = paste0(data_repo_path,"/return_plot_data.rds"))
    saveRDS(l2p_pathways, file = paste0(data_repo_path,"/l2p_pathways.rds"))
    saveRDS(diff_expr_genes[1], file = paste0(data_repo_path,"/diff_expr_genes.rds"))
    saveRDS(ssGSEA_results, file = paste0(data_repo_path,"/ssGSEA_results.rds"))
    saveRDS(ssGSEA_results[["DEss"]][[cons]][0], file = paste0(data_repo_path,"/ssColumn.rds"))

    return(list(norm_celfiles=return_plot_data,diff_expr_genes=diff_expr_genes[1],pathways=l2p_pathways,ssGSEA=ssGSEA_results,ssColumn=ssGSEA_results[["DEss"]][[cons]][0]))

  }


  if(action=="runSSGSEA"){
   
    # # #### 6) ssGSEA function, takes as input: output from deg function, species, and gene set modules(.gmt). Outputs one table of enrichment scores and tables of diff expr pathways per contrast. Prints ssGSEA heatmap ####
    # # # Output should dynamically respond to user-selected contrast
    diff_expr_genes<-readRDS(file = paste0(data_repo_path,"/diff_expr_genes.rds"))

    species<-toString(args[4])
    geneSet<-toString(args[5])
    
    ssGSEA_results = ssgseaPathways(diff_expr_genes,species,geneSet,data_repo_path,projectId)

    return(list(ssGSEA=ssGSEA_results[1]))
  }


  if(action=="pathwaysHeapMap"){
   ##geneHeatmap = function(degs, paths, contrast, upOrDown, pathway_name,saveImageFileName) {
   #geneHeatmap(diff_expr_genes, l2p_pathways, 'RNA_1-Ctl', 'upregulated_pathways','oxidation-reduction process')   #if GEO
   #geneHeatmap(diff_expr_genes, l2p_pathways, 'KO_1-Ctl_1', 'upregulated_pathways','oxidation-reduction process')   #if CEL file upload

    diff_expr_genes<-readRDS(file = paste0(data_repo_path,"/diff_expr_genes.rds"))

    l2p_pathways<-readRDS(file = paste0(data_repo_path,"/l2p_pathways.rds"))
    
    cgroup1<-toString(args[5])
    cgroup2<-toString(args[6])
    upOrDown<-toString(args[7])
    pathway_name<-toString(args[8])
    config_path<-toString(args[9])

    contrast <-c(paste0(cgroup1,"-",cgroup2))
    
    pic_name<-paste0("pathwaysHeapMap",sample(1:1000,1,replace=T),".jpg")
    saveImageFileName<-paste0(data_repo_path,pic_name)
    geneHeatmap(diff_expr_genes, l2p_pathways, contrast, upOrDown, pathway_name,saveImageFileName,config_path)

    return(list(pic_name=pic_name))
  }

}

toJSON(process(), auto_unbox = T,force = TRUE)  