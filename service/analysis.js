express = require('express');
var session = require('express-session');
var router = express.Router();
var R = require("../components/R");
var config = require('../config');
var logger = require('../components/logger');
var formidable = require('formidable');
var fs = require('fs');
var path = require('path');
var rimraf = require('rimraf');

router.post('/upload', function(req, res) {
    logger.info("API:/upload ");


    // create an incoming form object
    var form = new formidable.IncomingForm();

    // specify that we want to allow the user to upload multiple files in a single request
    form.multiples = true;

    var pid = "";

    // Emitted whenever a field / value pair has been received.
    form.on('field', function(name, value) {
        if (name == "projectId") {
            pid = value;
            form.uploadDir = path.join(config.uploadPath, "/" + value);
            if (!fs.existsSync(form.uploadDir)) {
                fs.mkdirSync(form.uploadDir);
            } else {
                rimraf(form.uploadDir, function() {
                    fs.mkdirSync(form.uploadDir);
                });
            }

        }
    });

    var number_of_files = 0;

    // every time a file has been uploaded successfully,
    // rename it to it's orignal name
    form.on('file', function(field, file) {
        number_of_files = number_of_files + 1;
        fs.rename(file.path, path.join(form.uploadDir, file.name));
    });

    // log any errors that occur
    form.on('error', function(err) {

        res.json({
            status: 500,
            data: ('An error has occured: \n' + err)
        });
    });

    // once all the files have been uploaded, send a response to the client
    form.on('end', function() {
        let data = [];
        data.push("loadCEL"); // action
        data.push(pid);
        //data path
        data.push(config.uploadPath);
        data.push(new Array(number_of_files).fill("Ctl"));

        R.execute("wrapper.R", data, function(err, returnValue) {
            if (err) {
                logger.info("API:/upload result ", "status 404 ");
                logger.warn("API:/upload result ", "status 404 ", err);
                res.json({
                    status: 404,
                    msg: err
                });
            } else {
                logger.info("API:/upload result ", "status 200 ");
                res.json({
                    status: 200,
                    data: returnValue
                });
            }
        });
    });
    // parse the incoming request containing the form data
    form.parse(req)
});


router.post('/loadGSE', function(req, res) {
    let data = [];
    //the content in data array should follow the order. Code projectId groups action pDEGs foldDEGs pPathways
    // action
    data.push("loadGSE");
    data.push(req.body.projectId);
    //data path
    data.push(config.uploadPath);
    data.push(req.body.code);
    data.push(req.body.groups);


    logger.info("API:/loadGSE ",
        "code:", req.body.code,
        "groups:", req.body.groups,
        "projectId:", req.body.projectId,
        "data_repo_path:", config.uploadPath
    );


    R.execute("wrapper.R", data, function(err, returnValue) {
        if (err) {
            logger.info("API:/loadGSE result ", "status 404 ");
            logger.warn("API:/loadGSE result ", "status 404 ", err);
            res.json({
                status: 404,
                msg: returnValue
            });
        } else {
            logger.info("API:/loadGSE result ", "status 200 ");
            res.json({
                status: 200,
                data: returnValue
            });
        }
    });
});



router.post('/pathwaysHeapMap', function(req, res) {

    let data = [];
    //the content in data array should follow the order. Code projectId groups action pDEGs foldDEGs pPathways
    data.push("pathwaysHeapMap");
    data.push(req.body.projectId);
    //data path
    data.push(config.uploadPath);
    data.push(req.body.group1);
    data.push(req.body.group2);
    data.push(req.body.upOrDown);
    data.push(req.body.pathway_name);
    //configuration path
    data.push(config.configPath);

    logger.info("API:/pathwaysHeapMap ",
        "projectId :", req.body.projectId,
        "group_1 :", req.body.group1,
        "group_2 :", req.body.group2,
        "upOrDown :", req.body.upOrDown,
        "pathway_name :", req.body.pathway_name,
        "data_repo_path:", config.uploadPath,
        "configPath:", config.configPath
    );

    R.execute("wrapper.R", data, function(err, returnValue) {
        if (err) {
            res.json({
                status: 404,
                msg: returnValue
            });
        } else {
            res.json({
                status: 200,
                data: returnValue
            });
        }
    });
});



