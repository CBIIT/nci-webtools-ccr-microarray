import { Spin, Icon, Button, Modal, Collapse } from 'antd';
import React, { Component } from 'react';
import Workflow from '../Workflow/Workflow';
import DataBox from '../DataBox/DataBox';
import About from '../About/About';
import Help from '../Help/Help';
import Plot from 'react-plotly.js';
import XLSX from 'xlsx';
import imageExists from 'image-exists';
import MAPlot from "../DataBox/MAPlot";
import CIframe from "../DataBox/CIframe";

const ButtonGroup = Button.Group;

const httpErrorMessage = {
    400: "Bad Request",
    401: "Unauthorized",
    404: "Not Found",
    403: "Forbidden",
    405: "Method Not Allowed",
    408: "Request Timeout",
    500: "Internal Server Error",
    501: "Not Implemented",
    502: "Bad Gateway",
    503: "Service Unavailable",
    504: "Gateway Timeout",
    505: "HTTP Version Not Supported"
}


const defaultState = {
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
                pageSize: 25
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
                "search_logFC": "",
                "search_Avg_Enrichment_Score": "",
                "search_t": "",
                "search_p_value": "",
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
        BoxplotBN: {
            data: "",
            plot: "",
            style: {
                width: "800",
            },
            layout: {
                showlegend: false,
                autosize: true,
            },
        },
        RLE: {
            data: "",
            plot: "",
            style: {
                width: "800",
            },
            layout: {
                showlegend: false,
                autosize: true,
            },
        },
        NUSE: {
            data: "",
            plot: "",
            style: {
                width: "800",
            },
            layout: {
                showlegend: false,
                autosize: true,
            },
        },
        preplots: {
            histplotBN: "",
            list_mAplotBN: "",
            NUSE: "",
            RLE: "",
            Boxplots: "",
            list_mAplotBN: "",
            histplotBN: "",
        },
        list_mAplotBN: "",
        list_mAplotAN: "",
        BoxplotAN: {
            data: "",
            plot: "",
            style: {
                width: "800",
            },
            layout: {
                showlegend: false,
                autosize: true,
            },
        },
        PCA: {
            data: "",
            plot: "",
            style: {},
            layout: {},
        },
        postplot: {
            histplotAN: "",
            list_mAplotAN: "",
            histplotAN: "",
            list_mAplotAN: "",
            Heatmapolt: "",
            Boxplots: "",
            PCA: ""
        },
        geneHeatmap: "Not enough significant pathways available with p-value < 0.05.",
        volcanoPlot: "No Data",
        volcanoPlotName: "/volcano.html",
        normal: "RMA",
        histplotBN_url: "",
        histplotAN_url: "",
        heatmapolt_url: ""
    }
};


class Analysis extends Component {

