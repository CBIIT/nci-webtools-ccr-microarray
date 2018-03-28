needs(jsonlite)
load("rawhist.RData")
output = toJSON(rawhist)
filename = paste0('raw',as.integer(Sys.time()),'.out')
fileConn = file(filename)
writeLines(output,fileConn)
close(fileConn)
filename