router.post('/runContrast', function(req, res) {


  let secs = (+new Date) + 60 * 1000;
  while ((+new Date) < secs);
  
    let data = [];
    //the content in data array should follow the order. Code projectId groups action pDEGs foldDEGs pPathways
    data.push("runContrast"); // action
    data.push(req.body.projectId);
    //data path
    data.push(config.uploadPath);
    data.push(req.body.code);
    data.push(req.body.groups);
    if (req.body.pDEGs) {
        data.push(req.body.pDEGs);
    } else {
        data.push(1);
    }

    if (req.body.foldDEGs) {
        data.push(req.body.foldDEGs);
    } else {
        data.push(1);
    }

    if (req.body.pPathways) {
        data.push(req.body.pPathways);
    } else {
        data.push(1);
    }

    data.push(req.body.group_1);
    data.push(req.body.group_2);
    data.push(req.body.species);
    data.push(req.body.genSet);
    data.push(req.body.pssGSEA);
    data.push(req.body.foldssGSEA);
    data.push(req.body.source)
    data.push(config.configPath);
   
    // mock data
    // if (config.env = "dev") {
    //     data.push("dev");
    // } else {
    //     data.push("prod");
    // }




    logger.info("API:/runContrast ",
        "code:", req.body.code,
        "groups:", req.body.groups,
        "pDEGs:", req.body.pDEGs,
        "foldDEGs:", req.body.foldDEGs,
        "pPathways:", req.body.pPathways,
        "group_1:", req.body.group_1,
        "group_2:", req.body.group_2,
        "species:", req.body.species,
        "genSet:", req.body.genSet,
        "pssGSEA:", req.body.pssGSEA,
        "foldssGSEA:", req.body.foldssGSEA,
        "source:", req.body.source,
        "data_repo_path:", config.uploadPath
    );



    // using session
    //if it is action is runContrast , then 
    if (req.session.groups &&
        JSON.stringify(req.session.groups) == JSON.stringify(req.body.groups) &&
        req.session.projectId == req.body.projectId &&
        req.session.option == req.body.group_1 + req.body.group_2 + req.body.genSet
    ) {
        let retun_data = "";
        let type = req.body.targetObject;
        
  

        if (type == "deg") {
            return_data = getDEG(req)
        }

        if (type == "ssGSEA") {
            return_data = getGSEA(req)
        }


        if (type == "pathways_up") {
            return_data = getUpPathWays(req)
        }

        if (type == "pathways_down") {
            return_data = getDownPathWays(req)
        }


        if (type == "volcanoPlot") {

            return_data = "/volcano.html"
        }


        if (type == "pathwayHeatMap") {

            return_data = "/geneHeatmap.jpg"
        }

        logger.info("API:/runContrast ", "Contrast uses session ")
        res.json({
            status: 200,
            data: retun_data
        });

    } else {
        logger.info("API:/runContrast ", "Session is not used, run R script; ")
        R.execute("wrapper.R", data, function(err, returnValue) {
            // returnValue :
            //(list(
            // norm_celfiles=return_plot_data,
            // diff_expr_genes=diff_expr_genes[1],
            // pathways=l2p_pathways,
            // ssGSEA=ssGSEA_results,
            // ssColumn=ssGSEA_results[["DEss"]][[cons]][0]
            // ))

            if (err) {
                res.json({
                    status: 404,
                    msg: returnValue
                });
            } else {
                // store return value in session (deep copy)
                req.session.runContrastData = toObject(returnValue);
                req.session.option = req.body.group_1 + req.body.group_2 + req.body.genSet;
                req.session.groups = req.body.groups;
                req.session.projectId = req.body.projectId;
                logger.info("API:/runContrast ", "store data in req.session")
                //  // filter out data based on the filter
                // if(req.body.actions == "runContrast"){
                //      returnValue = filter(returnValue,req.body.pDEGs,req.body.foldDEGs,req.body.pPathways,req.body.foldssGSEA,req.body.pssGSEA);
                // }


                let retun_data = "";
                let type = req.body.targetObject;
                if (type == "getHistplotAN") {
                    if (req.session && req.session.runContrastData) {
                        return_data = req.session.runContrastData.listPlots[5]
                    } else {
                        return_data = "";
                    }

                }

                if (type == "getBoxplotAN") {
                    if (req.session && req.session.runContrastData) {
                        return_data = req.session.runContrastData.listPlots[7]
                    } else {
                        return_data = "";
                    }

                }

                if (type == "getMAplotAN") {
                    if (req.session && req.session.runContrastData) {
                        return_data = req.session.runContrastData.listPlots[6]
                    } else {
                        return_data = "";
                    }
                }

                if (type == "getPCA") {
                    if (req.session && req.session.runContrastData) {
                        return_data = req.session.runContrastData.listPlots[8]
                    } else {
                        return_data = "";
                    }

                }

                if (type == "getHeatmapolt") {
                    if (req.session && req.session.runContrastData) {
                        return_data = req.session.runContrastData.listPlots[9]
                    } else {
                        return_data = "";
                    }
                }


                if (type == "getHistplotBN") {
                    if (req.session && req.session.runContrastData) {
                        return_data = req.session.runContrastData.listPlots[0]
                    } else {
                        return_data = "";
                    }

                }

                if (type == "getMAplotsBN") {
                    if (req.session && req.session.runContrastData) {
                        return_data = req.session.runContrastData.listPlots[1]
                    } else {
                        return_data = "";
                    }

                }

                if (type == "getBoxplotBN") {
                    if (req.session && req.session.runContrastData) {
                        return_data = req.session.runContrastData.listPlots[2]
                    } else {
                        return_data = "";
                    }

                }

                if (type == "getRLE") {
                    if (req.session && req.session.runContrastData) {
                        return_data = req.session.runContrastData.listPlots[3]
                    } else {
                        return_data = "";
                    }
                }

                if (type == "getNUSE") {

                    if (req.session && req.session.runContrastData) {
                        return_data = req.session.runContrastData.listPlots[4]
                    } else {
                        return_data = "";
                    }
                }


                if (type == "getPostPCA") {
                    if (req.session && req.session.runContrastData) {
                        return_data = req.session.runContrastData.listPlots[8]
                    } else {
                        return_data = "";
                    }
                }

                if (type == "deg") {
                    return_data = getDEG(req)
                }

                if (type == "ssGSEA") {
                    return_data = getGSEA(req)
                }


                if (type == "pathways_up") {
                    return_data = getUpPathWays(req)
                }

                if (type == "pathways_down") {
                    return_data = getDownPathWays(req)
                }


                if (type == "volcanoPlot") {

                    return_data = "/volcano.html"
                }


                if (type == "pathwayHeatMap") {

                    return_data = "/geneHeatmap.jpg"
                }

                logger.info("API:/runContrast ", "Contrast uses session ")
                res.json({
                    status: 200,
                    data: retun_data
                });

            }
        });

    }
});