    constructor(props) {
        super(props);
        this.state = Object.assign({}, defaultState);
        this.getCurrentNumberOfJobsinQueue();
    }
    componentDidMount() {
        if (this.props.location.search && this.props.location.search != "") {
            this.state = Object.assign({}, defaultState);
            this.state.workflow.progressing = true;
            this.initWithCode(this.props.location.search.substring(1, this.props.location.search.length));
        }
        // listen windows resize event
        window.addEventListener("resize", this.updateDimensions);
        this.updateSupportEmail();
    }
    componentDidCatch(error, info) {
        // Display fallback UI
        this.resetWorkFlowProject();
        document.getElementById("message-gsm").innerHTML = error;
        document.getElementById("message-gsm").nextSibling.innerHTML = "";
    }
    // release the listener
    componentWillUnmount() {
        window.removeEventListener("resize", this.updateDimensions);
    }
    updateDimensions = () => {
        // reset container-board-right
        if ((document.body.clientWidth - document.getElementsByClassName("container-board-left")[0].clientWidth) < 300) {
            // mobile model
            document.getElementsByClassName("container-board-right")[0].style.width = document.getElementsByClassName("container-board-left")[0].clientWidth + "px";
        } else {
            document.getElementsByClassName("container-board-right")[0].style.width = this.getElementByXpath('//*[@id="tab_analysis"]/div[1]').clientWidth - document.getElementsByClassName("container-board-left")[0].clientWidth - 80 + "px";
        }
    }
    getElementByXpath = (path) => {
        return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    }
    changeRunContrastMode = (params = false) => {
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

    updateSupportEmail = () => {
        fetch('./api/analysis/getConfiguration', {
                method: "POST",
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
                    // change 
                    document.getElementById("support_email").href = "mailto:" + result.data.mail.support_email + "?subject=MicroArray Support";
                }
            })

    }
    exportGSEA = (params = {}) => {
        let workflow = Object.assign({}, this.state.workflow);
        params = {
            projectId: workflow.projectID,
            page_size: 999999999,
            page_number: 1,
            sorting: {
                name: workflow.ssGSEA.sorting.name,
                order: workflow.ssGSEA.sorting.order,
            },
            search_keyword: workflow.ssGSEA.search_keyword
        };
        workflow.progressing = true;
        workflow.loading_info = "Export";
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
                        if (workflow.analysisType == "0") {
                            ws_data.push(["Analysis Type", "GEO Data"])
                            ws_data.push(["Accession Code", workflow.accessionCode])
                        }
                        ws_data.push(["Contrasts", workflow.group_1 + " vs " + workflow.group_2])
                        let group_1_gsm = "";
                        let group_2_gsm = "";
                        for (var i in workflow.dataList) {
                            if (workflow.dataList[i].groups == workflow.group_1) {
                                group_1_gsm = workflow.dataList[i].gsm + "," + group_1_gsm;
                            }

                            if (workflow.dataList[i].groups == workflow.group_2) {
                                group_2_gsm = workflow.dataList[i].gsm + "," + group_2_gsm;
                            }
                        }
                        ws_data.push([workflow.group_1, group_1_gsm])
                        ws_data.push([workflow.group_2, group_2_gsm])
                        ws_data.push(["Type", "Single Sample GSEA"])
                        ws_data.push(["Filters", ""])
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
                                degData[i]["V1"],
                                degData[i]["V2"],
                                degData[i]["V3"],
                                degData[i]["V4"],
                                degData[i]["V5"],
                                degData[i]["V6"],
                                degData[i]["V7"]
                            ])
                        }
                        var ws2 = XLSX.utils.aoa_to_sheet(exportData);
                        wb.Sheets["Results"] = ws2;
                        var wbout = XLSX.writeFile(wb, "ssGSEA_" + workflow.projectID + ".xlsx", { bookType: 'xlsx', type: 'binary' });
                    }

                } else {
                    document.getElementById("message-ssgsea").innerHTML = result.msg
                }
                workflow.progressing = false;
                workflow.loading_info = "Loading";
                this.setState({ workflow: workflow });
            }).catch(function(err) {
                let workflow = Object.assign({}, this.state.workflow);
                workflow.progressing = false;
                workflow.loading_info = "Loading";
                this.setState({ workflow: workflow });
                document.getElementById("message-ssgsea").innerHTML = err;
            });
    }
    getssGSEA = (params = {}) => {
        let workflow = Object.assign({}, this.state.workflow);
        if (params.sorting) {
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
            workflow.ssGSEA.sorting = params.sorting;
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
            params.sorting = workflow.ssGSEA.sorting;
            params.search_keyword = workflow.ssGSEA.search_keyword;
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
                if (result.status == 200) {
                    const pagination = { ...workflow2.ssGSEA.pagination };
                    pagination.total = result.data.totalCount;
                    for (let i = 0; i < result.data.records.length; i++) {
                        result.data.records[i].key = "GSEA" + i;
                    }
                    workflow2.ssGSEA.loading = false;
                    workflow2.ssGSEA.data = result.data.records;
                    workflow2.ssGSEA.pagination = pagination;
                    this.setState({ workflow: workflow2 });
                    this.getSSGSEAGeneHeatMap();
                } else {
                    document.getElementById("message-ssgsea").innerHTML = result.msg
                }
            }).catch(error => {
                let workflow = Object.assign({}, this.state.workflow);
                workflow.ssGSEA.loading = false;
                this.setState({ workflow: workflow });
                document.getElementById("message-ssgsea").innerHTML = error;
            })
    }
    exportPathwayUp = (params = {}) => {
        let workflow = Object.assign({}, this.state.workflow);
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
        workflow.progressing = true;
        workflow.loading_info = "Export";
        this.setState({ workflow: workflow });
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
                            ws_data.push(["Analysis Type", "CEL Files"]);

                            let uploadD = ""

                            for (var i in workflow.dataList) {
                                uploadD = workflow.dataList[i].title + "," + uploadD;
                            }

                            ws_data.push(["Upload Data", uploadD]);
                        }
                        if (workflow.analysisType == "0") {
                            ws_data.push(["Analysis Type", "GEO Data"])
                            ws_data.push(["Accession Code", workflow.accessionCode])
                        }

                        ws_data.push(["Contrasts", workflow.group_1 + " vs " + workflow.group_2])
                        let group_1_gsm = "";
                        let group_2_gsm = "";
                        for (var i in workflow.dataList) {
                            if (workflow.dataList[i].groups == workflow.group_1) {
                                group_1_gsm = workflow.dataList[i].gsm + "," + group_1_gsm;
                            }

                            if (workflow.dataList[i].groups == workflow.group_2) {
                                group_2_gsm = workflow.dataList[i].gsm + "," + group_2_gsm;
                            }
                        }
                        ws_data.push([workflow.group_1, group_1_gsm])
                        ws_data.push([workflow.group_2, group_2_gsm])
                        ws_data.push(["Type", "Pathways_For_Upregulated_Genes"])

                        ws_data.push(["Filters", ""])

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
                        if (workflow.pathways_up.search_keyword.search_NUMBER_USER_GENES != "") {
                            ws_data.push(["Number_User_Genes", workflow.pathways_up.search_keyword.search_NUMBER_USER_GENES])
                        }
                        if (workflow.pathways_up.search_keyword.search_TOTAL_NUMBER_GENES != "") {
                            ws_data.push(["Total_Number_Genes", workflow.pathways_up.search_keyword.search_TOTAL_NUMBER_GENES])
                        }
                        if (workflow.pathways_up.search_keyword.search_GENE_LIST != "") {
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
                        var wbout = XLSX.writeFile(wb, "DEG_" + workflow.projectID + ".xlsx", { bookType: 'xlsx', type: 'binary' });
                    }
                } else {
                    document.getElementById("message-pug").innerHTML = "export PathwayUp fails";
                }
                workflow.progressing = false;
                workflow.loading_info = "Loading";
                this.setState({ workflow: workflow });

            }).catch(error => {
                let workflow = Object.assign({}, this.state.workflow);
                workflow.progressing = false;
                workflow.loading_info = "Loading";
                this.setState({ workflow: workflow });
                document.getElementById("message-pug").innerHTML = error
            });
    }
    getPathwayUp = (params = {}) => {
        let workflow = Object.assign({}, this.state.workflow);
        // initialize
        if (params.sorting) {
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
            workflow.pathways_up.sorting = params.sorting;
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
                    pagination.total = result.data.totalCount;
                    for (let i = 0; i < result.data.records.length; i++) {
                        result.data.records[i].key = "pathway_up" + i;
                    }
                    workflow2.pathways_up.loading = false;
                    workflow2.pathways_up.data = result.data.records;
                    workflow2.pathways_up.pagination = pagination;
                    this.setState({ workflow: workflow2 });
                } else {
                    workflow2.pathways_up.loading = false;
                    this.setState({ workflow: workflow2 });
                    document.getElementById("message-pug").innerHTML = result.msg;
                }
            }).catch(error => {
                let workflow2 = Object.assign({}, this.state.workflow);
                workflow2.pathways_up.loading = false;
                this.setState({ workflow: workflow2 });
                document.getElementById("message-pug").innerHTML = error;
                console.log(error)
            });
    }
    getPathwayDown = (params = {}) => {
        let workflow = Object.assign({}, this.state.workflow);
        if (params.sorting) {
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
            workflow.pathways_down.sorting = params.sorting;
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
                } else {
                    document.getElementById("message-pdg").innerHTML = result.msg;
                }
            }).catch(error => document.getElementById("message-pdg").innerHTML = error);
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
                        Title: "Export Pathways For Downregulated Genes Data",
                        Subject: "Pathways For Downregulated Genes Data",
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
                        if (workflow.analysisType == "0") {
                            ws_data.push(["Analysis Type", "GEO Data"])
                            ws_data.push(["Accession Code", workflow.accessionCode])
                        }
                        ws_data.push(["Contrasts", workflow.group_1 + " vs " + workflow.group_2])
                        let group_1_gsm = "";
                        let group_2_gsm = "";
                        for (var i in workflow.dataList) {
                            if (workflow.dataList[i].groups == workflow.group_1) {
                                group_1_gsm = workflow.dataList[i].gsm + "," + group_1_gsm;
                            }

                            if (workflow.dataList[i].groups == workflow.group_2) {
                                group_2_gsm = workflow.dataList[i].gsm + "," + group_2_gsm;
                            }
                        }
                        ws_data.push([workflow.group_1, group_1_gsm])
                        ws_data.push([workflow.group_2, group_2_gsm])
                        ws_data.push(["Type", "Pathways_For_Downregulated_Genes"])

                        ws_data.push(["Filters", ""])

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
                        if (workflow.pathways_down.search_keyword.search_NUMBER_USER_GENES != "") {
                            ws_data.push(["Number_User_Genes", workflow.pathways_down.search_keyword.search_NUMBER_USER_GENES])
                        }
                        if (workflow.pathways_down.search_keyword.search_TOTAL_NUMBER_GENES != "") {
                            ws_data.push(["Total_Number_Genes", workflow.pathways_down.search_keyword.search_TOTAL_NUMBER_GENES])
                        }
                        if (workflow.pathways_down.search_keyword.search_GENE_LIST != "") {
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
                        var wbout = XLSX.writeFile(wb, "DEG_" + workflow.projectID + ".xlsx", { bookType: 'xlsx', type: 'binary' });
                    }

                } else {
                    document.getElementById("message-pdg").innerHTML = result.msg;
                }


            }).catch(error => document.getElementById("message-pdg").innerHTML = error);
    }
    getDEG = (params = {}) => {
        let workflow = Object.assign({}, this.state.workflow);
        if (params.sorting) {
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
            workflow.diff_expr_genes.sorting = params.sorting;
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
                } else {
                    document.getElementById("message-deg").innerHTML = result.msg;
                }
            }).catch(error => console.log(error));
    }



    exportNormalAll = (params = {}) => {

        let workflow = Object.assign({}, this.state.workflow);
        params = {
            projectId: workflow.projectID,
        }
        workflow.progressing = true;
        workflow.loading_info = "Export";
        this.setState({ workflow: workflow });
        fetch('./api/analysis/getNormalAll', {
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
                    var wb = XLSX.utils.book_new();
                    wb.Props = {
                        Title: "Normalized Data for All Samples",
                        Subject: "Normalized Data for All Samples",
                        Author: "Microarray",
                        CreatedDate: new Date()
                    };
                    wb.SheetNames.push("Data");
                    var ws_data = [];
                    if (result.data.data) {
                        ws_data.push([""].concat(result.data.col));
                        for (var i = 0; i < result.data.row.length; i++) {
                            ws_data.push([result.data.row[i]].concat(result.data.data[i]))
                        }

                    }
                    var ws = XLSX.utils.aoa_to_sheet(ws_data);
                    wb.Sheets["Data"] = ws;
                    XLSX.writeFile(wb, "DEG_Normalized_Data_for_All_Samples" + workflow.projectID + ".xlsx", { bookType: 'xlsx', type: 'binary' });

                }
                workflow.progressing = false;
                workflow.loading_info = "Loading";
                this.setState({ workflow: workflow });
            }).catch(error => document.getElementById("message-deg").innerHTML = error);
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

        workflow.progressing = true;
        workflow.loading_info = "Export";
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
                        if (workflow.analysisType == "0") {
                            ws_data.push(["Analysis Type", "GEO Data"])
                            ws_data.push(["Accession Code", workflow.accessionCode])
                        }
                        ws_data.push(["Contrasts", workflow.group_1 + " vs " + workflow.group_2])
                        let group_1_gsm = "";
                        let group_2_gsm = "";
                        for (var i in workflow.dataList) {
                            if (workflow.dataList[i].groups == workflow.group_1) {
                                group_1_gsm = workflow.dataList[i].gsm + "," + group_1_gsm;
                            }

                            if (workflow.dataList[i].groups == workflow.group_2) {
                                group_2_gsm = workflow.dataList[i].gsm + "," + group_2_gsm;
                            }
                        }
                        ws_data.push([workflow.group_1, group_1_gsm])
                        ws_data.push([workflow.group_2, group_2_gsm])
                        ws_data.push(["Type", "Differentially Expressed Genes"])
                        ws_data.push(["Filters", ""])

                        if (workflow.diff_expr_genes.search_keyword.search_symbol != "") {
                            ws_data.push(["SYMBOL", workflow.diff_expr_genes.search_keyword.search_symbol])
                        }
                        if (workflow.diff_expr_genes.search_keyword.search_fc != "") {
                            ws_data.push(["fc", workflow.diff_expr_genes.search_keyword.search_fc])
                        }
                        if (workflow.diff_expr_genes.search_keyword.search_p_value != "") {
                            ws_data.push(["P.Value", workflow.diff_expr_genes.search_keyword.search_p_value])
                        }
                        if (workflow.diff_expr_genes.search_keyword.search_adj_p_value != "") {
                            ws_data.push(["adj.P.value", workflow.diff_expr_genes.search_keyword.search_adj_p_value])
                        }
                        if (workflow.diff_expr_genes.search_keyword.search_aveexpr != "") {
                            ws_data.push(["AveExpr", workflow.diff_expr_genes.search_keyword.search_aveexpr])
                        }
                        if (workflow.pathways_down.search_keyword.search_fdr != "") {
                            ws_data.push(["ACCNUM", workflow.diff_expr_genes.search_keyword.search_accnum])
                        }
                        if (workflow.diff_expr_genes.search_keyword.search_desc != "") {
                            ws_data.push(["DESC", workflow.diff_expr_genes.search_keyword.search_desc])
                        }
                        if (workflow.diff_expr_genes.search_keyword.search_entrez != "") {
                            ws_data.push(["ENTREZ", workflow.diff_expr_genes.search_keyword.search_entrez])
                        }
                        if (workflow.diff_expr_genes.search_keyword.search_probsetid != "") {
                            ws_data.push(["probsetID", workflow.diff_expr_genes.search_keyword.search_probsetid])
                        }
                        if (workflow.diff_expr_genes.search_keyword.search_t != "") {
                            ws_data.push(["t", workflow.diff_expr_genes.search_keyword.search_t])
                        }
                        if (workflow.diff_expr_genes.search_keyword.search_b != "") {
                            ws_data.push(["b", workflow.diff_expr_genes.search_keyword.search_b])
                        }
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
                        var wbout = XLSX.writeFile(wb, "DEG_" + workflow.projectID + ".xlsx", { bookType: 'xlsx', type: 'binary' });
                    }
                } else {
                    document.getElementById("message-deg").innerHTML = result.msg;
                }
                workflow.progressing = false;
                workflow.loading_info = "Loading";
                this.setState({ workflow: workflow });
            }).catch(error => document.getElementById("message-deg").innerHTML = error);
    }
    getHeatmapolt = () => {
        document.getElementById("message-post-heatmap").innerHTML = "";
        let workflow = Object.assign({}, this.state.workflow);

        let link = "./images/" + workflow.projectID + "/" + workflow.heatmapolt_url
        let HeatMapIframe = <CIframe title={"Heatmap"} link={link} data={this.state.workflow} onLoadComplete={this.onLoadComplete} showLoading={this.showLoading} />;
        workflow.postplot.Heatmapolt = <div>{HeatMapIframe}</div>;
        this.setState({ workflow: workflow });
    }
    getVolcanoPlot() {
        let workflow = Object.assign({}, this.state.workflow);
        let volcanoPlot = <CIframe title={"volcanoPlot"} link={"./images/"+workflow.projectID+workflow.volcanoPlotName+"?"+this.uuidv4()} data={this.state.workflow} onLoadComplete={this.onLoadComplete} showLoading={this.showLoading} />;
        workflow.volcanoPlot = <div>{volcanoPlot}</div>;
        this.setState({ workflow: workflow });
    }
    onLoadComplete = () => {
        let workflow = Object.assign({}, this.state.workflow);
        workflow.progressing = false;
        this.setState({ workflow: workflow });
    }
    getPCA = () => {
        let workflow2 = Object.assign({}, this.state.workflow);
        workflow2.progressing = true;
        workflow2.loading_info = "Loading PCA...";
        this.setState({ workflow: workflow2 });
        let params = { projectId: workflow2.projectID };
        try {
            fetch('./api/analysis/getPCA', {
                    method: "POST",
                    body: JSON.stringify(params),
                    credentials: "same-origin",
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                .then(this.handleErrors)
                .then(res => res.json())
                .then(result => {
                    if (result.status == 200) {
                        if (result.data != "") {
                            let pcaData = result.data;
                            let pcaPlotData = [];
                            // break data in to groups 
                            let group_data = {};
                            let color_for_others = "#000";
                            pcaData.group_name.forEach(function(element, i) {
                                let color = pcaData.color[i]

                                if (pcaData.group_name[i].toLowerCase() == workflow2.group_2.toLowerCase() || pcaData.group_name[i].toLowerCase() == workflow2.group_1.toLowerCase()) {
                                    if (group_data.hasOwnProperty(element)) {
                                        group_data[element]["x"].push(pcaData.x[i]);
                                        group_data[element]["y"].push(pcaData.y[i]);
                                        group_data[element]["z"].push(pcaData.z[i]);
                                        group_data[element]['color'].push(pcaData.color[i]);
                                        group_data[element]['group_name'].push(pcaData.group_name[i]);
                                        group_data[element]['row'].push(pcaData.row[i]);
                                    } else {
                                        group_data[element] = {}
                                        group_data[element]["x"] = [pcaData.x[i]];
                                        group_data[element]["y"] = [pcaData.y[i]];
                                        group_data[element]["z"] = [pcaData.z[i]];
                                        group_data[element]['color'] = [pcaData.color[i]];
                                        group_data[element]['group_name'] = [pcaData.group_name[i]];
                                        group_data[element]['row'] = [pcaData.row[i]];
                                    }
                                }


                            });
                            for (let element in group_data) {
                                let color = "";
                                if (element.toLowerCase() == workflow2.group_2.toLowerCase() || element.toLowerCase() == workflow2.group_1.toLowerCase()) {
                                    color = group_data[element]['color'];
                                    pcaPlotData.push({
                                        autosize: true,
                                        x: group_data[element]["x"],
                                        y: group_data[element]["y"],
                                        z: group_data[element]["z"],
                                        text: pcaData.row,
                                        mode: 'markers',
                                        marker: {
                                            size: 10,
                                            color: color,
                                        },
                                        legendgroup: element,
                                        name: element,
                                        type: 'scatter3d'
                                    })
                                }
                            }
                            let pcaPlotLayout = {
                                showlegend: true,
                                margin: {
                                    l: 25,
                                    r: 25,
                                    t: -50,
                                    b: 0,
                                    pd: 2,
                                },
                                width: document.getElementsByClassName("ant-tabs-tabpane-active")[0].offsetWidth * 0.8,
                                height: document.getElementsByClassName("ant-tabs-tabpane-active")[0].offsetWidth * 0.6,
                                scene: {
                                    camera: {
                                        eye: { x: 0, y: 2, z: 1 }
                                    },
                                    xaxis: {
                                        title: pcaData.col[0] + " (" + pcaData.xlable + "%)",
                                        backgroundcolor: "#DDDDDD",
                                        gridcolor: "rgb(255, 255, 255)",
                                        showbackground: true,
                                        zerolinecolor: "rgb(255, 255, 255)"

                                    },
                                    yaxis: {
                                        title: pcaData.col[2] + " (" + pcaData.ylable + "%)",
                                        backgroundcolor: "#EEEEEE",
                                        gridcolor: "rgb(255, 255, 255)",
                                        showbackground: true,
                                        zerolinecolor: "rgb(255, 255, 255)"
                                    },
                                    zaxis: {
                                        title: pcaData.col[1] + " (" + pcaData.zlable + "%)",
                                        backgroundcolor: "#cccccc",
                                        gridcolor: "rgb(255, 255, 255)",
                                        showbackground: true,
                                        zerolinecolor: "rgb(255, 255, 255)"
                                    }
                                }
                            }
                            var PCAIframe = <Plot data={pcaPlotData} layout={pcaPlotLayout} useResizeHandler={true} />
                            let workflow = Object.assign({}, this.state.workflow);
                            workflow.progressing = false;
                            let plot_style = { "display": "block", "marginLeft": "auto", "marginRight": "auto", "width": "80%" }
                            workflow.PCA.plot = <div style={plot_style}> {PCAIframe}</div>;
                            workflow.PCA.data = pcaPlotData;
                            workflow.PCA.layout = pcaPlotLayout;
                            workflow.PCA.style = plot_style;
                            this.setState({ workflow: workflow });
                        } else {
                            let workflow = Object.assign({}, this.state.workflow);
                            workflow.progressing = false;
                            workflow.PCA = "No Data";
                            this.setState({ workflow: workflow });
                        }
                        document.getElementById("message-post-pca").innerHTML = "";
                    } else {
                        document.getElementById("message-post-pca").innerHTML = result.msg;
                        let workflow = Object.assign({}, this.state.workflow);
                        workflow.progressing = false;
                        workflow.PCA = "No Data";
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
    getBoxplotAN = () => {
        let workflow2 = Object.assign({}, this.state.workflow);
        workflow2.progressing = true;
        workflow2.loading_info = "Loading...";
        this.setState({ workflow: workflow2 });
        let params = { projectId: workflow2.projectID };
        try {
            fetch('./api/analysis/getBoxplotAN', {
                    method: "POST",
                    body: JSON.stringify(params),
                    credentials: "same-origin",
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                .then(this.handleErrors)
                .then(res => res.json())
                .then(result => {
                    if (result.status == 200) {
                        if (result.data != "") {
                            let workflow = Object.assign({}, this.state.workflow);
                            let render_data = this.generateBOXPLOT(result, workflow);
                            workflow.progressing = false;
                            workflow.BoxplotAN.plot = render_data.plot;
                            workflow.BoxplotAN.data = render_data.data;
                            this.setState({ workflow: workflow });
                        } else {
                            let workflow = Object.assign({}, this.state.workflow);
                            workflow.progressing = false;
                            workflow.BoxplotAN.plot = "No Data";
                            this.setState({ workflow: workflow });
                        }
                        document.getElementById("message-post-boxplot").innerHTML = "";
                    } else {
                        document.getElementById("message-post-boxplot").innerHTML = result.msg;
                        let workflow = Object.assign({}, this.state.workflow);
                        workflow.progressing = false;
                        workflow.BoxplotAN.plot = "No Data";
                        this.setState({ workflow: workflow });
                    }
                }).catch(error => console.log(error));
        } catch (error) {
            document.getElementById("message-post-boxplot").innerHTML = error;
            let workflow = Object.assign({}, this.state.workflow);
            workflow.progressing = false;
            workflow.BoxplotAN.plot = "No Data";
            this.setState({ workflow: workflow });
        }
    }
    getHistplotAN = () => {
        let workflow = Object.assign({}, this.state.workflow);
        let histplotANLink = './images/' + workflow.projectID + "/" + workflow.histplotAN_url;
        let histplotAN = <CIframe title={"HistplotAN"} link={histplotANLink} data={this.state.workflow} onLoadComplete={this.onLoadComplete} showLoading={this.showLoading} />;
        workflow.postplot.histplotAN = histplotAN;
        this.setState({ workflow: workflow });
    }
    showLoading = (title) => {
        let workflow = Object.assign({}, this.state.workflow);
        workflow.progressing = true;
        workflow.loading_info = title;
        this.setState({ workflow: workflow });
    }
    getMAplotAN = () => {
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
                        credentials: "same-origin",
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    })
                    .then(this.handleErrors)
                    .then(res => res.json())
                    .then(result => {
                        let workflow = Object.assign({}, this.state.workflow);
                        if (result.status == 200) {
                            document.getElementById("message-post-maplot").innerHTML = "";
                            if (result.data != "") {
                                workflow.list_mAplotAN = result.data;
                            } else {
                                workflow.list_mAplotAN = "No Data";
                            }
                        } else {
                            workflow.list_mAplotAN = "No Data";
                            document.getElementById("message-post-maplot").innerHTML = result.msg;
                        }
                        workflow.progressing = false;
                        this.setState({ workflow: workflow });
                    })
            } catch (error) {
                document.getElementById("message-post-maplot").innerHTML = error;
                let workflow = Object.assign({}, this.state.workflow);
                workflow.progressing = false;
                this.setState({ workflow: workflow });
            }
        }
    }
    getNUSE = () => {
        let workflow2 = Object.assign({}, this.state.workflow);
        workflow2.progressing = true;
        workflow2.loading_info = "Loading NUSE...";
        this.setState({ workflow: workflow2 });
        let params = { projectId: workflow2.projectID };
        try {
            fetch('./api/analysis/getNUSE', {
                    method: "POST",
                    body: JSON.stringify(params),
                    credentials: "same-origin",
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }).then(res => res.json())
                .then(result => {
                    document.getElementById("message-pre-nuse").innerHTML = "";
                    let workflow = Object.assign({}, this.state.workflow);
                    if (result.status == 200) {
                        let render_data = this.generateBOXPLOT(result, workflow);
                        workflow.progressing = false;
                        workflow.NUSE.data = render_data.data;
                        workflow.NUSE.plot = render_data.plot;
                    } else {
                        document.getElementById("message-pre-nuse").innerHTML = result.msg;
                        workflow.progressing = false;
                    }
                    this.setState({ workflow: workflow });
                })
        } catch (error) {
            document.getElementById("message-pre-nuse").innerHTML = error;
            let workflow = Object.assign({}, this.state.workflow);
            workflow.progressing = false;
            this.setState({ workflow: workflow });
        }
    }
    getRLE = () => {
        let workflow2 = Object.assign({}, this.state.workflow);
        workflow2.progressing = true;
        workflow2.loading_info = "Loading RLE...";
        this.setState({ workflow: workflow2 });
        let params = { projectId: workflow2.projectID };
        try {
            fetch('./api/analysis/getRLE', {
                    method: "POST",
                    body: JSON.stringify(params),
                    credentials: "same-origin",
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }).then(this.handleErrors)
                .then(res => res.json())
                .then(result => {
                    if (result.status == 200) {
                        document.getElementById("message-pre-rle").innerHTML = "";
                        let workflow = Object.assign({}, this.state.workflow);
                        if (result.data != "") {
                            workflow.progressing = false;
                            let render_data = this.generateBOXPLOT(result, workflow);
                            workflow.RLE.data = render_data.data;
                            workflow.RLE.plot = render_data.plot;
                        } else {
                            workflow.RLE.plot = "No Data";
                            workflow.progressing = false;
                        }
                        this.setState({ workflow: workflow });
                    } else {
                        document.getElementById("message-pre-rle").innerHTML = result.msg;
                        let workflow = Object.assign({}, this.state.workflow);
                        workflow.RLE.plot = "No Data";
                        workflow.progressing = false;
                        this.setState({ workflow: workflow });
                    }
                })
        } catch (error) {
            document.getElementById("message-pre-rle").innerHTML = error;
            let workflow = Object.assign({}, this.state.workflow);
            workflow.RLE.plot = "No Data";
            workflow.progressing = false;
            this.setState({ workflow: workflow });
        }
    }
    generateBOXPLOT(result, workflow) {

        let BoxplotRenderData = [];
        let BoxplotsData = result.data;
        //get max Y value 
        let maxY = Math.max(...BoxplotsData.data[0]);
        let minY = Math.min(...BoxplotsData.data[0]);
        let gap = maxY - minY;
        // get max x value 
        let maxX = workflow.groups.length + 0.1 * workflow.groups.length;
        // x,y value use to positiion the legend. 

        // get group with max word length 
        let color_for_others = "#000";
        const reducer2 = (accumulator, v, i, array) => {
            if (accumulator.length <= v.length) {
                accumulator = v;
            }
            return accumulator;
        };
        let max_text_length = workflow.groups.reduce(reducer2, "a"); // max text length 

        // use max text length to calculate the max text width.
        let text_max_width = max_text_length.length * 15;

        let flag_other = false; // this flag uses for check if annotation has Others or not 

        // pick trace show legend. Only one trace in a group of trace need to show legend. 
        const reducer = (accumulator, v, i, array) => {
            let cMarker = "";
            let v2 = "";
            if (v == workflow.group_2 || v == workflow.group_1) {
                cMarker = BoxplotsData.color[i];
                if (array.indexOf(v) === i) {
                    accumulator.push({
                        x: maxX,
                        y: maxY - accumulator.length * gap / 10,
                        xref: 'x',
                        yref: 'y',
                        text: '<span style="text-align:right"><span style="color:' + cMarker + '">O</span>   ' + v + '</span>',
                        showarrow: false,
                        width: text_max_width,
                        align: "left",
                    });

                }
            }

            return accumulator
        };

        let legend_settings = workflow.groups.reduce(reducer, []);


        for (let i = 0; i < result.data.col.length; i++) {
            let cMarker = ""
            if (workflow.groups[i] == workflow.group_2 || workflow.groups[i] == workflow.group_1) {
                cMarker = {
                    color: BoxplotsData.color[i]
                }
                let boxplotData = {
                    y: BoxplotsData.data[i],
                    type: "box",
                    name: BoxplotsData.col[i],
                    marker: cMarker,
                    hovertext: result.data.col[i]
                };
                BoxplotRenderData.push(boxplotData);
            }
        }
        // use annotations to show legend
        let plot_layout = {
            showlegend: false,
            annotations: legend_settings,
            yaxis: {
                title: BoxplotsData.ylable[0],
                zeroline: false
            }
        }
        let plot_style = { "width": document.getElementsByClassName("ant-tabs-tabpane-active")[0].offsetWidth * 0.9 }

        return {
            data: BoxplotRenderData,
            plot: <div> <Plot  data={BoxplotRenderData} layout={plot_layout}  style={plot_style} useResizeHandler={true}/></div>
        };
    }
    getBoxplotBN = () => {
        let workflow2 = Object.assign({}, this.state.workflow);
        workflow2.progressing = true;
        workflow2.loading_info = "Loading Plots...";
        this.setState({ workflow: workflow2 });
        let params = { projectId: workflow2.projectID };
        try {
            fetch('./api/analysis/getBoxplotBN', {
                    method: "POST",
                    body: JSON.stringify(params),
                    credentials: "same-origin",
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }).then(this.handleErrors)
                .then(res => res.json())
                .then(result => {
                    if (result.status == 200) {
                        let workflow = Object.assign({}, this.state.workflow);
                        document.getElementById("message-pre-boxplot").innerHTML = "";
                        if (result.data != "") {
                            workflow.progressing = false;
                            let render_data = this.generateBOXPLOT(result, workflow);
                            workflow.BoxplotBN.data = render_data.data;
                            workflow.BoxplotBN.plot = render_data.plot;
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
                });
        } catch (error) {
            document.getElementById("message-pre-boxplot").innerHTML = error;
            let workflow = Object.assign({}, this.state.workflow);
            workflow.preplots.Boxplots = "No Data";
            workflow.progressing = false;
            this.setState({ workflow: workflow });
        }
    }
    getMAplotsBN = () => {
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
                        credentials: "same-origin",
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    }).then(this.handleErrors)
                    .then(res => res.json())
                    .then(result => {
                        let workflow = Object.assign({}, this.state.workflow);
                        if (result.status == 200) {
                            if (result.data != "") {
                                document.getElementById("message-pre-maplot").innerHTML = "";
                                workflow.list_mAplotBN = result.data;
                            } else {
                                workflow.list_mAplotBN = "No Data";
                            }
                        } else {
                            workflow.list_mAplotBN = "No Data";
                        }
                        workflow.progressing = false;
                        this.setState({ workflow: workflow });
                    })
            } catch (error) {
                document.getElementById("message-pre-maplot").innerHTML = error;
                let workflow = Object.assign({}, this.state.workflow);
                workflow.list_mAplotBN = "No Data";
                workflow.progressing = false;
                this.setState({ workflow: workflow });
            }
        }
    }


    getHistplotBN = () => {
        let workflow = Object.assign({}, this.state.workflow);
        let histplotBNLink = './images/' + workflow.projectID + "/" + workflow.histplotBN_url;
        let histplotBN = <CIframe title={"histplotBN"} link={histplotBNLink} data={this.state.workflow} onLoadComplete={this.onLoadComplete} showLoading={this.showLoading} />;
        workflow.preplots.histplotBN = histplotBN;
        this.setState({ workflow: workflow });
    }
    changePathways_up = (obj) => {
        let workflow = Object.assign({}, this.state.workflow);
        if (obj.pagination) {
            workflow.pathways_up = obj;
        } else {
            obj.pagination = workflow.pagination;
            workflow.pathways_up = obj;
        }
        this.setState({ workflow: workflow }, () => { console.log("changePathways_up done"); });
    }
    changePathways_down = (obj) => {
        let workflow = Object.assign({}, this.state.workflow);
        if (obj.pagination) {
            workflow.pathways_down = obj;
        } else {
            obj.pagination = workflow.pagination;
            workflow.pathways_down = obj;
        }
        this.setState({ workflow: workflow });
    }
    changessGSEA = (obj) => {
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
        if (e == "volcanoPlot") {
            this.getVolcanoPlot();
        }
    }
    upateCurrentWorkingTab = (e) => {
        sessionStorage.setItem("current_working_on_tag", e);
        window.current_working_on_tag = e;
        let workflow = Object.assign({}, this.state.workflow);
        workflow.tab_activeKey = e;
        this.setState({ workflow: workflow });
    }
    handleGeneChange = (event) => {
        let value = event.target.value;
        let workflow = Object.assign({}, this.state.workflow);
        let reqBody = {};
        reqBody.projectId = workflow.projectID;
        reqBody.species = value.split("$")[0];
        reqBody.genSet = value.split("$")[1];
        reqBody.group1 = workflow.group_1;
        reqBody.group2 = workflow.group_2;
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
                    headers: { 'Content-Type': 'application/json' }
                })
                .then(this.handleErrors)
                .then(res => res.json())
                .then(result => {
                    workflow.progressing = false;
                    this.setState({ workflow: workflow });
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
    changeCode = (event) => {
        let workflow = Object.assign({}, this.state.workflow);
        workflow.accessionCode = event.target.value;
        this.setState({ workflow: workflow });
    }
    handleSelectType = (event) => {
        let workflow = Object.assign({}, this.state.workflow);
        workflow.analysisType = event.target.value;
        this.setState({ workflow: workflow });
    }
    handleGroup1Select = (event) => {
        let workflow = Object.assign({}, this.state.workflow);
        workflow.group_1 = event.target.value;
        this.setState({ workflow: workflow });
    }
    handleNormalSelect = (event) => {
        let workflow = Object.assign({}, this.state.workflow);
        workflow.normal = event.target.value;
        this.setState({ workflow: workflow });
    }
    handleGroup2Select = (event) => {
        let workflow = Object.assign({}, this.state.workflow);
        workflow.group_2 = event.target.value;
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
            document.getElementById("input-access-code").disabled = false;
            document.getElementById("btn-project-load-gse").disabled = false;
            // disable the input , prevent user to change the access code

            document.getElementById("analysisType_selection").disabled = false;
            document.getElementById("btn-project-load-gse").className = "ant-btn upload-start ant-btn-primary";
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
        workflow.progressing = true;
        workflow.loading_info = "Export";
        this.setState({ workflow: workflow });
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
                let uploadD = "";
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
                gsm.push([rawData[i].index, rawData[i].gsm, rawData[i].title, rawData[i].description, rawData[i].groups, ]);
            }
            var ws2 = XLSX.utils.aoa_to_sheet(gsm);
            wb.Sheets["Results"] = ws2;
            var wbout = XLSX.writeFile(wb, "GSM_" + workflow.projectID + ".xlsx", { bookType: 'xlsx', type: 'binary' });
            workflow.progressing = false;
            workflow.loading_info = "loading";
            this.setState({ workflow: workflow });
        }
    }
    loadGSE = () => {
        let workflow = Object.assign({}, this.state.workflow);
        let reqBody = {};
        reqBody.code = "";
        reqBody.projectId = "";
        reqBody.groups = "";
        if (workflow.accessionCode == "") {
            document.getElementById("message-load-accession-code").innerHTML = "Accession Code is required. ";
            return;
        } else {
            document.getElementById("message-load-accession-code").innerHTML = "";
        }
        document.getElementById("btn-project-load-gse").className = "ant-btn upload-start ant-btn-default";
        if (workflow.dataList != "") {
            // user click load after data already loaded.then it is a new transaction 
            window.location.reload(true);
        }
        reqBody.code = workflow.accessionCode;
        // this pid will be used to create a tmp folder to store the data. 
        workflow.projectID = this.uuidv4();
        reqBody.projectId = workflow.projectID;
        // gruop info
        var groups = []
        for (var i in workflow.dataList) {
            if (workflow.dataList[i].group == "") {
                groups.push("Others");
            } else {
                groups.push(workflow.dataList[i].group);
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

                        if (result.data === "undefined" || Object.keys(result.data).length === 0 || result.data.indexOf('{"files":') < 0) {
                            document.getElementById("btn-project-load-gse").className = "ant-btn upload-start ant-btn-primary"
                            workflow.uploading = false;
                            workflow.progressing = false;
                            document.getElementById("message-gsm").innerHTML = result.data.replace("\\n", " ").replace(/"/g, "").replace("[1] +++loadGSE+++", " ").replace("files Please", "files. Please")
                            document.getElementById("message-gsm").nextSibling.innerHTML = ""
                            this.setState({
                                workflow: workflow
                            });
                            return;
                        }
                        var data = result.data.substr(result.data.indexOf('{"files":'), result.data.length)
                        if (typeof(data) === "undefined" || data == "") {
                            document.getElementById("btn-project-load-gse").className = "ant-btn upload-start ant-btn-primary"
                            workflow.uploading = false;
                            workflow.progressing = false;
                            document.getElementById("message-gsm").innerHTML = result.data.replace("\\n", " ").replace(/"/g, "").replace("[1] +++loadGSE+++", " ")
                            document.getElementById("message-gsm").nextSibling.innerHTML = ""
                            this.setState({
                                workflow: workflow
                            });
                            return;
                        }
                        let list = JSON.parse(decodeURIComponent(data));
                        if (typeof(list) == "undefined" || list == null || list.files == null || typeof(list.files) == "undefined" || list.files.length == 0) {
                            document.getElementById("btn-project-load-gse").className = "ant-btn upload-start ant-btn-primary"
                            workflow.uploading = false;
                            workflow.progressing = false;
                            document.getElementById("message-gsm").innerHTML = result.data.replace("\\n", " ").replace(/"/g, "").replace("[1] +++loadGSE+++", " ").replace("files Please", "files. Please")
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
                        workflow.groups = new Array(list.files.length).fill('Others');

                        // disable the input , prevent user to change the access code
                        document.getElementById("input-access-code").disabled = true;
                        // change the word of load btn
                        document.getElementById("btn-project-load-gse").disabled = true;

                        document.getElementById("analysisType_selection").disabled = true;
                        this.setState({
                            workflow: workflow
                        });
                    } else {
                        document.getElementById("btn-project-load-gse").className = "ant-btn upload-start ant-btn-primary"
                        workflow.uploading = false;
                        workflow.progressing = false;
                        this.setState({
                            workflow: workflow
                        });
                        document.getElementById("message-gsm").innerHTML = result.msg
                        document.getElementById("message-gsm").nextSibling.innerHTML = ""
                        //message.error('load data fails.');
                    }
                });
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
    getSSGSEAGeneHeatMap = () => {

        let workflow = Object.assign({}, this.state.workflow);
        let link = "./images/" + workflow.projectID + "/ssgseaHeatmap1.jpg?" + this.uuidv4();
        imageExists(link, this.buildgeneHeatmap);
    }
    buildgeneHeatmap = (exists) => {
        let workflow = Object.assign({}, this.state.workflow);
        let link = "./images/" + workflow.projectID + "/ssgseaHeatmap1.jpg?" + this.uuidv4();

        if (exists) {
            workflow.geneHeatmap = <img src= {link}  style={{width:"100%"}} alt="Pathway Heatmap"/>
            this.setState({ workflow: workflow });
        }
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
        reqBody.dataList = [];
        if (workflow.uploaded) {
            reqBody.source = "upload";
        } else {
            reqBody.source = "fetch";
        }
        for (var i in workflow.dataList) {
            reqBody.dataList.push(workflow.dataList[i].gsm);
            if (workflow.dataList[i].groups != "") {
                reqBody.groups.push(workflow.dataList[i].groups);
            } else {
                // default value of the group is others
                reqBody.groups.push("Others")
            }
        }
        reqBody.genSet = workflow.genSet;
        reqBody.pssGSEA = workflow.pssGSEA;
        reqBody.foldssGSEA = workflow.foldssGSEA;
        reqBody.pPathways = workflow.pPathways;
        reqBody.species = workflow.species;
        reqBody.genSet = workflow.genSet;
        reqBody.normal = workflow.normal;
        reqBody.sorting = "";
        if (workflow.current_working_on_object) {
            reqBody.targetObject = workflow.current_working_on_object;
        } else {
            reqBody.targetObject = "";
        }
        workflow.progressing = true;
        if (workflow.useQueue) {
            workflow.loading_info = "Submitting job to queue...";
        } else {
            workflow.loading_info = "Running Contrast...";
        }
        // define action
        reqBody.actions = "runContrast";
        workflow.diff_expr_genes = {
            data: [],
            pagination: {
                current: 1,
                pageSize: 25
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
                "search_logFC": "",
                "search_Avg_Enrichment_Score": "",
                "search_t": "",
                "search_p_value": "",
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
            NUSE: "",
            RLE: "",
            Boxplots: "",
            list_mAplotBN: "",
            histplotBN: "",
        };
        workflow.postplot = {
            histplotAN: "",
            list_mAplotAN: "",
            Heatmapolt: "",
            histplotAN: "",
            list_mAplotAN: "",
            Boxplots: "",
            PCA: ""
        };
        workflow.list_mAplotBN = "";
        workflow.list_mAplotAN = "";
        workflow.volcanoPlot = "";
        workflow.histplotBN_url = "";
        workflow.histplotAN_url = "";
        workflow.heatmapolt_url = "";
        this.setState({
            workflow: workflow
        });
        document.getElementById("message-gsm").innerHTML = "";
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
                            workflow.QueueModalvisible = true;
                        } else {
                            workflow.QueueModalvisible = false;
                            document.getElementById("message-use-queue").innerHTML = result.data;
                        }
                        workflow.uploading = false;
                        workflow.progressing = false;
                        this.setState({
                            workflow: workflow
                        });
                        this.getSSGSEAGeneHeatMap();
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
                        if (response) {
                            return response.json();
                        }
                    }).then(result => {
                        if (result && result.status == 200) {
                            let type = window.current_working_on_object;
                            if (window.current_working_on_tag == "" || window.current_working_on_tag == "GSM_1") {
                                // open the GSM
                            }
                            if (window.current_working_on_tag == "Pre-normalization_QC_Plots") {
                                // open the Pre-plot
                                type = window.tag_pre_plot_status;
                            }
                            if (window.current_working_on_tag == "Post-normalization_Plots") {
                                // open the Post-plot
                                type = window.tag_post_plot_status;
                            }
                            if (window.current_working_on_tag == "DEG-Enrichments_Results") {
                                // open the DEG
                                type = window.tag_deg_plot_status;
                            }
                            if (window.current_working_on_tag == "ssGSEA_Results") {
                                // open the ssGSEA_Results
                                type = "ssGSEA_Results";
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
                                    this.getSSGSEAGeneHeatMap();
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
                            workflow.volcanoPlot = this.getVolcanoPlot();
                            workflow.groups = result.data.groups;
                            workflow.compared = true;
                            workflow.done_gsea = true;
                            workflow.progressing = false;
                            workflow.histplotBN_url = result.data.histplotBN;
                            workflow.histplotAN_url = result.data.histplotAN;
                            workflow.heatmapolt_url = result.data.heatmapolt;
                            this.setState({
                                workflow: workflow
                            });
                            this.getSSGSEAGeneHeatMap();
                            this.hideWorkFlow();
                        } else {
                            if (result) {
                                document.getElementById("message-gsm").innerHTML = result.data
                                workflow.progressing = false;
                                this.setState({
                                    workflow: workflow
                                });
                            }
                        }
                    }).catch(function(error) {
                        document.getElementById("message-gsm").innerHTML = error
                        workflow.uploading = false;
                        workflow.progressing = false;
                        this.setState({
                            workflow: workflow
                        });
                    }.bind(this));
            } catch (err) {
                document.getElementById("message-gsm").innerHTML = err
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
                            this.setState({ workflow: workflow });
                            return;
                        }
                        let list = JSON.parse(decodeURIComponent(data));
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
                        }
                        workflow.dataList = list.files;
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
                    document.getElementById("btn-project-upload").disabled = true;
                    document.getElementById("btn-project-upload").className = "ant-btn upload-start ant-btn-default";
                }).catch(error => console.log(error));
        } catch (error) {
            workflow.uploading = false;
            workflow.progressing = false;
            workflow.uploaded = true;
            this.setState({
                workflow: workflow
            });
            document.getElementById("message-gsm").innerHTML = error;
            document.getElementById("message-gsm").nextSibling.innerHTML = "";
            document.getElementById("btn-project-upload").disabled = true;
            document.getElementById("btn-project-upload").className = "ant-btn upload-start ant-btn-default";
        }
    }
    assignGroup = (group_name, dataList_keys, handler, callback) => {
        // validate group_name
        let pattern = /^[a-zA-Z]+\_?[a-zA-Z0-9]*$|^[a-zA-Z]+[0-9]*$/g
        if (group_name.match(pattern)) {
            let workflow = Object.assign({}, this.state.workflow);
            for (var key in dataList_keys) {
                workflow.dataList[dataList_keys[key] - 1].groups = group_name;
            }
            document.getElementById("message-gsm-group").innerHTML = "";
            this.setState({ workflow: workflow });
            callback(true, handler);
        } else {
            document.getElementById("message-gsm-group").innerHTML = "The group name only allows ASCII or numbers or underscore and it cannot start with numbers. Valid Group Name Example : RNA_1 ";
            callback(false, handler);
        }
    }
    deleteGroup = (group_name) => {
        let workflow = Object.assign({}, this.state.workflow);
        for (var key in workflow.dataList) {
            if (workflow.dataList[key].groups == group_name) {
                workflow.dataList[key].groups = ""
            }
        }
        this.setState({ workflow: workflow });
    }
    handleErrors = (response) => {
        if (!response.ok) {
            //throw Error(response.statusText);
            // Display fallback UI
            this.resetWorkFlowProject();
            if (response.statusText != "") {
                document.getElementById("message-gsm").innerHTML = response.statusText;
            } else {
                let errorMessage = ""
                if (httpErrorMessage[response.status]) errorMessage = httpErrorMessage[response.status];
                document.getElementById("message-gsm").innerHTML = "Error Code : " + response.status + "  " + errorMessage;
            }

            document.getElementById("message-gsm").nextSibling.innerHTML = "";

        } else {
            return response;
        }
    }
    hideWorkFlow = () => {
        if (document.getElementsByClassName("container-board-right")[0].clientWidth > 600) {
            document.getElementsByClassName("container-board-left")[0].style.display = 'none';
        }
        if (document.getElementsByClassName("container-board-right")[0].clientWidth > 600) {
            // when user use mobile, container-board-right set to be 100% width
            document.getElementsByClassName("container-board-right")[0].style.width = this.getElementByXpath('//*[@id="tab_analysis"]/div[1]').clientWidth - document.getElementsByClassName("container-board-left")[0].clientWidth - 80 + "px";
        }
        document.getElementById("panel-show").style.display = 'inherit';
        document.getElementById("panel-hide").style.display = 'none';
        this.resetBoxPlotAN();
        this.resetRLE();
        this.resetNUSE();
        this.resetPCA();
        this.resetBoxPlotBN();
    }
    showWorkFlow = () => {
        document.getElementsByClassName("container-board-left")[0].style.display = 'block';
        document.getElementsByClassName("container-board-right")[0].removeAttribute("style");
        document.getElementById("panel-show").style.display = 'none';
        document.getElementById("panel-hide").style.display = 'inherit';
        this.resetBoxPlotAN();
        this.resetRLE();
        this.resetNUSE();
        this.resetPCA();
        this.resetBoxPlotBN();
    }
    resetPCA = () => {
        let workflow = Object.assign({}, this.state.workflow);
        let pcaPlotLayout = {
            margin: workflow.PCA.layout.margin,
            width: document.getElementsByClassName("ant-tabs-tabpane-active")[0].offsetWidth * 0.8,
            height: document.getElementsByClassName("ant-tabs-tabpane-active")[0].offsetWidth * 0.6,
            scene: workflow.PCA.layout.scene
        }
        if (!workflow.PCA.data == "") {
            workflow.PCA.plot = <div style={workflow.PCA.style}> <Plot 
                             data={workflow.PCA.data} 
                             layout={pcaPlotLayout}  
                             /></div>;
        }
        this.setState({
            workflow: workflow
        });
    }
    resetBoxPlotAN = () => {
        let workflow = Object.assign({}, this.state.workflow);
        workflow.BoxplotAN.style = { width: document.getElementsByClassName("ant-tabs-tabpane-active")[0].offsetWidth * 0.9 };
        workflow.BoxplotAN.layout = {
            showlegend: false,
            autosize: true
        };
        if (!workflow.BoxplotAN.data == "") {
            workflow.BoxplotAN.plot = <Plot 
                             id="BoxplotAN" 
                             data={workflow.BoxplotAN.data} 
                             layout={workflow.BoxplotAN.layout}  
                             style={workflow.BoxplotAN.style} 
                             useResizeHandler={true}
                             />
        }

        this.setState({
            workflow: workflow
        });
    }
    resetBoxPlotBN = () => {
        let workflow = Object.assign({}, this.state.workflow);
        workflow.BoxplotBN.style = { width: document.getElementsByClassName("ant-tabs-tabpane-active")[0].offsetWidth * 0.9 };
        workflow.BoxplotBN.layout = {
            showlegend: false,
            autosize: true
        };
        if (!workflow.BoxplotBN.data == "") {
            workflow.BoxplotBN.plot = <Plot 
                             id="BoxplotAN" 
                             data={workflow.BoxplotBN.data} 
                             layout={workflow.BoxplotBN.layout}  
                             style={workflow.BoxplotBN.style} 
                             useResizeHandler={true}
                             />
        }

        this.setState({
            workflow: workflow
        });
    }
    resetRLE = () => {
        let workflow = Object.assign({}, this.state.workflow);
        workflow.RLE.style = { width: document.getElementsByClassName("ant-tabs-tabpane-active")[0].offsetWidth * 0.9 };
        workflow.RLE.layout = { showlegend: false, autosize: true };
        if (!workflow.RLE.data == "") {
            workflow.RLE.plot = <Plot id="BoxplotAN" data={workflow.RLE.data} layout={workflow.RLE.layout}  style={workflow.RLE.style} useResizeHandler={true} />
        }
        this.setState({ workflow: workflow });
    }
    resetNUSE = () => {
        let workflow = Object.assign({}, this.state.workflow);
        workflow.NUSE.style = { width: document.getElementsByClassName("ant-tabs-tabpane-active")[0].offsetWidth * 0.9 };
        workflow.NUSE.layout = {
            showlegend: false,
            autosize: true
        };
        if (!workflow.NUSE.data == "") {
            workflow.NUSE.plot = <Plot id="BoxplotAN" data={workflow.NUSE.data} layout={workflow.NUSE.layout} style={workflow.NUSE.style} useResizeHandler={true}/>
        }
        this.setState({
            workflow: workflow
        });
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
    initWithCode = (code) => {
        let workflow = Object.assign({}, this.state.workflow);
        let reqBody = {};
        reqBody.projectId = code;
        workflow.uploaded = false;
        workflow.progressing = true;
        workflow.loading_info = "Running Contrast...";
        workflow.diff_expr_genes = defaultState.workflow.diff_expr_genes;
        workflow.ssGSEA = defaultState.workflow.ssGSEA;
        workflow.pathways_up = defaultState.workflow.pathways_up;
        workflow.pathways_down = defaultState.workflow.pathways_down;
        workflow.preplots = defaultState.workflow.preplots;
        workflow.postplot = defaultState.workflow.postplot;
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
                        document.getElementById("message-gsm").innerHTML = "Run Contrast has failed to complete, please contact admin or try again. ";
                        document.getElementById("message-gsm").nextSibling.innerHTML = "";
                    }
                    return response.json();
                }).then(result => {
                    if (result.status == 200) {
                        result = result.data;
                        let workflow2 = Object.assign({}, this.state.workflow);
                        if (result.gsm[0].gsm) {
                            workflow2.dataList = result.gsm;
                        } else {
                            let tmp_gsms = []
                            for (let i in result.gsm) {
                                tmp_gsms.push({
                                    index: result.gsm[i].index,
                                    title: result.gsm[i].title,
                                    gsm: result.gsm[i]._row,
                                    groups: result.gsm[i].groups,
                                    colors: result.gsm[i].colors
                                })
                            }
                            workflow2.dataList = tmp_gsms;
                        }
                        if (result.source && result.source == "upload") {
                            // change analysis type
                            workflow2.analysisType = "1";
                            workflow2.uploaded = true;
                        }
                        workflow2.accessionCode = result.accessionCode;
                        workflow2.projectID = result.projectId[0];
                        workflow2.group_1 = result.group_1;
                        workflow2.group_2 = result.group_2;
                        workflow2.groups = result.groups;
                        workflow2.normal = result.normal;
                        // replace default group
                        for (let i in workflow2.dataList) {
                            if (result.groups[i].toLowerCase() == "others" || result.groups[i].toLowerCase() == 'clt') {
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
                        workflow2.compared = true;
                        workflow2.done_gsea = true;
                        workflow2.progressing = false;
                        workflow2.histplotBN_url = result.histplotBN;
                        workflow2.histplotAN_url = result.histplotAN;
                        workflow2.heatmapolt_url = result.heatmapolt;
                        // disable the input , prevent user to change the access code
                        document.getElementById("input-access-code").disabled = true;
                        // change the word of load btn
                        document.getElementById("btn-project-load-gse").disabled = true;
                        //
                        document.getElementById("analysisType_selection").disabled = true;
                        //
                        document.getElementById("btn-project-load-gse").classList.replace("ant-btn-primary", "ant-btn-default");

                        this.setState({
                            workflow: workflow2
                        });
                        this.getSSGSEAGeneHeatMap();
                        this.hideWorkFlow();
                    } else {
                        if (document.getElementById("message-gsm") != null) {
                            document.getElementById("message-gsm").innerHTML = "Run Contrast has failed to complete, please contact admin or try again. ";
                            document.getElementById("message-gsm").nextSibling.innerHTML = "";
                        }
                        workflow.progressing = false;
                        this.setState({
                            workflow: workflow
                        });
                    }
                });
        } catch (err) {
            workflow.uploading = false;
            workflow.progressing = false;
            if (document.getElementById("message-gsm") != null) {
                document.getElementById("message-gsm").innerHTML = err;
                document.getElementById("message-gsm").nextSibling.innerHTML = "";
            }
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
                result = result.data;
                let workflow = Object.assign({}, this.state.workflow);
                workflow.numberOfTasksInQueue = result;
                this.setState({
                    workflow: workflow
                });
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
        let workflow = <Workflow data={this.state.workflow}
                        handleNormalSelect ={this.handleNormalSelect}
                        resetWorkFlowProject={this.resetWorkFlowProject}  
                        changeCode={this.changeCode} 
                        handleSelectType={this.handleSelectType} 
                        changeRunContrastMode={this.changeRunContrastMode} 
                        fileRemove={this.fileRemove} 
                        beforeUpload={this.beforeUpload} 
                        handleUpload={this.handleUpload} 
                        loadGSE={this.loadGSE} 
                        handleGroup1Select={this.handleGroup1Select}  
                        handleGroup2Select={this.handleGroup2Select} 
                        runContrast={this.runContrast}
                        exportGSE={this.exportGSE}
                        exportNormalAll={this.exportNormalAll}
                        />
        let page_status = (this.props.location.search && this.props.location.search != "")
        let tabs = <div> <div className="header-nav">
            <div className="div-container">
                <ul className="nav navbar-nav" id="header-navbar">
                    <li  onClick={() => {this.changeTab('about')}}  id="li-about" className={page_status?"":"active"}> <a href="#about" className="nav-link" >ABOUT</a></li>
                    <li  onClick={() => {this.changeTab('analysis')}}  id="li-analysis" className={page_status?"active":""}> <a href="#analysis"  className="nav-link">ANALYSIS</a></li>
                    <li  onClick={() => {this.changeTab('help')}}  id="li-help" className="" > <a href="#help"  className="nav-link">HELP</a></li>
                </ul>
            </div>
        </div>
        <div className="content">
                <div id="tab_about" className={page_status?"hide":""}> <About/></div>
                <div id="tab_help" className="hide" > <Help/></div>
                <div id="tab_analysis" className={page_status?"":"hide"}>
                <div className="container container-board">
                    {workflow}
                    <div id="btn-controll-data-table-display">
                      <a  aria-label="panel display controller " id="panel-hide" onClick={this.hideWorkFlow} size="small" style={{"display":page_status?"none":"block"}}><Icon type="caret-left" /></a>
                      <a  aria-label="panel display controller" id="panel-show" onClick={this.showWorkFlow}  size="small" style={{"display":page_status?"block":"none"}}><Icon type="caret-right" /></a>
                  </div>
                <DataBox    data={this.state.workflow} 
                            resetGSMDisplay={this.resetGSMDisplay}
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
                            exportNormalAll={this.exportNormalAll}
                            />
                </div>
                <div className={modal}>
                    <div id="loading">
                        <Spin indicator={antIcon} style={{color:"black"}} aria-label="loading"/>
                        <label className="loading-info" aria-label="loading-info">{this.state.workflow.loading_info}</label>
                    </div>
                </div>
            </div>
            </div>
        </div>

        return (<div>{tabs}{queueModal}</div>);
    }
}

export default Analysis;