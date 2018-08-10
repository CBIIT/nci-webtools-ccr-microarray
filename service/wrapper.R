library(jsonlite)
source('./service/MAAPster_functions.R')




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

  workspace<-paste0(getwd(),"/service/data/",projectId,'/',sep="")

  setwd(paste0(getwd(),"/service/data/",sep=""))



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
      access_code<-toString(args[4])
      listGroups<-c()
      if(args[5]!=""){
        listGroups<-unlist((strsplit(args[5],",")))
      }else{
        listGroups<-toString(args[5])
      }

      if(access_code==""||projectId==""||listGroups==""){
        return ("Request field(s) is missing")
      }

      celfiles = processGEOfiles(projectId,access_code,listGroups,workspace)  
      return(celfiles)  
  }


  if(action =="loadCEL"){
    #If user selects 'ANALYZE CEL FILES', call this function, input path of files (length of group assignments must match number of files for testing purposes):
    #celfiles = processCELfiles('pid',c('Ctl_1','Ctl_1','Ctl_1','KO_1','KO_1','KO_1','Ctl_2','Ctl_2','Ctl_2','KO_2','KO_2','KO_2'))
      listGroups<-c()
      if(args[4]!=""){
        listGroups<-unlist((strsplit(args[4],",")))
      }else{
        listGroups<-toString(args[4])
      }

      if(access_code==""||projectId==""||listGroups==""){
        return ("Request field(s) is missing")
      }

    celfiles = processCELfiles(projectId,listGroups,workspace) 
    return(celfiles)  
  }



  if(action=="runContrast"){
    i<-4
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
    

    #If user selects 'ANALYZE CEL FILES', call this function, input path of files (length of group assignments must match number of files for testing purposes):
    #celfiles = processCELfiles('/Users/valdezkm/Documents/2___Combined',c('Ctl_1','Ctl_1','Ctl_1','KO_1','KO_1','KO_1','Ctl_2','Ctl_2','Ctl_2','KO_2','KO_2','KO_2'))

    #### 2) QC / Normalize data function takes ExpressionFeatureSet from above and prints pre-normalization plots, QC plots, post-normalization plots.  Returns normalized data ExpressionFeatureSet ####

    #celfiles = getLocalGEOfiles('pid','GSE37874', c('Ctl','Ctl','Ctl','Ctl','RNA_1','RNA_1','RNA_1','RNA_1','RNA_2','RNA_2','RNA_2','RNA_2'))    
   

    if(source=="upload"){
          celfiles = processCELfiles(projectId,listGroups,workspace) 
       }else{
          celfiles = getLocalGEOfiles(projectId,access_code,listGroups,workspace) 
       }
    
    norm_celfiles = calc(celfiles,workspace)

    #### 3) Differentially Expressed Genes function takes files, group and contrast data. Returns list of DEGs for each contrast, annotated normalized data, and pheno data ####
    # Output should dynamically respond to user-selected contrast

    # # if using processGEOfiles() function for test example, create this contrasts variable:
    cons <-c(paste0(cgroup1,"-",cgroup2))
    #cons <-c("RNA_1-RNA_2")
    # # or if using processCELfiles() function for test example, create this contrasts variable:
    # #cons = c("KO_1-Ctl_1","KO_2-Ctl_2")
 
    diff_expr_genes = deg(norm_celfiles[[11]],cons,projectId,workspace)       #Call function

    # # #### 4) l2p pathway analysis function, takes DEGs and species as input, returns list of up and downregulated pathways for each contrast ####
    # # # Output should dynamically respond to user-selected contrast
    l2p_pathways = pathways(diff_expr_genes,species,workspace,projectId)


    # # #### 6) ssGSEA function, takes as input: output from deg function, species, and gene set modules(.gmt). Outputs one table of enrichment scores and tables of diff expr pathways per contrast. Prints ssGSEA heatmap ####
    # # # Output should dynamically respond to user-selected contrast
    saveRDS(diff_expr_genes, file = paste0(workspace,"diff_expr_genes.rds"))
    saveRDS(l2p_pathways, file = paste0(workspace,"l2p_pathways.rds"))
    
    ssGSEA_results = ss(diff_expr_genes,species,geneSet,workspace,projectId)

    exportJson=list(diff_expr_genes=diff_expr_genes[1],pathways_up=l2p_pathways[0],pathways_down=l2p_pathways[1],ssGSEA=ssGSEA_results[1]) 
    write(toJSON(exportJson,auto_unbox = T,force = TRUE), paste0(workspace,"result.json"))

    return(list(norm_celfiles=norm_celfiles,diff_expr_genes=diff_expr_genes[1],pathways=l2p_pathways,ssGSEA=ssGSEA_results))

  }


  if(action=="runSSGSEA"){
   
    # # #### 6) ssGSEA function, takes as input: output from deg function, species, and gene set modules(.gmt). Outputs one table of enrichment scores and tables of diff expr pathways per contrast. Prints ssGSEA heatmap ####
    # # # Output should dynamically respond to user-selected contrast
    diff_expr_genes<-readRDS(file = paste0(workspace,"diff_expr_genes.rds"))

    species<-toString(args[4])
    geneSet<-toString(args[5])
    
    ssGSEA_results = ss(diff_expr_genes,species,geneSet,workspace,projectId)

    return(list(ssGSEA=ssGSEA_results[1]))
  }


  if(action=="pathwaysHeapMap"){
   ##geneHeatmap = function(degs, paths, contrast, upOrDown, pathway_name,saveImageFileName) {
   #geneHeatmap(diff_expr_genes, l2p_pathways, 'RNA_1-Ctl', 'upregulated_pathways','oxidation-reduction process')   #if GEO
   #geneHeatmap(diff_expr_genes, l2p_pathways, 'KO_1-Ctl_1', 'upregulated_pathways','oxidation-reduction process')   #if CEL file upload

    diff_expr_genes<-readRDS(file = paste0(workspace,"diff_expr_genes.rds"))

    l2p_pathways<-readRDS(file = paste0(workspace,"l2p_pathways.rds"))
    
    cgroup1<-toString(args[4])
    cgroup2<-toString(args[5])

    contrast <-c(paste0(cgroup1,"-",cgroup2))

    saveImageFileName<-paste0(workspace,"pathwaysHeapMap.jpeg"))

    geneHeatmap(diff_expr_genes, l2p_pathways, contrast, upOrDown, pathway_name,saveImageFileName)

    return("success")
  }

}

toJSON(process(), auto_unbox = T,force = TRUE)  