function getPlots(req, type) {
    let return_data = "";
    if (type == "getHistplotAN") {
        if (req.session && req.session.runContrastData) {
            return_data = req.session.runContrastData.listPlots[5]
        } else {
            return_data = "";
        }

    }

    if (type == "getBoxplotAN") {
        if (req.session && req.session.runContrastData) {
            return_data = req.session.runContrastData.listPlots[7]
        } else {
            return_data = "";
        }

    }

    if (type == "getMAplotAN") {
        if (req.session && req.session.runContrastData) {
            return_data = req.session.runContrastData.listPlots[6]
        } else {
            return_data = "";
        }
    }

    if (type == "getPCA") {
        if (req.session && req.session.runContrastData) {
            return_data = req.session.runContrastData.listPlots[8]
        } else {
            return_data = "";
        }

    }

    if (type == "getHeatmapolt") {
        if (req.session && req.session.runContrastData) {
            return_data = req.session.runContrastData.listPlots[9]
        } else {
            return_data = "";
        }
    }
    if (type == "getBoxplotAN") {
        if (req.session && req.session.runContrastData) {
            return_data = req.session.runContrastData.listPlots[7]
        } else {
            return_data = "";
        }
    }


    if (type == "getHistplotBN") {
        if (req.session && req.session.runContrastData) {
            return_data = req.session.runContrastData.listPlots[0]
        } else {
            return_data = "";
        }

    }

    if (type == "getMAplotsBN") {
        if (req.session && req.session.runContrastData) {
            return_data = req.session.runContrastData.listPlots[1]
        } else {
            return_data = "";
        }

    }

    if (type == "getBoxplotBN") {
        if (req.session && req.session.runContrastData) {
            return_data = req.session.runContrastData.listPlots[2]
        } else {
            return_data = "";
        }

    }

    if (type == "getRLE") {
        if (req.session && req.session.runContrastData) {
            return_data = req.session.runContrastData.listPlots[3]
        } else {
            return_data = "";
        }
    }

    if (type == "getNUSE") {

        if (req.session && req.session.runContrastData) {
            return_data = req.session.runContrastData.listPlots[4]
        } else {
            return_data = "";
        }
    }


    return return_data
}



