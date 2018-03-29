needs(jsonlite)

load("mapdata.RData")
output = toJSON(list(saveValue=list(rawhist=rawhist,rmahist=rmahist)),auto_unbox=T)

filename = paste0('mapdata',as.integer(Sys.time()),'.out')
fileConn = file(filename)
writeLines(output,fileConn)
close(fileConn)

filename