needs(GEOquery)
needs(jsonlite)
needs(limma)
needs(oligo)
needs(xml2)

############################
# Don't ask. Just... don't #
############################
getDirListing <- function(url) {
  # Takes a URL and returns a character vector of filenames
    a <- xml2::read_html(url)
    fnames = grep('^G',xml2::xml_text(xml2::xml_find_all(a,'//a/@href')),value=TRUE)
  return(fnames)
}

getGEOSuppFiles <- function(GEO, makeDirectory = TRUE,
                            baseDir = getwd(), fetch_files = TRUE,
                            filter_regex = NULL) {
  geotype <- toupper(substr(GEO,1,3))
  storedir <- baseDir
  fileinfo <- list()
  stub = gsub('\\d{1,3}$','nnn',GEO,perl=TRUE)
  if(geotype=='GSM') {
    url <- sprintf("https://ftp.ncbi.nlm.nih.gov/geo/samples/%s/%s/suppl/",stub,GEO)
  }
  if(geotype=='GSE') {
    url <- sprintf("https://ftp.ncbi.nlm.nih.gov/geo/series/%s/%s/suppl/",stub,GEO)
  }
  if(geotype=='GPL') {
    url <- sprintf("https://ftp.ncbi.nlm.nih.gov/geo/platform/%s/%s/suppl/",stub,GEO)
  }
  fnames <- try(getDirListing(url),silent=TRUE)
  if(inherits(fnames,'try-error')) {
    message('No supplemental files found.')
    message('Check URL manually if in doubt')
    message(url)
    return(NULL)
  }
  if(makeDirectory) {
    suppressWarnings(dir.create(storedir <- file.path(baseDir,GEO)))
  }
  if(!is.null(filter_regex)) {
      fnames = fnames[grepl(filter_regex, fnames)]
  }
  if(fetch_files) {
      for(i in fnames) {
          download.file(paste(file.path(url,i),'tool=geoquery',sep="?"),
                        destfile=file.path(storedir,i),
                        mode='wb',
                        quiet = TRUE,
                        method=getOption('download.file.method.GEOquery'))
          fileinfo[[file.path(storedir,i)]] <- file.info(file.path(storedir,i))
      }
      return(do.call(rbind,fileinfo))
  } else {
      return(data.frame(fname = fnames, url = file.path(url, fnames)))
  }
}
#################
# End stupidity #
#################

