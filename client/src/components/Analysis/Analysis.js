import React, { Component } from 'react';
import Workflow from '../Workflow/Workflow';
import DataBox from '../DataBox/DataBox';
import { Spin, message, Icon, Button } from 'antd';
import Plot from 'react-plotly.js';


const ButtonGroup = Button.Group;

class Analysis extends Component {

    constructor(props) {
        super(props);
        this.state = {
            workflow: {
                projectID: "",
                analysisType: "0",
                accessionCode: "",
                fileList: [],
                uploading: false,
                progressing: false,
                loading_info: "",
                dataList: [],
                groups: [],
                group_1: "-1",
                group_2: "-1",
                pDEGs: 0.05,
                foldDEGs: 1.5,
                species: "human",
                genSet: "H: Hallmark Gene Sets",
                pPathways: 0.05,
                pssGSEA: 0.05,
                foldssGSEA: 1.5,
                compared: false,
                uploaded: false,
                done_gsea: false,
                current_working_on_object: "",
                diff_expr_genes: {
                    data: [],
                    pagination: {
                        current: 1,
                        pageSize: 10,

                    },
                    loading: true,
                },
                ssGSEA: {
                    data: [],
                    pagination: {
                        current: 1,
                        pageSize: 10,

                    },
                    loading: true,
                },
                pathways_up: {

                    data: [],
                    pagination: {
                        current: 1,
                        pageSize: 10,

                    },
                    loading: true,
                },
                pathways_down: {
                    data: [],
                    pagination: {
                        current: 1,
                        pageSize: 10,

                    },
                    loading: true,
                },
                preplots: "",
                postplot: "",
                geneHeatmap: "/ssgseaHeatmap1.jpg",

            }
        };

        this.changePathways_up = this.changePathways_up.bind(this);
        this.changePathways_down = this.changePathways_down.bind(this);
        this.changessGSEA = this.changessGSEA.bind(this);
        this.changeDeg = this.changeDeg.bind(this);
        this.changeProject = this.changeProject.bind(this);
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
    }


    //use for generate UUID
    uuidv4() {
        return 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random() * 16 | 0,
                v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }



    getssGSEA = (params = {}) => {
        let workflow = Object.assign({}, this.state.workflow);

        if (!params.hasOwnProperty("search_keyword")) {
            params = {
                page_size: 10,
                page_number: 1,
                sorting: {
                    name: "P.Value",
                    order: "descend",
                },
                search_keyword: "",
                pssGSEA: workflow.pssGSEA,
                foldssGSEA: workflow.foldssGSEA,
            }
        }


        if (params.search_keyword != "") {
            let keyword = params.search_keyword;
            params = {
                page_size: workflow.ssGSEA.pagination.pageSize,
                page_number: workflow.ssGSEA.pagination.current,
                sorting: {
                    name: "P.Value",
                    order: "descend",
                },
                search_keyword: keyword,
                pssGSEA: workflow.pssGSEA,
                foldssGSEA: workflow.foldssGSEA,
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
            }).then(
                res => res.json()
            )
            .then(result => {
                if (result.status == 200) {
                    let workflow2 = Object.assign({}, this.state.workflow);
                    const pagination = { ...workflow2.ssGSEA.pagination };
                    // Read total count from server
                    // pagination.total = data.totalCount;
                    pagination.total = result.data.totalCount;

                    for (let i = 0; i < result.data.records.length; i++) {
                        result.data.records[i].key = "GSEA" + i;
                    }

                    workflow2.ssGSEA = {
                        loading: false,
                        data: result.data.records,
                        pagination,
                    }
                    this.setState({ workflow: workflow2 });


                } else {
                    message.warning('no data');
                }

            });
    }




