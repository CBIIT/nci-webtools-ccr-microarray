library(mpstr)

workspace <-paste0("/Users/cheny39/Documents/GitHub/apps/microarray/tmp/tmp")
access_code <-"GSE37874"
projectId<-"testGSE37874"
listGroups<-c("T1","T2","T3","T4")
data_repo_path<-workspace
config_path<-paste0("/Users/cheny39/Documents/GitHub/apps/microarray/data")

cons<-"T1-T2"

ptm <- proc.time()


celfiles = processGEOfiles(projectId,access_code,listGroups,data_repo_path)  


celfiles = getLocalGEOfiles(projectId,access_code,listGroups,data_repo_path) 


celfiles = getCELfiles(projectId,listGroups,data_repo_path) 

norm_celfiles = RMA_QCnorm(celfiles,data_repo_path,cons)




diff_expr_genes = diffExprGenes(norm_celfiles[[10]],cons,projectId,data_repo_path)       #Call function
      

species2<-"human"
          if(grepl("mouse",celfiles@annotation)){
              species2<-"mouse"
            }

          if(grepl("human",celfiles@annotation)){
              species2<-"human"
          }
          
l2p_pathways = l2pPathways(diff_expr_genes,species2,data_repo_path,projectId,config_path)


norm_celfiles2 = loess_QCnorm(celfiles,data_repo_path,cons)

diff_expr_genes2 = diffExprGenes(norm_celfiles2[[10]],cons,projectId,data_repo_path)       #Call function
      

          
l2p_pathways = l2pPathways(diff_expr_genes2,species2,data_repo_path,projectId,config_path)

species<-"human"
geneSet<-"H: Hallmark Gene Sets"
#
ssGSEA_results = ssgseaPathways(diff_expr_genes,species,geneSet,data_repo_path,projectId,config_path)

