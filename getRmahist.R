needs(jsonlite)
load("rmahist.RData")
output = toJSON(rmahist)
filename = paste0('rma',as.integer(Sys.time()),'.out')
fileConn = file(filename)
writeLines(output,fileConn)
close(fileConn)
filename