    getPathwayUp = (params = {}) => {
        let workflow = Object.assign({}, this.state.workflow);

        if (!params.hasOwnProperty("search_keyword")) {
            params = {
                page_size: 10,
                page_number: 1,
                sorting: {
                    name: "P_Value",
                    order: "descend",
                },
                pPathways: workflow.pPathways,
                search_keyword: "",
            }
        }


        if (params.search_keyword != "") {
            let keyword = params.search_keyword;
            params = {
                page_size: workflow.pathways_up.pagination.pageSize,
                page_number: workflow.pathways_up.pagination.current,
                sorting: {
                    name: "P_Value",
                    order: "descend",
                },
                pPathways: workflow.pPathways,
                search_keyword: keyword
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
            }).then(
                res => res.json()
            )
            .then(result => {
                if (result.status == 200) {
                    let workflow2 = Object.assign({}, this.state.workflow);
                    const pagination = { ...workflow.pathways_up.pagination };
                    // Read total count from server
                    // pagination.total = data.totalCount;
                    pagination.total = result.data.totalCount;

                    for (let i = 0; i < result.data.records.length; i++) {
                        result.data.records[i].key = "pathway_up" + i;
                    }
                    workflow2.pathways_up = {
                        loading: false,
                        data: result.data.records,
                        pagination,
                    }
                    this.setState({ workflow: workflow2 });

                } else {
                    message.warning('no data');
                }

            });
    }

    getPathwayDown = (params = {}) => {
        let workflow = Object.assign({}, this.state.workflow);
        if (!params.hasOwnProperty("search_keyword")) {
            params = {
                page_size: 10,
                page_number: 1,
                sorting: {
                    name: "P_Value",
                    order: "descend",
                },
                pPathways: workflow.pPathways,
                search_keyword: "",
            }
        }


        if (params.search_keyword != "") {
            let keyword = params.search_keyword;
            params = {
                page_size: workflow.pathways_down.pagination.pageSize,
                page_number: workflow.pathways_down.pagination.current,
                sorting: {
                    name: "P_Value",
                    order: "descend",
                },
                pPathways: workflow.pPathways,
                search_keyword: keyword
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
            }).then(
                res => res.json()
            )
            .then(result => {
                if (result.status == 200) {
                    let workflow2 = Object.assign({}, this.state.workflow);
                    const pagination = { ...workflow.pathways_down.pagination };
                    // Read total count from server
                    // pagination.total = data.totalCount;
                    pagination.total = result.data.totalCount;

                    for (let i = 0; i < result.data.records.length; i++) {
                        result.data.records[i].key = "pathway_down" + i;
                    }
                    workflow2.pathways_down = {
                        loading: false,
                        data: result.data.records,
                        pagination,
                    }
                    this.setState({ workflow: workflow2 });
                } else {
                    message.warning('no data');
                }

            });
    }

    getDEG = (params = {}) => {
        let workflow = Object.assign({}, this.state.workflow);
        if (!params.hasOwnProperty("search_keyword")) {
            params = {
                page_size: 10,
                page_number: 1,
                sorting: {
                    name: "P.Value",
                    order: "descend",
                },
                foldDEGs: workflow.foldDEGs,
                P_Value: workflow.pDEGs,
                search_keyword: "",
            }
        }

        if (params.search_keyword != "") {
            let keyword = params.search_keyword;
            params = {
                page_size: workflow.diff_expr_genes.pagination.pageSize,
                page_number: workflow.diff_expr_genes.pagination.current,
                sorting: {
                    name: "P.Value",
                    order: "descend",
                },
                foldDEGs: workflow.foldDEGs,
                P_Value: workflow.pDEGs,
                search_keyword: keyword
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
            }).then(
                res => res.json()
            )
            .then(result => {
                if (result.status == 200) {
                    let workflow2 = Object.assign({}, this.state.workflow);
                    const pagination = { ...workflow.diff_expr_genes.pagination };
                    // Read total count from server 
                    // pagination.total = data.totalCount;
                    pagination.total = result.data.totalCount;

                    for (let i = 0; i < result.data.records.length; i++) {
                        result.data.records[i].key = "DEG" + i;
                    }

                    workflow2.diff_expr_genes = {
                        loading: false,
                        data: result.data.records,
                        pagination,
                    }
                    this.setState({ workflow: workflow2 });
                } else {
                    message.warning('no data');
                }

            });
    }

