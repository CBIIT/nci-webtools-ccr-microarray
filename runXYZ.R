needs(jsonlite)

load("mapdata.RData")

rawboxT = as.data.frame(rawbox$stats)
colnames(rawboxT) <- rawbox$names
rawboxT = as.list(rawboxT)

rmaboxT = as.data.frame(rmabox$stats)
colnames(rmaboxT) <- rmabox$names
rmaboxT = as.list(rmaboxT)

output = toJSON(list(saveValue=list(rawhist=rawhist,rmahist=rmahist,rawbox=rawboxT,rmabox=rmaboxT)),auto_unbox=T)

filename = paste0('mapdata',as.integer(Sys.time()),'.out')
fileConn = file(filename)
writeLines(output,fileConn)
close(fileConn)

filename