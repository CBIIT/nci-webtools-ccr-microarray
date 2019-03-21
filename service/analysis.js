var express = require('express');
var session = require('express-session');
var router = express.Router();
var R = require("../components/R");
var config = require('../config');
var logger = require('../components/logger');
var formidable = require('formidable');
var fs = require('fs');
var path = require('path');
var rimraf = require('rimraf');
var queue = require('../components/queue');
const AWS = require('aws-sdk');
var dateFormat = require('dateformat');
var emailer = require('../components/mail');


router.post('/upload', function(req, res) {
    logger.info("[start] upload files");
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
        data.push(new Array(number_of_files).fill("others"));
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




router.post('/getssGSEAWithDiffGenSet', function(req, res) {
    let data = [];
    //the content in data array should follow the order. Code projectId groups action pDEGs foldDEGs pPathways
    data.push("runSSGSEA"); // action
    data.push(req.body.projectId);
    //data path
    data.push(config.uploadPath);
    data.push(req.body.species);
    data.push(req.body.genSet);
    data.push(req.body.group1);
    data.push(req.body.group2);
    data.push(config.configPath);
    //remove previous result. 
    //ssgseaHeatmap1.jpg
    fs.exists(config.uploadPath + "/" + req.body.projectId + "/ssgseaHeatmap1.jpg", function(exists) {
        if (exists) {
            fs.unlink(config.uploadPath + "/" + req.body.projectId + "/ssgseaHeatmap1.jpg")
        }
    })
    fs.exists(config.uploadPath + "/" + req.body.projectId + "/ss_result.txt", function(exists) {
        if (exists) {
            fs.unlink(config.uploadPath + "/" + req.body.projectId + "/ss_result.txt")
        }
    })
    R.execute("wrapper.R", data, function(err, returnValue) {
        fs.readFile(config.uploadPath + "/" + req.body.projectId + "/ss_result.txt", 'utf8', function(err, returnValue) {
            if (err) {
                res.json({
                    status: 404,
                    msg: err
                });
            } else {
                let re = JSON.parse(returnValue)
                // store return value in session (deep copy)
                let d = JsonToObject(re);
                // save result into session 
                if (req.session.runContrastData.ssGSEA) {
                    req.session.runContrastData.ssGSEA = d.ssGSEA;
                }
                logger.info("Get Contrast result success")
                res.json({
                    status: 200,
                    data: ""
                });
            }
        })

    });

});


router.post("/qAnalysis", function(req, res) {
    var now = new Date();
    let data = {};
    data.projectId = req.body.projectId;
    data.code = req.body.code;
    data.groups = req.body.groups;
    data.group_1 = req.body.group_1;
    data.group_2 = req.body.group_2;
    data.species = req.body.species;
    data.genSet = req.body.genSet;
    data.source = req.body.source;
    data.email = req.body.email;
    data.domain = "microarray";
    data.submit = dateFormat(now, "yyyy-mm-dd, h:MM:ss TT");
    data.dataList = req.body.dataList;
    let CEL = ""
    for (let i in req.body.dataList) {
        CEL = req.body.dataList[i] + "," + CEL;
    }
    let code = ""
    if (req.body.source == "fetch") {
        code = "<p>&nbsp;&nbsp;Accession Code: <b>" + data.code + "</b></p>";
    } else {

        code = "<p>&nbsp;&nbsp;CEL Files: <b>" + CEL + "</b></p>";
    }
    logger.info("[Queue] Start Using Queue for Analysis")
    logger.info("Input:")
    logger.info(JSON.stringify(data))

    function send(d) {
        logger.info("[Queue] Send Message to Queue", JSON.stringify(d));
        queue.awsHander.sender(JSON.stringify(d), d.email, function(err, data) {
            logger.info("[Queue] Send Message to Queue fails", JSON.stringify(err));
            llogger.info("[Queue] Send fails message  to client ", data.email)
            let subject = "MicroArray Contrast Results -" + dateFormat(now, "yyyy_mm_dd_h_MM") + "(FAILED) ";
            let html = emailer.emailFailedTemplate(code, 0, data.submit, data.projectId)
            emailer.sendMail(config.mail.from, data.email, subject, "text", html)
        });
    }
    logger.info("[S3]upload file to S3")
    logger.info("[S3]File Path:" + config.uploadPath + "/" + data.projectId)
    // // upload data
    queue.awsHander.upload(config.uploadPath + "/" + data.projectId, config.queue_input_path + "/" + data.projectId + "/", function(flag) {
        if (flag) {
            send(data);
        } else {
            logger.info("[S3] upload files to S3 fails");
            let subject = "MicroArray Contrast Results -" + dateFormat(now, "yyyy_mm_dd_h_MM") + "(FAILED) ";
            let html = emailer.emailFailedTemplate(code, 0, data.submit, data.projectId)
            emailer.sendMail(config.mail.from, data.email, subject, "text", html)
        }

    })
    res.json({ status: 200, data: "" });

})

router.post("/getCurrentNumberOfJobsinQueue", function(req, res) {
    let d = queue.awsHander.getQueueAttributes(["ApproximateNumberOfMessages"], function(result) {
        if (result != -1) {
            res.json({
                status: 200,
                data: result.Attributes.ApproximateNumberOfMessages
            });
        } else {
            res.json({
                status: 200,
                data: -1
            });
        }
    });
})


router.post('/getResultByProjectId', function(req, res) {
    logger.info("[Get contrast result from file]",
        "projectId:", req.body.projectId
    );
    queue.awsHander.download(req.body.projectId, config.uploadPath, function(flag) {
        if (flag) {
            fs.readFile(config.uploadPath + "/" + req.body.projectId + "/result.txt", 'utf8', function(err, returnValue) {
                if (err) {
                    res.json({
                        status: 404,
                        msg: err
                    });
                } else {
                    let re = JSON.parse(returnValue)
                    // store return value in session (deep copy)
                    req.session.runContrastData = JsonToObject(re);
                    req.session.option = req.session.runContrastData.group_1 + req.session.runContrastData.group_2 + req.session.runContrastData.genSet;
                    req.session.groups = req.session.runContrastData.groups;
                    req.session.projectId = req.session.runContrastData.projectId;
                    logger.info("store data in req.session")
                    let return_data = "";
                    return_data = {
                        mAplotBN: req.session.runContrastData.maplotBN,
                        mAplotAN: req.session.runContrastData.maplotAfter,
                        group_1: req.session.runContrastData.group_1,
                        group_2: req.session.runContrastData.group_2,
                        groups: req.session.runContrastData.groups,
                        projectId: req.session.runContrastData.projectId,
                        accessionCode: req.session.runContrastData.accessionCode,
                        gsm: re.GSM,
                        mAplotBN: re.maplotBN,
                        mAplotAN: re.maplotAfter
                    }
                    logger.info("Get Contrast result success")
                    res.json({
                        status: 200,
                        data: return_data
                    });
                }
            });
        }else{
            res.json({
                        status: 404,
                        msg: "err"
                    });
        }

    });
});



router.post('/runContrast', function(req, res) {
    req.setTimeout(0) // no timeout
    let data = [];
    //the content in data array should follow the order. Code projectId groups action pDEGs foldDEGs pPathways
    data.push("runContrast"); // action
    data.push(req.body.projectId);
    //data path
    data.push(config.uploadPath);
    data.push(req.body.code);
    data.push(req.body.groups);
    data.push(req.body.group_1);
    data.push(req.body.group_2);
    data.push(req.body.species);
    data.push(req.body.genSet);
    data.push(req.body.source)
    data.push(config.configPath);
    logger.info("API:/runContrast ",
        "code:", req.body.code,
        "groups:", req.body.groups,
        "group_1:", req.body.group_1,
        "group_2:", req.body.group_2,
        "species:", req.body.species,
        "genSet:", req.body.genSet,
        "pssGSEA:", req.body.pssGSEA,
        "foldssGSEA:", req.body.foldssGSEA,
        "source:", req.body.source,
        "data_repo_path:", config.uploadPath
    );
    R.execute("wrapper.R", data, function(err, returnValue) {
        fs.readFile(config.uploadPath + "/" + req.body.projectId + "/result.txt", 'utf8', function(err, returnValue) {
            if (err) {
                res.json({
                    status: 404,
                    msg: err
                });
            } else {
                let re = JSON.parse(returnValue)
                if (re.GSM) {
                    // store return value in session (deep copy)
                    req.session.runContrastData = JsonToObject(re);
                    req.session.option = req.session.runContrastData.group_1 + req.session.runContrastData.group_2 + req.session.runContrastData.genSet;
                    req.session.groups = req.session.runContrastData.groups;
                    req.session.projectId = req.session.runContrastData.projectId;
                    logger.info("store data in req.session")
                    let return_data = "";
                    return_data = {
                        mAplotBN: req.session.runContrastData.maplotBN,
                        mAplotAN: req.session.runContrastData.maplotAfter,
                        group_1: req.session.runContrastData.group_1,
                        group_2: req.session.runContrastData.group_2,
                        groups: req.session.runContrastData.groups,
                        projectId: req.session.runContrastData.projectId,
                        accessionCode: req.session.runContrastData.accessionCode,
                        gsm: re.GSM,
                        mAplotBN: re.maplotBN,
                        mAplotAN: re.maplotAfter
                    }
                    logger.info("Get Contrast result success")
                    res.json({
                        status: 200,
                        data: return_data
                    });
                } else {
                    res.json({
                        status: 404,
                        data: re
                    });
                }
            }
        })

    });

});


function sin_to_hex(i, phase, size) {
    let sin = Math.sin(Math.PI / size * 2 * i + phase);
    let int = Math.floor(sin * 127) + 128;
    let hex = int.toString(16);
    return hex.length === 1 ? "0" + hex : hex;
}

function getPlots(req, type) {
    let return_data = "";
    let uniqueColorCodeArray = "";
    let size = "";
    let rainbow = [];
    if (req.session && req.session.runContrastData && (type == "getBoxplotAN" || type == "getPCA" || type == "getBoxplotBN" || type == "getRLE" || type == "getNUSE")) {
        uniqueColorCodeArray = req.session.runContrastData.listPlots[8].color.filter(function(item, pos) {
            return req.session.runContrastData.listPlots[8].color.indexOf(item) == pos;
        })
        size = uniqueColorCodeArray.length;
        rainbow = new Array(size);
        for (let i = 0; i < size; i++) {
            let red = sin_to_hex(i, 0 * Math.PI * 2 / 3, size); // 0   deg
            let blue = sin_to_hex(i, 1 * Math.PI * 2 / 3, size); // 120 deg
            let green = sin_to_hex(i, 2 * Math.PI * 2 / 3, size); // 240 deg
            rainbow[i] = "#" + red + green + blue;
        }
    }
    switch (type) {
        case "getHistplotAN":
            if (req.session && req.session.runContrastData) {
                return_data = req.session.runContrastData.listPlots[5]
            } else {
                return_data = "";
            }
            break;
        case "getBoxplotAN":
            if (req.session && req.session.runContrastData) {
                if (typeof(req.session.runContrastData.listPlots[7].color[0]) == "number") {
                    req.session.runContrastData.listPlots[7].color = req.session.runContrastData.listPlots[7].color.map(x => rainbow[x / 5 - 1]);
                }
                return_data = req.session.runContrastData.listPlots[7]

            } else {
                return_data = "";
            }
            break;
        case "getMAplotAN":
            console.time("getMAplotAN")
            if (req.session && req.session.runContrastData) {
                return_data = req.session.runContrastData.listPlots[6]
            } else {
                return_data = "";
            }
            break;
        case "getPCA":
            if (req.session && req.session.runContrastData) {
                if (typeof(req.session.runContrastData.listPlots[8].color[0]) == "number") {
                    req.session.runContrastData.listPlots[8].color = req.session.runContrastData.listPlots[8].color.map(x => rainbow[x / 5 - 1]);
                }
                let groups = [];
                if (req.session.runContrastData.groups) {
                    for (var i = 0; i <= req.session.runContrastData.groups.length - 1; i++) {
                        if (req.session.runContrastData.groups[i] != 'Ctl') {
                            groups.push(req.session.runContrastData.groups[i]);
                        } else {
                            groups.push("Others");
                        }
                    }
                }
                req.session.runContrastData.listPlots[8].group_name = groups;
                return_data = req.session.runContrastData.listPlots[8];
            } else {
                return_data = "";
            }
            break;
        case "getHeatmapolt":
            if (req.session && req.session.runContrastData) {
                return_data = req.session.runContrastData.listPlots[9]
            } else {
                return_data = "";
            }
            break;
        case "getHistplotBN":
            if (req.session && req.session.runContrastData) {
                return_data = req.session.runContrastData.listPlots[0]
            } else {
                return_data = "";
            }
            break;
        case "getMAplotsBN":
            if (req.session && req.session.runContrastData) {
                return_data = req.session.runContrastData.listPlots[1]
            } else {
                return_data = "";
            }
            break;
        case "getBoxplotBN":
            if (req.session && req.session.runContrastData) {
                if (typeof(req.session.runContrastData.listPlots[2].color[0]) == "number") {
                    req.session.runContrastData.listPlots[2].color = req.session.runContrastData.listPlots[2].color.map(x => rainbow[x / 5 - 1]);
                }
                return_data = req.session.runContrastData.listPlots[2]
            } else {
                return_data = "";
            }
            break;
        case "getRLE":
            if (req.session && req.session.runContrastData) {
                if (typeof(req.session.runContrastData.listPlots[3].color[0]) == "number") {
                    req.session.runContrastData.listPlots[3].color = req.session.runContrastData.listPlots[3].color.map(x => rainbow[x / 5 - 1]);
                }
                return_data = req.session.runContrastData.listPlots[3]
            } else {
                return_data = "";
            }
            break;
        case "getNUSE":
            if (req.session && req.session.runContrastData) {
                if (typeof(req.session.runContrastData.listPlots[4].color[0]) == "number") {
                    req.session.runContrastData.listPlots[4].color = req.session.runContrastData.listPlots[4].color.map(x => rainbow[x / 5 - 1]);
                }
                return_data = req.session.runContrastData.listPlots[4]
            } else {
                return_data = "";
            }
            break;
        default:
            return_data = "";
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
    console.time("API_getMAplotAN")
    var dd = getPlots(req, "getMAplotAN");
    console.time("API_getMAplotAN")
    res.json({
        status: 200,
        data: dd
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
    return getPathWays(
        req.session.runContrastData.pathways_up, {},
        req.body.sorting,
        req.body.search_keyword,
        req.body.page_size,
        req.body.page_number,
        req, "pathways_up")
}

function getDownPathWays(req) {
    return getPathWays(
        req.session.runContrastData.pathways_down, {},
        req.body.sorting,
        req.body.search_keyword,
        req.body.page_size,
        req.body.page_number,
        req, "pathways_down")
}

function getGSEA(req) {
    return getGSEA_filter(
        req.session.runContrastData.ssGSEA, {},
        req.body.sorting,
        req.body.search_keyword,
        req.body.page_size,
        req.body.page_number,
        req)
}

function getDEG(req) {
    let threadhold = {}
    // add filter 
    return getDEG_filter(
        req.session.runContrastData.diff_expr_genes,
        threadhold,
        req.body.sorting,
        req.body.search_keyword,
        req.body.page_size,
        req.body.page_number,
        req)
}

function getPathWays(data, threadhold, sorting, search_keyword, page_size, page_number, req, type) {
    let result = data;
    if (type == "pathways_up") {
        // store
        if (req.session.pathway_up_tmp) {
            if (req.session.pathway_up_tmp.sorting_order == sorting.order &&
                req.session.pathway_up_tmp.sorting_name == sorting.name &&
                req.session.pathway_up_tmp.search_PATHWAY_ID == search_keyword.search_PATHWAY_ID &&
                req.session.pathway_up_tmp.search_SOURCE == search_keyword.search_SOURCE &&
                req.session.pathway_up_tmp.search_TYPE == search_keyword.search_TYPE &&
                req.session.pathway_up_tmp.search_DESCRIPTION == search_keyword.search_DESCRIPTION &&
                req.session.pathway_up_tmp.search_p_value == search_keyword.search_p_value &&
                req.session.pathway_up_tmp.search_fdr == search_keyword.search_fdr &&
                req.session.pathway_up_tmp.search_RATIO == search_keyword.search_RATIO &&
                req.session.pathway_up_tmp.search_NUMBER_HITS == search_keyword.search_NUMBER_HITS &&
                req.session.pathway_up_tmp.search_GENE_LIST == search_keyword.search_GENE_LIST &&
                req.session.pathway_up_tmp.search_NUMBER_GENES_PATHWAY == search_keyword.search_NUMBER_GENES_PATHWAY &&
                req.session.pathway_up_tmp.search_NUMBER_USER_GENES == search_keyword.search_NUMBER_USER_GENES &&
                req.session.pathway_up_tmp.search_TOTAL_NUMBER_GENES == search_keyword.search_TOTAL_NUMBER_GENES) {
                // return index
                let output = {
                    totalCount: req.session.pathway_up_tmp.data.length,
                    records: req.session.pathway_up_tmp.data.slice(page_size * (page_number - 1), page_size * (page_number - 1) + page_size),
                }
                return output;
            }
        }
    }
    if (type == "pathways_down") {
        // store
        if (req.session.pathway_down_tmp) {
            if (req.session.pathway_down_tmp.sorting_order == sorting.order &&
                req.session.pathway_down_tmp.sorting_name == sorting.name &&
                req.session.pathway_down_tmp.search_PATHWAY_ID == search_keyword.search_PATHWAY_ID &&
                req.session.pathway_down_tmp.search_SOURCE == search_keyword.search_SOURCE &&
                req.session.pathway_down_tmp.search_TYPE == search_keyword.search_TYPE &&
                req.session.pathway_down_tmp.search_DESCRIPTION == search_keyword.search_DESCRIPTION &&
                req.session.pathway_down_tmp.search_p_value == search_keyword.search_p_value &&
                req.session.pathway_down_tmp.search_fdr == search_keyword.search_fdr &&
                req.session.pathway_down_tmp.search_RATIO == search_keyword.search_RATIO &&
                req.session.pathway_down_tmp.search_NUMBER_HITS == search_keyword.search_NUMBER_HITS &&
                req.session.pathway_down_tmp.search_GENE_LIST == search_keyword.search_GENE_LIST &&
                req.session.pathway_down_tmp.search_NUMBER_GENES_PATHWAY == search_keyword.search_NUMBER_GENES_PATHWAY &&
                req.session.pathway_down_tmp.search_NUMBER_USER_GENES == search_keyword.search_NUMBER_USER_GENES &&
                req.session.pathway_down_tmp.search_TOTAL_NUMBER_GENES == search_keyword.search_TOTAL_NUMBER_GENES) {
                // return index
                let output = {
                    totalCount: req.session.pathway_down_tmp.data.length,
                    records: req.session.pathway_down_tmp.data.slice(page_size * (page_number - 1), page_size * (page_number - 1) + page_size),
                }
                return output;
            }
        }
    }
    // search
    if (search_keyword) {
        if (!(search_keyword.search_PATHWAY_ID == "" &&
                search_keyword.search_SOURCE == "" &&
                search_keyword.search_TYPE == "" &&
                search_keyword.search_DESCRIPTION == "" &&
                search_keyword.search_p_value == "" &&
                search_keyword.search_fdr == "" &&
                search_keyword.search_RATIO == "" &&
                search_keyword.search_NUMBER_HITS == "" &&
                search_keyword.search_GENE_LIST == "" &&
                search_keyword.search_NUMBER_GENES_PATHWAY == "" &&
                search_keyword.search_NUMBER_USER_GENES == "" &&
                search_keyword.search_TOTAL_NUMBER_GENES == "")) {
            result = result.filter(function(r) {
                var flag = false;
                if (search_keyword.search_PATHWAY_ID != "") {
                    if (r.Pathway_ID.toLowerCase().indexOf(search_keyword.search_PATHWAY_ID.toLowerCase()) != -1) {
                        flag = true;
                    } else {
                        return false;
                    }
                }
                if (search_keyword.search_SOURCE != "") {
                    if (r.Source.toLowerCase().indexOf(search_keyword.search_SOURCE.toLowerCase()) != -1) {
                        flag = true;
                    } else {
                        return false;
                    }
                }
                if (search_keyword.search_DESCRIPTION != "") {
                    if (r.Description.toLowerCase().indexOf(search_keyword.search_DESCRIPTION.toLowerCase()) != -1) {
                        flag = true;
                    } else {
                        return false;
                    }
                }
                if (search_keyword.search_TYPE != "") {
                    if (r.Type.toLowerCase().indexOf(search_keyword.search_TYPE.toLowerCase()) != -1) {
                        flag = true;
                    } else {
                        return false;
                    }
                }
                if (search_keyword.search_p_value != "") {
                    if (r["P_Value"] <= parseFloat(search_keyword.search_p_value)) {
                        flag = true;
                    } else {
                        return false;
                    }
                }
                if (search_keyword.search_fdr != "") {
                    if (r["FDR"] <= parseFloat(search_keyword.search_fdr)) {
                        flag = true;
                    } else {
                        return false;
                    }
                }
                if (search_keyword.search_RATIO != "") {
                    if (r["Ratio"] <= parseFloat(search_keyword.search_RATIO)) {
                        flag = true;
                    } else {
                        return false;
                    }
                }
                if (search_keyword.search_NUMBER_HITS != "") {
                    if (r["Number_Hits"] <= parseFloat(search_keyword.search_NUMBER_HITS)) {
                        flag = true;
                    } else {
                        return false;
                    }
                }
                if (search_keyword.search_GENE_LIST != "") {
                    if (r.Gene_List.toLowerCase().indexOf(search_keyword.search_GENE_LIST.toLowerCase()) != -1) {
                        flag = true;
                    } else {
                        return false;
                    }
                }
                if (search_keyword.search_NUMBER_GENES_PATHWAY != "") {
                    if (r["Number_Genes_Pathway"] <= parseFloat(search_keyword.search_NUMBER_GENES_PATHWAY)) {
                        flag = true;
                    } else {
                        return false;
                    }
                }
                if (search_keyword.search_NUMBER_USER_GENES != "") {
                    if (r["Number_User_Genes"] <= parseFloat(search_keyword.search_NUMBER_USER_GENES)) {
                        flag = true;
                    } else {
                        return false;
                    }
                }
                if (search_keyword.search_TOTAL_NUMBER_GENES != "") {
                    if (r["Total_Number_Genes"] <= parseFloat(search_keyword.search_TOTAL_NUMBER_GENES)) {
                        flag = true;
                    } else {
                        return false;
                    }
                }
                return flag;
            })
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
    }
    if (type == "pathways_up") {
        // store current filter result into tmp 
        req.session.pathway_up_tmp = {
            sorting_order: sorting.order,
            sorting_name: sorting.name,
            search_PATHWAY_ID: search_keyword.search_PATHWAY_ID,
            search_SOURCE: search_keyword.search_SOURCE,
            search_TYPE: search_keyword.search_TYPE,
            search_DESCRIPTION: search_keyword.search_DESCRIPTION,
            search_p_value: search_keyword.search_p_value,
            search_fdr: search_keyword.search_fdr,
            search_RATIO: search_keyword.search_RATIO,
            search_NUMBER_HITS: search_keyword.search_NUMBER_HITS,
            search_GENE_LIST: search_keyword.search_GENE_LIST,
            search_NUMBER_GENES_PATHWAY: search_keyword.search_NUMBER_GENES_PATHWAY,
            search_NUMBER_USER_GENES: search_keyword.search_NUMBER_USER_GENES,
            search_TOTAL_NUMBER_GENES: search_keyword.search_TOTAL_NUMBER_GENES,
            data: result
        }
    }
    if (type == "pathways_down") {
        // store current filter result into tmp 
        req.session.pathway_down_tmp = {
            sorting_order: sorting.order,
            sorting_name: sorting.name,
            search_PATHWAY_ID: search_keyword.search_PATHWAY_ID,
            search_SOURCE: search_keyword.search_SOURCE,
            search_TYPE: search_keyword.search_TYPE,
            search_DESCRIPTION: search_keyword.search_DESCRIPTION,
            search_p_value: search_keyword.search_p_value,
            search_fdr: search_keyword.search_fdr,
            search_RATIO: search_keyword.search_RATIO,
            search_NUMBER_HITS: search_keyword.search_NUMBER_HITS,
            search_GENE_LIST: search_keyword.search_GENE_LIST,
            search_NUMBER_GENES_PATHWAY: search_keyword.search_NUMBER_GENES_PATHWAY,
            search_NUMBER_USER_GENES: search_keyword.search_NUMBER_USER_GENES,
            search_TOTAL_NUMBER_GENES: search_keyword.search_TOTAL_NUMBER_GENES,
            data: result
        }
    }
    let output = {
        totalCount: result.length,
        records: result.slice(page_size * (page_number - 1), page_size * (page_number - 1) + page_size),
    }
    return output;
}

function getGSEA_filter(data, threadhold, sorting, search_keyword, page_size, page_number, req) {
    let result = data;
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
    }
    // search
    if (search_keyword) {
        if (!(search_keyword.name == "" &&
                search_keyword.search_b == "" &&
                search_keyword.search_adj_p_value == "" &&
                search_keyword.search_Avg_Enrichment_Score == "" &&
                search_keyword.search_p_value == "" &&
                search_keyword.search_t == "" &&
                search_keyword.search_logFC == ""
            )) {
            result = result.filter(function(r) {
                var flag = false;
                if (search_keyword.name != "") {
                    if (r["V1"].toLowerCase().indexOf(search_keyword.name.toLowerCase()) != -1) {
                        flag = true;
                    } else {
                        return false;
                    }
                }
                if (search_keyword.search_logFC != "") {
                    if (Math.abs(r["V2"]) >= parseFloat(search_keyword.search_logFC)) {
                        flag = true;
                    } else {
                        return false;
                    }
                }
                if (search_keyword.search_t != "") {
                    if (r["V4"] <= parseFloat(search_keyword.search_t)) {
                        flag = true;
                    } else {
                        return false;
                    }
                }
                if (search_keyword.search_p_value != "") {
                    if (r["V5"] <= parseFloat(search_keyword.search_p_value)) {
                        flag = true;
                    } else {
                        return false;
                    }
                }
                if (search_keyword.search_Avg_Enrichment_Score != "") {
                    if (r["V3"] <= parseFloat(search_keyword.search_Avg_Enrichment_Score)) {
                        flag = true;
                    } else {
                        return false;
                    }
                }
                if (search_keyword.search_adj_p_value != "") {
                    if (r["V6"] <= parseFloat(search_keyword.search_adj_p_value)) {
                        flag = true;
                    } else {
                        return false;
                    }
                }
                if (search_keyword.search_b != "") {
                    if (r["V7"] <= parseFloat(search_keyword.search_b)) {
                        flag = true;
                    } else {
                        return false;
                    }
                }
                // if search keywords is empty then return the
                return flag;
            })
        }
    }
    // return index
    let output = {
        totalCount: result.length,
        records: result.slice(page_size * (page_number - 1), page_size * (page_number - 1) + page_size),
    }
    return output;
}


function getDEG_filter(data, threadhold, sorting, search_keyword, page_size, page_number, req) {
    let result = data;
    // store
    if (req.session.deg_tmp) {
        // if only request a page's content do not need to filter out the data
        if (req.session.deg_tmp.sorting_order == sorting.order &&
            req.session.deg_tmp.sorting_name == sorting.name &&
            req.session.deg_tmp.search_symbol == search_keyword.search_symbol &&
            req.session.deg_tmp.search_fc == search_keyword.search_fc &&
            req.session.deg_tmp.search_p_value == search_keyword.search_p_value &&
            req.session.deg_tmp.search_adj_p_value == search_keyword.search_adj_p_value &&
            req.session.deg_tmp.search_aveexpr == search_keyword.search_aveexpr &&
            req.session.deg_tmp.search_accnum == search_keyword.search_accnum &&
            req.session.deg_tmp.search_desc == search_keyword.search_desc &&
            req.session.deg_tmp.search_entrez == search_keyword.search_entrez &&
            req.session.deg_tmp.search_probsetid == search_keyword.search_probsetid &&
            req.session.deg_tmp.search_t == search_keyword.search_t &&
            req.session.deg_tmp.search_b == search_keyword.search_b) {
            logger.info("Get Deg data from session success")
            let output = {
                totalCount: req.session.deg_tmp.data.length,
                records: req.session.deg_tmp.data.slice(page_size * (page_number - 1), page_size * (page_number - 1) + page_size),
            }
            return output;
        } else {
            logger.info("Get Deg data from session fails")
        }
    }
    if (sorting != null) {
        logger.info("Sort Deg data ")
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
    }
    // search
    if (search_keyword != "") {
        logger.info("Filter Deg data ")
        if (!(search_keyword.search_accnum == "" &&
                search_keyword.search_adj_p_value == "" &&
                search_keyword.search_aveexpr == "" &&
                search_keyword.search_b == "" &&
                search_keyword.search_p_value == "" &&
                search_keyword.search_desc == "" &&
                search_keyword.search_entrez == "" &&
                search_keyword.search_fc == "" &&
                search_keyword.search_probsetid == "" &&
                search_keyword.search_symbol == "" &&
                search_keyword.search_t == "")) {
            result = result.filter(function(r) {
                var flag = false;
                if (search_keyword.search_accnum != "") {
                    if (r.ACCNUM.toLowerCase().indexOf(search_keyword.search_accnum.toLowerCase()) != -1) {
                        flag = true;
                    } else {
                        return false;
                    }
                }
                if (search_keyword.search_adj_p_value != "") {
                    if (r['adj.P.Val'] <= parseFloat(search_keyword.search_adj_p_value)) {
                        flag = true;
                    } else {
                        return false;
                    }
                }
                if (search_keyword.search_aveexpr != "") {
                    if (r.AveExpr <= parseFloat(search_keyword.search_aveexpr)) {
                        flag = true;
                    } else {
                        return false;
                    }
                }
                if (search_keyword.search_b != "") {
                    if (r.B <= parseFloat(search_keyword.search_b)) {
                        flag = true;
                    } else {
                        return false;
                    }
                }
                if (search_keyword.search_p_value != "") {
                    if (r["P.Value"] <= parseFloat(search_keyword.search_p_value)) {
                        flag = true;
                    } else {
                        return false;
                    }
                }
                if (search_keyword.search_desc != "") {
                    if (r.DESC.toLowerCase().indexOf(search_keyword.search_desc.toLowerCase()) != -1) {
                        flag = true;
                    } else {
                        return false;
                    }
                }
                if (search_keyword.search_entrez != "") {
                    if (r.ENTREZ.toLowerCase().indexOf(search_keyword.search_entrez.toLowerCase()) != -1) {
                        flag = true;
                    } else {
                        return false;
                    }
                }
                if (search_keyword.search_fc != "") {
                    if (Math.abs(r.FC) >= parseFloat(search_keyword.search_fc)) {
                        flag = true;
                    } else {
                        return false;
                    }
                }
                if (search_keyword.search_probsetid != "") {
                    if (r.probsetID.toLowerCase().indexOf(search_keyword.search_probsetid.toLowerCase()) != -1) {
                        flag = true;
                    } else {
                        return false;
                    }
                }
                if (search_keyword.search_symbol != "") {
                    if (r.SYMBOL.toLowerCase().indexOf(search_keyword.search_symbol.toLowerCase()) != -1) {
                        flag = true;
                    } else {
                        return false;
                    }
                }

                if (search_keyword.search_t != "") {
                    if (r.t <= parseFloat(search_keyword.search_t)) {
                        flag = true;
                    } else {
                        return false;
                    }
                }
                return flag;
            })
        }
    }
    logger.info("Put Deg data into session ")
    // store current filter result into tmp 
    req.session.deg_tmp = {
        sorting_order: sorting.order,
        sorting_name: sorting.name,
        search_symbol: search_keyword.search_symbol,
        search_fc: search_keyword.search_fc,
        search_p_value: search_keyword.search_p_value,
        search_adj_p_value: search_keyword.search_adj_p_value,
        search_aveexpr: search_keyword.search_aveexpr,
        search_accnum: search_keyword.search_accnum,
        search_desc: search_keyword.search_desc,
        search_entrez: search_keyword.search_entrez,
        search_probsetid: search_keyword.search_probsetid,
        search_t: search_keyword.search_t,
        search_b: search_keyword.search_b,
        data: result
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
    let d = "";
    if (returnValue.split("+++ssGSEA+++\"")) {
        d = returnValue.split("+++ssGSEA+++\"")[1];
    }
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

function JsonToObject(returnValue) {
    var workflow = {};
    if (returnValue.deg) {
        workflow.diff_expr_genes = returnValue.deg;
    } else {
        workflow.diff_expr_genes = "";
    }
    if (returnValue.ss_data) {
        workflow.ssGSEA = returnValue.ss_data;
    } else {
        workflow.ssGSEA = "";
    }
    if (returnValue.uppath) {
        workflow.pathways_up = returnValue.uppath;
    } else {
        workflow.pathways_up = "";
    }
    if (returnValue.downpath) {
        workflow.pathways_down = returnValue.downpath;
    } else {
        workflow.pathways_down = "";
    }
    if (returnValue.projectId) {
        workflow.projectId = returnValue.projectId;
    } else {
        workflow.projectId = "";
    }
    if (returnValue.groups) {
        workflow.groups = returnValue.groups;
    } else {
        workflow.groups = "";
    }
    if (returnValue.accessionCode && returnValue.accessionCode[0]) {
        workflow.accessionCode = returnValue.accessionCode[0];
    } else {
        workflow.accessionCode = "";
    }
    if (returnValue.group_1 && returnValue.group_1[0]) {
        workflow.group_1 = returnValue.group_1[0];
    } else {
        workflow.group_1 = "";
    }
    if (returnValue.group_2 && returnValue.group_2[0]) {
        workflow.group_2 = returnValue.group_2[0];
    } else {
        workflow.group_2 = "";
    }
    workflow.listPlots = [returnValue.hisBefore,
        returnValue.maplotBN,
        returnValue.boxplotDataBN,
        returnValue.RLE,
        returnValue.NUSE,
        returnValue.hisAfter,
        returnValue.maplotAfter,
        returnValue.boxplotDataAN,
        returnValue.pcaData,
        returnValue.heatmapAfterNorm
    ]
    return workflow;
}






module.exports = router;