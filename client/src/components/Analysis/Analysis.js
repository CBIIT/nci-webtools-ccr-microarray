import React, { Component } from 'react';
import Workflow from '../Workflow/Workflow';
import DataBox from '../DataBox/DataBox';
import About from '../About/About';
import Help from '../Help/Help';
import { Spin, Icon, Button, Modal } from 'antd';
import Plot from 'react-plotly.js';
import XLSX from 'xlsx';


const ButtonGroup = Button.Group;

let defaultState = {
    workflow: {
        tab_activeKey: "GSM_1",
        numberOfTasksInQueue: 0,
        QueueModalvisible: false,
        useQueue: true,
        token: "",
        projectID: "",
        analysisType: "0",
        accessionCode: "",
        fileList: [],
        uploading: false,
        progressing: false,
        loading_info: "Loading",
        dataList: [],
        groups: [],
        group_1: "-1",
        group_2: "-1",
        pDEGs: 0.05,
        foldDEGs: 1.5,
        species: "human",
        genSet: "H: Hallmark Gene Sets",
        compared: false,
        uploaded: false,
        done_gsea: false,
        current_working_on_object: "",
        current_working_on_tag: "",
        tag_pre_plot_status: "",
        tag_post_plot_status: "",
        tag_deg_plot_status: "",
        tag_ssgea_plot_status: "",
        diff_expr_genes: {
            data: [],
            pagination: {
                current: 1,
                pageSize: 25,

            },
            loading: true,
            page_number: 1,
            page_size: 25,
            sorting: {
                name: "P.Value",
                order: "ascend",
            },
            search_keyword: {
                "search_symbol": "",
                "search_fc": "1.5",
                "search_p_value": "0.05",
                "search_adj_p_value": "",
                "search_aveexpr": "",
                "search_accnum": "",
                "search_desc": "",
                "search_entrez": "",
                "search_probsetid": "",
                "search_t": "",
                "search_b": ""
            }
        },
        ssGSEA: {
            data: [],
            pagination: {
                current: 1,
                pageSize: 25,

            },
            loading: true,
            page_size: 25,
            page_number: 1,
            sorting: {
                name: "P.Value",
                order: "ascend",
            },
            search_keyword: {
                "name": "",
                "search_logFC": "1",
                "search_Avg_Enrichment_Score": "",
                "search_t": "",
                "search_p_value": "0.05",
                "search_adj_p_value": "",
                "search_b": "",
            }
        },
        pathways_up: {

            data: [],
            pagination: {
                current: 1,
                pageSize: 25,

            },
            sorting: {
                name: "P_Value",
                order: "ascend",

            },
            loading: true,
            search_keyword: {
                "search_PATHWAY_ID": "",
                "search_SOURCE": "",
                "search_DESCRIPTION": "",
                "search_TYPE": "",
                "search_p_value": "0.05",
                "search_fdr": "",
                "search_RATIO": "",
                "search_GENE_LIST": "",
                "search_NUMBER_HITS": "",
                "search_NUMBER_GENES_PATHWAY": "",
                "search_NUMBER_USER_GENES": "",
                "search_TOTAL_NUMBER_GENES": "",
            }
        },
        pathways_down: {
            data: [],
            pagination: {
                current: 1,
                pageSize: 25,

            },
            loading: true,
            sorting: {
                name: "P_Value",
                order: "ascend",

            },
            search_keyword: {
                "search_PATHWAY_ID": "",
                "search_SOURCE": "",
                "search_DESCRIPTION": "",
                "search_TYPE": "",
                "search_p_value": "0.05",
                "search_fdr": "",
                "search_RATIO": "",
                "search_GENE_LIST": "",
                "search_NUMBER_HITS": "",
                "search_NUMBER_GENES_PATHWAY": "",
                "search_NUMBER_USER_GENES": "",
                "search_TOTAL_NUMBER_GENES": "",
            }
        },
        preplots: {
            histplotBN: "",
            list_mAplotBN: "",
            Boxplots: "",
            RLE: "",
            NUSE: "",
        },
        list_mAplotBN: "",
        list_mAplotAN: "",
        postplot: {
            histplotAN: "",
            list_mAplotAN: "",
            Boxplots: "",
            PCA: "",
            Heatmapolt: ""
        },
        geneHeatmap: "/ssgseaHeatmap1.jpg",
        volcanoPlot: "/volcano.html",
    }
};



class Analysis extends Component {

    constructor(props) {
        super(props);
        if (this.props.location.search && this.props.location.search != "") {


            defaultState.workflow.progressing = true;
            this.state = Object.assign({}, defaultState);
            this.initWithCode(this.props.location.search.substring(1, this.props.location.search.length));

        } else {

            this.state = Object.assign({}, defaultState);
        }
        this.resetWorkFlowProject = this.resetWorkFlowProject.bind(this);
        this.changeCode = this.changeCode.bind(this);
        this.handleSelectType = this.handleSelectType.bind(this);
        this.upateCurrentWorkingTabAndObject = this.upateCurrentWorkingTabAndObject.bind(this);
        this.runContrast = this.runContrast.bind(this);
        this.getHistplotBN = this.getHistplotBN.bind(this);
        this.getNUSE = this.getNUSE.bind(this);
        this.getRLE = this.getRLE.bind(this);
        this.getBoxplotBN = this.getBoxplotBN.bind(this);
        this.getMAplotsBN = this.getMAplotsBN.bind(this);
        this.getHeatmapolt = this.getHeatmapolt.bind(this);
        this.getPCA = this.getPCA.bind(this);
        this.getBoxplotAN = this.getBoxplotAN.bind(this);
        this.getHistplotAN = this.getHistplotAN.bind(this);
        this.getMAplotAN = this.getMAplotAN.bind(this);
        this.getDEG = this.getDEG.bind(this);
        this.getPathwayDown = this.getPathwayDown.bind(this);
        this.getPathwayUp = this.getPathwayUp.bind(this);
        this.getssGSEA = this.getssGSEA.bind(this);
        this.changeLoadingStatus = this.changeLoadingStatus.bind(this);
        this.changeRUNContractModel = this.changeRUNContractModel.bind(this);
        this.initWithCode = this.initWithCode.bind(this);


        this.exportGSE = this.exportGSE.bind(this);
        this.exportGSEA = this.exportGSEA.bind(this);
        this.exportPathwayUp = this.exportPathwayUp.bind(this);
        this.exportPathwayDown = this.exportPathwayDown.bind(this);
        this.exportDEG = this.exportDEG.bind(this);
        this.getCurrentNumberOfJobsinQueue = this.getCurrentNumberOfJobsinQueue.bind(this);
        this.showModal = this.showModal.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.getCurrentNumberOfJobsinQueue();


    }

