library(mpstr)

workspace <-paste0(getwd(),"/test_data/R_ENV_TEST")
access_code <-"GSE20489"
projectId<-"testGSE20489"
listGroups<-c("T1","T1","T1","T1","T1","T1","T1","T1","T1","T1","T1","T1","T1","T1","T1","T1","T1","T1","T1","T1","T1","T1","T1","T1","T1","T2","T2","T2","T2","T2","T2","T2","T2","T2","T2","T2","T2","T2","T2","T2","T2","T2","T2","T2","T2","T2","T2","T2","T2","T2","others","others","others","others")
data_repo_path<-workspace
config_path<-paste0(getwd(),"/test_data/R_ENV_TEST_CONFIG")

cons<-"T1-T2"

ptm <- proc.time()


celfiles = processGEOfiles(projectId,access_code,listGroups,data_repo_path)  


celfiles = getLocalGEOfiles(projectId,access_code,listGroups,data_repo_path) 


norm_celfiles = QCnorm(celfiles,data_repo_path)


diff_expr_genes = diffExprGenes(norm_celfiles[[11]],cons,projectId,data_repo_path)       #Call function
      

species2<-"human"
          if(grepl("mouse",celfiles@annotation)){
              species2<-"mouse"
            }

          if(grepl("human",celfiles@annotation)){
              species2<-"human"
          }
          
l2p_pathways = l2pPathways(diff_expr_genes,species2,data_repo_path,projectId,config_path)


ssGSEA_results = ssgseaPathways(diff_expr_genes,species,geneSet,data_repo_path,projectId,config_path)