router.post('/getHistplotBN', function(req, res) {
    res.json({
        status: 200,
        data: getPlots(req, "getHistplotBN")
    });
});




router.post('/getHistplotAN', function(req, res) {
    res.json({
        status: 200,
        data: getPlots(req, "getHistplotAN")
    });
});



router.post('/getBoxplotAN', function(req, res) {
    res.json({
        status: 200,
        data: getPlots(req, "getBoxplotAN")
    });
});

router.post('/getMAplotAN', function(req, res) {
    res.json({
        status: 200,
        data: getPlots(req, "getMAplotAN")
    });

});


router.post('/getPCA', function(req, res) {
    res.json({
        status: 200,
        data: getPlots(req, "getPCA")
    });
});


router.post('/getHeatmapolt', function(req, res) {
    res.json({
        status: 200,
        data: getPlots(req, "getHeatmapolt")
    });
});



router.post('/getBoxplotAN', function(req, res) {
    res.json({
        status: 200,
        data: getPlots(req, "getBoxplotAN")
    });
});




router.post('/getMAplotsBN', function(req, res) {
    res.json({
        status: 200,
        data: getPlots(req, "getMAplotsBN")
    });
});





router.post('/getBoxplotBN', function(req, res) {
    res.json({
        status: 200,
        data: getPlots(req, "getBoxplotBN")
    });
});

router.post('/getRLE', function(req, res) {
    res.json({
        status: 200,
        data: getPlots(req, "getRLE")
    });

});


router.post('/getNUSE', function(req, res) {
    res.json({
        status: 200,
        data: getPlots(req, "getNUSE")
    });
});




router.post('/getUpPathWays', function(req, res) {

    if (req.session && req.session.runContrastData) {
        res.json({
            status: 200,
            data: getUpPathWays(req)
        });

    } else {
        res.json({
            status: 404,
            data: ""
        });
    }

});


router.post('/getDownPathWays', function(req, res) {

    if (req.session && req.session.runContrastData) {
        res.json({
            status: 200,
            data: getDownPathWays(req)
        });

    } else {
        res.json({
            status: 404,
            data: ""
        });
    }



});


router.post('/getGSEA', function(req, res) {

    if (req.session && req.session.runContrastData) {

        res.json({
            status: 200,
            data: getGSEA(req)
        });

    } else {
        res.json({
            status: 404,
            data: ""
        });
    }



});

router.post('/getDEG', function(req, res) {

    if (req.session && req.session.runContrastData) {
        res.json({
            status: 200,
            data: getDEG(req)
        });
    } else {
        res.json({
            status: 404,
            data: ""
        });
    }

});


function getUpPathWays(req) {
    let threadhold = {}
    if (!req.body.pPathways) {
        threadhold = {
            P_Value: 0.05
        }
    } else {
        threadhold = {
            P_Value: req.body.pPathways
        }
    }

    if (!req.body.sorting) {
        req.body.sorting = {
            field: "P_Value",
            rder: "descend"
        }
    }

    if (!req.body.search_keyword) {
        req.body.search_keyword = ""
    }

    if (!req.body.page_size) {
        req.body.page_size = 10
    }

    if (!req.body.page_number) {
        req.body.page_number = 1
    }


    return getPathWays(
        req.session.runContrastData.pathways_up,
        threadhold,
        req.body.sorting,
        req.body.search_keyword,
        req.body.page_size,
        req.body.page_number)

}