    getHeatmapolt() {

        try {
            fetch('./api/analysis/getHeatmapolt', {
                    method: "POST",
                    body: "",
                    processData: false,
                    contentType: false
                }).then(res => res.json())
                .then(result => {
                    if (result.status == 200) {
                        if (result.data != "") {
                            let workflow = Object.assign({}, this.state.workflow);
                            let HeatMapIframe = <div><iframe title={"Heatmap"} src={"./images/"+workflow.projectID+result.data}  width={'90%'} height={'90%'} frameBorder={'0'}/></div>

                            workflow.postplot = <div>{HeatMapIframe}</div>;
                            this.setState({ workflow: workflow });
                        } else {
                            let workflow = Object.assign({}, this.state.workflow);
                            workflow.postplot = "No Data";
                            this.setState({ workflow: workflow });
                        }

                    } else {
                        message.error('Load histplot fails.');
                    }

                })
        } catch (error) {
            message.error('Load data fails.');
        }

    }
    getPCA() {

        try {
            fetch('./api/analysis/getPCA', {
                    method: "POST",
                    body: "",
                    processData: false,
                    contentType: false
                }).then(res => res.json())
                .then(result => {
                    if (result.status == 200) {
                        if (result.data != "") {
                            let pcaData = result.data;
                            var PCAIframe = <Plot  data={[{

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
                                        autosize:true,
                                        margin: {
                                            l: 0,
                                            r: 0,
                                            b: 0,
                                            t: 0
                                        },
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
                            workflow.postplot = <div> {PCAIframe}</div>;
                            this.setState({ workflow: workflow });
                        } else {
                            let workflow = Object.assign({}, this.state.workflow);
                            workflow.postplot = "No Data";
                            this.setState({ workflow: workflow });

                        }


                    } else {
                        message.error('Load histplot fails.');
                    }

                })
        } catch (error) {
            message.error('Load data fails.');
        }

    }
    getBoxplotAN() {
        try {
            fetch('./api/analysis/getBoxplotAN', {
                    method: "POST",
                    body: "",
                    processData: false,
                    contentType: false
                }).then(res => res.json())
                .then(result => {
                    if (result.status == 200) {
                        if (result.data != "") {
                            let BoxplotRenderData = []
                            let BoxplotsData = result.data
                            for (let i = 0; i < result.data.col.length - 1; i++) {

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

                            let plot_layout = { showlegend: false, autosize: true }
                            let plot_style = {}

                            let Boxplots = <Plot  data={BoxplotRenderData} layout={plot_layout}  style={plot_style} useResizeHandler={true}/>

                            let workflow = Object.assign({}, this.state.workflow);
                            workflow.postplot = <div> {Boxplots}</div>;
                            this.setState({ workflow: workflow });
                        } else {
                            let workflow = Object.assign({}, this.state.workflow);
                            workflow.postplot = "No Data";
                            this.setState({ workflow: workflow });

                        }


                    } else {
                        message.error('Load histplot fails.');
                    }

                })
        } catch (error) {
            message.error('Load data fails.');
        }

    }

    getHistplotAN() {
        try {
            fetch('./api/analysis/getHistplotAN', {
                    method: "POST",
                    body: "",
                    processData: false,
                    contentType: false
                }).then(res => res.json())
                .then(result => {
                    if (result.status == 200) {
                        if (result.data != "") {
                            let workflow = Object.assign({}, this.state.workflow);
                            let histplotANLink = './images/' + workflow.projectID + result.data;
                            let histplotAN = <div><img src={ histplotANLink } style={{ width: "75%" }} alt="Histogram" /></div>;

                            workflow.postplot = histplotAN;
                            this.setState({ workflow: workflow });
                        } else {
                            let workflow = Object.assign({}, this.state.workflow);
                            workflow.postplot = "No Data";
                            this.setState({ workflow: workflow });
                        }

                    } else {
                        message.error('Load histplot fails.');
                    }

                })
        } catch (error) {
            message.error('Load data fails.');
        }
    }

    getMAplotAN() {
        try {
            fetch('./api/analysis/getMAplotAN', {
                    method: "POST",
                    body: "",
                    processData: false,
                    contentType: false
                }).then(res => res.json())
                .then(result => {
                    if (result.status == 200) {
                        let workflow = Object.assign({}, this.state.workflow);
                        if (result.data != "") {
                            let list_mAplotBN = [];
                            for (let i = result.data.length - 1; i >= 0; i--) {
                                let link = "./images/" + workflow.projectID + result.data[i]
                                list_mAplotBN.push(<div key={"mAplotBN"+i}  > <img  src={ link } style ={{ width: "75%" }} alt="MAplot"/> </div>)
                            }
                            let maplot_style = {
                                'height': 'auto',
                                'maxHeight': '100%',
                                'overflow': 'scroll'
                            };


                            workflow.postplot = <div style={ maplot_style } > { list_mAplotBN } </div>;
                            this.setState({ workflow: workflow });

                        } else {

                            let workflow = Object.assign({}, this.state.workflow);
                            workflow.postplot = "No Data";
                            this.setState({ workflow: workflow });

                        }


                    } else {
                        message.error('Load histplot fails.');
                    }

                })
        } catch (error) {
            message.error('Load data fails.');
        }

    }
    getNUSE() {
        try {
            fetch('./api/analysis/getNUSE', {
                    method: "POST",
                    body: "",
                    processData: false,
                    contentType: false
                }).then(res => res.json())
                .then(result => {
                    if (result.status == 200) {

                        let NUSERenderData = []
                        let NUSEplotsData = result.data
                        for (let i = 0; i < result.data.col.length - 1; i++) {

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

                        let plot_layout = { showlegend: false, autosize: true }
                        let plot_style = {}

                        let NUSE = <Plot  data={NUSERenderData} layout={plot_layout}  style={plot_style} useResizeHandler={true}/>

                        let workflow = Object.assign({}, this.state.workflow);
                        workflow.preplots = <div> {NUSE}</div>;
                        this.setState({ workflow: workflow });


                    } else {
                        message.error('Load histplot fails.');
                    }

                })
        } catch (error) {
            message.error('Load data fails.');
        }
    }

    getRLE() {

        try {
            fetch('./api/analysis/getRLE', {
                    method: "POST",
                    body: "",
                    processData: false,
                    contentType: false
                }).then(res => res.json())
                .then(result => {
                    if (result.status == 200) {
                        if (result.data != "") {
                            let RLERenderData = []
                            let RLEplotsData = result.data
                            for (let i = 0; i < result.data.col.length - 1; i++) {

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


                            let plot_layout = { showlegend: false, autosize: true }
                            let plot_style = {}

                            let RLE = <Plot data={RLERenderData} layout={plot_layout}  style={plot_style} useResizeHandler={true}/>


                            let workflow = Object.assign({}, this.state.workflow);
                            workflow.preplots = <div> {RLE}</div>;
                            this.setState({ workflow: workflow });
                        } else {
                            let workflow = Object.assign({}, this.state.workflow);
                            workflow.preplots = "No Data";
                            this.setState({ workflow: workflow });
                        }


                    } else {
                        message.error('Load histplot fails.');
                    }

                })
        } catch (error) {
            message.error('Load data fails.');
        }


    }

    getBoxplotBN() {

        try {
            fetch('./api/analysis/getBoxplotBN', {
                    method: "POST",
                    body: "",
                    processData: false,
                    contentType: false
                }).then(res => res.json())
                .then(result => {
                    if (result.status == 200) {
                        if (result.data != "") {
                            let BoxplotRenderData = []
                            let BoxplotsData = result.data
                            for (let i = 0; i < result.data.col.length - 1; i++) {

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

                            let plot_layout = { showlegend: false, autosize: true }
                            let plot_style = {}

                            let Boxplots = <Plot  data={BoxplotRenderData} layout={plot_layout}  style={plot_style} useResizeHandler={true}/>

                            let workflow = Object.assign({}, this.state.workflow);
                            workflow.preplots = <div> {Boxplots}</div>;
                            this.setState({ workflow: workflow });
                        } else {

                            let workflow = Object.assign({}, this.state.workflow);
                            workflow.preplots = "No Data";
                            this.setState({ workflow: workflow });
                        }


                    } else {
                        message.error('Load histplot fails.');
                    }

                })
        } catch (error) {
            message.error('Load data fails.');
        }

    }

    getMAplotsBN() {

        try {
            fetch('./api/analysis/getMAplotsBN', {
                    method: "POST",
                    body: "",
                    processData: false,
                    contentType: false
                }).then(res => res.json())
                .then(result => {
                    if (result.status == 200) {
                        if (result.data != "") {
                            let workflow = Object.assign({}, this.state.workflow);
                            let list_mAplotBN = [];
                            for (let i = result.data.length - 1; i >= 0; i--) {
                                let link = "./images/" + workflow.projectID + result.data[i]
                                list_mAplotBN.push(<div key={"mAplotBN"+i}  > <img  src={ link } style ={{ width: "75%" }} alt="MAplot"/> </div>)
                            }
                            let maplot_style = {
                                'height': 'auto',
                                'maxHeight': '100%',
                                'overflow': 'scroll'
                            };


                            workflow.preplots = <div style={ maplot_style } > { list_mAplotBN } </div>;
                            this.setState({ workflow: workflow });

                        } else {
                            let workflow = Object.assign({}, this.state.workflow);
                            workflow.preplots = "No Data";
                            this.setState({ workflow: workflow });

                        }


                    } else {
                        message.error('Load histplot fails.');
                    }

                })
        } catch (error) {
            message.error('Load data fails.');
        }
    }


    getHistplotBN() {

        try {
            fetch('./api/analysis/getHistplotBN', {
                    method: "POST",
                    body: "",
                    processData: false,
                    contentType: false
                }).then(res => res.json())
                .then(result => {
                    if (result.status == 200) {
                        if (result.data != "") {
                            let workflow = Object.assign({}, this.state.workflow);
                            let histplotBNLink = './images/' + workflow.projectID + result.data;
                            let histplotBN = <div><img src={ histplotBNLink } style={{ width: "75%" }} alt="Histogram" /></div>;
                            workflow.preplots = histplotBN;
                            this.setState({ workflow: workflow });

                        } else {
                            let workflow = Object.assign({}, this.state.workflow);
                            workflow.preplots = "No Data";
                            this.setState({ workflow: workflow });

                        }


                    } else {
                        message.error('Load histplot fails.');
                    }

                })
        } catch (error) {
            message.error('Load data fails.');
        }

    }



    changeDeg(obj) {
        let workflow = Object.assign({}, this.state.workflow);
        if (obj.pagination) {
            workflow.diff_expr_genes = obj;
        } else {
            obj.pagination = workflow.pagination;
            workflow.diff_expr_genes = obj;
        }

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
        this.setState({ workflow: workflow });
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
        let workflow = Object.assign({}, this.state.workflow);
        workflow.current_working_on_object = e;
        this.setState({ workflow: workflow });
    }

    changeProject(event) {
        let workflow = Object.assign({}, this.state.workflow);
        workflow.projectID = event.target.value;
        this.setState({ workflow: workflow });
    }

    changePDEGs = (event) => {
        let workflow = Object.assign({}, this.state.workflow);
        workflow.pDEGs = event.target.value;
        this.setState({ workflow: workflow });
    }

    changeFoldDEGs = (event) => {
        let workflow = Object.assign({}, this.state.workflow);
        workflow.foldDEGs = event.target.value;
        this.setState({ workflow: workflow });
    }

    changePathways = (event) => {
        let workflow = Object.assign({}, this.state.workflow);
        workflow.pPathways = event.target.value;
        this.setState({ workflow: workflow });
    }

    handleGeneChange = (value) => {
        let workflow = Object.assign({}, this.state.workflow);
        workflow.species = value.split("$")[0];
        workflow.genSet = value.split("$")[1];
        this.setState({ workflow: workflow });
    }


    changeFoldSSGSEA = (event) => {
        let workflow = Object.assign({}, this.state.workflow);
        workflow.foldssGSEA = event.target.value;
        this.setState({ workflow: workflow });
    }

    changePssGSEA = (event) => {
        let workflow = Object.assign({}, this.state.workflow);
        workflow.pssGSEA = event.target.value;
        this.setState({ workflow: workflow });
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
        window.location.reload(true);
    }



    loadGSE = () => {

        let workflow = Object.assign({}, this.state.workflow);
        let reqBody = {};
        reqBody.code = "";
        reqBody.projectId = "";
        reqBody.groups = "";

        document.getElementById("btn-project-load-gse").className = "ant-btn upload-start ant-btn-default"

        if (workflow.dataList != "") {
            // user click load after data already loaded.then it is a new transaction 
            window.location.reload(true);
        }
        if (workflow.accessionCode == "") {
            message.warning('Accession Code is required. ');
            return;
        }
        reqBody.code = workflow.accessionCode;


        // this pid will be used to create a tmp folder to store the data. 
        workflow.projectID = this.uuidv4();
        reqBody.projectId = workflow.projectID;

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
                .then(res => res.json())
                .then(result => {
                    if (result.status == 200) {
                        if (result.data === "undefined" || Object.keys(result.data).length === 0) {
                            document.getElementById("btn-project-load-gse").className = "ant-btn upload-start ant-btn-primary"

                            workflow.uploading = false;
                            workflow.progressing = false;
                            message.error('Load data fails');
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
                            message.error('Load data fails');
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
                            message.error('Load data fails');
                            this.setState({
                                workflow: workflow
                            });

                            return;
                        }

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

                        message.success('load successfully.');

                    } else {
                        document.getElementById("btn-project-load-gse").className = "ant-btn upload-start ant-btn-primary"

                        workflow.uploading = false;
                        workflow.progressing = false;
                        this.setState({
                            workflow: workflow
                        });

                        message.error('load data fails.');
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

            message.error('load data fails.');

        }
    }

    runContrast = () => {
        let workflow = Object.assign({}, this.state.workflow);
        let reqBody = {};
        reqBody.code = "";
        reqBody.projectId = "";
        reqBody.groups = "";
        reqBody.actions = "";
        reqBody.pDEGs = "";
        reqBody.foldDEGs = "";
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

        if (workflow.pDEGs == "" || workflow.foldDEGs == "" || workflow.pPathways == "" || workflow.foldssGSEA == "" || workflow.pssGSEA == "") {
            message.warning('All the threshold is required!');
            return;
        }

        reqBody.genSet = workflow.genSet;
        reqBody.pssGSEA = workflow.pssGSEA;
        reqBody.foldssGSEA = workflow.foldssGSEA;
        reqBody.pDEGs = workflow.pDEGs;
        reqBody.foldDEGs = workflow.foldDEGs;
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
                pageSize: 10,

            },
            loading: true,
        };
        workflow.ssGSEA = {
            data: [],
            pagination: {
                current: 1,
                pageSize: 10,

            },
            loading: true,
        };
        workflow.pathways_up = {

            data: [],
            pagination: {
                current: 1,
                pageSize: 10,

            },
            loading: true,
        };
        workflow.pathways_down = {
            data: [],
            pagination: {
                current: 1,
                pageSize: 10,

            },
            loading: true,
        };
        workflow.preplots = "";
        workflow.postplot = "";

        this.setState({
            workflow: workflow
        });

        try {
            fetch('./api/analysis/runContrast', {
                    method: "POST",
                    body: JSON.stringify(reqBody),
                    credentials: "same-origin",
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                .then(function(response) {
                    if (!response.ok) {
                        throw Error(response.statusText);
                    }
                    return response.json();
                }).then(result => {
                    if (result.status == 200) {
                        let type = workflow.current_working_on_object;

                        if (type == "getHistplotAN") {
                            this.getHistplotAN();
                        }

                        if (type == "getBoxplotAN") {

                            this.getBoxplotAN();
                        }

                        if (type == "getMAplotAN") {
                            this.getMAplotAN();
                        }

                        if (type == "getPCA") {

                            this.getPCA();
                        }

                        if (type == "getHeatmapolt") {
                            this.getHeatmapolt();
                        }


                        if (type == "getHistplotBN") {
                            this.getHistplotBN();
                        }

                        if (type == "getMAplotsBN") {
                            this.getMAplotsBN();
                        }

                        if (type == "getBoxplotBN") {
                            this.getBoxplotBN();

                        }

                        if (type == "getRLE") {
                            this.getRLE();
                        }

                        if (type == "getNUSE") {
                            this.getNUSE();
                        }

                        if (type == "volcanoPlot") {
                            workflow.volcanoPlot = "/volcano.html";
                        }

                        if (type == "pathwayHeatMap") {
                            workflow.geneHeatmap = "/ssgseaHeatmap1.jpg";
                        }

                        if (type == "pathways_up") {

                            this.getPathwayUp()
                        }

                        if (type == "pathways_down") {
                            this.getPathwayDown();
                        }

                        if (type == "ssGSEA") {
                            this.getssGSEA();
                        }

                        if (type == "deg") {
                            this.getDEG();
                        }

                        if (type == "Pre-normalization_QC_Plots") {
                                this.getHistplotBN();
                         
                        }

                        if (type == "Post-normalization_Plots") {
                                this.getHistplotAN();
                           
                        }

                        if (type == "DEG-Enrichments_Results") {
                                this.getPathwayUp();
                                this.getPathwayDown();
                                this.getDEG();
                        }

                        if (type == "GSM_1") {
                            // do nothing
                        }

                        if (type == "ssGSEA_Results") {
                                this.getssGSEA();
                        }

                        workflow.geneHeatmap = "/ssgseaHeatmap1.jpg";
                        workflow.progressing = false;
                        workflow.compared = true;
                        workflow.done_gsea = true;
                        workflow.progressing = false;
                        this.setState({
                            workflow: workflow
                        });
                        message.success('Plots loaded successfully.');
                    } else {

                        workflow.progressing = false;
                        this.setState({
                            workflow: workflow
                        });
                        message.warning('Generate plots fails.');
                    }

                });
        } catch (err) {

            workflow.uploading = false;
            workflow.progressing = false;
            message.success('Run contrast fails');
            console.log(err);
            this.setState({
                workflow: workflow
            });
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
                }).then(res => res.json())
                .then(result => {
                    if (result.status == 200) {
                        var data = result.data.split("+++getCELfiles+++\"")[1]

                        if (typeof(data) === "undefined" || data == "") {

                            workflow.uploading = false;
                            workflow.progressing = false;
                            message.error('update data fails');
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
                            message.err('load data fails.');
                            return;
                        }
                        for (let i in list.files) {
                            list.files[i]["gsm"] = list.files[i]["_row"];
                            //list.files[i]["gsm"]=list.files[i].title.split("_")[0];
                        }
                        workflow.dataList = list.files;

                        // change the word of load btn
                        document.getElementById("btn-project-upload").disabled = true

                        // init group with default value
                        workflow.group = new Array(list.files.length).fill('Ctl');
                        workflow.uploaded = true;
                        this.setState({
                            workflow: workflow
                        });
                        message.success('load successfully.');
                    } else {

                        workflow.uploading = false;
                        workflow.progressing = false;
                        workflow.uploaded = true;
                        this.setState({
                            workflow: workflow
                        });
                        message.error('load data fails.');
                    }
                });
        } catch (error) {


            workflow.uploading = false;
            workflow.progressing = false;
            workflow.uploaded = true;
            this.setState({
                workflow: workflow
            });
            message.error('load data fails.');
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
            this.setState({
                workflow: workflow
            });
            message.success('Add group successfully.');
        } else {
            message.success('The group name only allows ASCII or numbers or underscore and it cannot start with numbers. Valid Group Name Example : RNA_1');
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
        message.success('Delete  group successfully.');

    }

    hideWorkFlow = () => {
        document.getElementsByClassName("container-board-left")[0].style.display = 'none';
        document.getElementsByClassName("container-board-right")[0].style.width = document.getElementById("header-nci").offsetWidth - 50;
        document.getElementById("panel-show").style.display = 'inherit';
        document.getElementById("panel-hide").style.display = 'none';
    }

    showWorkFlow = () => {
        document.getElementsByClassName("container-board-left")[0].style.display = 'block';
        document.getElementsByClassName("container-board-right")[0].removeAttribute("style");
        document.getElementById("panel-show").style.display = 'none';
        document.getElementById("panel-hide").style.display = 'inherit';
    }


    render() {
        let modal = this.state.workflow.progressing ? "progress" : "progress-hidden";
        const antIcon = <Icon type="loading" style={{ fontSize: 48, width:48,height:48 }} spin />;
        return (
            <div className="content">
                <div className="container container-board">
                
                  <Workflow data={this.state.workflow}
                        handleGeneChange={this.handleGeneChange} changeFoldSSGSEA={this.changeFoldSSGSEA} changePssGSEA={this.changePssGSEA}
                        resetWorkFlowProject={this.resetWorkFlowProject}  changeProject={this.changeProject} 
                        changeCode={this.changeCode} handleSelectType={this.handleSelectType}  
                        fileRemove={this.fileRemove} beforeUpload={this.beforeUpload} handleUpload={this.handleUpload} 
                        loadGSE={this.loadGSE} handleGroup1Select={this.handleGroup1Select}  handleGroup2Select={this.handleGroup2Select} 
                        changePDEGs={this.changePDEGs} changeFoldDEGs={this.changeFoldDEGs} changePathways={this.changePathways} runContrast={this.runContrast}/>
                    <div style={{'paddingTop':'10px',"width":"16px","float":"left"}}><label>
                      <a id="panel-hide" onClick={this.hideWorkFlow} size="small" ><Icon type="caret-left" /></a>
                      <a id="panel-show" onClick={this.showWorkFlow}  size="small" style={{"display":"none"}}><Icon type="caret-right" /></a>

                  </label></div>
                  <DataBox  data={this.state.workflow} 
                            upateCurrentWorkingTabAndObject={this.upateCurrentWorkingTabAndObject} 
                            assignGroup={this.assignGroup} 
                            deleteGroup={this.deleteGroup}
                            changeDeg={this.changeDeg}
                            changePathways_up={this.changePathways_up}
                            changePathways_down={this.changePathways_down}
                            changessGSEA={this.changessGSEA}

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
                    <Spin indicator={antIcon} style={{color:"black"}} />
                    <label className="loading-info">{this.state.workflow.loading_info}</label>
                    </div>
                </div>
            </div>
        );
    }
}

export default Analysis;