suppressWarnings(suppressMessages({
  returnValue <- list()
  returnValue$saveValue <- tryCatch(
    withCallingHandlers(
      {
        input = fromJSON(input[[1]])
        id = input$gsecode
        mytable = input$files
        #getGEOSuppFiles(id, makeDirectory = T, baseDir = file.path(getwd(),'tmp'))
        fileDir = file.path(getwd(),'tmp',id)
        #untar(file.path(fileDir,paste0(id,'_RAW.tar')),exdir=fileDir)

        SampleName = list.files(path=fileDir,pattern = '/*CEL.gz', ignore.case = T) #list contents of new directory with zipped CEL files
        if (length(grep('*CEL*',SampleName,ignore.case = T)) == 0) {
          info("Raw files must be CEL files")
        }
        rownames(mytable) = mytable$title
        cels = SampleName

        pd = AnnotatedDataFrame(mytable)
        celfiles = read.celfiles(file.path(fileDir,cels), phenoData = pd)
        colnames(pData(celfiles))[2] = 'SampleID'

        tAnnot = tempfile(pattern = "annotation_", tmpdir = file.path(getwd(),'tmp'), fileext = paste0(paste("_",id, sep=""),'.txt'))
        cat(celfiles@annotation,file=tAnnot)

        #if platform is not supported display error message
        if (celfiles@annotation!="pd.hg.u133.plus.2" & celfiles@annotation!="pd.mogene.2.0.st" & celfiles@annotation!="pd.hugene.2.0.st" & celfiles@annotation!="pd.clariom.s.human.ht" & celfiles@annotation!="pd.clariom.s.human" & celfiles@annotation!="pd.clariom.s.mouse.ht" & celfiles@annotation!="pd.clariom.s.mouse" & celfiles@annotation!='pd.mouse430.2' & celfiles@annotation!='pd.hg.u133a' & celfiles@annotation!='pd.hugene.1.0.st.v1' & celfiles@annotation!='pd.mogene.1.0.st.v1' & celfiles@annotation!='pd.hg.u133a.2' & celfiles@annotation!='pd.huex.1.0.st.v2' & celfiles@annotation!='pd.hg.u219' & celfiles@annotation!='pd.mg.u74av2' & celfiles@annotation!='pd.mouse430a.2' & celfiles@annotation!='pd.moe430a' & celfiles@annotation!='pd.hg.u95av2' & celfiles@annotation!='pd.hta.2.0' & celfiles@annotation!='pd.moex.1.0.st.v1' & celfiles@annotation!='pd.hg.u133b' & celfiles@annotation!='pd.hugene.1.1.st.v1' & celfiles@annotation!='pd.mogene.1.1.st.v1' & celfiles@annotation!='pd.clariom.s.rat') {
          #cat("Please sort your phenotype on sample name and upload it again. \n")
          info(paste0("Affymetrix platform: ",celfiles@annotation," NOT supported. Leaving..."))
          stop(-1)
        }

        #normalization
        if (celfiles@annotation=="pd.hg.u133.plus.2" | celfiles@annotation=="pd.clariom.s.human.ht" | celfiles@annotation=="pd.clariom.s.human" | celfiles@annotation=="pd.clariom.s.mouse.ht" | celfiles@annotation=="pd.clariom.s.mouse" | celfiles@annotation=='pd.mouse430.2' | celfiles@annotation=='pd.hg.u133a' | celfiles@annotation=='pd.hg.u133a.2' | celfiles@annotation=='pd.hg.u219' | celfiles@annotation=='pd.mg.u74av2' | celfiles@annotation=='pd.mouse430a.2' | celfiles@annotation=='pd.moe430a' | celfiles@annotation=='pd.hg.u95av2' | celfiles@annotation=='pd.hg.u133b' | celfiles@annotation=='pd.clariom.s.rat') {
          celfiles.rma =rma(celfiles, background=TRUE, normalize=TRUE, subset=NULL)
        } else {
          celfiles.rma =rma(celfiles, background=TRUE, normalize=TRUE, subset=NULL, target="core")
        }

        #QC
        celfiles.qc=fitProbeLevelModel(celfiles)

        #############################################
        # This is where integration starts, I think #
        #############################################
        #Contrast (user input, many contrasts may be added as rows, contrasts must be chosen from groups assigned above)
        contra = data.frame(k1 = unique(mytable$group[1:4]), k2 = unique(mytable$group[13:16]))
        contra = rbind(contra, data.frame(k1 = unique(mytable$group[1:4]), k2 = unique(mytable$group[17:20])))

        #####  DEG  #####
        nb=dim(contra)[1]
        cons=c()

        #order: experimental samples first, control/baseline samples second
        for (k in 1:nb) {
          cons=c(cons,paste(contra[k,2],"-",contra[k,1],sep=""))
        }

        myfactor <- factor(celfiles$group)
        design1 <- model.matrix(~0+myfactor)
        colnames(design1) <- levels(myfactor)

        fit1 <- lmFit(celfiles.rma,design1)
        contrast.matrix <- makeContrasts(contrasts=cons,levels=design1)

        fit2 <- contrasts.fit(fit1, contrast.matrix)
        ebayes.fit2=eBayes(fit2) # smooths the std error

        Annot <- switch (celfiles@annotation,
          pd.mogene.2.0.st = {
            data.frame(ACCNUM=sapply(contents(mogene20sttranscriptclusterACCNUM), paste, collapse=", "), SYMBOL=sapply(contents(mogene20sttranscriptclusterSYMBOL), paste, collapse=", "), DESC=sapply(contents(mogene20sttranscriptclusterGENENAME), paste, collapse=", "), ENTREZ=sapply(contents(mogene20sttranscriptclusterENTREZID), paste, collapse=", "))
            #data.frame(ACCNUM=sapply(contents(mogene20sttranscriptclusterACCNUM), paste, collapse=", "), SYMBOL=sapply(contents(mogene20sttranscriptclusterSYMBOL), paste, collapse=", "), DESC=sapply(contents(mogene20sttranscriptclusterGENENAME), paste, collapse=", "))
          },
          pd.hg.u133.plus.2 = {
            #data.frame(ACCNUM=sapply(contents(hgu133plus2ACCNUM), paste, collapse=", "), SYMBOL=sapply(contents(hgu133plus2SYMBOL), paste, collapse=", "), DESC=sapply(contents(hgu133plus2GENENAME), paste, collapse=", "))
            data.frame(ACCNUM=sapply(contents(hgu133plus2ACCNUM), paste, collapse=", "), SYMBOL=sapply(contents(hgu133plus2SYMBOL), paste, collapse=", "), DESC=sapply(contents(hgu133plus2GENENAME), paste, collapse=", "), ENTREZ=sapply(contents(hgu133plus2ENTREZID), paste, collapse=", "))
          },
          pd.hugene.2.0.st = {
            #data.frame(ACCNUM=sapply(contents(hugene20sttranscriptclusterACCNUM), paste, collapse=", "), SYMBOL=sapply(contents(hugene20sttranscriptclusterSYMBOL), paste, collapse=", "), DESC=sapply(contents(hugene20sttranscriptclusterGENENAME), paste, collapse=", "))
            data.frame(ACCNUM=sapply(contents(hugene20sttranscriptclusterACCNUM), paste, collapse=", "), SYMBOL=sapply(contents(hugene20sttranscriptclusterSYMBOL), paste, collapse=", "), DESC=sapply(contents(hugene20sttranscriptclusterGENENAME), paste, collapse=", "), ENTREZ=sapply(contents(hugene20sttranscriptclusterENTREZID), paste, collapse=", "))
          },
          pd.clariom.s.human.ht = {
            #data.frame(ACCNUM=sapply(contents(clariomshumanhttranscriptclusterACCNUM), paste, collapse=", "), SYMBOL=sapply(contents(clariomshumanhttranscriptclusterSYMBOL), paste, collapse=", "), DESC=sapply(contents(clariomshumanhttranscriptclusterGENENAME), paste, collapse=", "))
            data.frame(ACCNUM=sapply(contents(clariomshumanhttranscriptclusterACCNUM), paste, collapse=", "), SYMBOL=sapply(contents(clariomshumanhttranscriptclusterSYMBOL), paste, collapse=", "), DESC=sapply(contents(clariomshumanhttranscriptclusterGENENAME), paste, collapse=", "), ENTREZ=sapply(contents(clariomshumanhttranscriptclusterENTREZID), paste, collapse=", "))
          },
          pd.clariom.s.mouse.ht = {
            #data.frame(ACCNUM=sapply(contents(clariomsmousehttranscriptclusterACCNUM), paste, collapse=", "), SYMBOL=sapply(contents(clariomsmousehttranscriptclusterSYMBOL), paste, collapse=", "), DESC=sapply(contents(clariomsmousehttranscriptclusterGENENAME), paste, collapse=", "))
            data.frame(ACCNUM=sapply(contents(clariomsmousehttranscriptclusterACCNUM), paste, collapse=", "), SYMBOL=sapply(contents(clariomsmousehttranscriptclusterSYMBOL), paste, collapse=", "), DESC=sapply(contents(clariomsmousehttranscriptclusterGENENAME), paste, collapse=", "), ENTREZ=sapply(contents(clariomsmousehttranscriptclusterENTREZID), paste, collapse=", "))
          }, pd.clariom.s.mouse = {
            #data.frame(ACCNUM=sapply(contents(clariomsmousetranscriptclusterACCNUM), paste, collapse=", "), SYMBOL=sapply(contents(clariomsmousetranscriptclusterSYMBOL), paste, collapse=", "), DESC=sapply(contents(clariomsmousetranscriptclusterGENENAME), paste, collapse=", "))
            data.frame(ACCNUM=sapply(contents(clariomsmousetranscriptclusterACCNUM), paste, collapse=", "), SYMBOL=sapply(contents(clariomsmousetranscriptclusterSYMBOL), paste, collapse=", "), DESC=sapply(contents(clariomsmousetranscriptclusterGENENAME), paste, collapse=", "), ENTREZ=sapply(contents(clariomsmousetranscriptclusterENTREZID), paste, collapse=", "))
          },
          pd.clariom.s.human = {
            #data.frame(ACCNUM=sapply(contents(clariomshumantranscriptclusterACCNUM), paste, collapse=", "), SYMBOL=sapply(contents(clariomshumantranscriptclusterSYMBOL), paste, collapse=", "), DESC=sapply(contents(clariomshumantranscriptclusterGENENAME), paste, collapse=", "))
            data.frame(ACCNUM=sapply(contents(clariomshumantranscriptclusterACCNUM), paste, collapse=", "), SYMBOL=sapply(contents(clariomshumantranscriptclusterSYMBOL), paste, collapse=", "), DESC=sapply(contents(clariomshumantranscriptclusterGENENAME), paste, collapse=", "), ENTREZ=sapply(contents(clariomshumantranscriptclusterENTREZID), paste, collapse=", "))
          },
          pd.mouse430.2 = {
            #data.frame(ACCNUM=sapply(contents(mouse4302ACCNUM), paste, collapse=", "), SYMBOL=sapply(contents(mouse4302SYMBOL), paste, collapse=", "), DESC=sapply(contents(mouse4302GENENAME), paste, collapse=", "))
            data.frame(ACCNUM=sapply(contents(mouse4302ACCNUM), paste, collapse=", "), SYMBOL=sapply(contents(mouse4302SYMBOL), paste, collapse=", "), DESC=sapply(contents(mouse4302GENENAME), paste, collapse=", "), ENTREZ=sapply(contents(mouse4302ENTREZID), paste, collapse=", "))
          },
          pd.hg.u133a = {
            #data.frame(ACCNUM=sapply(contents(hgu133aACCNUM), paste, collapse=", "), SYMBOL=sapply(contents(hgu133aSYMBOL), paste, collapse=", "), DESC=sapply(contents(hgu133aGENENAME), paste, collapse=", "))
            data.frame(ACCNUM=sapply(contents(hgu133aACCNUM), paste, collapse=", "), SYMBOL=sapply(contents(hgu133aSYMBOL), paste, collapse=", "), DESC=sapply(contents(hgu133aGENENAME), paste, collapse=", "), ENTREZ=sapply(contents(hgu133aENTREZID), paste, collapse=", "))
          },
          pd.hugene.1.0.st.v1 = {
            library(pd.hugene.1.0.st.v1)
            library(hugene10sttranscriptcluster.db)
            #data.frame(ACCNUM=sapply(contents(hugene10sttranscriptclusterACCNUM), paste, collapse=", "), SYMBOL=sapply(contents(hugene10sttranscriptclusterSYMBOL), paste, collapse=", "), DESC=sapply(contents(hugene10sttranscriptclusterGENENAME), paste, collapse=", "))
            data.frame(ACCNUM=sapply(contents(hugene10sttranscriptclusterACCNUM), paste, collapse=", "), SYMBOL=sapply(contents(hugene10sttranscriptclusterSYMBOL), paste, collapse=", "), DESC=sapply(contents(hugene10sttranscriptclusterGENENAME), paste, collapse=", "), ENTREZ=sapply(contents(hugene10sttranscriptclusterENTREZID), paste, collapse=", "))
          },
          pd.mogene.1.0.st.v1 = {
            #data.frame(ACCNUM=sapply(contents(mogene10sttranscriptclusterACCNUM), paste, collapse=", "), SYMBOL=sapply(contents(mogene10sttranscriptclusterSYMBOL), paste, collapse=", "), DESC=sapply(contents(mogene10sttranscriptclusterGENENAME), paste, collapse=", "))
            data.frame(ACCNUM=sapply(contents(mogene10sttranscriptclusterACCNUM), paste, collapse=", "), SYMBOL=sapply(contents(mogene10sttranscriptclusterSYMBOL), paste, collapse=", "), DESC=sapply(contents(mogene10sttranscriptclusterGENENAME), paste, collapse=", "), ENTREZ=sapply(contents(mogene10sttranscriptclusterENTREZID), paste, collapse=", "))
          },
          pd.hg.u133a.2 = {
            #data.frame(ACCNUM=sapply(contents(hgu133a2ACCNUM), paste, collapse=", "), SYMBOL=sapply(contents(hgu133a2SYMBOL), paste, collapse=", "), DESC=sapply(contents(hgu133a2GENENAME), paste, collapse=", "))
            data.frame(ACCNUM=sapply(contents(hgu133a2ACCNUM), paste, collapse=", "), SYMBOL=sapply(contents(hgu133a2SYMBOL), paste, collapse=", "), DESC=sapply(contents(hgu133a2GENENAME), paste, collapse=", "), ENTREZ=sapply(contents(hgu133a2ENTREZID), paste, collapse=", "))
          },
          pd.huex.1.0.st.v2 = {
            #data.frame(ACCNUM=sapply(contents(huex10sttranscriptclusterACCNUM), paste, collapse=", "), SYMBOL=sapply(contents(huex10sttranscriptclusterSYMBOL), paste, collapse=", "), DESC=sapply(contents(huex10sttranscriptclusterGENENAME), paste, collapse=", "))
            data.frame(ACCNUM=sapply(contents(huex10sttranscriptclusterACCNUM), paste, collapse=", "), SYMBOL=sapply(contents(huex10sttranscriptclusterSYMBOL), paste, collapse=", "), DESC=sapply(contents(huex10sttranscriptclusterGENENAME), paste, collapse=", "), ENTREZ=sapply(contents(huex10sttranscriptclusterENTREZID), paste, collapse=", "))
          },
          pd.hg.u219 = {
            #data.frame(ACCNUM=sapply(contents(hgu219ACCNUM), paste, collapse=", "), SYMBOL=sapply(contents(hgu219SYMBOL), paste, collapse=", "), DESC=sapply(contents(hgu219GENENAME), paste, collapse=", "))
            data.frame(ACCNUM=sapply(contents(hgu219ACCNUM), paste, collapse=", "), SYMBOL=sapply(contents(hgu219SYMBOL), paste, collapse=", "), DESC=sapply(contents(hgu219GENENAME), paste, collapse=", "), ENTREZ=sapply(contents(hgu219ENTREZID), paste, collapse=", "))
          },
          pd.ht.hg.u133.plus.pm = {
            #data.frame(ACCNUM=sapply(contents(hgu133plus2ACCNUM), paste, collapse=", "), SYMBOL=sapply(contents(hgu133plus2SYMBOL), paste, collapse=", "), DESC=sapply(contents(hgu133plus2GENENAME), paste, collapse=", "))
            data.frame(ACCNUM=sapply(contents(hgu133plus2ACCNUM), paste, collapse=", "), SYMBOL=sapply(contents(hgu133plus2SYMBOL), paste, collapse=", "), DESC=sapply(contents(hgu133plus2GENENAME), paste, collapse=", "), ENTREZ=sapply(contents(hgu133plus2ENTREZID), paste, collapse=", "))
          },
          pd.mg.u74av2 = {
            #data.frame(ACCNUM=sapply(contents(mgu74av2ACCNUM), paste, collapse=", "), SYMBOL=sapply(contents(mgu74av2SYMBOL), paste, collapse=", "), DESC=sapply(contents(mgu74av2GENENAME), paste, collapse=", "))
            data.frame(ACCNUM=sapply(contents(mgu74av2ACCNUM), paste, collapse=", "), SYMBOL=sapply(contents(mgu74av2SYMBOL), paste, collapse=", "), DESC=sapply(contents(mgu74av2GENENAME), paste, collapse=", "), ENTREZ=sapply(contents(mgu74av2ENTREZID), paste, collapse=", "))
          },
          pd.mouse430a.2 = {
            #data.frame(ACCNUM=sapply(contents(mouse430a2ACCNUM), paste, collapse=", "), SYMBOL=sapply(contents(mouse430a2SYMBOL), paste, collapse=", "), DESC=sapply(contents(mouse430a2GENENAME), paste, collapse=", "))
            data.frame(ACCNUM=sapply(contents(mouse430a2ACCNUM), paste, collapse=", "), SYMBOL=sapply(contents(mouse430a2SYMBOL), paste, collapse=", "), DESC=sapply(contents(mouse430a2GENENAME), paste, collapse=", "), ENTREZ=sapply(contents(mouse430a2ENTREZID), paste, collapse=", "))
          },
          pd.moe430a = {
            #data.frame(ACCNUM=sapply(contents(moe430aACCNUM), paste, collapse=", "), SYMBOL=sapply(contents(moe430aSYMBOL), paste, collapse=", "), DESC=sapply(contents(moe430aGENENAME), paste, collapse=", "))
            data.frame(ACCNUM=sapply(contents(moe430aACCNUM), paste, collapse=", "), SYMBOL=sapply(contents(moe430aSYMBOL), paste, collapse=", "), DESC=sapply(contents(moe430aGENENAME), paste, collapse=", "), ENTREZ=sapply(contents(moe430aENTREZID), paste, collapse=", "))
          },
          pd.hg.u95av2 = {
            #data.frame(ACCNUM=sapply(contents(hgu95av2ACCNUM), paste, collapse=", "), SYMBOL=sapply(contents(hgu95av2SYMBOL), paste, collapse=", "), DESC=sapply(contents(hgu95av2GENENAME), paste, collapse=", "))
            data.frame(ACCNUM=sapply(contents(hgu95av2ACCNUM), paste, collapse=", "), SYMBOL=sapply(contents(hgu95av2SYMBOL), paste, collapse=", "), DESC=sapply(contents(hgu95av2GENENAME), paste, collapse=", "), ENTREZ=sapply(contents(hgu95av2ENTREZID), paste, collapse=", "))
          },
          pd.hta.2.0 = {
            #data.frame(ACCNUM=sapply(contents(hta20transcriptclusterACCNUM), paste, collapse=", "), SYMBOL=sapply(contents(hta20transcriptclusterSYMBOL), paste, collapse=", "), DESC=sapply(contents(hta20transcriptclusterGENENAME), paste, collapse=", "))
            data.frame(ACCNUM=sapply(contents(hta20transcriptclusterACCNUM), paste, collapse=", "), SYMBOL=sapply(contents(hta20transcriptclusterSYMBOL), paste, collapse=", "), DESC=sapply(contents(hta20transcriptclusterGENENAME), paste, collapse=", "), ENTREZ=sapply(contents(hta20transcriptclusterENTREZID), paste, collapse=", "))
          },
          pd.moex.1.0.st.v1 = {
            #data.frame(ACCNUM=sapply(contents(moex10sttranscriptclusterACCNUM), paste, collapse=", "), SYMBOL=sapply(contents(moex10sttranscriptclusterSYMBOL), paste, collapse=", "), DESC=sapply(contents(moex10sttranscriptclusterGENENAME), paste, collapse=", "))
            data.frame(ACCNUM=sapply(contents(moex10sttranscriptclusterACCNUM), paste, collapse=", "), SYMBOL=sapply(contents(moex10sttranscriptclusterSYMBOL), paste, collapse=", "), DESC=sapply(contents(moex10sttranscriptclusterGENENAME), paste, collapse=", "), ENTREZ=sapply(contents(moex10sttranscriptclusterENTREZID), paste, collapse=", "))
          },
          pd.hg.u133b = {
            #data.frame(ACCNUM=sapply(contents(hgu133bACCNUM), paste, collapse=", "), SYMBOL=sapply(contents(hgu133bSYMBOL), paste, collapse=", "), DESC=sapply(contents(hgu133bGENENAME), paste, collapse=", "))
            data.frame(ACCNUM=sapply(contents(hgu133bACCNUM), paste, collapse=", "), SYMBOL=sapply(contents(hgu133bSYMBOL), paste, collapse=", "), DESC=sapply(contents(hgu133bGENENAME), paste, collapse=", "), ENTREZ=sapply(contents(hgu133bENTREZID), paste, collapse=", "))
          },
          pd.hugene.1.1.st.v1 = {
            #data.frame(ACCNUM=sapply(contents(hugene11sttranscriptclusterACCNUM), paste, collapse=", "), SYMBOL=sapply(contents(hugene11sttranscriptclusterSYMBOL), paste, collapse=", "), DESC=sapply(contents(hugene11sttranscriptclusterGENENAME), paste, collapse=", "))
            data.frame(ACCNUM=sapply(contents(hugene11sttranscriptclusterACCNUM), paste, collapse=", "), SYMBOL=sapply(contents(hugene11sttranscriptclusterSYMBOL), paste, collapse=", "), DESC=sapply(contents(hugene11sttranscriptclusterGENENAME), paste, collapse=", "), ENTREZ=sapply(contents(hugene11sttranscriptclusterENTREZID), paste, collapse=", "))
          },
          pd.mogene.1.1.st.v1 = {
            #data.frame(ACCNUM=sapply(contents(mogene11sttranscriptclusterACCNUM), paste, collapse=", "), SYMBOL=sapply(contents(mogene11sttranscriptclusterSYMBOL), paste, collapse=", "), DESC=sapply(contents(mogene11sttranscriptclusterGENENAME), paste, collapse=", "))
            data.frame(ACCNUM=sapply(contents(mogene11sttranscriptclusterACCNUM), paste, collapse=", "), SYMBOL=sapply(contents(mogene11sttranscriptclusterSYMBOL), paste, collapse=", "), DESC=sapply(contents(mogene11sttranscriptclusterGENENAME), paste, collapse=", "), ENTREZ=sapply(contents(mogene11sttranscriptclusterENTREZID), paste, collapse=", "))
          },
          pd.clariom.s.rat = {
            data.frame(ACCNUM=sapply(contents(clariomsrattranscriptclusterACCNUM), paste, collapse=", "), SYMBOL=sapply(contents(clariomsrattranscriptclusterSYMBOL), paste, collapse=", "), DESC=sapply(contents(clariomsrattranscriptclusterGENENAME), paste, collapse=", "), ENTREZ=sapply(contents(clariomsrattranscriptclusterENTREZID), paste, collapse=", "))
          }
        )

        mylist=vector("list",nb)

        for (i in 1:nb)
        {
          all.genes.con = topTable(ebayes.fit2, coef = i, number=nrow(ebayes.fit2))

          all <- merge(all.genes.con, Annot,by.x=0, by.y=0, all.x=T)
          all=all[order(all$P.Value),]
          colnames(all)[1]="probsetID"

          #add fold change and rearrange columns
          all$FC = ifelse(all$logFC<0, -1/(2^all$logFC), 2^all$logFC)
          all = all[,c(9,12,2,5,6,3,8,10,11,1,4,7)]

          # Write out to a file
          write.table(all,file=paste(id,"_",cons[i],"_all_genes.txt",sep=""),sep="\t",row.names=F)

          #GUI displays table for users selected contrast
          mylist[[i]]=all
        }
        nAll <- merge(exprs(celfiles.rma), Annot,by.x=0, by.y=0, all.x=T)

        tNorm = tempfile(pattern = "normalized_data_", tmpdir = getwd(), fileext = paste0(paste("_",id, sep=""),'.txt'))
        write.table(nAll,file=tNorm,sep="\t",row.names=F)  #not in GUI
        names(mylist)=cons

        mylist
      },
      message=function(m) {
        print(m$message)
      },
      warning=function(w) {
        returnValue$warnings <<- append(returnValue$warnings, w$message)
      }
    ),
    error=function(e) {
      returnValue$error <<- list(
        status = FALSE,
        statusMessage = e$message
      )
      return(NULL)
    }
  )
}))
toJSON(returnValue, auto_unbox = T)