function getDownPathWays(req) {
    let threadhold = {}
    if (!req.body.pPathways) {
        threadhold = {
            P_Value: 0.05
        }
    } else {
        threadhold = {
            P_Value: req.body.pPathways
        }
    }

    if (!req.body.sorting) {
        req.body.sorting = {
            field: "P_Value",
            rder: "descend"
        }
    }

    if (!req.body.search_keyword) {
        req.body.search_keyword = ""
    }

    if (!req.body.page_size) {
        req.body.page_size = 10
    }

    if (!req.body.page_number) {
        req.body.page_number = 1
    }

    return getPathWays(
        req.session.runContrastData.pathways_down,
        threadhold,
        req.body.sorting,
        req.body.search_keyword,
        req.body.page_size,
        req.body.page_number)
}





function getGSEA(req) {
    let threadhold = {}
    if (!req.body.p_value) {
        threadhold = {
            pssGSEA: 0.05,
            foldssGSEA: 1.5
        }
    } else {
        threadhold = {
            pssGSEA: req.body.pssGSEA,
            foldssGSEA: req.body.foldssGSEA

        }
    }

    if (!req.body.sorting) {
        req.body.sorting = {
            field: "P.Value",
            rder: "descend"
        }
    }

    if (!req.body.search_keyword) {
        req.body.search_keyword = ""
    }

    if (!req.body.page_size) {
        req.body.page_size = 10
    }

    if (!req.body.page_number) {
        req.body.page_number = 1
    }

    return getGSEA_filter(
        req.session.runContrastData.ssGSEA,
        threadhold,
        req.body.sorting,
        req.body.search_keyword,
        req.body.page_size,
        req.body.page_number)
}





function getDEG(req) {

    let threadhold = {}
    if (!req.body.p_value) {
        threadhold = {
            P_Value: 0.05,
            foldDEGs: 1.5
        }
    } else {
        threadhold = {
            P_Value: req.body.p_value,
            foldDEGs: req.body.foldDEGs

        }
    }

    if (!req.body.sorting) {
        req.body.sorting = {
            field: "P.Value",
            rder: "descend"
        }
    }

    if (!req.body.search_keyword) {
        req.body.search_keyword = ""
    }

    if (!req.body.page_size) {
        req.body.page_size = 10
    }

    if (!req.body.page_number) {
        req.body.page_number = 1
    }
    return getDEG_filter(
        req.session.runContrastData.diff_expr_genes,
        threadhold,
        req.body.sorting,
        req.body.search_keyword,
        req.body.page_size,
        req.body.page_number)

}





function getPathWays(data, threadhold, sorting, search_keyword, page_size, page_number) {
    let result = []

    console.log(sorting, search_keyword, page_size, page_number)
    var pPathways = threadhold.P_Value;


    // filter data
    for (let j in data) {
        if (data[j]["P_Value"] < pPathways) {
            result.push(data[j])
        }
    }

    // sorting
    if (sorting != null) {
        if (sorting.order == "descend") {
            result.sort(function(e1, e2) {
                return (e1[sorting.name] < e2[sorting.name]) ? 1 : -1
            })
        }

        if (sorting.order == "ascend") {
            result.sort(function(e1, e2) {
                return (e1[sorting.name] < e2[sorting.name]) ? -1 : 1
            })
        }
    } else {

        result.sort(function(e1, e2) {
            return (e1["P_Value"] < e2["P_Value"]) ? 1 : -1
        })

    }
    // search
    if (search_keyword != "") {

        result.filter(function(r) {
            if (r.Description.toLowerCase().indexOf("search_keyword") > 0 || r.Gene_List.toLowerCase().indexOf("search_keyword") > 0) {
                return true;
            } else {
                return false;
            }
        })

    }

    // return index
    let output = {
        totalCount: result.length,
        records: result.slice(page_size * (page_number - 1), page_size * (page_number - 1) + page_size),
    }
    return output;
}



function getGSEA_filter(data, threadhold, sorting, search_keyword, page_size, page_number) {

    let result = []

    // filter data
    for (let j in data) {
        if (Math.abs(data[j]["logFC"]) < threadhold.foldssGSEA && data[j]["P.Value"] < threadhold.pssGSEA) {
            result.push(data[j])
        }
    }

    // sorting
    if (sorting != null) {
        if (sorting.order == "descend") {
            result.sort(function(e1, e2) {
                return (e1[sorting.name] < e2[sorting.name]) ? 1 : -1
            })
        }

        if (sorting.order == "ascend") {
            result.sort(function(e1, e2) {
                return (e1[sorting.name] < e2[sorting.name]) ? -1 : 1
            })
        }
    } else {

        result.sort(function(e1, e2) {
            return (e1["P.Value"] < e2["P.Value"]) ? 1 : -1
        })

    }

    // search
    if (search_keyword != "") {

        result.filter(function(r) {
            if (r.Description.toLowerCase().indexOf("search_keyword") > 0 || r.Gene_List.toLowerCase().indexOf("search_keyword") > 0) {
                return true;
            } else {
                return false;
            }
        })

    }

    // return index
    let output = {
        totalCount: result.length,
        records: result.slice(page_size * (page_number - 1), page_size * (page_number - 1) + page_size),
    }
    return output;

}