    changeRUNContractModel = (params = false) => {
        let workflow = Object.assign({}, this.state.workflow);
        if (params) {
            workflow.useQueue = true;
        } else {
            workflow.useQueue = false;
        }
        this.setState({ workflow: workflow });
    }
    //use for generate UUID
    uuidv4() {
        return 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random() * 16 | 0,
                v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    exportGSEA = (params = {}) => {
        let workflow = Object.assign({}, this.state.workflow);
        params = {
            projectId: workflow.projectID,
            page_size: 99999999,
            page_number: 1,
            sorting: {
                name: workflow.ssGSEA.sorting.name,
                order: workflow.ssGSEA.sorting.order,
            },
            search_keyword: workflow.ssGSEA.search_keyword
        }

        fetch('./api/analysis/getGSEA', {
                method: "POST",
                body: JSON.stringify(params),
                credentials: "same-origin",
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(this.handleErrors)
            .then(
                res => res.json()
            )
            .then(result => {


                if (result.status == 200) {
                    let workflow = Object.assign({}, this.state.workflow);
                    var wb = XLSX.utils.book_new();
                    wb.Props = {
                        Title: "Export ssGSEA Data",
                        Subject: "ssGSEA Data",
                        Author: "Microarray",
                        CreatedDate: new Date()
                    };
                    if (workflow.dataList.length != 0) {
                        wb.SheetNames.push("Settings");

                        var ws_data = [];

                        if (workflow.analysisType == "1") {
                            // Upload
                            ws_data.push(["Analysis Type", "CEL Files"]);

                            let uploadD = ""

                            for (var i in workflow.dataList) {
                                uploadD = workflow.dataList[i].title + "," + uploadD;
                            }

                            ws_data.push(["Upload Data", uploadD]);
                        }

                        ws_data.push(["Accession Code", workflow.accessionCode])
                        ws_data.push(["Contrast Group", workflow.group_1 + " vs " + workflow.group_2])
                        ws_data.push(["sorting.field", workflow.ssGSEA.sorting.name])
                        ws_data.push(["sorting.order", workflow.ssGSEA.sorting.order])
                        ws_data.push(["search_keyword", ""])

                        if (workflow.ssGSEA.search_keyword.name != "") {
                            ws_data.push(["sorting.order", workflow.ssGSEA.sorting.order])
                        }

                        if (workflow.ssGSEA.search_keyword.search_logFC != "") {
                            ws_data.push(["logFC", workflow.ssGSEA.search_keyword.search_logFC])
                        }
                        if (workflow.ssGSEA.search_keyword.search_p_value != "") {
                            ws_data.push(["P.Value", workflow.ssGSEA.search_keyword.search_p_value])
                        }
                        if (workflow.ssGSEA.search_keyword.search_adj_p_value != "") {
                            ws_data.push(["adj.P.value", workflow.ssGSEA.search_keyword.search_adj_p_value])
                        }
                        if (workflow.ssGSEA.search_keyword.search_Avg_Enrichment_Score != "") {
                            ws_data.push(["Avg.Enrichment.Score", workflow.ssGSEA.search_keyword.search_Avg_Enrichment_Score])
                        }
                        if (workflow.ssGSEA.search_keyword.search_b != "") {
                            ws_data.push(["B", workflow.ssGSEA.search_keyword.search_b])
                        }
                        if (workflow.ssGSEA.search_keyword.search_t != "") {
                            ws_data.push(["t", workflow.ssGSEA.search_keyword.search_t])
                        }

                        var ws = XLSX.utils.aoa_to_sheet(ws_data);
                        wb.Sheets["Settings"] = ws;
                        wb.SheetNames.push("Results");

                        // export data
                        let degData = result.data.records;
                        let exportData = [
                            ["NAME", "logFC", "Avg.Enrichment.Score", "t", "P.Value", "adj.P.Val", "B"]
                        ]
                        for (let i in degData) {
                            exportData.push([
                                degData[i]["_row"],
                                degData[i]["logFC"],
                                degData[i]["Avg.Enrichment.Score"],
                                degData[i]["t"],
                                degData[i]["P.Value"],
                                degData[i]["adj.P.Val"],
                                degData[i]["B"]
                            ])
                        }

                        var ws2 = XLSX.utils.aoa_to_sheet(exportData);
                        wb.Sheets["Results"] = ws2;
                        var wbout = XLSX.writeFile(wb, "ssGSEA_" + workflow.projectID + ".xlsx", { bookType: 'xlsx', type: 'binary' });
                    }

                } else {

                    document.getElementById("message-ssgsea").innerHTML = result.msg
                }


            }).catch(error => console.log(error));
    }

    getssGSEA = (params = {}) => {
        let workflow = Object.assign({}, this.state.workflow);

        if (params.search_keyword) {
            params = {
                projectId: workflow.projectID,
                page_size: params.page_size,
                page_number: params.page_number,
                sorting: {
                    name: params.sorting.name,
                    order: params.sorting.order,
                },
                search_keyword: params.search_keyword
            }

            workflow.ssGSEA.pagination = {
                current: params.page_number,
                pageSize: params.page_size,

            }
            workflow.ssGSEA.search_keyword = params.search_keyword;
        } else {

            params = {
                projectId: workflow.projectID,
                page_number: workflow.ssGSEA.pagination.current,
                page_size: workflow.ssGSEA.pagination.pageSize
            }
            params.sorting = workflow.ssGSEA.sorting
            params.search_keyword = workflow.ssGSEA.search_keyword
            workflow.ssGSEA.pagination = {
                current: workflow.ssGSEA.pagination.current,
                pageSize: workflow.ssGSEA.pagination.pageSize,

            }

        }

        workflow.ssGSEA.loading = true;
        this.setState({ workflow: workflow });



        fetch('./api/analysis/getGSEA', {
                method: "POST",
                body: JSON.stringify(params),
                credentials: "same-origin",
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(this.handleErrors)
            .then(
                res => res.json()
            )
            .then(result => {
                document.getElementById("message-ssgsea").innerHTML = ""
                let workflow2 = Object.assign({}, this.state.workflow);

                document.getElementById("input_ssg_name").value = workflow2.ssGSEA.search_keyword.name;
                document.getElementById("input_ssg_search_logFC").value = workflow2.ssGSEA.search_keyword.search_logFC;
                document.getElementById("input_ssg_search_Avg_Enrichment_Score").value = workflow2.ssGSEA.search_keyword.search_Avg_Enrichment_Score;
                document.getElementById("input_ssg_search_t").value = workflow2.ssGSEA.search_keyword.search_t;
                document.getElementById("input_ssg_search_p_value").value = workflow2.ssGSEA.search_keyword.search_p_value;
                document.getElementById("input_ssg_search_adj_p_value").value = workflow2.ssGSEA.search_keyword.search_adj_p_value;
                document.getElementById("input_ssg_search_b").value = workflow2.ssGSEA.search_keyword.search_b;


                if (result.status == 200) {
                    const pagination = { ...workflow2.ssGSEA.pagination };
                    // Read total count from server
                    // pagination.total = data.totalCount;
                    pagination.total = result.data.totalCount;

                    for (let i = 0; i < result.data.records.length; i++) {
                        result.data.records[i].key = "GSEA" + i;
                    }

                    workflow2.ssGSEA.loading = false;
                    workflow2.ssGSEA.data = result.data.records;
                    workflow2.ssGSEA.pagination = pagination;

                    let min = 0;
                    let max = 99999;
                    let random = Math.random() * (+max - +min) + +min;
                    workflow2.geneHeatmap = "/ssgseaHeatmap1.jpg?" + random
                    this.setState({ workflow: workflow2 });

                    this.resetSSGSEADisplay();

                } else {

                    document.getElementById("message-ssgsea").innerHTML = result.msg
                }



            }).catch(error => console.log(error));
    }

    exportPathwayUp = (params = {}) => {
        let workflow = Object.assign({}, this.state.workflow);
        // initialize
        params = {
            projectId: workflow.projectID,
            page_size: 99999999,
            page_number: 1,
            sorting: {
                name: workflow.pathways_up.sorting.name,
                order: workflow.pathways_up.sorting.order,
            },
            search_keyword: workflow.pathways_up.search_keyword
        }
        fetch('./api/analysis/getUpPathWays', {
                method: "POST",
                body: JSON.stringify(params),
                credentials: "same-origin",
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(this.handleErrors)
            .then(
                res => res.json()
            )
            .then(result => {
                if (result.status == 200) {

                    let workflow = Object.assign({}, this.state.workflow);
                    var wb = XLSX.utils.book_new();
                    wb.Props = {
                        Title: "Export Pathways For Upregulated Genes Data",
                        Subject: "Pathways For Upregulated Genes Data",
                        Author: "Microarray",
                        CreatedDate: new Date()
                    };
                    if (workflow.dataList.length != 0) {
                        wb.SheetNames.push("Settings");
                        var ws_data = [];

                        if (workflow.analysisType == "1") {
                            // Upload
                            ws_data.push(["Analysis Type", "CEL Files"]);

                            let uploadD = ""

                            for (var i in workflow.dataList) {
                                uploadD = workflow.dataList[i].title + "," + uploadD;
                            }

                            ws_data.push(["Upload Data", uploadD]);
                        }

                        ws_data.push(["Accession Code", workflow.accessionCode])
                        ws_data.push(["Contrast Group", workflow.group_1 + " vs " + workflow.group_2])
                        ws_data.push(["sorting.field", workflow.ssGSEA.sorting.name])
                        ws_data.push(["sorting.order", workflow.ssGSEA.sorting.order])
                        ws_data.push(["search_keyword", ""])

                        if (workflow.pathways_up.search_keyword.search_PATHWAY_ID != "") {
                            ws_data.push(["Pathway_ID", workflow.pathways_up.search_keyword.search_PATHWAY_ID])
                        }

                        if (workflow.pathways_up.search_keyword.search_SOURCE != "") {
                            ws_data.push(["Source", workflow.pathways_up.search_keyword.search_SOURCE])
                        }
                        if (workflow.pathways_up.search_keyword.search_DESCRIPTION != "") {
                            ws_data.push(["Description", workflow.pathways_up.search_keyword.search_DESCRIPTION])
                        }
                        if (workflow.pathways_up.search_keyword.search_TYPE != "") {
                            ws_data.push(["Type", workflow.pathways_up.search_keyword.search_TYPE])
                        }
                        if (workflow.pathways_up.search_keyword.search_p_value != "") {
                            ws_data.push(["P.value", workflow.pathways_up.search_keyword.search_p_value])
                        }
                        if (workflow.pathways_up.search_keyword.search_fdr != "") {
                            ws_data.push(["FDR", workflow.pathways_up.search_keyword.search_fdr])
                        }
                        if (workflow.pathways_up.search_keyword.search_RATIO != "") {
                            ws_data.push(["Ratio", workflow.pathways_up.search_keyword.search_RATIO])
                        }
                        if (workflow.pathways_up.search_keyword.search_NUMBER_HITS != "") {
                            ws_data.push(["Number_Hits", workflow.pathways_up.search_keyword.search_NUMBER_HITS])
                        }
                        if (workflow.pathways_up.search_keyword.search_NUMBER_GENES_PATHWAY != "") {
                            ws_data.push(["Number_Genes_Pathway", workflow.pathways_up.search_keyword.search_NUMBER_GENES_PATHWAY])
                        }
                        if (workflow.pathways_up.search_keyword.search_NUMBER_USER_GENES!= "") {
                            ws_data.push( ["Number_User_Genes", workflow.pathways_up.search_keyword.search_NUMBER_USER_GENES])
                        }
                       if (workflow.pathways_up.search_keyword.search_TOTAL_NUMBER_GENES!= "") {
                            ws_data.push(["Total_Number_Genes", workflow.pathways_up.search_keyword.search_TOTAL_NUMBER_GENES])
                        }
                        if (workflow.pathways_up.search_keyword.search_GENE_LIST!= "") {
                            ws_data.push(["Gene_List", workflow.pathways_up.search_keyword.search_GENE_LIST])
                        }


                        var ws = XLSX.utils.aoa_to_sheet(ws_data);
                        wb.Sheets["Settings"] = ws;
                        wb.SheetNames.push("Results");

                        // export data
                        let degData = result.data.records;
                        let exportData = [
                            ["Pathway_ID", "Source", "Description", "Type", "P.Value", "FDR", "Ratio", "Gene_List", "Number_Hits", "Number_Genes_Pathway", "Number_User_Genes", "Total_Number_Genes"]
                        ]
                        for (let i in degData) {
                            exportData.push([
                                degData[i]["Pathway_ID"],
                                degData[i]["Source"],
                                degData[i]["Description"],
                                degData[i]["Type"],
                                degData[i]["P_Value"],
                                degData[i]["FDR"],
                                degData[i]["Ratio"],
                                degData[i]["Gene_List"],
                                degData[i]["Number_Hits"],
                                degData[i]["Number_Genes_Pathway"],
                                degData[i]["Number_User_Genes"],
                                degData[i]["Total_Number_Genes"]
                            ])
                        }

                        var ws2 = XLSX.utils.aoa_to_sheet(exportData);
                        wb.Sheets["Results"] = ws2;
                        var wbout = XLSX.writeFile(wb, "Pathways_For_Upregulated_Genes_Export_" + workflow.projectID + ".xlsx", { bookType: 'xlsx', type: 'binary' });
                    }
                } else {

                    document.getElementById("message-pug").innerHTML = "Contrast result no found";
                }


            }).catch(error => console.log(error));
    }

    getPathwayUp = (params = {}) => {
        let workflow = Object.assign({}, this.state.workflow);
        // initialize
        if (params.search_keyword) {
            params = {
                projectId: workflow.projectID,
                page_size: params.page_size,
                page_number: params.page_number,
                sorting: {
                    name: params.sorting.name,
                    order: params.sorting.order,
                },
                search_keyword: params.search_keyword
            }

            workflow.pathways_up.pagination = {
                current: params.page_number,
                pageSize: params.page_size,

            }
            workflow.pathways_up.search_keyword = params.search_keyword;
        } else {

            params = {
                projectId: workflow.projectID,
                page_number: workflow.pathways_up.pagination.current,
                page_size: workflow.pathways_up.pagination.pageSize
            }
            params.sorting = workflow.pathways_up.sorting;
            params.search_keyword = workflow.pathways_up.search_keyword
            workflow.pathways_up.pagination = {
                current: workflow.pathways_up.pagination.current,
                pageSize: workflow.pathways_up.pagination.pageSize,
            }
        }

        workflow.pathways_up.loading = true;
        this.setState({ workflow: workflow });
        console.log()
        fetch('./api/analysis/getUpPathWays', {
                method: "POST",
                body: JSON.stringify(params),
                credentials: "same-origin",
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(this.handleErrors)
            .then(
                res => res.json()
            )
            .then(result => {
                document.getElementById("message-pug").innerHTML = "";
                let workflow2 = Object.assign({}, this.state.workflow);
                if (result.status == 200) {
                    const pagination = { ...workflow.pathways_up.pagination };
                    // Read total count from server
                    // pagination.total = data.totalCount;
                    pagination.total = result.data.totalCount;

                    for (let i = 0; i < result.data.records.length; i++) {
                        result.data.records[i].key = "pathway_up" + i;
                    }

                    workflow2.pathways_up.loading = false;
                    workflow2.pathways_up.data = result.data.records;
                    workflow2.pathways_up.pagination = pagination;

                    this.setState({ workflow: workflow2 });

                    this.resetPathWayUPDisplay();

                } else {

                    document.getElementById("message-pug").innerHTML = result.msg;
                }



                document.getElementById("input_pathway_up_search_PATHWAY_ID").value = workflow2.pathways_up.search_keyword.search_PATHWAY_ID;
                document.getElementById("input_pathway_up_search_SOURCE").value = workflow2.pathways_up.search_keyword.search_SOURCE;
                document.getElementById("input_pathway_up_search_DESCRIPTION").value = workflow2.pathways_up.search_keyword.search_DESCRIPTION;
                document.getElementById("input_pathway_up_search_TYPE").value = workflow2.pathways_up.search_keyword.search_TYPE;
                document.getElementById("input_pathway_up_search_p_value").value = workflow.pathways_up.search_keyword.search_p_value;
                document.getElementById("input_pathway_up_search_fdr").value = workflow2.pathways_up.search_keyword.search_fdr;
                document.getElementById("input_pathway_up_search_RATIO").value = workflow2.pathways_up.search_keyword.search_RATIO;
                document.getElementById("input_pathway_up_search_GENE_LIST").value = workflow2.pathways_up.search_keyword.search_GENE_LIST;
                document.getElementById("input_pathway_up_search_NUMBER_HITS").value = workflow2.pathways_up.search_keyword.search_NUMBER_HITS;
                document.getElementById("input_pathway_up_search_NUMBER_GENES_PATHWAY").value = workflow2.pathways_up.search_keyword.search_NUMBER_GENES_PATHWAY;
                document.getElementById("input_pathway_up_search_NUMBER_USER_GENES").value = workflow2.pathways_up.search_keyword.search_NUMBER_USER_GENES;
                document.getElementById("input_pathway_up_search_TOTAL_NUMBER_GENES").value = workflow2.load.pathways_up.search_keyword.search_TOTAL_NUMBER_GENES;


            }).catch(error => console.log(error));
    }

    getPathwayDown = (params = {}) => {
        let workflow = Object.assign({}, this.state.workflow);
        // initialize
        if (params.search_keyword) {
            params = {
                projectId: workflow.projectID,
                page_size: params.page_size,
                page_number: params.page_number,
                sorting: {
                    name: params.sorting.name,
                    order: params.sorting.order,
                },
                search_keyword: params.search_keyword
            }

            workflow.pathways_down.pagination = {
                current: params.page_number,
                pageSize: params.page_size,

            }
            workflow.pathways_down.search_keyword = params.search_keyword;
        } else {

            params = {
                projectId: workflow.projectID,
                page_number: workflow.pathways_down.pagination.current,
                page_size: workflow.pathways_down.pagination.pageSize
            }
            params.sorting = workflow.pathways_down.sorting;
            params.search_keyword = workflow.pathways_down.search_keyword;
            workflow.pathways_down.pagination = {
                current: workflow.pathways_down.pagination.current,
                pageSize: workflow.pathways_down.pagination.pageSize,

            }

        }


        workflow.pathways_down.loading = true;
        this.setState({ workflow: workflow });
        fetch('./api/analysis/getDownPathWays', {
                method: "POST",
                body: JSON.stringify(params),
                credentials: "same-origin",
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(this.handleErrors)
            .then(
                res => res.json()
            )
            .then(result => {
                document.getElementById("message-pdg").innerHTML = "";
                let workflow2 = Object.assign({}, this.state.workflow);
                if (result.status == 200) {
                    const pagination = { ...workflow.pathways_down.pagination };
                    // Read total count from server
                    // pagination.total = data.totalCount;
                    pagination.total = result.data.totalCount;

                    for (let i = 0; i < result.data.records.length; i++) {
                        result.data.records[i].key = "pathway_down" + i;
                    }
                    workflow2.pathways_down.loading = false;
                    workflow2.pathways_down.data = result.data.records;
                    workflow2.pathways_down.pagination = pagination;

                    this.setState({ workflow: workflow2 });
                    this.resetPathWayDownDisplay();
                } else {
                    document.getElementById("message-pdg").innerHTML = result.msg;
                }

                document.getElementById("input_pathway_down_search_PATHWAY_ID").value = workflow2.pathways_down.search_keyword.search_PATHWAY_ID;
                document.getElementById("input_pathway_down_search_SOURCE").value = workflow2.pathways_down.search_keyword.search_SOURCE;
                document.getElementById("input_pathway_down_search_DESCRIPTION").value = workflow2.pathways_down.search_keyword.search_DESCRIPTION;
                document.getElementById("input_pathway_down_search_TYPE").value = workflow2.pathways_down.search_keyword.search_TYPE;
                document.getElementById("input_pathway_down_search_p_value").value = workflow2.pathways_down.search_keyword.search_p_value;
                document.getElementById("input_pathway_down_search_fdr").value = workflow2.pathways_down.search_keyword.search_fdr;
                document.getElementById("input_pathway_down_search_RATIO").value = workflow2.pathways_down.search_keyword.search_RATIO;
                document.getElementById("input_pathway_down_search_GENE_LIST").value = workflow2.pathways_down.search_keyword.search_GENE_LIST;
                document.getElementById("input_pathway_down_search_NUMBER_HITS").value = workflow2.pathways_down.search_keyword.search_NUMBER_HITS;
                document.getElementById("input_pathway_down_search_NUMBER_GENES_PATHWAY").value = workflow2.pathways_down.search_keyword.search_NUMBER_GENES_PATHWAY;
                document.getElementById("input_pathway_down_search_NUMBER_USER_GENES").value = workflow2.pathways_down.search_keyword.search_NUMBER_USER_GENES;
                document.getElementById("input_pathway_down_search_TOTAL_NUMBER_GENES").value = workflow2.pathways_down.search_keyword.search_TOTAL_NUMBER_GENES;


            }).catch(error => console.log(error));
    }


    exportPathwayDown = (params = {}) => {
        let workflow = Object.assign({}, this.state.workflow);
        // initialize
        params = {
            projectId: workflow.projectID,
            page_size: 99999999,
            page_number: 1,
            sorting: {
                name: workflow.pathways_down.sorting.name,
                order: workflow.pathways_down.sorting.order,
            },
            search_keyword: workflow.pathways_down.search_keyword
        }

        fetch('./api/analysis/getDownPathWays', {
                method: "POST",
                body: JSON.stringify(params),
                credentials: "same-origin",
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(this.handleErrors)
            .then(
                res => res.json()
            )
            .then(result => {
                document.getElementById("message-pdg").innerHTML = "";
                let workflow = Object.assign({}, this.state.workflow);
                if (result.status == 200) {

                    let workflow = Object.assign({}, this.state.workflow);
                    var wb = XLSX.utils.book_new();
                    wb.Props = {
                        Title: "Export Pathways For Upregulated Genes Data",
                        Subject: "Pathways For Upregulated Genes Data",
                        Author: "Microarray",
                        CreatedDate: new Date()
                    };
                    if (workflow.dataList.length != 0) {
                        wb.SheetNames.push("Settings");
                        var ws_data = [];
                        if (workflow.analysisType == "1") {
                            // Upload
                            ws_data.push(["Analysis Type", "CEL Files"]);
                            let uploadD = ""
                            for (var i in workflow.dataList) {
                                uploadD = workflow.dataList[i].title + "," + uploadD;
                            }
                            ws_data.push(["Upload Data", uploadD]);
                        }
                        ws_data.push(["Accession Code", workflow.accessionCode])
                        ws_data.push(["Contrast Group", workflow.group_1 + " vs " + workflow.group_2])
                        ws_data.push(["sorting.field", workflow.ssGSEA.sorting.name])
                        ws_data.push(["sorting.order", workflow.ssGSEA.sorting.order])
                        ws_data.push(["search_keyword", ""])

                        if (workflow.pathways_down.search_keyword.search_PATHWAY_ID != "") {
                            ws_data.push(["Pathway_ID", workflow.pathways_down.search_keyword.search_PATHWAY_ID])
                        }

                        if (workflow.pathways_down.search_keyword.search_SOURCE != "") {
                            ws_data.push(["Source", workflow.pathways_down.search_keyword.search_SOURCE])
                        }
                        if (workflow.pathways_down.search_keyword.search_DESCRIPTION != "") {
                            ws_data.push(["Description", workflow.pathways_down.search_keyword.search_DESCRIPTION])
                        }
                        if (workflow.pathways_down.search_keyword.search_TYPE != "") {
                            ws_data.push(["Type", workflow.pathways_down.search_keyword.search_TYPE])
                        }
                        if (workflow.pathways_down.search_keyword.search_p_value != "") {
                            ws_data.push(["P.value", workflow.pathways_down.search_keyword.search_p_value])
                        }
                        if (workflow.pathways_down.search_keyword.search_fdr != "") {
                            ws_data.push(["FDR", workflow.pathways_down.search_keyword.search_fdr])
                        }
                        if (workflow.pathways_down.search_keyword.search_RATIO != "") {
                            ws_data.push(["Ratio", workflow.pathways_down.search_keyword.search_RATIO])
                        }
                        if (workflow.pathways_down.search_keyword.search_NUMBER_HITS != "") {
                            ws_data.push(["Number_Hits", workflow.pathways_down.search_keyword.search_NUMBER_HITS])
                        }
                        if (workflow.pathways_down.search_keyword.search_NUMBER_GENES_PATHWAY != "") {
                            ws_data.push(["Number_Genes_Pathway", workflow.pathways_down.search_keyword.search_NUMBER_GENES_PATHWAY])
                        }
                        if (workflow.pathways_down.search_keyword.search_NUMBER_USER_GENES!= "") {
                            ws_data.push( ["Number_User_Genes", workflow.pathways_down.search_keyword.search_NUMBER_USER_GENES])
                        }
                       if (workflow.pathways_down.search_keyword.search_TOTAL_NUMBER_GENES!= "") {
                            ws_data.push(["Total_Number_Genes", workflow.pathways_down.search_keyword.search_TOTAL_NUMBER_GENES])
                        }
                        if (workflow.pathways_down.search_keyword.search_GENE_LIST!= "") {
                            ws_data.push(["Gene_List", workflow.pathways_down.search_keyword.search_GENE_LIST])
                        }


                        var ws = XLSX.utils.aoa_to_sheet(ws_data);
                        wb.Sheets["Settings"] = ws;
                        wb.SheetNames.push("Results");

                        // export data
                        let degData = result.data.records;
                        let exportData = [
                            ["Pathway_ID", "Source", "Description", "Type", "P.Value", "FDR", "Ratio", "Gene_List", "Number_Hits", "Number_Genes_Pathway", "Number_User_Genes", "Total_Number_Genes"]
                        ]
                        for (let i in degData) {
                            exportData.push([
                                degData[i]["Pathway_ID"],
                                degData[i]["Source"],
                                degData[i]["Description"],
                                degData[i]["Type"],
                                degData[i]["P_Value"],
                                degData[i]["FDR"],
                                degData[i]["Ratio"],
                                degData[i]["Gene_List"],
                                degData[i]["Number_Hits"],
                                degData[i]["Number_Genes_Pathway"],
                                degData[i]["Number_User_Genes"],
                                degData[i]["Total_Number_Genes"]
                            ])
                        }

                        var ws2 = XLSX.utils.aoa_to_sheet(exportData);
                        wb.Sheets["Results"] = ws2;
                        var wbout = XLSX.writeFile(wb, "Pathways_For_Upregulated_Genes_Export_" + workflow.projectID + ".xlsx", { bookType: 'xlsx', type: 'binary' });
                    }

                } else {
                    document.getElementById("message-pdg").innerHTML = result.msg;
                }


            }).catch(error => console.log(error));
    }

    getDEG = (params = {}) => {

        let workflow = Object.assign({}, this.state.workflow);
        if (params.search_keyword) {

            params = {
                projectId: workflow.projectID,
                page_size: params.page_size,
                page_number: params.page_number,
                sorting: {
                    name: params.sorting.name,
                    order: params.sorting.order,
                },
                search_keyword: params.search_keyword
            }

            workflow.diff_expr_genes.pagination = {
                current: params.page_number,
                pageSize: params.page_size,

            }
            workflow.sorting = params.sorting;
            workflow.diff_expr_genes.search_keyword = params.search_keyword;

        } else {
            params = {
                projectId: workflow.projectID,
                page_number: workflow.diff_expr_genes.pagination.current,
                page_size: workflow.diff_expr_genes.pagination.pageSize
            }
            params.sorting = workflow.diff_expr_genes.sorting;
            params.search_keyword = workflow.diff_expr_genes.search_keyword
            workflow.diff_expr_genes.pagination = {
                current: workflow.diff_expr_genes.pagination.current,
                pageSize: workflow.diff_expr_genes.pagination.pageSize,

            }

        }


        workflow.diff_expr_genes.loading = true;
        this.setState({ workflow: workflow });
        fetch('./api/analysis/getDEG', {
                method: "POST",
                body: JSON.stringify(params),
                credentials: "same-origin",
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(this.handleErrors)
            .then(
                res => res.json()
            )
            .then(result => {
                document.getElementById("message-deg").innerHTML = "";
                let workflow2 = Object.assign({}, this.state.workflow);
                if (result.status == 200) {

                    const pagination = { ...workflow2.diff_expr_genes.pagination };
                    // Read total count from server 
                    // pagination.total = data.totalCount;
                    pagination.total = result.data.totalCount;

                    for (let i = 0; i < result.data.records.length; i++) {
                        result.data.records[i].key = "DEG" + i;
                    }
                    workflow2.diff_expr_genes.loading = false;
                    workflow2.diff_expr_genes.data = result.data.records;
                    workflow2.diff_expr_genes.pagination = pagination;

                    this.setState({ workflow: workflow2 });
                    this.resetDEGDisplay();

                } else {
                    document.getElementById("message-deg").innerHTML = result.msg;
                }


                document.getElementById("input_deg_search_symbol").value = workflow2.diff_expr_genes.search_keyword.search_symbol;
                document.getElementById("input_deg_search_fc").value = workflow2.diff_expr_genes.search_keyword.search_fc;
                document.getElementById("input_dge_search_p_value").value = workflow2.diff_expr_genes.search_keyword.search_p_value;
                document.getElementById("input_deg_search_adj_p_value").value = workflow2.diff_expr_genes.search_keyword.search_adj_p_value;
                document.getElementById("input_deg_search_aveexpr").value = workflow2.diff_expr_genes.search_keyword.search_aveexpr;
                document.getElementById("input_deg_search_accnum").value = workflow2.diff_expr_genes.search_keyword.search_accnum;
                document.getElementById("input_deg_search_desc").value = workflow2.diff_expr_genes.search_keyword.search_desc;
                document.getElementById("input_deg_search_entrez").value = workflow2.diff_expr_genes.search_keyword.search_entrez;
                document.getElementById("input_deg_search_probsetid").value = workflow2.diff_expr_genes.search_keyword.search_probsetid;
                document.getElementById("input_deg_search_t").value = workflow2.diff_expr_genes.search_keyword.search_t;
                document.getElementById("input_deg_search_b").value = workflow2.diff_expr_genes.search_keyword.search_b;

            }).catch(error => console.log(error));
    }


    exportDEG = (params = {}) => {

        let workflow = Object.assign({}, this.state.workflow);
        params = {
            projectId: workflow.projectID,
            page_size: 99999999,
            page_number: 1,
            sorting: workflow.diff_expr_genes.sorting,
            search_keyword: workflow.diff_expr_genes.search_keyword
        }
        fetch('./api/analysis/getDEG', {
                method: "POST",
                body: JSON.stringify(params),
                credentials: "same-origin",
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(this.handleErrors)
            .then(
                res => res.json()
            )
            .then(result => {
                if (result.status == 200) {
                    let workflow = Object.assign({}, this.state.workflow);
                    var wb = XLSX.utils.book_new();
                    wb.Props = {
                        Title: "Export Deg Data",
                        Subject: "Deg Data",
                        Author: "Microarray",
                        CreatedDate: new Date()
                    };
                    if (workflow.dataList.length != 0) {
                        wb.SheetNames.push("Settings");
                        var ws_data = [
                            ["Accession Code", workflow.accessionCode],
                            ["Contrast Group", workflow.group_1 + " vs " + workflow.group_2],
                            ["sorting.field", workflow.diff_expr_genes.sorting.name],
                            ["sorting.order", workflow.diff_expr_genes.sorting.order],
                            ["search_keyword", ""],
                            ["SYMBOL", workflow.diff_expr_genes.search_keyword.search_symbol],
                            ["fc", workflow.diff_expr_genes.search_keyword.search_fc],
                            ["P.Value", workflow.diff_expr_genes.search_keyword.search_p_value],
                            ["adj.P.value", workflow.diff_expr_genes.search_keyword.search_adj_p_value],
                            ["AveExpr", workflow.diff_expr_genes.search_keyword.search_aveexpr],
                            ["ACCNUM", workflow.diff_expr_genes.search_keyword.search_accnum],
                            ["DESC", workflow.diff_expr_genes.search_keyword.search_desc],
                            ["ENTREZ", workflow.diff_expr_genes.search_keyword.search_entrez],
                            ["probsetID", workflow.diff_expr_genes.search_keyword.search_probsetid],
                            ["t", workflow.diff_expr_genes.search_keyword.search_t],
                            ["b", workflow.diff_expr_genes.search_keyword.search_b],
                        ];
                        var ws = XLSX.utils.aoa_to_sheet(ws_data);
                        wb.Sheets["Settings"] = ws;
                        wb.SheetNames.push("Results");

                        // export data
                        let degData = result.data.records;
                        let exportData = [
                            ["SYMBOL", "FC", "logFC", "P.Value", "adj.P.value", "AveExpr", "ACCNUM", "DESC", "ENTREZ", "probsetID", "t", "B"]

                        ]
                        for (let i in degData) {
                            exportData.push([
                                degData[i]["SYMBOL"],
                                degData[i]["FC"],
                                degData[i]["logFC"],
                                degData[i]["P.Value"],
                                degData[i]["adj.P.Val"],
                                degData[i]["AveExpr"],
                                degData[i]["ACCNUM"],
                                degData[i]["DESC"],
                                degData[i]["ENTREZ"],
                                degData[i]["probsetID"],
                                degData[i]["t"],
                                degData[i]["B"]
                            ])
                        }

                        var ws2 = XLSX.utils.aoa_to_sheet(exportData);
                        wb.Sheets["Results"] = ws2;
                        var wbout = XLSX.writeFile(wb, "Differentially_Expressed_Genes_Export_" + workflow.projectID + ".xlsx", { bookType: 'xlsx', type: 'binary' });

                    }

                } else {
                    document.getElementById("message-deg").innerHTML = result.msg;
                }

            }).catch(error => console.log(error));
    }

    getHeatmapolt() {
        document.getElementById("message-post-heatmap").innerHTML = "";
        let workflow = Object.assign({}, this.state.workflow);
        let link = "./images/" + workflow.projectID + "/heatmapAfterNorm.html"
        let HeatMapIframe = <div><iframe title={"Heatmap"} src={link}  width={'100%'} height={'100%'} frameBorder={'0'}/></div>
        workflow.postplot.Heatmapolt = <div>{HeatMapIframe}</div>;
        this.setState({ workflow: workflow });
    }

    getPCA() {
        let workflow2 = Object.assign({}, this.state.workflow);
        workflow2.progressing = true;
        workflow2.loading_info = "Loading PCA...";
        this.setState({ workflow: workflow2 });
        let params = { projectId: workflow2.projectID };
        try {
            fetch('./api/analysis/getPCA', {
                    method: "POST",
                    body: JSON.stringify(params),
                    processData: false,
                    contentType: false
                })
                .then(this.handleErrors)
                .then(res => res.json())
                .then(result => {
                    if (result.status == 200) {
                        if (result.data != "") {
                            let pcaData = result.data;
                            var PCAIframe = <Plot  data={[{
                                        autosize: true,
                                        x: pcaData.x,
                                        y: pcaData.y,
                                        z: pcaData.z,
                                        text: pcaData.row,
                                        mode: 'markers',
                                        marker: {
                                            size: 10,
                                            color: pcaData.color
                                        },
                                        type: 'scatter3d',
                                       
                                    }]} layout={{
            
                                        margin:{
                                            l:25,
                                            r:25,
                                            t:-50,
                                            b:0 ,
                                            pd:2,
                                        },
                                        width:document.getElementsByClassName("ant-tabs-tabpane-active")[0].offsetWidth*0.8,
                                        height:document.getElementsByClassName("ant-tabs-tabpane-active")[0].offsetWidth*0.6,
                                        scene: {
                                            xaxis: {
                                                title: pcaData.col[0],
                                                backgroundcolor: "#DDDDDD",
                                                gridcolor: "rgb(255, 255, 255)",
                                                showbackground: true,
                                                zerolinecolor: "rgb(255, 255, 255)"

                                            },
                                            yaxis: {
                                                title:  pcaData.col[1],
                                                backgroundcolor: "#EEEEEE",
                                                gridcolor: "rgb(255, 255, 255)",
                                                showbackground: true,
                                                zerolinecolor: "rgb(255, 255, 255)"
                                            },
                                            zaxis: {
                                                title:  pcaData.col[2],
                                                backgroundcolor: "#cccccc",
                                                gridcolor: "rgb(255, 255, 255)",
                                                showbackground: true,
                                                zerolinecolor: "rgb(255, 255, 255)"
                                            }
                                        }}
                                    }  useResizeHandler={true} />

                            let workflow = Object.assign({}, this.state.workflow);
                            workflow.progressing = false;
                            let plot_style = { "display": "block", "marginLeft": "auto", "marginRight": "auto", "width": "80%" }
                            workflow.postplot.PCA = <div style={plot_style}> {PCAIframe}</div>;
                            this.setState({ workflow: workflow });
                        } else {
                            let workflow = Object.assign({}, this.state.workflow);
                            workflow.progressing = false;
                            workflow.postplot.PCA = "No Data";
                            this.setState({ workflow: workflow });

                        }
                        document.getElementById("message-post-pca").innerHTML = "";

                    } else {
                        document.getElementById("message-post-pca").innerHTML = result.msg;
                        let workflow = Object.assign({}, this.state.workflow);
                        workflow.progressing = false;
                        workflow.postplot.PCA = "No Data";
                        this.setState({ workflow: workflow });
                    }

                }).catch(error => console.log(error));
        } catch (error) {
            document.getElementById("message-post-pca").innerHTML = error;
            let workflow = Object.assign({}, this.state.workflow);
            workflow.progressing = false;
            this.setState({ workflow: workflow });
        }

    }
    getBoxplotAN() {
        let workflow2 = Object.assign({}, this.state.workflow);
        workflow2.progressing = true;
        workflow2.loading_info = "Loading Boxplot...";
        this.setState({ workflow: workflow2 });
        let params = { projectId: workflow2.projectID };
        try {
            fetch('./api/analysis/getBoxplotAN', {
                    method: "POST",
                    body: JSON.stringify(params),
                    processData: false,
                    contentType: false
                })
                .then(this.handleErrors)
                .then(res => res.json())
                .then(result => {
                    if (result.status == 200) {
                        if (result.data != "") {
                            let BoxplotRenderData = []
                            let BoxplotsData = result.data
                            for (let i = 0; i < result.data.col.length; i++) {

                                let boxplotData = {
                                    y: BoxplotsData.data[i],
                                    type: "box",
                                    name: BoxplotsData.col[i],
                                    marker: {
                                        color: BoxplotsData.color[i]
                                    }
                                }
                                BoxplotRenderData.push(boxplotData)
                            }

                            let plot_layout = { showlegend: false }
                            let plot_style = { "width": document.getElementsByClassName("ant-tabs-tabpane-active")[0].offsetWidth * 0.9 }

                            let Boxplots = <Plot  data={BoxplotRenderData} layout={plot_layout}  style={plot_style} useResizeHandler={true}/>

                            let workflow = Object.assign({}, this.state.workflow);
                            workflow.progressing = false;
                            workflow.postplot.Boxplots = <div> {Boxplots}</div>;
                            this.setState({ workflow: workflow });
                        } else {
                            let workflow = Object.assign({}, this.state.workflow);
                            workflow.progressing = false;
                            workflow.postplot.Boxplots = "No Data";
                            this.setState({ workflow: workflow });

                        }

                        document.getElementById("message-post-boxplot").innerHTML = "";
                    } else {
                        document.getElementById("message-post-boxplot").innerHTML = result.msg;
                        let workflow = Object.assign({}, this.state.workflow);
                        workflow.progressing = false;
                        workflow.postplot.Boxplots = "No Data";
                        this.setState({ workflow: workflow });
                    }

                }).catch(error => console.log(error));
        } catch (error) {
            document.getElementById("message-post-boxplot").innerHTML = error;
            let workflow = Object.assign({}, this.state.workflow);
            workflow.progressing = false;
            workflow.postplot.Boxplots = "No Data";
            this.setState({ workflow: workflow });
        }

    }

    getHistplotAN() {

        let workflow = Object.assign({}, this.state.workflow);
        let histplotANLink = './images/' + workflow.projectID + "/histAfterNorm.svg";
        let histplotAN = <div><img src={ histplotANLink } style={{ width: "50%" }} alt="Histogram" /></div>;

        workflow.postplot.histplotAN = histplotAN;
        this.setState({ workflow: workflow });

    }

    getMAplotAN() {
        let workflow2 = Object.assign({}, this.state.workflow);
        if (workflow2.list_mAplotAN == "") {
            workflow2.progressing = true;
            workflow2.loading_info = "Loading Plots...";
            this.setState({ workflow: workflow2 });
            let params = { projectId: workflow2.projectID };
            try {
                fetch('./api/analysis/getMAplotAN', {
                        method: "POST",
                        body: JSON.stringify(params),
                        processData: false,
                        contentType: false
                    })
                    .then(this.handleErrors)
                    .then(res => res.json())
                    .then(result => {
                        if (result.status == 200) {
                            document.getElementById("message-post-maplot").innerHTML = "";
                            let workflow = Object.assign({}, this.state.workflow);
                            if (result.data != "") {
                                let list_mAplotBN = [];
                                for (let i = result.data.length - 1; i >= 0; i--) {
                                    let link = "./images/" + workflow.projectID + result.data[i]
                                    list_mAplotBN.push(<div key={"mAplotBN"+i}  > <img  src={ link } style ={{ width: "50%" }} alt="MAplot"/> </div>)
                                }
                                let maplot_style = {

                                };


                                workflow.postplot.list_mAplotAN = <div style={ maplot_style } > { list_mAplotBN } </div>;
                                workflow.progressing = false;
                                this.setState({ workflow: workflow });

                            } else {

                                let workflow = Object.assign({}, this.state.workflow);
                                workflow.postplot.list_mAplotAN = "No Data";
                                workflow.progressing = false;
                                this.setState({ workflow: workflow });
                            }

                        } else {

                            document.getElementById("message-post-maplot").innerHTML = result.msg;
                            let workflow = Object.assign({}, this.state.workflow);
                            workflow.progressing = false;
                            this.setState({ workflow: workflow });
                        }

                    }).catch(error => console.log(error));
            } catch (error) {
                document.getElementById("message-post-maplot").innerHTML = error;
                let workflow = Object.assign({}, this.state.workflow);
                workflow.progressing = false;
                this.setState({ workflow: workflow });
            }
        } else {
            let workflow2 = Object.assign({}, this.state.workflow);
            let list_mAplotBN = [];
            for (let i = workflow2.list_mAplotAN.length - 1; i >= 0; i--) {
                let link = "./images/" + workflow2.projectID + workflow2.list_mAplotAN[i]
                list_mAplotBN.push(<div key={"mAplotBN"+i}  > <img  src={ link } style ={{ width: "50%" }} alt="MAplot"/> </div>)
            }
            let maplot_style = {

            };


            workflow2.postplot.list_mAplotAN = <div style={ maplot_style } > { list_mAplotBN } </div>;
            workflow2.progressing = false;
            this.setState({ workflow: workflow2 });
        }

    }
    getNUSE() {
        let workflow2 = Object.assign({}, this.state.workflow);
        workflow2.progressing = true;
        workflow2.loading_info = "Loading NUSE...";
        this.setState({ workflow: workflow2 });
        let params = { projectId: workflow2.projectID };

        try {
            fetch('./api/analysis/getNUSE', {
                    method: "POST",
                    body: JSON.stringify(params),
                    processData: false,
                    contentType: false
                }).then(res => res.json())
                .then(result => {
                    document.getElementById("message-pre-nuse").innerHTML = "";
                    let workflow = Object.assign({}, this.state.workflow);
                    if (result.status == 200) {

                        let NUSERenderData = []
                        let NUSEplotsData = result.data
                        for (let i = 0; i < result.data.col.length; i++) {

                            let boxplotData = {
                                y: NUSEplotsData.data[i],
                                type: "box",
                                name: NUSEplotsData.col[i],
                                marker: {
                                    color: NUSEplotsData.color[i]
                                }
                            }
                            NUSERenderData.push(boxplotData)
                        }

                        let plot_layout = { showlegend: false }
                        let plot_style = { "width": document.getElementsByClassName("ant-tabs-tabpane-active")[0].offsetWidth * 0.9, }

                        let NUSE = <Plot  data={NUSERenderData} layout={plot_layout}  style={plot_style} useResizeHandler={true}/>


                        workflow.progressing = false;
                        workflow.preplots.NUSE = <div> {NUSE}</div>;
                        this.setState({ workflow: workflow });


                    } else {

                        document.getElementById("message-pre-nuse").innerHTML = result.msg;
                        workflow.progressing = false;
                        this.setState({ workflow: workflow });

                    }

                }).catch(error => console.log(error));
        } catch (error) {
            document.getElementById("message-pre-nuse").innerHTML = error;
            let workflow = Object.assign({}, this.state.workflow);
            workflow.progressing = false;
            this.setState({ workflow: workflow });
        }
    }

    getRLE() {
        let workflow2 = Object.assign({}, this.state.workflow);
        workflow2.progressing = true;
        workflow2.loading_info = "Loading RLE...";
        this.setState({ workflow: workflow2 });
        let params = { projectId: workflow2.projectID };

        try {
            fetch('./api/analysis/getRLE', {
                    method: "POST",
                    body: JSON.stringify(params),
                    processData: false,
                    contentType: false
                }).then(this.handleErrors)
                .then(res => res.json())
                .then(result => {
                    if (result.status == 200) {
                        document.getElementById("message-pre-rle").innerHTML = "";
                        if (result.data != "") {
                            let RLERenderData = []
                            let RLEplotsData = result.data
                            for (let i = 0; i < result.data.col.length; i++) {

                                let boxplotData = {
                                    y: RLEplotsData.data[i],
                                    type: "box",
                                    name: RLEplotsData.col[i],
                                    marker: {
                                        color: RLEplotsData.color[i]
                                    }
                                }
                                RLERenderData.push(boxplotData)
                            }


                            let plot_layout = { showlegend: false }
                            let plot_style = { "width": document.getElementsByClassName("ant-tabs-tabpane-active")[0].offsetWidth * 0.9, }

                            let RLE = <Plot data={RLERenderData} layout={plot_layout}  style={plot_style}  useResizeHandler={true}/>


                            let workflow = Object.assign({}, this.state.workflow);
                            workflow.progressing = false;
                            workflow.preplots.RLE = <div> {RLE}</div>;
                            this.setState({ workflow: workflow });
                        } else {

                            let workflow = Object.assign({}, this.state.workflow);
                            workflow.preplots.RLE = "No Data";
                            workflow.progressing = false;
                            this.setState({ workflow: workflow });
                        }


                    } else {
                        document.getElementById("message-pre-rle").innerHTML = result.msg;
                        let workflow = Object.assign({}, this.state.workflow);
                        workflow.preplots.RLE = "";
                        workflow.progressing = false;
                        this.setState({ workflow: workflow });

                    }

                }).catch(error => console.log(error));
        } catch (error) {

            document.getElementById("message-pre-rle").innerHTML = error;
            let workflow = Object.assign({}, this.state.workflow);
            workflow.preplots.RLE = "No Data";
            workflow.progressing = false;
            this.setState({ workflow: workflow });
        }
    }

    getBoxplotBN() {

        let workflow2 = Object.assign({}, this.state.workflow);
        workflow2.progressing = true;
        workflow2.loading_info = "Loading Plots...";
        this.setState({ workflow: workflow2 });
        let params = { projectId: workflow2.projectID };

        try {
            fetch('./api/analysis/getBoxplotBN', {
                    method: "POST",
                    body: JSON.stringify(params),
                    processData: false,
                    contentType: false
                }).then(this.handleErrors)
                .then(res => res.json())
                .then(result => {
                    if (result.status == 200) {
                        document.getElementById("message-pre-boxplot").innerHTML = "";
                        if (result.data != "") {
                            let BoxplotRenderData = []
                            let BoxplotsData = result.data
                            for (let i = 0; i < result.data.col.length; i++) {

                                let boxplotData = {
                                    y: BoxplotsData.data[i],
                                    type: "box",
                                    name: BoxplotsData.col[i],
                                    marker: {
                                        color: BoxplotsData.color[i]
                                    }
                                }
                                BoxplotRenderData.push(boxplotData)
                            }

                            let plot_layout = { showlegend: false }
                            let plot_style = { "width": document.getElementsByClassName("ant-tabs-tabpane-active")[0].offsetWidth * 0.9, }


                            let Boxplots = <Plot  data={BoxplotRenderData} layout={plot_layout}  style={plot_style} useResizeHandler={true}/>

                            let workflow = Object.assign({}, this.state.workflow);
                            workflow.preplots.Boxplots = <div> {Boxplots}</div>;
                            workflow.progressing = false;
                            this.setState({ workflow: workflow });
                        } else {

                            let workflow = Object.assign({}, this.state.workflow);
                            workflow.preplots.Boxplots = "No Data";
                            workflow.progressing = false;
                            this.setState({ workflow: workflow });
                        }


                    } else {
                        document.getElementById("message-pre-boxplot").innerHTML = result.msg;
                        let workflow = Object.assign({}, this.state.workflow);
                        workflow.preplots.Boxplots = "No Data";
                        workflow.progressing = false;
                        this.setState({ workflow: workflow });
                    }

                }).catch(error => console.log(error));
        } catch (error) {

            document.getElementById("message-pre-boxplot").innerHTML = error;
            let workflow = Object.assign({}, this.state.workflow);
            workflow.preplots.Boxplots = "No Data";
            workflow.progressing = false;
            this.setState({ workflow: workflow });
        }
    }

    getMAplotsBN() {
        let workflow2 = Object.assign({}, this.state.workflow);
        if (workflow2.list_mAplotBN == "") {
            workflow2.progressing = true;
            workflow2.loading_info = "Loading Plots...";
            let params = { projectId: workflow2.projectID };
            this.setState({ workflow: workflow2 });
            try {
                fetch('./api/analysis/getMAplotsBN', {
                        method: "POST",
                        body: JSON.stringify(params),
                        processData: false,
                        contentType: false
                    }).then(this.handleErrors)
                    .then(res => res.json())
                    .then(result => {
                        if (result.status == 200) {
                            document.getElementById("message-pre-maplot").innerHTML = "";
                            if (result.data != "") {
                                let workflow = Object.assign({}, this.state.workflow);
                                let list_mAplotBN = [];
                                for (let i = result.data.length - 1; i >= 0; i--) {
                                    let link = "./images/" + workflow.projectID + result.data[i]
                                    list_mAplotBN.push(<div key={"mAplotBN"+i}  > <img  src={ link } style ={{ width: "50%" }} alt="MAplot"/> </div>)
                                }
                                let maplot_style = {

                                };
                                workflow.list_mAplotBN = result.data;
                                workflow.preplots.list_mAplotBN = <div style={ maplot_style } > { list_mAplotBN } </div>;
                                workflow.progressing = false;
                                this.setState({ workflow: workflow });

                            } else {
                                let workflow = Object.assign({}, this.state.workflow);
                                workflow.preplots.list_mAplotBN = "No Data";
                                workflow.progressing = false;
                                this.setState({ workflow: workflow });
                            }

                        } else {
                            document.getElementById("message-pre-maplot").innerHTML = result.msg;
                            let workflow = Object.assign({}, this.state.workflow);
                            workflow.preplots.list_mAplotBN = "No Data";
                            workflow.progressing = false;
                            this.setState({ workflow: workflow });
                        }

                    }).catch(error => console.log(error));
            } catch (error) {
                document.getElementById("message-pre-maplot").innerHTML = error;
                let workflow = Object.assign({}, this.state.workflow);
                workflow.preplots.list_mAplotBN = "No Data";
                workflow.progressing = false;
                this.setState({ workflow: workflow });
            }

        } else {
            let list_mAplotBN = [];
            for (let i = workflow2.list_mAplotBN.length - 1; i >= 0; i--) {
                let link = "./images/" + workflow2.projectID + workflow2.list_mAplotBN[i]
                list_mAplotBN.push(<div key={"mAplotBN"+i}  > <img  src={ link } style ={{ width: "50%" }} alt="MAplot"/> </div>)
            }
            let maplot_style = {

            };
            workflow2.preplots.list_mAplotBN = <div style={ maplot_style } > { list_mAplotBN } </div>;
            this.setState({ workflow: workflow2 });

        }
    }

    getHistplotBN() {

        let workflow = Object.assign({}, this.state.workflow);
        let histplotBNLink = './images/' + workflow.projectID + "/histBeforeNorm.svg";
        let histplotBN = <div><img src={ histplotBNLink } style={{ width: "50%" }} alt="Histogram" /></div>;
        workflow.preplots.histplotBN = histplotBN;
        this.setState({ workflow: workflow });
    }

    changePathways_up(obj) {
        let workflow = Object.assign({}, this.state.workflow);
        if (obj.pagination) {
            workflow.pathways_up = obj;
        } else {
            obj.pagination = workflow.pagination;
            workflow.pathways_up = obj;
        }
        this.setState({ workflow: workflow }, () => {
            console.log("changePathways_up done");
        });
    }

    changePathways_down(obj) {
        let workflow = Object.assign({}, this.state.workflow);
        if (obj.pagination) {
            workflow.pathways_down = obj;
        } else {
            obj.pagination = workflow.pagination;
            workflow.pathways_down = obj;
        }

        this.setState({ workflow: workflow });
    }


    changessGSEA(obj) {
        let workflow = Object.assign({}, this.state.workflow);
        if (obj.pagination) {
            workflow.ssGSEA = obj;
        } else {
            obj.pagination = workflow.pagination;
            workflow.ssGSEA = obj;
        }
        this.setState({ workflow: workflow });
    }

    upateCurrentWorkingTabAndObject = (e) => {
        window.current_working_on_object = e;
        sessionStorage.setItem("current_working_on_object", e);
        if (e == "getHistplotBN" || e == "getMAplotsBN" || e == "getBoxplotBN" || e == "getRLE" || e == "getNUSE") {
            sessionStorage.setItem("tag_pre_plot_status", e);
            window.tag_pre_plot_status = e;
        }
        if (e == "getHistplotAN" || e == "getBoxplotAN" || e == "getPCA" || e == "getHistplotBN") {
            sessionStorage.setItem("tag_post_plot_status", e);
            window.tag_post_plot_status = e;
        }
        if (e == "pathways_up" || e == "pathways_down" || e == "deg") {
            sessionStorage.setItem("tag_deg_plot_status", e);
            window.tag_deg_plot_status = e;
        }

    }

    upateCurrentWorkingTab = (e) => {
        sessionStorage.setItem("current_working_on_tag", e);
        window.current_working_on_tag = e;
        let workflow = Object.assign({}, this.state.workflow);
        workflow.tab_activeKey = e;
        this.setState({
            workflow: workflow
        });
    }

    handleGeneChange = (value) => {
        let workflow = Object.assign({}, this.state.workflow);
        let reqBody = {};
        reqBody.projectId = workflow.projectID;
        reqBody.species = value.split("$")[0];
        reqBody.genSet = value.split("$")[1];
        //change button style

        workflow.progressing = true;
        workflow.loading_info = "Running Analysis...";
        this.setState({
            workflow: workflow
        });
        try {
            fetch('./api/analysis/getssGSEAWithDiffGenSet', {
                    method: "POST",
                    body: JSON.stringify(reqBody),
                    credentials: "same-origin",
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                .then(this.handleErrors)
                .then(res => res.json())
                .then(result => {
                    workflow.progressing = false;
                    this.setState({
                        workflow: workflow
                    });

                    if (result.status == 200) {
                        this.getssGSEA();
                    } else {
                        //change button style
                        document.getElementById("message-ssgsea").innerHTML = result.msg;
                    }
                })
        } catch (err) {
            document.getElementById("message-ssgsea").innerHTML = err;
            //change button style
            workflow.progressing = false;
            this.setState({
                workflow: workflow
            });
        }
    }

    changeCode(event) {
        let workflow = Object.assign({}, this.state.workflow);
        workflow.accessionCode = event.target.value;
        this.setState({ workflow: workflow });
    }

    handleSelectType = (value) => {
        let workflow = Object.assign({}, this.state.workflow);
        workflow.analysisType = value;
        this.setState({ workflow: workflow });
    }

    handleGroup1Select = (value) => {
        let workflow = Object.assign({}, this.state.workflow);
        workflow.group_1 = value;
        this.setState({ workflow: workflow });
    }

    handleGroup2Select = (value) => {
        let workflow = Object.assign({}, this.state.workflow);
        workflow.group_2 = value;
        this.setState({ workflow: workflow });
    }

    fileRemove = (file) => {
        let workflow = Object.assign({}, this.state.workflow);
        const index = workflow.fileList.indexOf(file);
        const newFileList = workflow.fileList.slice();
        newFileList.splice(index, 1);
        workflow.fileList = newFileList;
        this.setState({ workflow: workflow });
    }

    beforeUpload = (fl) => {
        let workflow = Object.assign({}, this.state.workflow);
        let names = [];
        workflow.fileList.forEach(function(f) {
            names.push(f.name);
        });
        fl.forEach(function(file) {
            if (names.indexOf(file.name) == -1) {
                workflow.fileList = [...workflow.fileList, file];
            }
        });
        this.setState({ workflow: workflow });
    }

    resetWorkFlowProject = () => {
        let workflow = Object.assign({}, this.state.workflow);
        if (workflow.analysisType == "0") {
            //defaultState.workflow.analysisType = 0;
            document.getElementById("input-access-code").disabled = false;
            document.getElementById("btn-project-load-gse").disabled = false;
            document.getElementById("btn-project-load-gse").className = "ant-btn upload-start ant-btn-primary";
        }
        if (workflow.analysisType == "1") {
            // defaultState.workflow.analysisType = 1;
        }
        defaultState.workflow.analysisType = "0";
        let err_message = document.getElementsByClassName("err-message")

        for (let i = 0; i < err_message.length; i++) {
            err_message[i].innerHTML = ""; // or
        }

        if (document.getElementById("message-gsm") != null) {
            document.getElementById("message-gsm").nextSibling.innerHTML = "Choose an Analysis Type on the left panel and click on the Load button to see a list of GSM displayed here."

        }

        document.getElementById("input-email").value = "";

        document.getElementById("message-success-use-queue").innerHTML = "";
        defaultState.workflow.progressing = false;
        this.setState({ workflow: defaultState.workflow });
    }

    changeLoadingStatus = (progressing, loading_info) => {

        let workflow = Object.assign({}, this.state.workflow);
        workflow.progressing = progressing;
        workflow.loading_info = loading_info;
        this.setState({ workflow: workflow });

    }

    exportGSE = () => {
        let workflow = Object.assign({}, this.state.workflow);
        var wb = XLSX.utils.book_new();
        wb.Props = {
            Title: "Export GSM Data",
            Subject: "GSM Data",
            Author: "Microarray",
            CreatedDate: new Date()
        };
        if (workflow.dataList.length != 0) {
            wb.SheetNames.push("Settings");
            let ws_data = [];
            if (workflow.analysisType == "0") {
                // GSM 
                ws_data.push(["Analysis Type", "GEO Data"]);
                ws_data.push(["Accession Code", workflow.accessionCode]);

            }

            if (workflow.analysisType == "1") {
                // Upload
                ws_data.push(["Analysis Type", "CEL Files"]);

                let uploadD = ""

                for (var i in workflow.dataList) {
                    uploadD = workflow.dataList[i].title + "," + uploadD;
                }

                ws_data.push(["Upload Data", uploadD]);
            }

            let ws = XLSX.utils.aoa_to_sheet(ws_data);
            wb.Sheets["Settings"] = ws;
            wb.SheetNames.push("Results");
            let gsm = [
                ['id', 'gsm', 'title', 'description', 'group']
            ]
            let rawData = workflow.dataList;
            for (var i in rawData) {
                gsm.push([rawData[i].index, rawData[i].gsm, rawData[i].title, rawData[i].description, rawData[i].groups, ])
            }
            var ws2 = XLSX.utils.aoa_to_sheet(gsm);
            wb.Sheets["Results"] = ws2;
            var wbout = XLSX.writeFile(wb, "GSM_" + workflow.projectID + ".xlsx", { bookType: 'xlsx', type: 'binary' });

        }
    }

    loadGSE = () => {

        let workflow = Object.assign({}, this.state.workflow);
        let reqBody = {};
        reqBody.code = "";
        reqBody.projectId = "";
        reqBody.groups = "";

        if (workflow.accessionCode == "") {
            document.getElementById("message-load-accession-code").innerHTML = "Accession Code is required. "
            return;
        } else {
            document.getElementById("message-load-accession-code").innerHTML = ""
        }

        document.getElementById("btn-project-load-gse").className = "ant-btn upload-start ant-btn-default"

        if (workflow.dataList != "") {
            // user click load after data already loaded.then it is a new transaction 
            window.location.reload(true);
        }

        reqBody.code = workflow.accessionCode;


        // this pid will be used to create a tmp folder to store the data. 
        workflow.projectID = this.uuidv4();
        reqBody.projectId = workflow.projectID;


        // mock

        // workflow.projectID = "test";
        // gruop info
        var groups = []
        for (var i in workflow.dataList) {
            if (workflow.dataList[i].group == "") {
                groups.push("Ctl")
            } else {
                groups.push(workflow.dataList[i].group)
            }
        }
        reqBody.groups = groups;

        workflow.uploading = true;
        workflow.progressing = true;
        workflow.loading_info = "Loading GEO Data...";
        this.setState({
            workflow: workflow
        });

        try {
            fetch('./api/analysis/loadGSE', {
                    method: "POST",
                    body: JSON.stringify(reqBody),
                    credentials: "same-origin",
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                .then(this.handleErrors)
                .then(res => res.json())
                .then(result => {
                    if (result.status == 200) {

                        let workflow = Object.assign({}, this.state.workflow);


                        if (result.data === "undefined" || Object.keys(result.data).length === 0) {
                            document.getElementById("btn-project-load-gse").className = "ant-btn upload-start ant-btn-primary"

                            workflow.uploading = false;
                            workflow.progressing = false;
                            document.getElementById("message-gsm").innerHTML = result.data.replace("\\n", "").replace(/"/g, "")
                            document.getElementById("message-gsm").nextSibling.innerHTML = ""
                            this.setState({
                                workflow: workflow
                            });
                            return;
                        }

                        var data = result.data.split("+++loadGSE+++\"")[1]

                        if (typeof(data) === "undefined" || data == "") {
                            document.getElementById("btn-project-load-gse").className = "ant-btn upload-start ant-btn-primary"

                            workflow.uploading = false;
                            workflow.progressing = false;
                            document.getElementById("message-gsm").innerHTML = result.data.replace("\\n", "").replace(/"/g, "")
                            document.getElementById("message-gsm").nextSibling.innerHTML = ""
                            this.setState({
                                workflow: workflow
                            });
                            return;
                        }

                        let list = JSON.parse(decodeURIComponent(data));
                        //let list = result.data;

                        if (typeof(list) == "undefined" || list == null || list.files == null || typeof(list.files) == "undefined" || list.files.length == 0) {
                            document.getElementById("btn-project-load-gse").className = "ant-btn upload-start ant-btn-primary"

                            workflow.uploading = false;
                            workflow.progressing = false;
                            document.getElementById("message-gsm").innerHTML = result.data.replace("\\n", "").replace(/"/g, "")
                            document.getElementById("message-gsm").nextSibling.innerHTML = ""
                            this.setState({
                                workflow: workflow
                            });

                            return;
                        }

                        document.getElementById("message-gsm").innerHTML = ""
                        workflow.uploading = false;
                        workflow.progressing = false;

                        workflow.dataList = list.files;
                        // init group with default value
                        workflow.group = new Array(list.files.length).fill('Ctl');

                        // disable the input , prevent user to change the access code
                        document.getElementById("input-access-code").disabled = true

                        // change the word of load btn
                        document.getElementById("btn-project-load-gse").disabled = true

                        this.setState({
                            workflow: workflow
                        });

                        this.resetGSMDisplay();

                    } else {
                        document.getElementById("btn-project-load-gse").className = "ant-btn upload-start ant-btn-primary"

                        workflow.uploading = false;
                        workflow.progressing = false;
                        this.setState({
                            workflow: workflow
                        });
                        document.getElementById("message-gsm").innerHTML = result.data
                        document.getElementById("message-gsm").nextSibling.innerHTML = ""
                        //message.error('load data fails.');
                    }
                })
                .catch(error => console.log(error));
        } catch (err) {
            //change button style
            document.getElementById("btn-project-load-gse").className = "ant-btn upload-start ant-btn-primary"
            workflow.uploading = false;
            workflow.progressing = false;
            this.setState({
                workflow: workflow
            });
            document.getElementById("message-gsm").innerHTML = err
            document.getElementById("message-gsm").nextSibling.innerHTML = ""

        }
    }


    showModal = () => {
        let workflow = Object.assign({}, this.state.workflow);
        workflow.QueueModalvisible = true;
        this.setState({
            workflow: workflow
        });
    }

    handleCancel = () => {
        let workflow = Object.assign({}, this.state.workflow);
        workflow.QueueModalvisible = false;
        this.setState({
            workflow: workflow
        });
    }


    runContrast = () => {
        let workflow = Object.assign({}, this.state.workflow);
        document.getElementById("message-use-queue").innerHTML = "";
        let reqBody = {};
        reqBody.code = "";
        reqBody.projectId = "";
        reqBody.groups = "";
        reqBody.actions = "";
        reqBody.pPathways = "";
        reqBody.genSet = "";
        reqBody.pssGSEA = "";
        reqBody.foldssGSEA = "";
        reqBody.species = "";
        reqBody.genSet = "";
        reqBody.code = workflow.accessionCode;
        reqBody.projectId = workflow.projectID;
        reqBody.groups = [];
        reqBody.group_1 = workflow.group_1;
        reqBody.group_2 = workflow.group_2;
        if (workflow.uploaded) {
            reqBody.source = "upload";
        } else {
            reqBody.source = "fetch";
        }


        for (var i in workflow.dataList) {
            if (workflow.dataList[i].groups != "") {
                reqBody.groups.push(workflow.dataList[i].groups)
            } else {
                // default value of the group is Ctl
                reqBody.groups.push("Ctl")
            }
        }


        reqBody.genSet = workflow.genSet;
        reqBody.pssGSEA = workflow.pssGSEA;
        reqBody.foldssGSEA = workflow.foldssGSEA;
        reqBody.pPathways = workflow.pPathways;
        reqBody.species = workflow.species;
        reqBody.genSet = workflow.genSet;
        reqBody.sorting = "";
        if (workflow.current_working_on_object) {
            reqBody.targetObject = workflow.current_working_on_object;
        } else {
            reqBody.targetObject = "";
        }

        workflow.progressing = true;
        workflow.loading_info = "Running Contrast...";
        // define action
        reqBody.actions = "runContrast";


        workflow.diff_expr_genes = {
            data: [],
            pagination: {
                current: 1,
                pageSize: 25,

            },
            loading: true,
            page_number: 1,
            page_size: 25,
            sorting: {
                name: "P.Value",
                order: "ascend",
            },
            search_keyword: {
                "search_symbol": "",
                "search_fc": "1.5",
                "search_p_value": "0.05",
                "search_adj_p_value": "",
                "search_aveexpr": "",
                "search_accnum": "",
                "search_desc": "",
                "search_entrez": "",
                "search_probsetid": "",
                "search_t": "",
                "search_b": ""
            }
        };
        reqBody.deg = workflow.diff_expr_genes;
        workflow.ssGSEA = {
            data: [],
            pagination: {
                current: 1,
                pageSize: 25,

            },
            loading: true,
            page_size: 25,
            page_number: 1,
            sorting: {
                name: "P.Value",
                order: "ascend",
            },
            search_keyword: {
                "name": "",
                "search_logFC": "1",
                "search_Avg_Enrichment_Score": "",
                "search_t": "",
                "search_p_value": "0.05",
                "search_adj_p_value": "",
                "search_b": "",
            }
        };
        reqBody.ssGSEA = workflow.ssGSEA;
        workflow.pathways_up = {

            data: [],
            pagination: {
                current: 1,
                pageSize: 25,

            },
            loading: true,
            sorting: {
                name: "P_Value",
                order: "ascend",

            },
            search_keyword: {
                "search_PATHWAY_ID": "",
                "search_SOURCE": "",
                "search_DESCRIPTION": "",
                "search_TYPE": "",
                "search_p_value": "0.05",
                "search_fdr": "",
                "search_RATIO": "",
                "search_GENE_LIST": "",
                "search_NUMBER_HITS": "",
                "search_NUMBER_GENES_PATHWAY": "",
                "search_NUMBER_USER_GENES": "",
                "search_TOTAL_NUMBER_GENES": "",
            }
        };
        reqBody.pathways_up = workflow.pathways_up;
        workflow.pathways_down = {
            data: [],
            pagination: {
                current: 1,
                pageSize: 25,

            },
            loading: true,
            sorting: {
                name: "P_Value",
                order: "ascend",

            },
            search_keyword: {
                "search_PATHWAY_ID": "",
                "search_SOURCE": "",
                "search_DESCRIPTION": "",
                "search_TYPE": "",
                "search_p_value": "0.05",
                "search_fdr": "",
                "search_RATIO": "",
                "search_GENE_LIST": "",
                "search_NUMBER_HITS": "",
                "search_NUMBER_GENES_PATHWAY": "",
                "search_NUMBER_USER_GENES": "",
                "search_TOTAL_NUMBER_GENES": "",
            }
        };
        reqBody.pathways_down = workflow.pathways_down;
        workflow.preplots = {
            histplotBN: "",
            list_mAplotBN: "",
            Boxplots: "",
            RLE: "",
            NUSE: ""
        };
        workflow.postplot = {
            histplotAN: "",
            list_mAplotAN: "",
            Boxplots: "",
            PCA: "",
            Heatmapolt: ""
        };
        workflow.volcanoPlot = "";
        this.setState({
            workflow: workflow
        });

        if (workflow.useQueue) {
            if (document.getElementById("input-email").value == "") {
                document.getElementById("message-use-queue").innerHTML = "Email is required"
                workflow.uploading = false;
                workflow.progressing = false;
                this.setState({
                    workflow: workflow
                });
                return
            } else {
                reqBody.email = document.getElementById("input-email").value
            }
            try {
                fetch('./api/analysis/qAnalysis', {
                        method: "POST",
                        body: JSON.stringify(reqBody),
                        credentials: "same-origin",
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    }).then(this.handleErrors)
                    .then(function(response) {
                        if (!response.ok) {
                            throw Error(response.statusText);
                        }
                        return response.json();
                    }).then(result => {
                        if (result.status == 200) {

                        }
                        workflow.uploading = false;
                        workflow.progressing = false;
                        workflow.QueueModalvisible = true;
                        this.setState({
                            workflow: workflow
                        });
                    })


            } catch (err) {

                workflow.uploading = false;
                workflow.progressing = false;
                console.log(err);
                document.getElementById("message-use-queue").innerHTML = err

                this.setState({
                    workflow: workflow
                });
            }

        } else {
            try {
                fetch('./api/analysis/runContrast', {
                        method: "POST",
                        body: JSON.stringify(reqBody),
                        credentials: "same-origin",
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    }).then(this.handleErrors)
                    .then(function(response) {
                        if (!response.ok) {
                            throw Error(response.statusText);
                        }
                        return response.json();
                    }).then(result => {
                        if (result.status == 200) {

                            let type = window.current_working_on_object;

                            if (window.current_working_on_tag == "" || window.current_working_on_tag == "GSM_1") {
                                // means  I open the GSM
                            }

                            if (window.current_working_on_tag == "Pre-normalization_QC_Plots") {
                                // means  I open the Pre-plot
                                type = window.tag_pre_plot_status;
                            }

                            if (window.current_working_on_tag == "Post-normalization_Plots") {
                                // means  I open the Post-plot
                                type = window.tag_post_plot_status;
                            }

                            if (window.current_working_on_tag == "DEG-Enrichments_Results") {
                                // means  I open the DEG
                                type = window.tag_deg_plot_status;
                            }

                            if (window.current_working_on_tag == "ssGSEA_Results") {
                                // means  I open the ssGSEA_Results
                                type = "ssGSEA_Results";
                            }

                            if (result.data.mAplotBN != "") {
                                workflow.list_mAplotBN = result.data.mAplotBN;
                            }

                            if (result.data.mAplotAN != "") {
                                workflow.list_mAplotAN = result.data.mAplotAN;
                            }

                            switch (type) {
                                case "getHistplotAN":
                                    this.getHistplotAN();
                                    break;

                                case "getBoxplotAN":
                                    this.getBoxplotAN();
                                    break;

                                case "getMAplotAN":
                                    this.getMAplotAN();
                                    break;

                                case "getPCA":
                                    this.getPCA();
                                    break;

                                case "getHeatmapolt":
                                    this.getHeatmapolt();
                                    break;

                                case "getHistplotBN":
                                    this.getHistplotBN();
                                    break;

                                case "getMAplotsBN":
                                    this.getMAplotsBN();
                                    break;

                                case "getBoxplotBN":
                                    this.getBoxplotBN();
                                    break;
                                case "getRLE":
                                    this.getRLE();
                                    break;
                                case "getNUSE":
                                    this.getNUSE();
                                    break;

                                case "pathwayHeatMap":
                                    workflow.geneHeatmap = "/ssgseaHeatmap1.jpg";
                                    break;
                                case "pathways_up":
                                    this.getPathwayUp()
                                    break;
                                case "pathways_down":
                                    this.getPathwayDown();
                                    break;
                                case "ssGSEA":
                                    this.getssGSEA();
                                    break;
                                case "deg":
                                    this.getDEG();
                                    break;
                                case "Pre-normalization_QC_Plots":
                                    this.getHistplotBN();
                                    break;
                                case "Post-normalization_Plots":
                                    this.getHistplotAN();
                                    break;
                                case "DEG-Enrichments_Results":
                                    this.getDEG();
                                    break;
                                case "GSM_1":
                                    // do nothing
                                    break;
                                case "ssGSEA_Results":
                                    this.getssGSEA();
                                    break;
                            }

                            workflow.volcanoPlot = "/volcano.html";
                            workflow.geneHeatmap = "/ssgseaHeatmap1.jpg";
                            workflow.compared = true;
                            workflow.done_gsea = true;
                            workflow.progressing = false;
                            this.setState({
                                workflow: workflow
                            });

                            this.hideWorkFlow();
                        } else {

                            workflow.progressing = false;
                            this.setState({
                                workflow: workflow
                            });

                        }

                    }).catch(error => console.log(error));
            } catch (err) {

                workflow.uploading = false;
                workflow.progressing = false;
                console.log(err);
                this.setState({
                    workflow: workflow
                });
            }


        }

    }


    handleUpload = () => {
        let workflow = Object.assign({}, this.state.workflow);
        const fileList = workflow.fileList;
        const formData = new FormData();


        // this pid will be used to create a tmp folder to store the data. 
        workflow.projectID = this.uuidv4();
        formData.append('projectId', workflow.projectID)

        fileList.forEach((file) => {
            formData.append('cels', file);
        });

        workflow.uploading = true;
        workflow.progressing = true;
        this.setState({
            workflow: workflow
        });

        document.getElementById("btn-project-upload").className = "ant-btn upload-start ant-btn-default"


        try {
            fetch('./api/analysis/upload', {
                    method: "POST",
                    body: formData,
                    processData: false,
                    contentType: false
                })
                .then(this.handleErrors)
                .then(res => res.json())
                .then(result => {
                    if (result.status == 200) {
                        var data = result.data.split("+++getCELfiles+++\"")[1]

                        if (typeof(data) === "undefined" || data == "") {

                            workflow.uploading = false;
                            workflow.progressing = false;
                            document.getElementById("message-gsm").innerHTML = result.msg;
                            document.getElementById("message-gsm").nextSibling.innerHTML = ""
                            this.setState({
                                workflow: workflow
                            });
                            return;
                        }

                        let list = JSON.parse(decodeURIComponent(data));

                        //let list = result.data;
                        workflow.uploading = false;
                        workflow.progressing = false;
                        if (list.files == null || typeof(list.files) == "undefined" || list.files.length == 0) {
                            document.getElementById("message-gsm").innerHTML = "load data fails.";
                            document.getElementById("message-gsm").nextSibling.innerHTML = ""
                            return;
                        }
                        for (let i in list.files) {
                            list.files[i]["gsm"] = list.files[i]["_row"];
                            list.files[i]["groups"] = "";
                            //list.files[i]["gsm"]=list.files[i].title.split("_")[0];
                        }
                        workflow.dataList = list.files;


                        // init group with default value
                        //workflow.group = new Array(list.files.length).fill('Ctl');
                        workflow.uploaded = true;
                        this.setState({
                            workflow: workflow
                        });
                    } else {

                        workflow.uploading = false;
                        workflow.progressing = false;
                        workflow.uploaded = true;
                        this.setState({
                            workflow: workflow
                        });
                        document.getElementById("message-gsm").innerHTML = result.msg;
                        document.getElementById("message-gsm").nextSibling.innerHTML = ""
                    }
                }).catch(error => console.log(error));
        } catch (error) {


            workflow.uploading = false;
            workflow.progressing = false;
            workflow.uploaded = true;
            this.setState({
                workflow: workflow
            });
            document.getElementById("message-gsm").innerHTML = error;
            document.getElementById("message-gsm").nextSibling.innerHTML = ""
        }

    }
    assignGroup = (group_name, dataList_keys) => {
        // validate group_name
        let pattern = /^[a-zA-Z]+\_?[a-zA-Z0-9]*$|^[a-zA-Z]+[0-9]*$/g
        if (group_name.match(pattern)) {
            let workflow = Object.assign({}, this.state.workflow);
            for (var key in dataList_keys) {
                workflow.dataList[dataList_keys[key] - 1].groups = group_name;
            }
            document.getElementById("message-gsm-group").innerHTML = ""

            this.setState({
                workflow: workflow
            });


        } else {
            document.getElementById("message-gsm-group").innerHTML = "The group name only allows ASCII or numbers or underscore and it cannot start with numbers. Valid Group Name Example : RNA_1 "

            return false;
        }

    }

    deleteGroup = (group_name) => {

        let workflow = Object.assign({}, this.state.workflow);
        for (var key in workflow.dataList) {
            if (workflow.dataList[key].groups == group_name) {
                workflow.dataList[key].groups = ""
            }
        }
        this.setState({
            workflow: workflow
        });

    }

    resetGSMDisplay = () => {
        while (document.getElementById("tab_analysis").getElementsByClassName("ant-tabs-tabpane")[0].getElementsByClassName("ant-table-pagination")[0] == "undefined") {
            console.log("watch gsm display")
        }
        let width = document.getElementById("tab_analysis").getElementsByClassName("ant-tabs-tabpane")[0].getElementsByClassName("ant-table-pagination")[0].offsetWidth + 125;
        document.getElementById("gsm-select").style.right = width;

    }

    resetDEGDisplay = () => {
        while (document.getElementById("deg_tag1").getElementsByClassName("ant-table-pagination")[0] == "undefined") {
            console.log("watch deg display")
        }
        let width = document.getElementById("deg_tag1").getElementsByClassName("ant-table-pagination")[0].offsetWidth + 125;
        document.getElementById("deg-select").style.right = width;
    }

    resetPathWayUPDisplay = () => {
        while (document.getElementById("deg_tag2").getElementsByClassName("ant-table-pagination")[0] == "undefined") {
            console.log("watch pathways_up display")
        }
        let width = document.getElementById("deg_tag2").getElementsByClassName("ant-table-pagination")[0].offsetWidth + 125;
        document.getElementById("pathways-up-select").style.right = width;
    }

    resetPathWayDownDisplay = () => {
        while (document.getElementById("deg_tag3").getElementsByClassName("ant-table-pagination")[0] == "undefined") {
            console.log("watch pathways_down display")
        }

        let width = document.getElementById("deg_tag3").getElementsByClassName("ant-table-pagination")[0].offsetWidth + 125;
        document.getElementById("pathways-down-select").style.right = width;

    }


    resetSSGSEADisplay = () => {
        while (document.getElementById("tab_analysis").getElementsByClassName("ant-tabs-tabpane")[4].getElementsByClassName("ant-table-pagination")[0] == "undefined") {
            console.log("watch SSGSEA display")
        }
        let width = document.getElementById("tab_analysis").getElementsByClassName("ant-tabs-tabpane")[4].getElementsByClassName("ant-table-pagination")[0].offsetWidth + 125;
        document.getElementById("ss-select").style.right = width;
    }


    handleErrors = (response) => {
        if (!response.ok) {
            throw Error(response.statusText);
        }
        return response;
    }

    hideWorkFlow = () => {
        document.getElementsByClassName("container-board-left")[0].style.display = 'none';
        document.getElementsByClassName("container-board-right")[0].style.width = document.getElementById("header-nci").offsetWidth - 80;
        document.getElementById("panel-show").style.display = 'inherit';
        document.getElementById("panel-hide").style.display = 'none';
    }

    showWorkFlow = () => {
        document.getElementsByClassName("container-board-left")[0].style.display = 'block';
        document.getElementsByClassName("container-board-right")[0].removeAttribute("style");
        document.getElementById("panel-show").style.display = 'none';
        document.getElementById("panel-hide").style.display = 'inherit';
    }

    changeTab(tab) {
        console.log(tab)
        if (document.getElementById("li-about") != null) {
            if (tab == "about") {
                document.getElementById("li-about").className = "active"
                document.getElementById("li-analysis").className = ""
                document.getElementById("li-help").className = ""

                document.getElementById("tab_about").className = ""
                document.getElementById("tab_analysis").className = "hide"
                document.getElementById("tab_help").className = "hide"
            }

            if (tab == "analysis") {
                document.getElementById("li-about").className = ""
                document.getElementById("li-analysis").className = "active"
                document.getElementById("li-help").className = ""

                document.getElementById("tab_about").className = "hide"
                document.getElementById("tab_analysis").className = ""
                document.getElementById("tab_help").className = "hide"
            }

            if (tab == "help") {
                document.getElementById("tab_about").className = "hide"
                document.getElementById("tab_analysis").className = "hide"
                document.getElementById("tab_help").className = ""

                document.getElementById("li-about").className = ""
                document.getElementById("li-analysis").className = ""
                document.getElementById("li-help").className = "active"
            }
        }

    }

    initWithCode(code) {

        let workflow = Object.assign({}, this.state.workflow);
        let reqBody = {};

        reqBody.projectId = code;


        workflow.progressing = true;
        workflow.loading_info = "Running Contrast...";

        workflow.diff_expr_genes = {
            data: [],
            pagination: {
                current: 1,
                pageSize: 25,

            },
            loading: true,
            page_number: 1,
            page_size: 25,
            sorting: {
                name: "P.Value",
                order: "ascend",
            },
            search_keyword: {
                "search_symbol": "",
                "search_fc": "1.5",
                "search_p_value": "0.05",
                "search_adj_p_value": "",
                "search_aveexpr": "",
                "search_accnum": "",
                "search_desc": "",
                "search_entrez": "",
                "search_probsetid": "",
                "search_t": "",
                "search_b": ""
            }
        };

        workflow.ssGSEA = {
            data: [],
            pagination: {
                current: 1,
                pageSize: 25,

            },
            loading: true,
            page_size: 25,
            page_number: 1,
            sorting: {
                name: "P.Value",
                order: "ascend",
            },
            search_keyword: {
                "name": "",
                "search_logFC": "1",
                "search_Avg_Enrichment_Score": "",
                "search_t": "",
                "search_p_value": "0.05",
                "search_adj_p_value": "",
                "search_b": "",
            }
        };

        workflow.pathways_up = {

            data: [],
            pagination: {
                current: 1,
                pageSize: 25,

            },
            loading: true,
            sorting: {
                name: "P_Value",
                order: "ascend",

            },
            search_keyword: {
                "search_PATHWAY_ID": "",
                "search_SOURCE": "",
                "search_DESCRIPTION": "",
                "search_TYPE": "",
                "search_p_value": "0.05",
                "search_fdr": "",
                "search_RATIO": "",
                "search_GENE_LIST": "",
                "search_NUMBER_HITS": "",
                "search_NUMBER_GENES_PATHWAY": "",
                "search_NUMBER_USER_GENES": "",
                "search_TOTAL_NUMBER_GENES": "",
            }
        };

        workflow.pathways_down = {
            data: [],
            pagination: {
                current: 1,
                pageSize: 25,

            },
            loading: true,
            sorting: {
                name: "P_Value",
                order: "ascend",

            },
            search_keyword: {
                "search_PATHWAY_ID": "",
                "search_SOURCE": "",
                "search_DESCRIPTION": "",
                "search_TYPE": "",
                "search_p_value": "0.05",
                "search_fdr": "",
                "search_RATIO": "",
                "search_GENE_LIST": "",
                "search_NUMBER_HITS": "",
                "search_NUMBER_GENES_PATHWAY": "",
                "search_NUMBER_USER_GENES": "",
                "search_TOTAL_NUMBER_GENES": "",
            }
        };

        workflow.preplots = {
            histplotBN: "",
            list_mAplotBN: "",
            Boxplots: "",
            RLE: "",
            NUSE: ""
        };
        workflow.postplot = {
            histplotAN: "",
            list_mAplotAN: "",
            Boxplots: "",
            PCA: "",
            Heatmapolt: ""
        };
        workflow.volcanoPlot = "";
        workflow.progressing = true;
        workflow.loading_info = "Loading...";
        this.setState({
            workflow: workflow
        });

        try {
            fetch('./api/analysis/getResultByProjectId', {
                    method: "POST",
                    body: JSON.stringify(reqBody),
                    credentials: "same-origin",
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }).then(this.handleErrors)
                .then(function(response) {
                    if (!response.ok) {
                        throw Error(response.statusText);
                    }
                    return response.json();
                }).then(result => {
                    if (result.status == 200) {
                        result = result.data;
                        let workflow2 = Object.assign({}, this.state.workflow);
                        workflow2.dataList = result.gsm;
                        workflow2.accessionCode = result.accessionCode;
                        workflow2.projectID = result.projectId;
                        workflow2.group_1 = result.group_1;
                        workflow2.group_2 = result.group_2;
                        workflow2.groups = result.groups;

                        for (let i in workflow2.dataList) {
                            if (result.groups[i] == "Ctl") {
                                workflow2.dataList[i].groups = "";
                            } else {
                                workflow2.dataList[i].groups = result.groups[i];
                            }

                        }

                        if (result.mAplotBN) {
                            workflow2.list_mAplotBN = result.mAplotBN;
                        }

                        if (result.mAplotAN) {
                            workflow2.list_mAplotAN = result.mAplotAN;
                        }
                        workflow2.init = true;
                        workflow2.volcanoPlot = "/volcano.html";
                        workflow2.geneHeatmap = "/ssgseaHeatmap1.jpg";
                        workflow2.compared = true;
                        workflow2.done_gsea = true;
                        workflow2.progressing = false;

                        this.setState({
                            workflow: workflow2
                        });

                        this.hideWorkFlow();

                        this.resetGSMDisplay();

                    } else {
                        workflow.progressing = false;
                        this.setState({
                            workflow: workflow
                        });
                    }
                }).catch(error => console.log(error));
        } catch (err) {
            workflow.uploading = false;
            workflow.progressing = false;
            console.log(err);
            this.setState({
                workflow: workflow
            });
        }
    }


    getCurrentNumberOfJobsinQueue = () => {

        fetch('./api/analysis/getCurrentNumberOfJobsinQueue', {
                method: "POST",
                credentials: "same-origin",
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(this.handleErrors)
            .then(function(response) {
                if (!response.ok) {
                    throw Error(response.statusText);
                }
                return response.json();
            }).then(result => {
                if (result.status == 200) {
                    result = result.data;
                    let workflow = Object.assign({}, this.state.workflow);
                    workflow.numberOfTasksInQueue = result;
                    this.setState({
                        workflow: workflow
                    });
                } else {
                    // do nothing
                }
            }).catch(error => console.log(error));

    }

    render() {


        // define group modal
        let queueModal = <Modal key="queue_modal" visible={this.state.workflow.QueueModalvisible}  className="custom_modal" title="MicroArray Queue" onCancel={this.handleCancel}
        footer={[
            <Button key="back" type="primary"  onClick={this.handleCancel}>Close</Button>,
          ]}
        > <div >
          <p> Your job will be sent to the queuing system for processing. Results will be sent to you via email when all model runs are completed </p>
          <p>Please note: Depending on model complexity and queue length it could be up to a day before you receive your results.</p>
          </div>
        </Modal>
        // end  group modal



        let modal = this.state.workflow.progressing ? "progress" : "progress-hidden";
        const antIcon = <Icon type="loading" style={{ fontSize: 48, width:48,height:48 }} spin  />;
        let tabs = <div> <div className="header-nav">
            <div className="div-container">
                <ul className="nav navbar-nav" id="header-navbar">
                    <li  onClick={() => {this.changeTab('about')}}  id="li-about" className="active"> <a href="#about" className="nav-link" >ABOUT</a></li>
                    <li  onClick={() => {this.changeTab('analysis')}}  id="li-analysis" className=""> <a href="#analysis"  className="nav-link">ANALYSIS</a></li>
                    <li  onClick={() => {this.changeTab('help')}}  id="li-help" className="" > <a href="#help"  className="nav-link">HELP</a></li>
                </ul>
            
            </div>
        </div>
        <div className="content">
                <div id="tab_about" > <About/></div>
                <div id="tab_help" className="hide" > <Help/></div>
                <div id="tab_analysis" className="hide">
                <div className="container container-board">
                  <Workflow data={this.state.workflow}
                       
                        resetWorkFlowProject={this.resetWorkFlowProject}  
                        changeCode={this.changeCode} 
                        handleSelectType={this.handleSelectType} 
                         changeRUNContractModel={this.changeRUNContractModel} 
                        fileRemove={this.fileRemove} 
                        beforeUpload={this.beforeUpload} 
                        handleUpload={this.handleUpload} 
                        loadGSE={this.loadGSE} 
                        handleGroup1Select={this.handleGroup1Select}  
                        handleGroup2Select={this.handleGroup2Select} 
                        runContrast={this.runContrast}
                        exportGSE={this.exportGSE}/>

                    <div id="btn-controll-data-table-display">
                      <a  aria-label="panel display controller " id="panel-hide" onClick={this.hideWorkFlow} size="small" ><Icon type="caret-left" /></a>
                      <a  aria-label="panel display controller" id="panel-show" onClick={this.showWorkFlow}  size="small" style={{"display":"none"}}><Icon type="caret-right" /></a>

                  </div>
                  <DataBox  data={this.state.workflow} 
                            upateCurrentWorkingTabAndObject={this.upateCurrentWorkingTabAndObject} 
                            upateCurrentWorkingTab={this.upateCurrentWorkingTab}
                            assignGroup={this.assignGroup} 
                            deleteGroup={this.deleteGroup}
                        
                            handleGeneChange={this.handleGeneChange} 
                            changessGSEA={this.changessGSEA}
                            changeLoadingStatus ={this.changeLoadingStatus}

                            getHistplotBN={this.getHistplotBN}
                            getMAplotsBN={this.getMAplotsBN}
                            getBoxplotBN={this.getBoxplotBN}
                            getRLE={this.getRLE}
                            getNUSE={this.getNUSE}

                             getBoxplotAN={this.getBoxplotAN}
                             getMAplotAN={this.getMAplotAN}
                             getHistplotAN={this.getHistplotAN}
                             getPCA={this.getPCA}
                             getHeatmapolt={this.getHeatmapolt}

                             getDEG={this.getDEG}
                             getPathwayUp={this.getPathwayUp}
                             getPathwayDown={this.getPathwayDown}
                             getssGSEA={this.getssGSEA}
                               exportGSE={this.exportGSE}
                              exportGSEA={this.exportGSEA}
                              exportPathwayUp={this.exportPathwayUp}
                              exportPathwayDown={this.exportPathwayDown}
                              exportDEG={this.exportDEG}
                             
                            />
                </div>
                <div className={modal}>
                    <div style={{
                        "width": "180px",
                        "height": "175px",
                        "background": "#efefef",
                        "position": "absolute",
                        "left": "calc(50% - 80px)",
                        "padding": "2%",
                        "borderRadius": "50%"}}>
                    <Spin indicator={antIcon} style={{color:"black"}} aria-label="loading"/>
                    <label className="loading-info" aria-label="loading-info">{this.state.workflow.loading_info}</label>
                    </div>
                </div>
            </div>
            </div>
        </div>


        if (this.props.location.search && this.props.location.search != "") {
            tabs = <div><div className="header-nav">
            <div className="div-container">
                <ul className="nav navbar-nav" id="header-navbar">
                    <li  onClick={() => {this.changeTab('about')}}  id="li-about"> <a href="#about" className="nav-link" >About</a></li>
                    <li  onClick={() => {this.changeTab('analysis')}}  id="li-analysis" className="active"> <a href="#analysis"  className="nav-link">Analysis</a></li>
                    <li  onClick={() => {this.changeTab('help')}}  id="li-help" className="" > <a href="#help"  className="nav-link">Help</a></li>
                </ul>
            
            </div>
        </div>
        <div className="content">
                <div id="tab_about" className="hide"> <About/></div>
                <div id="tab_help" className="hide"> <Help/></div>
                <div id="tab_analysis">
                <div className="container container-board">
                  <Workflow data={this.state.workflow}
                       
                        resetWorkFlowProject={this.resetWorkFlowProject}  
                        changeCode={this.changeCode} 
                        handleSelectType={this.handleSelectType}  
                        fileRemove={this.fileRemove} 
                        beforeUpload={this.beforeUpload} 
                        handleUpload={this.handleUpload} 
                        loadGSE={this.loadGSE} 
                        changeRUNContractModel={this.changeRUNContractModel}
                        handleGroup1Select={this.handleGroup1Select}  
                        handleGroup2Select={this.handleGroup2Select} 
                        runContrast={this.runContrast}
                        exportGSE={this.exportGSE}
                        />

                    <div id="btn-controll-data-table-display">
                      <a  aria-label="panel display controller " id="panel-hide" onClick={this.hideWorkFlow} size="small" ><Icon type="caret-left" /></a>
                      <a  aria-label="panel display controller" id="panel-show" onClick={this.showWorkFlow}  size="small" style={{"display":"none"}}><Icon type="caret-right" /></a>

                  </div>
                  <DataBox  data={this.state.workflow} 
                            upateCurrentWorkingTabAndObject={this.upateCurrentWorkingTabAndObject} 
                            upateCurrentWorkingTab={this.upateCurrentWorkingTab}
                            assignGroup={this.assignGroup} 
                            deleteGroup={this.deleteGroup}
                        
                            handleGeneChange={this.handleGeneChange} 
                            changessGSEA={this.changessGSEA}
                            changeLoadingStatus ={this.changeLoadingStatus}

                            getHistplotBN={this.getHistplotBN}
                            getMAplotsBN={this.getMAplotsBN}
                            getBoxplotBN={this.getBoxplotBN}
                            getRLE={this.getRLE}
                            getNUSE={this.getNUSE}

                             getBoxplotAN={this.getBoxplotAN}
                             getMAplotAN={this.getMAplotAN}
                             getHistplotAN={this.getHistplotAN}
                             getPCA={this.getPCA}
                             getHeatmapolt={this.getHeatmapolt}

                             getDEG={this.getDEG}
                             getPathwayUp={this.getPathwayUp}
                             getPathwayDown={this.getPathwayDown}
                             getssGSEA={this.getssGSEA}

                              exportGSE={this.exportGSE}
                              exportGSEA={this.exportGSEA}
                              exportPathwayUp={this.exportPathwayUp}
                              exportPathwayDown={this.exportPathwayDown}
                              exportDEG={this.exportDEG}
                                                         
                            />
                </div>
                <div className={modal}>
                    <div style={{
                        "width": "180px",
                        "height": "175px",
                        "background": "#efefef",
                        "position": "absolute",
                        "left": "calc(50% - 80px)",
                        "padding": "2%",
                        "borderRadius": "50%"}}>
                    <Spin indicator={antIcon} style={{color:"black"}} aria-label="loading"/>
                    <label className="loading-info" aria-label="loading-info">{this.state.workflow.loading_info}</label>
                    </div>
                </div>
            </div>
            </div>
           
             </div>

        }
        return (<div>{tabs}{queueModal}</div>);
    }
}

export default Analysis;