function getDEG_filter(data, threadhold, sorting, search_keyword, page_size, page_number) {

    let result = []


    // filter data
    for (let j in data) {
        if (data[j]["P.Value"] < threadhold.P_Value && Math.abs(data[j].FC) < threadhold.foldDEGs) {
            result.push(data[j])
        }
    }

    // sorting
    if (sorting != null) {
        if (sorting.order == "descend") {
            result.sort(function(e1, e2) {
                return (e1[sorting.name] < e2[sorting.name]) ? 1 : -1
            })
        }

        if (sorting.order == "ascend") {
            result.sort(function(e1, e2) {
                return (e1[sorting.name] < e2[sorting.name]) ? -1 : 1
            })
        }
    } else {

        result.sort(function(e1, e2) {
            return (e1["P.Value"] < e2["P.Value"]) ? 1 : -1
        })

    }

    // search
    if (search_keyword != "") {

        result.filter(function(r) {
            if (r.Description.toLowerCase().indexOf("search_keyword") > 0 || r.Gene_List.toLowerCase().indexOf("search_keyword") > 0) {
                return true;
            } else {
                return false;
            }
        })

    }

    // return index
    let output = {
        totalCount: result.length,
        records: result.slice(page_size * (page_number - 1), page_size * (page_number - 1) + page_size),
    }
    return output;


}



function toObject(returnValue) {


    var workflow = {};
    workflow.diff_expr_genes = [];
    workflow.ssGSEA = [];
    workflow.pathways_up = [];
    workflow.pathways_down = [];
    workflow.listPlots = [];

    var list = "";


    //// mock data
    // if (config.env = "dev") {
    //     list = JSON.parse(decodeURIComponent(returnValue));
    // } else {
    //     let d = returnValue.split("+++ssGSEA+++\"")[1];
    //     // "/Users/cheny39/Documents/GitHub/nci-webtools-ccr-microarray/service/data/a891ca3a044443b78a8bc3c32fdaf02a/"
    //     let data_dir = d.substring(0, d.indexOf("{"));
    //     list = JSON.parse(decodeURIComponent(d.substring(d.indexOf("{"), d.length)));
    // }


    let d = returnValue.split("+++ssGSEA+++\"")[1];
    // "/Users/cheny39/Documents/GitHub/nci-webtools-ccr-microarray/service/data/a891ca3a044443b78a8bc3c32fdaf02a/"
    let data_dir = d.substring(0, d.indexOf("{"));
    list = JSON.parse(decodeURIComponent(d.substring(d.indexOf("{"), d.length)));

    // get plots
    workflow.listPlots = list.norm_celfiles["listData"];
    for (let i in list.pathways) {
        workflow.pathways_up = list.pathways[i]["upregulated_pathways"]
        workflow.pathways_down = list.pathways[i]["downregulated_pathways"]
    }

    let ssGSEA = list.ssGSEA.DEss;
    for (let key in ssGSEA) {
        ssGSEA = ssGSEA[key];
    }

    for (let j in ssGSEA) {
        workflow.ssGSEA.push(ssGSEA[j]);
    }

    let deg = list.diff_expr_genes.listDEGs;
    for (let i in list.diff_expr_genes.listDEGs) {
        for (let j in deg[i]) {
            workflow.diff_expr_genes.push(deg[i][j]);
        }
    }




    logger.info("API: function filter result :",
        "workflow.diff_expr_genes.length: ", workflow.diff_expr_genes.length,
        "workflow.ssGSEA.length: ", workflow.ssGSEA.length,
        "workflow.pathways_up.length: ", workflow.pathways_up.length,
        "workflow.pathways_down.length: ", workflow.pathways_down.length
    )

    return workflow;
}






module.exports = router;