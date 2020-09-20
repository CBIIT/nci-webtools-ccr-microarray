import { Spin, Icon, Button, Modal } from 'antd';
import React, { Component } from 'react';
import Workflow from '../Workflow/Workflow';
import DataBox from '../DataBox/DataBox';
import About from '../About/About';
import Help from '../Help/Help';
import Plot from 'react-plotly.js';
import XLSX from 'xlsx';
import CIframe from '../DataBox/CIframe';
import ReactGA from 'react-ga';

ReactGA.initialize('UA-62346354-19', {
  userId: 'nciwebtools',
});

const httpErrorMessage = {
  400: 'Bad Request',
  401: 'Unauthorized',
  404: 'Not Found',
  403: 'Forbidden',
  405: 'Method Not Allowed',
  408: 'Request Timeout',
  500: 'Internal Server Error',
  501: 'Not Implemented',
  502: 'Bad Gateway',
  503: 'Service Unavailable',
  504: 'Gateway Timeout',
  505: 'HTTP Version Not Supported',
};

const defaultState = {
  workflow: {
    tab_activeKey: 'GSM_1',
    numberOfTasksInQueue: 0,
    QueueModalvisible: false,
    useQueue: true,
    token: '',
    projectID: '',
    analysisType: '0',
    accessionCode: '',
    fileList: [],
    uploading: false,
    progressing: false,
    loading_info: 'Loading',
    dataList: [],
    groups: [],
    group_1: '-1',
    group_2: '-1',
    pDEGs: 0.05,
    foldDEGs: 1.5,
    species: 'human',
    genSet: 'H: Hallmark Gene Sets',
    compared: false,
    uploaded: false,
    done_gsea: false,
    current_working_on_object: '',
    current_working_on_tag: '',
    tag_pre_plot_status: '',
    tag_post_plot_status: '',
    tag_deg_plot_status: '',
    tag_ssgea_plot_status: '',
    diff_expr_genes: {
      message: '',
      data: [],
      pagination: {
        current: 1,
        pageSize: 25,
      },
      loading: true,
      page_number: 1,
      page_size: 25,
      sorting: {
        name: 'P.Value',
        order: 'ascend',
      },
      search_keyword: {
        search_symbol: '',
        search_fc: '1.5',
        search_p_value: '0.05',
        search_adj_p_value: '',
        search_aveexpr: '',
        search_accnum: '',
        search_desc: '',
        search_entrez: '',
        search_probsetid: '',
        search_t: '',
        search_b: '',
      },
    },
    ssGSEA: {
      message: '',
      data: [],
      pagination: {
        current: 1,
        pageSize: 25,
      },
      loading: true,
      page_size: 25,
      page_number: 1,
      sorting: {
        name: 'P.Value',
        order: 'ascend',
      },
      search_keyword: {
        name: '',
        search_logFC: '',
        search_Avg_Enrichment_Score: '',
        search_t: '',
        search_p_value: '',
        search_adj_p_value: '',
        search_b: '',
      },
    },
    pathways_up: {
      message: '',
      data: [],
      pagination: {
        current: 1,
        pageSize: 25,
      },
      sorting: {
        name: 'P_Value',
        order: 'ascend',
      },
      loading: true,
      search_keyword: {
        Pathway_Name: '',
        Category: '',
        P_Value: '0.05',
        Enrichment_Score: '',
        Percent_Gene_Hits_per_Pathway: '',
        Significant_Genes_IN_Pathway: '',
        'Non-Significant_genes_IN_Pathway': '',
        'Non-Significant_Genes_NOT_IN_Pathway': '',
        Pathway_ID: '',
        Gene_List: '',
      },
    },
    pathways_down: {
      message: '',
      data: [],
      pagination: {
        current: 1,
        pageSize: 25,
      },
      loading: true,
      sorting: {
        name: 'P_Value',
        order: 'ascend',
      },
      search_keyword: {
        Pathway_Name: '',
        Category: '',
        P_Value: '0.05',
        Enrichment_Score: '',
        Percent_Gene_Hits_per_Pathway: '',
        Significant_Genes_IN_Pathway: '',
        'Non-Significant_genes_IN_Pathway': '',
        'Non-Significant_Genes_NOT_IN_Pathway': '',
        Pathway_ID: '',
        Gene_List: '',
      },
    },
    BoxplotBN: {
      data: '',
      plot: '',
      style: {
        width: '800',
      },
      layout: {
        showlegend: false,
        autoSize: true,
      },
    },
    RLE: {
      data: '',
      plot: '',
      style: {
        width: '800',
      },
      layout: {
        showlegend: false,
        autoSize: true,
      },
    },
    NUSE: {
      data: '',
      plot: '',
      style: {
        width: '800',
      },
      layout: {
        showlegend: false,
        autoSize: true,
      },
    },
    preplots: {
      selected: 'preHistogram',
      histplotBN: '',
      list_mAplotBN: '',
      NUSE: '',
      RLE: '',
      Boxplots: '',
    },
    degSelected: 'deg_tag1',
    ssSelect: 'ss_tag1',
    geneSelect: 'human$H: Hallmark Gene Sets',
    list_mAplotBN: '',
    list_mAplotAN: '',
    BoxplotAN: {
      data: '',
      plot: '',
      style: {
        width: '800',
      },
      layout: {
        showlegend: false,
        autoSize: true,
      },
    },
    PCA: {
      data: '',
      plot: '',
      style: {},
      layout: {},
    },
    postplot: {
      selected: 'postHistogram',
      histplotAN: '',
      list_mAplotAN: '',
      Heatmapolt: '',
      Boxplots: '',
      PCA: '',
    },
    geneHeatmap:
      'Not enough significant pathways available with p-value < 0.05.',
    volcanoPlot: 'No Data',
    volcanoPlotName: '/volcano.html',
    normal: 'RMA',
    histplotBN_url: '',
    histplotAN_url: '',
    heatmapolt_url: '',
    batches: [],
    loadChip: '',
    chip: '',
    multichip: false,
    dataListChip: [],
    disableContrast: false,
  },
};

class Analysis extends Component {
  constructor(props) {
    super(props);
    this.state = Object.assign({}, defaultState);
    this.getCurrentNumberOfJobsinQueue();
  }
  componentDidMount() {
    if (this.props.location.search && this.props.location.search != '') {
      this.state = Object.assign({}, defaultState);
      this.state.workflow.progressing = true;
      this.initWithCode(
        this.props.location.search.substring(
          1,
          this.props.location.search.length
        )
      );
      if (window.location.search == '') {
        ReactGA.pageview(window.location.pathname + '#about');
      } else {
        ReactGA.pageview(window.location.pathname + window.location.search);
      }
    }
    // listen windows resize event
    window.addEventListener('resize', this.updateDimensions);
    this.updateSupportEmail();
  }
  componentDidCatch(error, info) {
    // Display fallback UI
    this.resetWorkFlowProject();
    document.getElementById('message-gsm').innerHTML = error;
    document.getElementById('message-gsm').nextSibling.innerHTML = '';
  }
  // release the listener
  componentWillUnmount() {
    window.removeEventListener('resize', this.updateDimensions);
  }
  updateDimensions = () => {
    // reset container-board-right
    if (
      document.body.clientWidth -
        document.getElementsByClassName('container-board-left')[0].clientWidth <
      300
    ) {
      // mobile model
      document.getElementsByClassName('container-board-right')[0].style.width =
        document.getElementsByClassName('container-board-left')[0].clientWidth +
        'px';
    } else {
      document.getElementsByClassName('container-board-right')[0].style.width =
        this.getElementByXpath('//*[@id="tab_analysis"]/div[1]').clientWidth -
        document.getElementsByClassName('container-board-left')[0].clientWidth -
        80 +
        'px';
    }
  };
  getElementByXpath = (path) => {
    return document.evaluate(
      path,
      document,
      null,
      XPathResult.FIRST_ORDERED_NODE_TYPE,
      null
    ).singleNodeValue;
  };
  changeRunContrastMode = (params = false) => {
    let workflow = Object.assign({}, this.state.workflow);
    if (params) {
      workflow.useQueue = true;
    } else {
      workflow.useQueue = false;
    }
    this.setState({ workflow: workflow });
  };
  //use for generate UUID
  uuidv4() {
    return 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = (Math.random() * 16) | 0,
        v = c == 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  updateSupportEmail = () => {
    fetch('./api/analysis/getConfiguration', {
      method: 'POST',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(this.handleErrors)
      .then((res) => res.json())
      .then((result) => {
        if (result.status == 200) {
          // change
          document.getElementById('support_email').href =
            'mailto:' +
            result.data.mail.support_email +
            '?subject=MicroArray Support';
        }
      });
  };
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
      search_keyword: workflow.ssGSEA.search_keyword,
    };
    workflow.progressing = true;
    workflow.loading_info = 'Export';
    this.setState({ workflow: workflow });
    fetch('./api/analysis/getGSEA', {
      method: 'POST',
      body: JSON.stringify(params),
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(this.handleErrors)
      .then((res) => res.json())
      .then((result) => {
        if (result.status == 200) {
          let workflow = Object.assign({}, this.state.workflow);
          var wb = XLSX.utils.book_new();
          wb.Props = {
            Title: 'Export ssGSEA Data',
            Subject: 'ssGSEA Data',
            Author: 'Microarray',
            CreatedDate: new Date(),
          };
          if (workflow.dataList.length != 0) {
            wb.SheetNames.push('Settings');
            var ws_data = [];
            if (workflow.analysisType == '1') {
              // Upload
              ws_data.push(['Analysis Type', 'CEL Files']);
              let uploadD = '';
              for (var i in workflow.dataList) {
                uploadD = workflow.dataList[i].title + ',' + uploadD;
              }
              ws_data.push(['Upload Data', uploadD]);
            }
            if (workflow.analysisType == '0') {
              ws_data.push(['Analysis Type', 'GEO Data']);
              ws_data.push(['Accession Code', workflow.accessionCode]);
            }
            ws_data.push([
              'Contrasts',
              workflow.group_1 + ' vs ' + workflow.group_2,
            ]);
            let group_1_gsm = '';
            let group_2_gsm = '';
            for (var i in workflow.dataList) {
              if (workflow.dataList[i].groups == workflow.group_1) {
                group_1_gsm = workflow.dataList[i].gsm + ',' + group_1_gsm;
              }

              if (workflow.dataList[i].groups == workflow.group_2) {
                group_2_gsm = workflow.dataList[i].gsm + ',' + group_2_gsm;
              }
            }
            ws_data.push([workflow.group_1, group_1_gsm]);
            ws_data.push([workflow.group_2, group_2_gsm]);
            ws_data.push(['Type', 'Single Sample GSEA']);
            ws_data.push(['Filters', '']);
            if (workflow.ssGSEA.search_keyword.name != '') {
              ws_data.push(['sorting.order', workflow.ssGSEA.sorting.order]);
            }
            if (workflow.ssGSEA.search_keyword.search_logFC != '') {
              ws_data.push([
                'logFC',
                workflow.ssGSEA.search_keyword.search_logFC,
              ]);
            }
            if (workflow.ssGSEA.search_keyword.search_p_value != '') {
              ws_data.push([
                'P.Value',
                workflow.ssGSEA.search_keyword.search_p_value,
              ]);
            }
            if (workflow.ssGSEA.search_keyword.search_adj_p_value != '') {
              ws_data.push([
                'adj.P.value',
                workflow.ssGSEA.search_keyword.search_adj_p_value,
              ]);
            }
            if (
              workflow.ssGSEA.search_keyword.search_Avg_Enrichment_Score != ''
            ) {
              ws_data.push([
                'Avg.Enrichment.Score',
                workflow.ssGSEA.search_keyword.search_Avg_Enrichment_Score,
              ]);
            }
            if (workflow.ssGSEA.search_keyword.search_b != '') {
              ws_data.push(['B', workflow.ssGSEA.search_keyword.search_b]);
            }
            if (workflow.ssGSEA.search_keyword.search_t != '') {
              ws_data.push(['t', workflow.ssGSEA.search_keyword.search_t]);
            }
            var ws = XLSX.utils.aoa_to_sheet(ws_data);
            wb.Sheets['Settings'] = ws;
            wb.SheetNames.push('Results');
            // export data
            let degData = result.data.records;
            let exportData = [
              [
                'NAME',
                'logFC',
                'Avg.Enrichment.Score',
                't',
                'P.Value',
                'adj.P.Val',
                'B',
              ],
            ];
            for (let i in degData) {
              exportData.push([
                degData[i]['V1'],
                degData[i]['V2'],
                degData[i]['V3'],
                degData[i]['V4'],
                degData[i]['V5'],
                degData[i]['V6'],
                degData[i]['V7'],
              ]);
            }
            var ws2 = XLSX.utils.aoa_to_sheet(exportData);
            wb.Sheets['Results'] = ws2;
            var wbout = XLSX.writeFile(
              wb,
              'ssGSEA_' + workflow.projectID + '.xlsx',
              {
                bookType: 'xlsx',
                type: 'binary',
              }
            );
          }
        } else {
          workflow.ssGSEA.message = result.msg;
        }
        workflow.progressing = false;
        workflow.loading_info = 'Loading';
        this.setState({ workflow: workflow });
      })
      .catch(function (err) {
        let workflow = Object.assign({}, this.state.workflow);
        workflow.progressing = false;
        workflow.loading_info = 'Loading';
        workflow.ssGSEA.message = err;
        this.setState({ workflow: workflow });
      });
  };
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
        search_keyword: params.search_keyword,
      };
      workflow.ssGSEA.sorting = params.sorting;
      workflow.ssGSEA.pagination = {
        current: params.page_number,
        pageSize: params.page_size,
      };
      workflow.ssGSEA.search_keyword = params.search_keyword
        ? params.search_keyword
        : workflow.ssGSEA.search_keyword;
    } else {
      params = {
        projectId: workflow.projectID,
        page_number: workflow.ssGSEA.pagination.current,
        page_size: workflow.ssGSEA.pagination.pageSize,
      };
      params.sorting = workflow.ssGSEA.sorting;
      params.search_keyword = workflow.ssGSEA.search_keyword;
      workflow.ssGSEA.pagination = {
        current: workflow.ssGSEA.pagination.current,
        pageSize: workflow.ssGSEA.pagination.pageSize,
      };
    }
    workflow.ssGSEA.loading = true;
    this.setState({ workflow: workflow });
    fetch('./api/analysis/getGSEA', {
      method: 'POST',
      body: JSON.stringify(params),
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(this.handleErrors)
      .then((res) => res.json())
      .then((result) => {
        let workflow2 = Object.assign({}, this.state.workflow);
        workflow2.ssGSEA.message = '';
        if (result.status == 200) {
          const pagination = { ...workflow2.ssGSEA.pagination };
          pagination.total = result.data.totalCount;
          for (let i = 0; i < result.data.records.length; i++) {
            result.data.records[i].key = 'GSEA' + i;
          }
          workflow2.ssGSEA.loading = false;
          workflow2.ssGSEA.data = result.data.records;
          workflow2.ssGSEA.pagination = pagination;
        } else {
          workflow.ssGSEA.message = result.msg;
        }
        this.setState({ workflow: workflow2 });
        this.getSSGSEAGeneHeatMap();
      })
      .catch((error) => {
        let workflow = Object.assign({}, this.state.workflow);
        workflow.ssGSEA.loading = false;
        workflow.ssGSEA.message = error;
        this.setState({ workflow: workflow });
      });
  };
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
      search_keyword: workflow.pathways_up.search_keyword,
    };
    workflow.progressing = true;
    workflow.loading_info = 'Export';
    this.setState({ workflow: workflow });
    fetch('./api/analysis/getUpPathWays', {
      method: 'POST',
      body: JSON.stringify(params),
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(this.handleErrors)
      .then((res) => res.json())
      .then((result) => {
        if (result.status == 200) {
          let workflow = Object.assign({}, this.state.workflow);
          var wb = XLSX.utils.book_new();
          wb.Props = {
            Title: 'Export Pathways For Upregulated Genes Data',
            Subject: 'Pathways For Upregulated Genes Data',
            Author: 'Microarray',
            CreatedDate: new Date(),
          };
          if (workflow.dataList.length != 0) {
            wb.SheetNames.push('Settings');
            var ws_data = [];
            if (workflow.analysisType == '1') {
              ws_data.push(['Analysis Type', 'CEL Files']);

              let uploadD = '';

              for (var i in workflow.dataList) {
                uploadD = workflow.dataList[i].title + ',' + uploadD;
              }

              ws_data.push(['Upload Data', uploadD]);
            }
            if (workflow.analysisType == '0') {
              ws_data.push(['Analysis Type', 'GEO Data']);
              ws_data.push(['Accession Code', workflow.accessionCode]);
            }

            ws_data.push([
              'Contrasts',
              workflow.group_1 + ' vs ' + workflow.group_2,
            ]);
            let group_1_gsm = '';
            let group_2_gsm = '';
            for (var i in workflow.dataList) {
              if (workflow.dataList[i].groups == workflow.group_1) {
                group_1_gsm = workflow.dataList[i].gsm + ',' + group_1_gsm;
              }

              if (workflow.dataList[i].groups == workflow.group_2) {
                group_2_gsm = workflow.dataList[i].gsm + ',' + group_2_gsm;
              }
            }
            ws_data.push([workflow.group_1, group_1_gsm]);
            ws_data.push([workflow.group_2, group_2_gsm]);
            ws_data.push(['Type', 'Pathways_For_Upregulated_Genes']);

            ws_data.push(['Filters', '']);

            for (let key in workflow.pathways_up.search_keyword) {
              if (workflow.pathways_up.search_keyword[key])
                ws_data.push([key, workflow.pathways_up.search_keyword[key]]);
            }

            var ws = XLSX.utils.aoa_to_sheet(ws_data);
            wb.Sheets['Settings'] = ws;
            wb.SheetNames.push('Results');
            // export data
            let pugData = result.data.records;
            let exportData = [Object.keys(workflow.pathways_up.search_keyword)];
            for (let data of pugData) {
              exportData.push(
                Object.keys(workflow.pathways_up.search_keyword).map((key) => {
                  return data[key];
                })
              );
            }

            var ws2 = XLSX.utils.aoa_to_sheet(exportData);
            wb.Sheets['Results'] = ws2;
            var wbout = XLSX.writeFile(
              wb,
              'DEG_' + workflow.projectID + '.xlsx',
              {
                bookType: 'xlsx',
                type: 'binary',
              }
            );
          }
        } else {
          workflow.pathways_up.message = 'export PathwayUp fails';
        }
        workflow.progressing = false;
        workflow.loading_info = 'Loading';
        this.setState({ workflow: workflow });
      })
      .catch((error) => {
        let workflow = Object.assign({}, this.state.workflow);
        workflow.progressing = false;
        workflow.loading_info = 'Loading';
        workflow.pathways_up.message = error;
        this.setState({ workflow: workflow });
      });
  };
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
        search_keyword: params.search_keyword,
      };
      workflow.pathways_up.sorting = params.sorting;
      workflow.pathways_up.pagination = {
        current: params.page_number,
        pageSize: params.page_size,
      };
      workflow.pathways_up.search_keyword = params.search_keyword;
    } else {
      params = {
        projectId: workflow.projectID,
        page_number: workflow.pathways_up.pagination.current,
        page_size: workflow.pathways_up.pagination.pageSize,
      };
      params.sorting = workflow.pathways_up.sorting;
      params.search_keyword = workflow.pathways_up.search_keyword;
      workflow.pathways_up.pagination = {
        current: workflow.pathways_up.pagination.current,
        pageSize: workflow.pathways_up.pagination.pageSize,
      };
    }
    workflow.pathways_up.loading = true;
    this.setState({ workflow: workflow }, () => {
      fetch('./api/analysis/getUpPathWays', {
        method: 'POST',
        body: JSON.stringify(params),
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then(this.handleErrors)
        .then((res) => res.json())
        .then((result) => {
          let workflow2 = Object.assign({}, this.state.workflow);
          workflow2.pathways_up.message = '';
          if (result.status == 200) {
            const pagination = { ...workflow.pathways_up.pagination };
            pagination.total = result.data.totalCount;
            for (let i = 0; i < result.data.records.length; i++) {
              result.data.records[i].key = 'pathway_up' + i;
            }
            workflow2.pathways_up.loading = false;
            workflow2.pathways_up.data = result.data.records;
            workflow2.pathways_up.pagination = pagination;
            this.setState({ workflow: workflow2 });
          } else {
            workflow2.pathways_up.loading = false;
            workflow2.pathways_up.message = JSON.stringify(result.msg);
            this.setState({ workflow: workflow2 });
          }
        })
        .catch((error) => {
          let workflow2 = Object.assign({}, this.state.workflow);
          workflow2.pathways_up.loading = false;
          workflow2.pathways_up.message = JSON.stringify(error);
          this.setState({ workflow: workflow2 });
        });
    });
  };
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
        search_keyword: params.search_keyword,
      };
      workflow.pathways_down.pagination = {
        current: params.page_number,
        pageSize: params.page_size,
      };
      workflow.pathways_down.sorting = params.sorting;
      workflow.pathways_down.search_keyword = params.search_keyword;
    } else {
      params = {
        projectId: workflow.projectID,
        page_number: workflow.pathways_down.pagination.current,
        page_size: workflow.pathways_down.pagination.pageSize,
      };
      params.sorting = workflow.pathways_down.sorting;
      params.search_keyword = workflow.pathways_down.search_keyword;
      workflow.pathways_down.pagination = {
        current: workflow.pathways_down.pagination.current,
        pageSize: workflow.pathways_down.pagination.pageSize,
      };
    }
    workflow.pathways_down.loading = true;
    this.setState({ workflow: workflow });
    fetch('./api/analysis/getDownPathWays', {
      method: 'POST',
      body: JSON.stringify(params),
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(this.handleErrors)
      .then((res) => res.json())
      .then((result) => {
        let workflow2 = Object.assign({}, this.state.workflow);
        workflow2.pathways_down.message = '';
        if (result.status == 200) {
          const pagination = { ...workflow.pathways_down.pagination };
          // Read total count from server
          // pagination.total = data.totalCount;
          pagination.total = result.data.totalCount;

          for (let i = 0; i < result.data.records.length; i++) {
            result.data.records[i].key = 'pathway_down' + i;
          }
          workflow2.pathways_down.loading = false;
          workflow2.pathways_down.data = result.data.records;
          workflow2.pathways_down.pagination = pagination;
        } else {
          workflow2.pathways_down.message = JSON.stringify(result.msg);
        }
        this.setState({ workflow: workflow2 });
      })
      .catch((error) => {
        let workflow2 = Object.assign({}, this.state.workflow);
        workflow2.pathways_down.loading = JSON.stringify(error);
        this.setState({ workflow: workflow2 });
      });
  };
  exportPathwayDown = (params = {}) => {
    let workflow = Object.assign({}, this.state.workflow);
    workflow.pathways_down.message = '';
    // initialize
    params = {
      projectId: workflow.projectID,
      page_size: 99999999,
      page_number: 1,
      sorting: {
        name: workflow.pathways_down.sorting.name,
        order: workflow.pathways_down.sorting.order,
      },
      search_keyword: workflow.pathways_down.search_keyword,
    };

    fetch('./api/analysis/getDownPathWays', {
      method: 'POST',
      body: JSON.stringify(params),
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(this.handleErrors)
      .then((res) => res.json())
      .then((result) => {
        let workflow = Object.assign({}, this.state.workflow);
        workflow.pathways_down.message = '';
        if (result.status == 200) {
          let workflow = Object.assign({}, this.state.workflow);
          var wb = XLSX.utils.book_new();
          wb.Props = {
            Title: 'Export Pathways For Downregulated Genes Data',
            Subject: 'Pathways For Downregulated Genes Data',
            Author: 'Microarray',
            CreatedDate: new Date(),
          };
          if (workflow.dataList.length != 0) {
            wb.SheetNames.push('Settings');
            var ws_data = [];
            if (workflow.analysisType == '1') {
              // Upload
              ws_data.push(['Analysis Type', 'CEL Files']);
              let uploadD = '';
              for (var i in workflow.dataList) {
                uploadD = workflow.dataList[i].title + ',' + uploadD;
              }
              ws_data.push(['Upload Data', uploadD]);
            }
            if (workflow.analysisType == '0') {
              ws_data.push(['Analysis Type', 'GEO Data']);
              ws_data.push(['Accession Code', workflow.accessionCode]);
            }
            ws_data.push([
              'Contrasts',
              workflow.group_1 + ' vs ' + workflow.group_2,
            ]);
            let group_1_gsm = '';
            let group_2_gsm = '';
            for (var i in workflow.dataList) {
              if (workflow.dataList[i].groups == workflow.group_1) {
                group_1_gsm = workflow.dataList[i].gsm + ',' + group_1_gsm;
              }

              if (workflow.dataList[i].groups == workflow.group_2) {
                group_2_gsm = workflow.dataList[i].gsm + ',' + group_2_gsm;
              }
            }
            ws_data.push([workflow.group_1, group_1_gsm]);
            ws_data.push([workflow.group_2, group_2_gsm]);
            ws_data.push(['Type', 'Pathways_For_Downregulated_Genes']);

            ws_data.push(['Filters', '']);

            for (let key in workflow.pathways_down.search_keyword) {
              if (workflow.pathways_down.search_keyword[key])
                ws_data.push([key, workflow.pathways_down.search_keyword[key]]);
            }

            var ws = XLSX.utils.aoa_to_sheet(ws_data);
            wb.Sheets['Settings'] = ws;
            wb.SheetNames.push('Results');
            // export data
            let pdgData = result.data.records;
            let exportData = [
              Object.keys(workflow.pathways_down.search_keyword),
            ];
            for (let data of pdgData) {
              exportData.push(
                Object.keys(workflow.pathways_down.search_keyword).map(
                  (key) => {
                    return data[key];
                  }
                )
              );
            }

            var ws2 = XLSX.utils.aoa_to_sheet(exportData);
            wb.Sheets['Results'] = ws2;
            var wbout = XLSX.writeFile(
              wb,
              'DEG_' + workflow.projectID + '.xlsx',
              {
                bookType: 'xlsx',
                type: 'binary',
              }
            );
          }
        } else {
          let workflow = Object.assign({}, this.state.workflow);
          workflow.pathways_down.message = JSON.stringify(result.msg);
          this.setState({ workflow: workflow });
        }
      })
      .catch((error) => {
        let workflow = Object.assign({}, this.state.workflow);
        workflow.pathways_down.message = JSON.stringify(error);
        this.setState({ workflow: workflow });
      });
  };
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
        search_keyword: params.search_keyword,
      };
      workflow.diff_expr_genes.pagination = {
        current: params.page_number,
        pageSize: params.page_size,
      };
      workflow.diff_expr_genes.sorting = params.sorting;
      workflow.diff_expr_genes.search_keyword = params.search_keyword;
    } else {
      params = {
        projectId: workflow.projectID,
        page_number: workflow.diff_expr_genes.pagination.current,
        page_size: workflow.diff_expr_genes.pagination.pageSize,
      };
      params.sorting = workflow.diff_expr_genes.sorting;
      params.search_keyword = workflow.diff_expr_genes.search_keyword;
      workflow.diff_expr_genes.pagination = {
        current: workflow.diff_expr_genes.pagination.current,
        pageSize: workflow.diff_expr_genes.pagination.pageSize,
      };
    }
    workflow.diff_expr_genes.loading = true;
    this.setState({ workflow: workflow });
    fetch('./api/analysis/getDEG', {
      method: 'POST',
      body: JSON.stringify(params),
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(this.handleErrors)
      .then((res) => res.json())
      .then((result) => {
        let workflow2 = Object.assign({}, this.state.workflow);
        workflow2.diff_expr_genes.message = '';
        if (result.status == 200) {
          const pagination = { ...workflow2.diff_expr_genes.pagination };
          // Read total count from server
          // pagination.total = data.totalCount;
          pagination.total = result.data.totalCount;
          for (let i = 0; i < result.data.records.length; i++) {
            result.data.records[i].key = 'DEG' + i;
          }
          workflow2.diff_expr_genes.loading = false;
          workflow2.diff_expr_genes.data = result.data.records;
          workflow2.diff_expr_genes.pagination = pagination;
        } else {
          workflow2.diff_expr_genes.message = JSON.stringify(result.msg);
        }
        this.setState({ workflow: workflow2 });
      })
      .catch((error) => console.log(error));
  };

  exportNormalAll = (params = {}) => {
    let workflow = Object.assign({}, this.state.workflow);
    params = {
      projectId: workflow.projectID,
    };
    workflow.progressing = true;
    workflow.loading_info = 'Export';
    this.setState({ workflow: workflow });
    fetch('./api/analysis/getNormalAll', {
      method: 'POST',
      body: JSON.stringify(params),
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(this.handleErrors)
      .then((res) => res.json())
      .then((result) => {
        workflow.diff_expr_genes.message = '';
        if (result.status == 200) {
          var wb = XLSX.utils.book_new();
          wb.Props = {
            Title: 'Normalized Data for All Samples',
            Subject: 'Normalized Data for All Samples',
            Author: 'Microarray',
            CreatedDate: new Date(),
          };
          wb.SheetNames.push('Data');
          var ws_data = [];
          if (result.data && result.data.length != 0) {
            // get col name
            let cols = [];
            for (var j in result.data[0]) {
              cols.push(j);
            }

            // get data
            let d = [];
            for (var k in result.data) {
              for (var col in cols) {
                d.push(result.data[k][cols[col]]);
              }
              ws_data.push(d);
              d = [];
            }

            // remove new line from col names
            cols = cols.map((col) => col.replace(/\n+/g, ''));
            ws_data = [cols, ...ws_data];
          }

          var ws = XLSX.utils.aoa_to_sheet(ws_data);
          wb.Sheets['Data'] = ws;
          XLSX.writeFile(
            wb,
            'DEG_Normalized_Data_for_All_Samples' +
              workflow.projectID +
              '.xlsx',
            {
              bookType: 'xlsx',
              type: 'binary',
            }
          );
        }
        workflow.progressing = false;
        workflow.loading_info = 'Loading';
        this.setState({ workflow: workflow });
      })
      .catch((error) => {
        let workflow = Object.assign({}, this.state.workflow);
        workflow.diff_expr_genes.message = JSON.stringify(error);
        this.setState({ workflow: workflow });
      });
  };

  exportNormalTSV = (params = {}) => {
    let workflow = Object.assign({}, this.state.workflow);
    params = {
      projectId: workflow.projectID,
    };
    workflow.progressing = true;
    workflow.loading_info = 'Export';
    this.setState({ workflow: workflow });
    fetch('./api/analysis/getNormalAll', {
      method: 'POST',
      body: JSON.stringify(params),
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(this.handleErrors)
      .then((res) => res.json())
      .then((result) => {
        workflow.diff_expr_genes.message = '';
        if (result.status == 200) {
          let wb = XLSX.utils.book_new();
          let ws_data = [];
          if (result.data && result.data.length != 0) {
            // get col name
            let cols = [];
            for (let j in result.data[0]) {
              cols.push(j);
            }

            // get data
            let d = [];
            for (var k in result.data) {
              for (var col in cols) {
                d.push(result.data[k][cols[col]]);
              }
              ws_data.push(d);
              d = [];
            }

            // remove new line from col names
            cols = cols.map((col) => col.replace(/\n+/g, ''));
            ws_data = [cols, ...ws_data];
          }
          let ws = XLSX.utils.aoa_to_sheet(ws_data);
          XLSX.utils.book_append_sheet(wb, ws);
          XLSX.writeFile(
            wb,
            'DEG_Normalized_Data_for_All_Samples' + workflow.projectID + '.tsv',
            { bookType: 'csv', FS: '\t', type: 'binary' }
          );
        }
        workflow.progressing = false;
        workflow.loading_info = 'Loading';
        this.setState({ workflow: workflow });
      })
      .catch((error) => {
        let workflow = Object.assign({}, this.state.workflow);
        workflow.diff_expr_genes.message = JSON.stringify(error);
        this.setState({ workflow: workflow });
      });
  };

  exportDEG = (params = {}) => {
    let workflow = Object.assign({}, this.state.workflow);
    params = {
      projectId: workflow.projectID,
      page_size: 99999999,
      page_number: 1,
      sorting: workflow.diff_expr_genes.sorting,
      search_keyword: workflow.diff_expr_genes.search_keyword,
    };

    workflow.progressing = true;
    workflow.loading_info = 'Export';
    this.setState({ workflow: workflow });
    fetch('./api/analysis/getDEG', {
      method: 'POST',
      body: JSON.stringify(params),
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(this.handleErrors)
      .then((res) => res.json())
      .then((result) => {
        if (result.status == 200) {
          let workflow = Object.assign({}, this.state.workflow);
          workflow.diff_expr_genes.message = '';
          var wb = XLSX.utils.book_new();
          wb.Props = {
            Title: 'Export Deg Data',
            Subject: 'Deg Data',
            Author: 'Microarray',
            CreatedDate: new Date(),
          };
          if (workflow.dataList.length != 0) {
            wb.SheetNames.push('Settings');
            var ws_data = [];
            if (workflow.analysisType == '1') {
              // Upload
              ws_data.push(['Analysis Type', 'CEL Files']);
              let uploadD = '';
              for (var i in workflow.dataList) {
                uploadD = workflow.dataList[i].title + ',' + uploadD;
              }
              ws_data.push(['Upload Data', uploadD]);
            }
            if (workflow.analysisType == '0') {
              ws_data.push(['Analysis Type', 'GEO Data']);
              ws_data.push(['Accession Code', workflow.accessionCode]);
            }
            ws_data.push([
              'Contrasts',
              workflow.group_1 + ' vs ' + workflow.group_2,
            ]);
            let group_1_gsm = '';
            let group_2_gsm = '';
            for (var i in workflow.dataList) {
              if (workflow.dataList[i].groups == workflow.group_1) {
                group_1_gsm = workflow.dataList[i].gsm + ',' + group_1_gsm;
              }

              if (workflow.dataList[i].groups == workflow.group_2) {
                group_2_gsm = workflow.dataList[i].gsm + ',' + group_2_gsm;
              }
            }
            ws_data.push([workflow.group_1, group_1_gsm]);
            ws_data.push([workflow.group_2, group_2_gsm]);
            ws_data.push(['Type', 'Differentially Expressed Genes']);
            ws_data.push(['Filters', '']);

            if (workflow.diff_expr_genes.search_keyword.search_symbol != '') {
              ws_data.push([
                'SYMBOL',
                workflow.diff_expr_genes.search_keyword.search_symbol,
              ]);
            }
            if (workflow.diff_expr_genes.search_keyword.search_fc != '') {
              ws_data.push([
                'fc',
                workflow.diff_expr_genes.search_keyword.search_fc,
              ]);
            }
            if (workflow.diff_expr_genes.search_keyword.search_p_value != '') {
              ws_data.push([
                'P.Value',
                workflow.diff_expr_genes.search_keyword.search_p_value,
              ]);
            }
            if (
              workflow.diff_expr_genes.search_keyword.search_adj_p_value != ''
            ) {
              ws_data.push([
                'adj.P.value',
                workflow.diff_expr_genes.search_keyword.search_adj_p_value,
              ]);
            }
            if (workflow.diff_expr_genes.search_keyword.search_aveexpr != '') {
              ws_data.push([
                'AveExpr',
                workflow.diff_expr_genes.search_keyword.search_aveexpr,
              ]);
            }
            if (workflow.pathways_down.search_keyword.search_fdr != '') {
              ws_data.push([
                'ACCNUM',
                workflow.diff_expr_genes.search_keyword.search_accnum,
              ]);
            }
            if (workflow.diff_expr_genes.search_keyword.search_desc != '') {
              ws_data.push([
                'DESC',
                workflow.diff_expr_genes.search_keyword.search_desc,
              ]);
            }
            if (workflow.diff_expr_genes.search_keyword.search_entrez != '') {
              ws_data.push([
                'ENTREZ',
                workflow.diff_expr_genes.search_keyword.search_entrez,
              ]);
            }
            if (
              workflow.diff_expr_genes.search_keyword.search_probsetid != ''
            ) {
              ws_data.push([
                'probsetID',
                workflow.diff_expr_genes.search_keyword.search_probsetid,
              ]);
            }
            if (workflow.diff_expr_genes.search_keyword.search_t != '') {
              ws_data.push([
                't',
                workflow.diff_expr_genes.search_keyword.search_t,
              ]);
            }
            if (workflow.diff_expr_genes.search_keyword.search_b != '') {
              ws_data.push([
                'b',
                workflow.diff_expr_genes.search_keyword.search_b,
              ]);
            }
            var ws = XLSX.utils.aoa_to_sheet(ws_data);
            wb.Sheets['Settings'] = ws;
            wb.SheetNames.push('Results');
            // export data
            let degData = result.data.records;
            let exportData = [
              [
                'SYMBOL',
                'FC',
                'logFC',
                'P.Value',
                'adj.P.value',
                'AveExpr',
                'ACCNUM',
                'DESC',
                'ENTREZ',
                'probsetID',
                't',
                'B',
              ],
            ];
            for (let i in degData) {
              exportData.push([
                degData[i]['SYMBOL'],
                degData[i]['FC'],
                degData[i]['logFC'],
                degData[i]['P.Value'],
                degData[i]['adj.P.Val'],
                degData[i]['AveExpr'],
                degData[i]['ACCNUM'],
                degData[i]['DESC'],
                degData[i]['ENTREZ'],
                degData[i]['probsetID'],
                degData[i]['t'],
                degData[i]['B'],
              ]);
            }
            var ws2 = XLSX.utils.aoa_to_sheet(exportData);
            wb.Sheets['Results'] = ws2;
            var wbout = XLSX.writeFile(
              wb,
              'DEG_' + workflow.projectID + '.xlsx',
              {
                bookType: 'xlsx',
                type: 'binary',
              }
            );
          }
        } else {
          workflow.diff_expr_genes.message = JSON.stringify(result.msg);
        }
        workflow.progressing = false;
        workflow.loading_info = 'Loading';
        this.setState({ workflow: workflow });
      })
      .catch((error) => {
        let workflow = Object.assign({}, this.state.workflow);
        workflow.diff_expr_genes.message = JSON.stringify(error);
        this.setState({ workflow: workflow });
      });
  };
  getHeatmapolt = () => {
    document.getElementById('message-post-heatmap').innerHTML = '';
    let workflow = Object.assign({}, this.state.workflow);
    let link = './images/' + workflow.projectID + workflow.heatmapolt_url;
    let HeatMapIframe = (
      <CIframe
        title={'Heatmap'}
        link={link}
        data={this.state.workflow}
        onLoadComplete={this.onLoadComplete}
        showLoading={this.showLoading}
      />
    );
    workflow.postplot.Heatmapolt = <div>{HeatMapIframe}</div>;
    this.setState({ workflow: workflow });
  };
  getVolcanoPlot = () => {
    let workflow = Object.assign({}, this.state.workflow);
    let volcanoPlot = (
      <CIframe
        title={'volcanoPlot'}
        link={
          './images/' +
          workflow.projectID +
          workflow.volcanoPlotName +
          '?' +
          this.uuidv4()
        }
        data={this.state.workflow}
        onLoadComplete={this.onLoadComplete}
        showLoading={this.showLoading}
      />
    );
    workflow.volcanoPlot = <div>{volcanoPlot}</div>;
    this.setState({ workflow: workflow });
  };
  onLoadComplete = () => {
    let workflow = Object.assign({}, this.state.workflow);
    workflow.progressing = false;
    this.setState({ workflow: workflow });
  };
  getPCA = () => {
    let workflow2 = Object.assign({}, this.state.workflow);
    workflow2.progressing = true;
    workflow2.loading_info = 'Loading PCA...';
    this.setState({ workflow: workflow2 });
    let params = { projectId: workflow2.projectID };
    try {
      fetch('./api/analysis/getPCA', {
        method: 'POST',
        body: JSON.stringify(params),
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then(this.handleErrors)
        .then((res) => res.json())
        .then((result) => {
          if (result.status == 200) {
            if (result.data != '') {
              let pcaData = result.data;
              let pcaPlotData = [];
              // break data in to groups
              let group_data = {};

              let index = 0;
              [workflow2.group_1, workflow2.group_2].forEach((group) => {
                pcaData.group_name.forEach(function (element, i) {
                  if (element.split(',').indexOf(group) > -1) {
                    if (element in group_data) {
                      group_data[element]['x'].push(pcaData.x[index]);
                      group_data[element]['y'].push(pcaData.y[index]);
                      group_data[element]['z'].push(pcaData.z[index]);
                      group_data[element]['color'].push(pcaData.color[i]);
                      group_data[element]['group_name'].push(
                        pcaData.group_name[i]
                      );
                      group_data[element]['row'].push(pcaData.row[i]);
                    } else {
                      group_data[element] = {};
                      group_data[element]['x'] = [pcaData.x[index]];
                      group_data[element]['y'] = [pcaData.y[index]];
                      group_data[element]['z'] = [pcaData.z[index]];
                      group_data[element]['color'] = [pcaData.color[i]];
                      group_data[element]['group_name'] = [
                        pcaData.group_name[i],
                      ];
                      group_data[element]['row'] = [pcaData.row[i]];
                    }
                    index++;
                  }
                });
              });

              for (let element in group_data) {
                let color = '';
                if (
                  element.split(',').indexOf(workflow2.group_2) > -1 ||
                  element.split(',').indexOf(workflow2.group_1) > -1
                ) {
                  color = group_data[element]['color'];
                  pcaPlotData.push({
                    autoSize: true,
                    x: group_data[element]['x'],
                    y: group_data[element]['y'],
                    z: group_data[element]['z'],
                    text: group_data[element].row,
                    mode: 'markers',
                    marker: {
                      size: 10,
                      color: color,
                    },
                    legendgroup: element,
                    name: element,
                    type: 'scatter3d',
                  });
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
                width:
                  document.getElementsByClassName('ant-tabs-tabpane-active')[0]
                    .offsetWidth * 0.8,
                height:
                  document.getElementsByClassName('ant-tabs-tabpane-active')[0]
                    .offsetWidth * 0.6,
                scene: {
                  camera: {
                    eye: { x: 0, y: 2, z: 1 },
                  },
                  xaxis: {
                    title: pcaData.col[0] + ' (' + pcaData.xlable + '%)',
                    backgroundcolor: '#DDDDDD',
                    gridcolor: 'rgb(255, 255, 255)',
                    showbackground: true,
                    zerolinecolor: 'rgb(255, 255, 255)',
                  },
                  yaxis: {
                    title: pcaData.col[2] + ' (' + pcaData.ylable + '%)',
                    backgroundcolor: '#EEEEEE',
                    gridcolor: 'rgb(255, 255, 255)',
                    showbackground: true,
                    zerolinecolor: 'rgb(255, 255, 255)',
                  },
                  zaxis: {
                    title: pcaData.col[1] + ' (' + pcaData.zlable + '%)',
                    backgroundcolor: '#cccccc',
                    gridcolor: 'rgb(255, 255, 255)',
                    showbackground: true,
                    zerolinecolor: 'rgb(255, 255, 255)',
                  },
                },
              };

              var PCAIframe = (
                <Plot
                  data={pcaPlotData}
                  layout={pcaPlotLayout}
                  useResizeHandler={true}
                />
              );
              let workflow = Object.assign({}, this.state.workflow);
              workflow.progressing = false;
              let plot_style = {
                display: 'block',
                marginLeft: 'auto',
                marginRight: 'auto',
                width: '80%',
              };
              workflow.PCA.plot = <div style={plot_style}> {PCAIframe}</div>;
              workflow.PCA.data = pcaPlotData;
              workflow.PCA.layout = pcaPlotLayout;
              workflow.PCA.style = plot_style;
              this.setState({ workflow: workflow });
            } else {
              let workflow = Object.assign({}, this.state.workflow);
              workflow.progressing = false;
              workflow.PCA = 'No Data';
              this.setState({ workflow: workflow });
            }
            document.getElementById('message-post-pca').innerHTML = '';
          } else {
            document.getElementById(
              'message-post-pca'
            ).innerHTML = JSON.stringify(result.msg);
            let workflow = Object.assign({}, this.state.workflow);
            workflow.progressing = false;
            workflow.PCA = 'No Data';
            this.setState({ workflow: workflow });
          }
        })
        .catch((error) => console.log(error));
    } catch (error) {
      document.getElementById('message-post-pca').innerHTML = error;
      let workflow = Object.assign({}, this.state.workflow);
      workflow.progressing = false;
      this.setState({ workflow: workflow });
    }
  };
  getBoxplotAN = () => {
    let workflow2 = Object.assign({}, this.state.workflow);
    workflow2.progressing = true;
    workflow2.loading_info = 'Loading...';
    this.setState({ workflow: workflow2 });
    let params = { projectId: workflow2.projectID };
    try {
      fetch('./api/analysis/getBoxplotAN', {
        method: 'POST',
        body: JSON.stringify(params),
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then(this.handleErrors)
        .then((res) => res.json())
        .then((result) => {
          if (result.status == 200) {
            if (result.data != '') {
              let workflow = Object.assign({}, this.state.workflow);
              let render_data = this.generateBOXPLOT(result, workflow);
              workflow.progressing = false;
              workflow.BoxplotAN.plot = render_data.plot;
              workflow.BoxplotAN.data = render_data.data;
              this.setState({ workflow: workflow });
            } else {
              let workflow = Object.assign({}, this.state.workflow);
              workflow.progressing = false;
              workflow.BoxplotAN.plot = 'No Data';
              this.setState({ workflow: workflow });
            }
            document.getElementById('message-post-boxplot').innerHTML = '';
          } else {
            document.getElementById(
              'message-post-boxplot'
            ).innerHTML = JSON.stringify(result.msg);
            let workflow = Object.assign({}, this.state.workflow);
            workflow.progressing = false;
            workflow.BoxplotAN.plot = 'No Data';
            this.setState({ workflow: workflow });
          }
        })
        .catch((error) => console.log(error));
    } catch (error) {
      document.getElementById('message-post-boxplot').innerHTML = error;
      let workflow = Object.assign({}, this.state.workflow);
      workflow.progressing = false;
      workflow.BoxplotAN.plot = 'No Data';
      this.setState({ workflow: workflow });
    }
  };
  getHistplotAN = () => {
    let workflow = Object.assign({}, this.state.workflow);
    let histplotANLink =
      './images/' + workflow.projectID + '/' + workflow.histplotAN_url;
    let histplotAN = (
      <CIframe
        title={'HistplotAN'}
        link={histplotANLink}
        data={this.state.workflow}
        onLoadComplete={this.onLoadComplete}
        showLoading={this.showLoading}
      />
    );
    workflow.postplot.histplotAN = histplotAN;
    this.setState({ workflow: workflow });
  };
  showLoading = (title) => {
    let workflow = Object.assign({}, this.state.workflow);
    workflow.progressing = true;
    workflow.loading_info = title;
    this.setState({ workflow: workflow });
  };
  getMAplotAN = () => {
    let workflow2 = Object.assign({}, this.state.workflow);
    if (workflow2.list_mAplotAN == '') {
      workflow2.progressing = true;
      workflow2.loading_info = 'Loading Plots...';
      this.setState({ workflow: workflow2 });
      let params = { projectId: workflow2.projectID };
      try {
        fetch('./api/analysis/getMAplotAN', {
          method: 'POST',
          body: JSON.stringify(params),
          credentials: 'same-origin',
          headers: {
            'Content-Type': 'application/json',
          },
        })
          .then(this.handleErrors)
          .then((res) => res.json())
          .then((result) => {
            let workflow = Object.assign({}, this.state.workflow);
            if (result.status == 200) {
              document.getElementById('message-post-maplot').innerHTML = '';
              if (result.data != '') {
                workflow.list_mAplotAN = result.data;
              } else {
                workflow.list_mAplotAN = 'No Data';
              }
            } else {
              workflow.list_mAplotAN = 'No Data';
              document.getElementById(
                'message-post-maplot'
              ).innerHTML = JSON.stringify(result.msg);
            }
            workflow.progressing = false;
            this.setState({ workflow: workflow });
          });
      } catch (error) {
        document.getElementById(
          'message-post-maplot'
        ).innerHTML = JSON.stringify(error);
        let workflow = Object.assign({}, this.state.workflow);
        workflow.progressing = false;
        this.setState({ workflow: workflow });
      }
    }
  };
  getNUSE = () => {
    let workflow2 = Object.assign({}, this.state.workflow);
    workflow2.progressing = true;
    workflow2.loading_info = 'Loading NUSE...';
    this.setState({ workflow: workflow2 });
    let params = { projectId: workflow2.projectID };
    try {
      fetch('./api/analysis/getNUSE', {
        method: 'POST',
        body: JSON.stringify(params),
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then((res) => res.json())
        .then((result) => {
          document.getElementById('message-pre-nuse').innerHTML = '';
          let workflow = Object.assign({}, this.state.workflow);
          if (result.status == 200) {
            let render_data = this.generateBOXPLOT(result, workflow);
            workflow.progressing = false;
            workflow.NUSE.data = render_data.data;
            workflow.NUSE.plot = render_data.plot;
          } else {
            document.getElementById(
              'message-pre-nuse'
            ).innerHTML = JSON.stringify(result.msg);
            workflow.progressing = false;
          }
          this.setState({ workflow: workflow });
        });
    } catch (error) {
      document.getElementById('message-pre-nuse').innerHTML = JSON.stringify(
        error
      );
      let workflow = Object.assign({}, this.state.workflow);
      workflow.progressing = false;
      this.setState({ workflow: workflow });
    }
  };
  getRLE = () => {
    let workflow2 = Object.assign({}, this.state.workflow);
    workflow2.progressing = true;
    workflow2.loading_info = 'Loading RLE...';
    this.setState({ workflow: workflow2 });
    let params = { projectId: workflow2.projectID };
    try {
      fetch('./api/analysis/getRLE', {
        method: 'POST',
        body: JSON.stringify(params),
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then(this.handleErrors)
        .then((res) => res.json())
        .then((result) => {
          document.getElementById('message-pre-rle').innerHTML = '';
          if (result.status == 200) {
            let workflow = Object.assign({}, this.state.workflow);
            if (result.data != '') {
              workflow.progressing = false;
              let render_data = this.generateBOXPLOT(result, workflow);
              workflow.RLE.data = render_data.data;
              workflow.RLE.plot = render_data.plot;
            } else {
              workflow.RLE.plot = 'No Data';
              workflow.progressing = false;
            }
            this.setState({ workflow: workflow });
          } else {
            document.getElementById(
              'message-pre-rle'
            ).innerHTML = JSON.stringify(result.msg);
            let workflow = Object.assign({}, this.state.workflow);
            workflow.RLE.plot = 'No Data';
            workflow.progressing = false;
            this.setState({ workflow: workflow });
          }
        });
    } catch (error) {
      document.getElementById('message-pre-rle').innerHTML = JSON.stringify(
        error
      );
      let workflow = Object.assign({}, this.state.workflow);
      workflow.RLE.plot = 'No Data';
      workflow.progressing = false;
      this.setState({ workflow: workflow });
    }
  };
  generateBOXPLOT(result, workflow) {
    let BoxplotRenderData = [];
    let BoxplotsData = result.data;

    // Create an empty trace with the contrast group name to use for legend
    let legend = workflow.groups.reduce((acc, v, i, array) => {
      if (v == workflow.group_2 || v == workflow.group_1) {
        if (array.indexOf(v) === i) {
          acc.push({
            y: [null],
            type: 'box',
            name: v,
            marker: { color: BoxplotsData.color[i] },
            showlegend: true,
            legendgroup: v,
          });
        }
      }
      return acc;
    }, []);

    BoxplotRenderData.push(...legend);

    let names = [];
    let colors = [];
    let legendgroup = [];
    [workflow.group_1, workflow.group_2].forEach((group) => {
      workflow.groups.forEach((name, i) => {
        if (name === group) {
          names.push(BoxplotsData.col[i]);
          colors.push(BoxplotsData.color[i]);
          legendgroup.push(name);
        }
      });
    });

    BoxplotsData.data.forEach((data, i) => {
      let boxplotData = {
        y: data,
        type: 'box',
        name: names[i],
        marker: { color: colors[i] },
        hovertext: names[i],
        showlegend: false,
        legendgroup: legendgroup[i],
      };

      BoxplotRenderData.push(boxplotData);
    });

    let plot_layout = {
      yaxis: {
        title: BoxplotsData.ylable[0],
        zeroline: false,
      },
      legend: {
        x: 1,
        y: 1,
        yanchor: 'top',
        xanchor: 'center',
      },
    };

    let plot_style = {
      width:
        document.getElementsByClassName('ant-tabs-tabpane-active')[0]
          .offsetWidth * 0.9,
    };

    return {
      data: BoxplotRenderData,
      plot: (
        <div>
          <Plot
            data={BoxplotRenderData}
            layout={plot_layout}
            style={plot_style}
            useResizeHandler={true}
          />
        </div>
      ),
    };
  }
  getBoxplotBN = () => {
    let workflow2 = Object.assign({}, this.state.workflow);
    workflow2.progressing = true;
    workflow2.loading_info = 'Loading Plots...';
    this.setState({ workflow: workflow2 });
    let params = { projectId: workflow2.projectID };
    try {
      fetch('./api/analysis/getBoxplotBN', {
        method: 'POST',
        body: JSON.stringify(params),
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then(this.handleErrors)
        .then((res) => res.json())
        .then((result) => {
          document.getElementById('message-pre-boxplot').innerHTML = '';
          if (result.status == 200) {
            let workflow = Object.assign({}, this.state.workflow);

            if (result.data != '') {
              workflow.progressing = false;
              let render_data = this.generateBOXPLOT(result, workflow);
              workflow.BoxplotBN.data = render_data.data;
              workflow.BoxplotBN.plot = render_data.plot;
              this.setState({ workflow: workflow });
            } else {
              let workflow = Object.assign({}, this.state.workflow);
              workflow.preplots.Boxplots = 'No Data';
              workflow.progressing = false;
              this.setState({ workflow: workflow });
            }
          } else {
            document.getElementById(
              'message-pre-boxplot'
            ).innerHTML = JSON.stringify(result.msg);
            let workflow = Object.assign({}, this.state.workflow);
            workflow.preplots.Boxplots = 'No Data';
            workflow.progressing = false;
            this.setState({ workflow: workflow });
          }
        });
    } catch (error) {
      document.getElementById('message-pre-boxplot').innerHTML = JSON.stringify(
        error
      );
      let workflow = Object.assign({}, this.state.workflow);
      workflow.preplots.Boxplots = 'No Data';
      workflow.progressing = false;
      this.setState({ workflow: workflow });
    }
  };
  getMAplotsBN = () => {
    let workflow2 = Object.assign({}, this.state.workflow);
    if (workflow2.list_mAplotBN == '') {
      workflow2.progressing = true;
      workflow2.loading_info = 'Loading Plots...';
      let params = { projectId: workflow2.projectID };
      this.setState({ workflow: workflow2 });
      try {
        fetch('./api/analysis/getMAplotsBN', {
          method: 'POST',
          body: JSON.stringify(params),
          credentials: 'same-origin',
          headers: {
            'Content-Type': 'application/json',
          },
        })
          .then(this.handleErrors)
          .then((res) => res.json())
          .then((result) => {
            document.getElementById('message-pre-maplot').innerHTML = '';
            let workflow = Object.assign({}, this.state.workflow);
            if (result.status == 200) {
              if (result.data != '') {
                workflow.list_mAplotBN = result.data;
              } else {
                workflow.list_mAplotBN = 'No Data';
                document.getElementById(
                  'message-pre-maplot'
                ).innerHTML = JSON.stringify(result.msg);
              }
            } else {
              workflow.list_mAplotBN = 'No Data';
            }
            workflow.progressing = false;
            this.setState({ workflow: workflow });
          });
      } catch (error) {
        document.getElementById(
          'message-pre-maplot'
        ).innerHTML = JSON.stringify(error);
        let workflow = Object.assign({}, this.state.workflow);
        workflow.list_mAplotBN = 'No Data';
        workflow.progressing = false;
        this.setState({ workflow: workflow });
      }
    }
  };

  getHistplotBN = () => {
    let workflow = Object.assign({}, this.state.workflow);
    let histplotBNLink =
      './images/' + workflow.projectID + '/' + workflow.histplotBN_url;
    let histplotBN = (
      <CIframe
        title={'histplotBN'}
        link={histplotBNLink}
        data={this.state.workflow}
        onLoadComplete={this.onLoadComplete}
        showLoading={this.showLoading}
      />
    );
    workflow.preplots.histplotBN = histplotBN;
    this.setState({ workflow: workflow });
  };
  changePathways_up = (obj) => {
    let workflow = Object.assign({}, this.state.workflow);
    if (obj.pagination) {
      workflow.pathways_up = obj;
    } else {
      obj.pagination = workflow.pagination;
      workflow.pathways_up = obj;
    }
    this.setState({ workflow: workflow }, () => {});
  };
  changePathways_down = (obj) => {
    let workflow = Object.assign({}, this.state.workflow);
    if (obj.pagination) {
      workflow.pathways_down = obj;
    } else {
      obj.pagination = workflow.pagination;
      workflow.pathways_down = obj;
    }
    this.setState({ workflow: workflow });
  };
  changessGSEA = (obj) => {
    let workflow = Object.assign({}, this.state.workflow);
    if (obj.pagination) {
      workflow.ssGSEA = obj;
    } else {
      obj.pagination = workflow.pagination;
      workflow.ssGSEA = obj;
    }
    this.setState({ workflow: workflow });
  };
  updateCurrentWorkingObject = (e, dropdown, selected) => {
    let workflow = Object.assign({}, this.state.workflow);

    workflow.current_working_on_object = e;

    if (dropdown == 'preplots') {
      workflow.preplots.selected = selected;
      workflow.tag_pre_plot_status = e;
    } else if (dropdown == 'postplot') {
      workflow.postplot.selected = selected;
      workflow.tag_post_plot_status = e;
    } else if (dropdown == 'deg') {
      workflow.degSelected = selected;
      workflow.tag_deg_plot_status = e;
    } else if (dropdown == 'ssSelect') {
      workflow.ssSelect = selected;
    } else if (dropdown == 'geneSelect') {
      workflow.geneSelect = selected;
    }

    this.setState({ workflow: workflow }, () => {
      if (e == 'volcanoPlot' && workflow.volcanoPlot == '') {
        this.getVolcanoPlot();
      }
    });
  };
  updateCurrentWorkingTab = (e) => {
    let workflow = Object.assign({}, this.state.workflow);
    workflow.current_working_on_tag = e;
    workflow.tab_activeKey = e;
    this.setState({ workflow: workflow });
  };
  handleGeneChange = (event) => {
    let value = event.target.value;
    let workflow = Object.assign({}, this.state.workflow);
    workflow.geneSelect = value;
    let reqBody = {};
    reqBody.projectId = workflow.projectID;
    reqBody.species = value.split('$')[0];
    reqBody.genSet = value.split('$')[1];
    reqBody.group1 = workflow.group_1;
    reqBody.group2 = workflow.group_2;
    //change button style
    workflow.progressing = true;
    workflow.loading_info = 'Running Analysis...';
    // remove old heatmap
    workflow.geneHeatmap =
      'Not enough significant pathways available with p-value < 0.05.';
    this.setState({
      workflow: workflow,
    });
    try {
      fetch('./api/analysis/getssGSEAWithDiffGenSet', {
        method: 'POST',
        body: JSON.stringify(reqBody),
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
      })
        .then(this.handleErrors)
        .then((res) => res.json())
        .then((result) => {
          workflow.ssGSEA.message = '';
          workflow.progressing = false;
          this.setState({ workflow: workflow });
          if (result.status == 200) {
            this.setState({ workflow: workflow });
            this.getssGSEA();
          } else {
            workflow.ssGSEA.message = JSON.stringify(result.msg);
            this.setState({ workflow: workflow });
          }
        });
    } catch (err) {
      workflow.progressing = false;
      workflow.ssGSEA.message = JSON.stringify(err);
      this.setState({
        workflow: workflow,
      });
    }
  };

  // disable contrast fields
  disableContrast = () => {
    let workflow = Object.assign({}, this.state.workflow);
    workflow.disableContrast = true;
    this.setState({ workflow: workflow });
  };
  // clear and enable contrast fields, disable results tabs
  resetContrast = () => {
    let workflow = Object.assign({}, this.state.workflow);
    workflow.disableContrast = false;
    workflow.group_1 = '-1';
    workflow.group_2 = '-1';
    workflow.normal = 'RMA';
    workflow.compared = false;
    workflow.done_gsea = false;
    workflow.tab_activeKey = 'GSM_1';
    document.getElementById('message-gsm').innerHTML = '';
    document.getElementById('input-email').value = '';
    document.getElementById('message-success-use-queue').innerHTML = '';
    for (let node of document.getElementsByClassName('err-message')) {
      node.innerHTML = '';
    }
    this.setState({ workflow: workflow });
  };

  changeCode = (event) => {
    let workflow = Object.assign({}, this.state.workflow);
    workflow.accessionCode = event.target.value.toUpperCase();
    this.setState({ workflow: workflow });
  };
  changeChip = (event) => {
    let workflow = Object.assign({}, this.state.workflow);
    workflow.loadChip = event.target.value.toUpperCase();
    this.setState({ workflow: workflow });
  };
  handleSelectChip = (value) => {
    let workflow = Object.assign({}, this.state.workflow);
    workflow.chip = value;
    workflow.dataListChip = workflow.dataList[value];
    this.setState({ workflow: workflow });
  };
  handleSelectType = (value) => {
    let workflow = Object.assign({}, this.state.workflow);
    workflow.analysisType = value;
    this.setState({ workflow: workflow });
  };
  handleGroup1Select = (value) => {
    let workflow = Object.assign({}, this.state.workflow);
    workflow.group_1 = value;
    this.setState({ workflow: workflow });
  };
  handleNormalSelect = (value) => {
    let workflow = Object.assign({}, this.state.workflow);
    workflow.normal = value;
    this.setState({ workflow: workflow });
  };
  handleGroup2Select = (value) => {
    let workflow = Object.assign({}, this.state.workflow);
    workflow.group_2 = value;
    this.setState({ workflow: workflow });
  };
  fileRemove = (file) => {
    let workflow = Object.assign({}, this.state.workflow);
    const index = workflow.fileList.indexOf(file);
    const newFileList = workflow.fileList.slice();
    newFileList.splice(index, 1);
    workflow.fileList = newFileList;
    this.setState({ workflow: workflow });
  };
  beforeUpload = (fl) => {
    let workflow = Object.assign({}, this.state.workflow);
    let names = [];
    workflow.fileList.forEach(function (f) {
      names.push(f.name);
    });
    fl.forEach(function (file) {
      if (names.indexOf(file.name) == -1) {
        workflow.fileList = [...workflow.fileList, file];
      }
    });
    this.setState({ workflow: workflow });
  };
  resetWorkFlowProject = () => {
    let workflow = Object.assign({}, this.state.workflow);
    if (workflow.analysisType == '0') {
      document.getElementById('input-access-code').disabled = false;
      document.getElementById('btn-project-load-gse').disabled = false;
      // disable the input , prevent user to change the access code

      document.getElementById('analysisType_selection').disabled = false;
      document.getElementById('btn-project-load-gse').className =
        'ant-btn upload-start ant-btn-primary';
    }
    defaultState.workflow.analysisType = '0';
    let err_message = document.getElementsByClassName('err-message');
    for (let i = 0; i < err_message.length; i++) {
      err_message[i].innerHTML = ''; // or
    }
    if (document.getElementById('message-gsm') != null) {
      document.getElementById('message-gsm').nextSibling.innerHTML =
        'Choose an Analysis Type on the left panel and click on the Load button to see a list of GSM displayed here.';
    }
    document.getElementById('input-email').value = '';
    document.getElementById('message-success-use-queue').innerHTML = '';
    defaultState.workflow.progressing = false;
    this.setState({ workflow: defaultState.workflow });
  };
  changeLoadingStatus = (progressing, loading_info) => {
    let workflow = Object.assign({}, this.state.workflow);
    workflow.progressing = progressing;
    workflow.loading_info = loading_info;
    this.setState({ workflow: workflow });
  };
  exportGSE = () => {
    let workflow = Object.assign({}, this.state.workflow);
    workflow.progressing = true;
    workflow.loading_info = 'Export';
    this.setState({ workflow: workflow });
    var wb = XLSX.utils.book_new();
    wb.Props = {
      Title: 'Export GSM Data',
      Subject: 'GSM Data',
      Author: 'Microarray',
      CreatedDate: new Date(),
    };
    if (workflow.dataList.length != 0) {
      wb.SheetNames.push('Settings');
      let ws_data = [];
      if (workflow.analysisType == '0') {
        // GSM
        ws_data.push(['Analysis Type', 'GEO Data']);
        ws_data.push(['Accession Code', workflow.accessionCode]);
      }
      if (workflow.analysisType == '1') {
        // Upload
        ws_data.push(['Analysis Type', 'CEL Files']);
        let uploadD = '';
        for (var i in workflow.dataList) {
          uploadD = workflow.dataList[i].title + ',' + uploadD;
        }
        ws_data.push(['Upload Data', uploadD]);
      }
      let ws = XLSX.utils.aoa_to_sheet(ws_data);
      wb.Sheets['Settings'] = ws;
      wb.SheetNames.push('Results');
      let gsm = [['id', 'gsm', 'title', 'description', 'group']];
      let rawData = workflow.dataList;
      for (var i in rawData) {
        gsm.push([
          rawData[i].index,
          rawData[i].gsm,
          rawData[i].title,
          rawData[i].description,
          rawData[i].groups,
        ]);
      }
      var ws2 = XLSX.utils.aoa_to_sheet(gsm);
      wb.Sheets['Results'] = ws2;
      var wbout = XLSX.writeFile(wb, 'GSM_' + workflow.projectID + '.xlsx', {
        bookType: 'xlsx',
        type: 'binary',
      });
      workflow.progressing = false;
      workflow.loading_info = 'loading';
      this.setState({ workflow: workflow });
    }
  };

  loadError = (data) => {
    let workflow = Object.assign({}, this.state.workflow);

    document.getElementById('btn-project-load-gse').className =
      'ant-btn upload-start ant-btn-primary';
    workflow.uploading = false;
    workflow.progressing = false;
    const linkify = (data) => {
      let splitData = data.split(' ');
      const style = 'color:#b22222;text-decoration:underline;';
      splitData.forEach((link, i) => {
        if (link.includes('https')) {
          splitData[i] = `<a href=${link} style=${style}>${link}</a>`;
        }
      });
      return splitData.join(' ');
    };
    document.getElementById('message-gsm').innerHTML = linkify(data);
    document.getElementById('message-gsm').nextSibling.innerHTML = '';
    this.setState({
      workflow: workflow,
    });
  };

  loadGSE = () => {
    let workflow = Object.assign({}, this.state.workflow);
    let reqBody = {};
    if (workflow.accessionCode == '') {
      document.getElementById('message-load-accession-code').innerHTML =
        'Accession Code is required. ';
      return;
    } else {
      document.getElementById('message-load-accession-code').innerHTML = '';
      ReactGA.event({
        category: 'Load GSM',
        action: 'Load accession code',
      });
    }
    document.getElementById('btn-project-load-gse').className =
      'ant-btn upload-start ant-btn-default';
    if (workflow.dataList != '') {
      // user click load after data already loaded.then it is a new transaction
      window.location.reload(true);
    }
    reqBody.code = workflow.accessionCode;
    // this pid will be used to create a tmp folder to store the data.
    workflow.projectID = this.uuidv4();
    reqBody.projectId = workflow.projectID;
    reqBody.groups = workflow.groups;
    reqBody.batches = workflow.batches;
    reqBody.chip = workflow.loadChip;
    // gruop info
    // var groups = [];
    // for (var i in workflow.dataList) {
    //   if (workflow.dataList[i].group == '') {
    //     groups.push('Others');
    //   } else {
    //     groups.push(workflow.dataList[i].group);
    //   }
    // }
    // reqBody.groups = groups;
    workflow.uploading = true;
    workflow.progressing = true;
    workflow.loading_info = 'Loading GEO Data...';
    this.setState({
      workflow: workflow,
    });

    try {
      fetch('./api/analysis/loadGSE', {
        method: 'POST',
        body: JSON.stringify(reqBody),
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then(this.handleErrors)
        .then((res) => res.json())
        .then((result) => {
          if (result.status == 200) {
            let workflow = Object.assign({}, this.state.workflow);
            let data = result.data.substr(
              result.data.indexOf('wrapperReturn') + 15,
              result.data.length
            );

            if (data.indexOf('{"files":') > -1) {
              let list = JSON.parse(decodeURIComponent(data));
              if (!list || !list.files || list.files.length == 0) {
                this.loadError(data);
                return;
              }
              workflow.dataList = list.files;
              // init group with default value
              workflow.groups = new Array(list.files.length).fill('Others');
            } else {
              // multichip
              try {
                let parse = JSON.parse(decodeURIComponent(data));
                if (typeof parse === 'object' && Object.entries(parse).length) {
                  workflow.dataList = parse;
                  let chips = Object.keys(workflow.dataList);

                  chips.forEach((chip) => {
                    workflow.dataList[chip].forEach((gsm) => {
                      gsm.groups = '';
                      gsm.color = '';
                    });
                  });
                  workflow.chip = chips[0];
                  workflow.dataListChip = workflow.dataList[chips[0]];
                  workflow.multichip = true;
                  workflow.groups = {};
                  chips.forEach(
                    (key) =>
                      (workflow.groups.key = new Array(
                        workflow.dataList[key].length
                      ).fill('Others'))
                  );
                } else if (typeof parse === 'string' && parse.length) {
                  this.loadError(parse);
                  return;
                } else {
                  this.loadError(`An error has occured\n${parse}`);
                  return;
                }
              } catch (e) {
                this.loadError(`Caught Exception:\n${e}\n${data}`);
                return;
              }
            }

            document.getElementById('message-gsm').innerHTML = '';
            workflow.uploading = false;
            workflow.progressing = false;

            // disable the input , prevent user to change the access code
            document.getElementById('input-access-code').disabled = true;
            // change the word of load btn
            document.getElementById('btn-project-load-gse').disabled = true;

            document.getElementById('analysisType_selection').disabled = true;
            this.setState({
              workflow: workflow,
            });
          } else {
            document.getElementById('btn-project-load-gse').className =
              'ant-btn upload-start ant-btn-primary';
            workflow.uploading = false;
            workflow.progressing = false;
            this.setState({
              workflow: workflow,
            });
            document.getElementById('message-gsm').innerHTML = result.msg;
            document.getElementById('message-gsm').nextSibling.innerHTML = '';
          }
        });
    } catch (err) {
      //change button style
      document.getElementById('btn-project-load-gse').className =
        'ant-btn upload-start ant-btn-primary';
      workflow.uploading = false;
      workflow.progressing = false;
      this.setState({
        workflow: workflow,
      });
      document.getElementById('message-gsm').innerHTML = err;
      document.getElementById('message-gsm').nextSibling.innerHTML = '';
    }
  };

  showModal = () => {
    let workflow = Object.assign({}, this.state.workflow);
    workflow.QueueModalvisible = true;
    this.setState({
      workflow: workflow,
    });
  };
  handleCancel = () => {
    let workflow = Object.assign({}, this.state.workflow);
    workflow.QueueModalvisible = false;
    this.setState({
      workflow: workflow,
    });
  };

  getSSGSEAGeneHeatMap = async () => {
    let workflow = Object.assign({}, this.state.workflow);
    let link =
      './images/' + workflow.projectID + '/ssgseaHeatmap1.jpg?' + this.uuidv4();
    const AbortController = window.AbortController;
    const controller = new AbortController();
    const signal = controller.signal;

    const exists = async () => {
      try {
        const res = await fetch(link, {
          signal,
          method: 'HEAD',
          cache: 'no-cache',
        });
        return res.status === 200;
      } catch (error) {
        return false;
      }
    };

    setTimeout(() => controller.abort(), 10000);
    if (await exists()) {
      workflow.geneHeatmap = (
        <img src={link} style={{ width: '100%' }} alt="Pathway Heatmap" />
      );
      this.setState({ workflow: workflow });
    }
  };

  index = (groups) => {
    let index = [];
    for (let i in groups) {
      if (
        groups[i] === this.state.workflow.group_1 ||
        groups[i] === this.state.workflow.group_2
      ) {
        index.push(++i);
      }
    }
    return index;
  };

  runContrast = () => {
    let workflow = Object.assign({}, this.state.workflow);
    document.getElementById('message-use-queue').innerHTML = '';
    let reqBody = {};
    reqBody.actions = '';
    reqBody.pPathways = '';
    reqBody.genSet = '';
    reqBody.pssGSEA = '';
    reqBody.foldssGSEA = '';
    reqBody.species = '';
    reqBody.code = workflow.accessionCode;
    reqBody.projectId = workflow.projectID;
    reqBody.groups = [];
    reqBody.group_1 = workflow.group_1;
    reqBody.group_2 = workflow.group_2;
    reqBody.dataList = [];
    reqBody.realGroup = []; // group without filter
    reqBody.batches = [];
    reqBody.chip = workflow.loadChip || workflow.chip;
    if (workflow.uploaded) {
      reqBody.source = 'upload';
    } else {
      reqBody.source = 'fetch';
    }
    let batchCount = 0;
    let batchSamples = {};
    let dataList = workflow.multichip
      ? workflow.dataList[workflow.chip]
      : workflow.dataList;

    for (var gsm of dataList) {
      reqBody.dataList.push(gsm.gsm);
      if (gsm.batch) {
        let batch = gsm.batch;
        if (batch != 'Others') {
          reqBody.batches.push(batch);
          if (!batchSamples[batch]) {
            batchSamples[batch] = [false, false];
          }
          if (gsm.groups.indexOf(workflow.group_1) > -1) {
            batchSamples[batch] = [true, batchSamples[batch][1]];
          } else if (gsm.groups.indexOf(workflow.group_2) > -1) {
            batchSamples[batch] = [batchSamples[batch][0], true];
          }
        }
      } else {
        reqBody.batches.push('Others');
        batchCount++;
      }
      if (gsm.groups && gsm.groups != '') {
        reqBody.realGroup.push(gsm.groups);
        // prohibit samples in both groups chosen for contrast.
        if (
          gsm.groups.indexOf(workflow.group_1) != -1 &&
          gsm.groups.indexOf(workflow.group_2) != -1
        ) {
          // stop process and show warnning.
          document.getElementById('message-gsm').innerHTML =
            'Cannot run contrasts when same samples belong to both groups . Please re-configure your groups and try again. ';
          return;
        }
        if (gsm.groups.indexOf(workflow.group_1) != -1) {
          reqBody.groups.push(workflow.group_1);
          continue;
        }
        if (gsm.groups.indexOf(workflow.group_2) != -1) {
          reqBody.groups.push(workflow.group_2);
          continue;
        }

        reqBody.groups.push('Others');
      } else {
        reqBody.realGroup.push('Others');
        // default value of the group is others
        reqBody.groups.push('Others');
      }
    }

    // validate that each batch contains at least one sample per group
    let valid = true;
    Object.keys(batchSamples).forEach((batch) => {
      if (!batchSamples[batch][0] || !batchSamples[batch][1]) {
        document.getElementById('message-gsm').innerHTML =
          'Cannot run contrasts when batches do not contain samples from each group. Please re-configure your batches and try again. ';
        valid = false;
      }
    });
    if (!valid) return;

    if (batchCount == dataList.length) {
      reqBody.batches = [];
    }
    reqBody.index = this.index(reqBody.groups);
    reqBody.pssGSEA = workflow.pssGSEA;
    reqBody.foldssGSEA = workflow.foldssGSEA;
    reqBody.pPathways = workflow.pPathways;
    reqBody.species = workflow.species;
    reqBody.genSet = workflow.genSet;
    reqBody.normal = workflow.normal;
    reqBody.sorting = '';
    if (workflow.current_working_on_object) {
      reqBody.targetObject = workflow.current_working_on_object;
    } else {
      reqBody.targetObject = '';
    }
    workflow.progressing = true;
    if (workflow.useQueue) {
      workflow.loading_info = 'Submitting job to queue...';
    } else {
      workflow.loading_info = 'Running Contrast...';
    }
    // define action
    reqBody.actions = 'runContrast';
    workflow.diff_expr_genes = defaultState.workflow.diff_expr_genes;
    reqBody.deg = workflow.diff_expr_genes;
    workflow.ssGSEA = defaultState.workflow.ssGSEA;
    reqBody.ssGSEA = workflow.ssGSEA;
    workflow.pathways_up = defaultState.workflow.pathways_up;
    reqBody.pathways_up = workflow.pathways_up;
    workflow.pathways_down = defaultState.workflow.pathways_down;
    reqBody.pathways_down = workflow.pathways_down;
    workflow.preplots = defaultState.workflow.preplots;
    workflow.postplot = defaultState.workflow.postplot;
    workflow.degSelected = 'deg_tag1';
    workflow.ssSelect = 'ss_tag1';
    workflow.geneSelect = 'human$H: Hallmark Gene Sets';
    workflow.list_mAplotBN = '';
    workflow.list_mAplotAN = '';
    workflow.volcanoPlot = '';
    workflow.histplotBN_url = '';
    workflow.histplotAN_url = '';
    workflow.heatmapolt_url = '';
    this.setState({
      workflow: workflow,
    });
    document.getElementById('message-gsm').innerHTML = '';

    // reset view to GSM tab
    if (this.state.workflow.tab_activeKey != 'GSM_1') {
      workflow.tab_activeKey = 'GSM_1';
    }

    // remove old heatmap
    workflow.geneHeatmap =
      'Not enough significant pathways available with p-value < 0.05.';
    this.setState({ workflow: workflow });

    if (workflow.useQueue) {
      if (document.getElementById('input-email').value == '') {
        document.getElementById('message-use-queue').innerHTML =
          'Email is required';
        workflow.uploading = false;
        workflow.progressing = false;
        this.setState({
          workflow: workflow,
        });
        return;
      } else {
        reqBody.email = document.getElementById('input-email').value;
      }
      try {
        fetch('./api/analysis/qAnalysis', {
          method: 'POST',
          body: JSON.stringify(reqBody),
          credentials: 'same-origin',
          headers: {
            'Content-Type': 'application/json',
          },
        })
          .then(this.handleErrors)
          .then((res) => res.json())
          .then((result) => {
            if (result.status == 200) {
              workflow.QueueModalvisible = true;
            } else {
              workflow.QueueModalvisible = false;
              document.getElementById(
                'message-use-queue'
              ).innerHTML = JSON.stringify(result.msg);
            }
            workflow.uploading = false;
            workflow.progressing = false;
            this.setState({
              workflow: workflow,
            });
            this.getSSGSEAGeneHeatMap();
            ReactGA.event({
              category: 'Run Contrast',
              action: 'Run Contrast - Queued',
            });
          });
      } catch (err) {
        workflow.uploading = false;
        workflow.progressing = false;
        document.getElementById('message-use-queue').innerHTML = JSON.stringify(
          err
        );
        this.setState({
          workflow: workflow,
        });
      }
    } else {
      try {
        fetch('./api/analysis/runContrast', {
          method: 'POST',
          body: JSON.stringify(reqBody),
          credentials: 'same-origin',
          headers: {
            'Content-Type': 'application/json',
          },
        })
          .then(this.handleErrors)
          .then((res) => {
            if (res) return res.json();
          })
          .then((result) => {
            if (result && result.status == 200) {
              workflow.groups = result.data.groups;
              workflow.compared = true;
              workflow.done_gsea = true;
              workflow.progressing = false;
              workflow.histplotBN_url = result.data.histplotBN;
              workflow.histplotAN_url = result.data.histplotAN;
              workflow.heatmapolt_url = result.data.heatmapolt;
              workflow.disableContrast = true;
              this.setState({
                workflow: workflow,
              });

              this.hideWorkFlow();

              ReactGA.event({
                category: 'Run Contrast',
                action: 'Run Contrast - Live',
              });
            } else {
              document.getElementById('message-gsm').innerHTML = JSON.stringify(
                result.msg
              );
              workflow.progressing = false;
              this.setState({
                workflow: workflow,
              });
            }
          })
          .catch(
            function (error) {
              document.getElementById('message-gsm').innerHTML = error;
              workflow.uploading = false;
              workflow.progressing = false;
              this.setState({
                workflow: workflow,
              });
            }.bind(this)
          );
      } catch (error) {
        document.getElementById('message-gsm').innerHTML = error;
        workflow.uploading = false;
        workflow.progressing = false;
        this.setState({
          workflow: workflow,
        });
      }
    }
  };
  handleUpload = () => {
    let workflow = Object.assign({}, this.state.workflow);
    const fileList = workflow.fileList;
    const formData = new FormData();
    // this pid will be used to create a tmp folder to store the data.
    workflow.projectID = this.uuidv4();
    formData.append('projectId', workflow.projectID);

    fileList.forEach((file) => {
      formData.append('cels', file);
    });
    workflow.uploading = true;
    workflow.progressing = true;
    this.setState({
      workflow: workflow,
    });
    document.getElementById('btn-project-upload').className =
      'ant-btn upload-start ant-btn-default';
    try {
      fetch('./api/analysis/upload', {
        method: 'POST',
        body: formData,
        processData: false,
        contentType: false,
      })
        .then(this.handleErrors)
        .then((res) => res.json())
        .then((result) => {
          if (result.status == 200) {
            var data = result.data.split('+++getCELfiles+++"')[1];
            if (typeof data === 'undefined' || data == '') {
              workflow.uploading = false;
              workflow.progressing = false;
              document.getElementById('message-gsm').innerHTML = result.msg;
              document.getElementById('message-gsm').nextSibling.innerHTML = '';
              this.setState({ workflow: workflow });
              return;
            }
            let list = JSON.parse(decodeURIComponent(data));
            workflow.uploading = false;
            workflow.progressing = false;
            if (
              list.files == null ||
              typeof list.files == 'undefined' ||
              list.files.length == 0
            ) {
              document.getElementById('message-gsm').innerHTML =
                'load data fails.';
              document.getElementById('message-gsm').nextSibling.innerHTML = '';
              return;
            }
            for (let i in list.files) {
              list.files[i]['gsm'] = list.files[i]['_row'];
              list.files[i]['groups'] = '';
            }
            // clear warning message
            document.getElementById('message-gsm').innerHTML = '';
            workflow.dataList = list.files;
            workflow.uploaded = true;
            this.setState({
              workflow: workflow,
            });
          } else {
            workflow.uploading = false;
            workflow.progressing = false;
            workflow.uploaded = true;
            this.setState({
              workflow: workflow,
            });
            document.getElementById('message-gsm').innerHTML = JSON.stringify(
              result.msg
            );
            document.getElementById('message-gsm').nextSibling.innerHTML = '';
          }
          document.getElementById('btn-project-upload').disabled = true;
          document.getElementById('btn-project-upload').className =
            'ant-btn upload-start ant-btn-default';
        })
        .catch((error) => console.log(error));
      ReactGA.event({
        category: 'Load GSM',
        action: 'Upload CEL files',
      });
    } catch (error) {
      workflow.uploading = false;
      workflow.progressing = false;
      workflow.uploaded = true;
      this.setState({
        workflow: workflow,
      });
      document.getElementById('message-gsm').innerHTML = error;
      document.getElementById('message-gsm').nextSibling.innerHTML = '';
      document.getElementById('btn-project-upload').disabled = true;
      document.getElementById('btn-project-upload').className =
        'ant-btn upload-start ant-btn-default';
    }
  };
  assignGroup = (type, group_name, dataList_keys, callback) => {
    // validate group_name
    let pattern = /^[a-zA-Z]+\_?[a-zA-Z0-9]*$|^[a-zA-Z]+[0-9]*$/g;
    if (group_name.match(pattern)) {
      let workflow = Object.assign({}, this.state.workflow);
      let dataList = workflow.multichip
        ? workflow.dataList[workflow.chip]
        : workflow.dataList;
      for (var key of dataList_keys) {
        if (type === 'group') {
          if (dataList[key - 1].groups) {
            if (dataList[key - 1].groups === '') {
              dataList[key - 1].groups = group_name;
            } else if (
              dataList[key - 1].groups.split(',').indexOf(group_name) < 0
            ) {
              dataList[key - 1].groups += `,${group_name}`;
            }
          } else {
            dataList[key - 1].groups = group_name;
          }
        } else {
          dataList[key - 1].batch = group_name;
        }
      }
      this.setState({ workflow: workflow });
      callback(true);
    } else {
      callback(false);
    }
  };

  uploadGroup = (csvData) => {
    let pattern = /^[a-zA-Z]+\_?[a-zA-Z0-9]*$|^[a-zA-Z]+[0-9]*$/g;
    let workflow = Object.assign({}, this.state.workflow);

    for (let row of csvData) {
      if (row.length > 2) {
        let gsm = row.shift().toUpperCase();
        let assignment = row;

        if (assignment.length < 2) {
          return `Error: Invalid format - 'group' and 'batch' columns required.`;
        }
        let dataList = workflow.multichip
          ? workflow.dataList[workflow.chip]
          : workflow.dataList;

        for (let data of dataList) {
          if (data.gsm === gsm) {
            if (assignment[0].length) {
              if (assignment[0].match(pattern)) {
                if (data.groups) {
                  if (data.groups.split(',').indexOf(assignment[0]) < 0) {
                    data.groups === ''
                      ? (data.groups = assignment[0])
                      : (data.groups += `,${assignment[0]}`);
                  }
                } else {
                  data.groups = assignment[0];
                }
              } else {
                return `${gsm} Error: Group Name ${assignment[0]} is invalid`;
              }
            }
            if (assignment[1].length) {
              if (assignment[1].match(pattern)) data.batch = assignment[1];
              else
                return `${gsm} Error: Batch Name ${assignment[1]} is invalid`;
            }
          }
        }
      }
    }
    this.setState({ workflow: workflow });
    return true;
  };

  deleteGroup = (group_name, type) => {
    let workflow = Object.assign({}, this.state.workflow);
    let dataList = workflow.multichip
      ? workflow.dataList[workflow.chip]
      : workflow.dataList;

    for (let gsm of dataList) {
      if (type === 'group') {
        if (gsm.groups && gsm.groups == group_name) {
          gsm.groups = '';
        } else if (
          gsm.groups &&
          gsm.groups.indexOf(',') != -1 &&
          gsm.groups.indexOf(group_name) != -1
        ) {
          if (
            gsm.groups.indexOf(group_name) ==
            gsm.groups.length - group_name.length
          ) {
            gsm.groups = gsm.groups.replace(',' + group_name, '');
          } else {
            gsm.groups = gsm.groups.replace(group_name + ',', '');
          }
        }
      } else if (type === 'batch') {
        if (gsm.batch && gsm.batch == group_name) {
          gsm.batch = '';
        }
      }
    }
    this.setState({ workflow: workflow });
  };

  handleErrors = (response) => {
    if (!response.ok) {
      // Display fallback UI
      // this.resetWorkFlowProject();
      if (response.statusText != '') {
        document.getElementById('message-gsm').innerHTML = response.statusText;
      } else {
        let errorMessage = '';
        if (httpErrorMessage[response.status])
          errorMessage = httpErrorMessage[response.status];
        document.getElementById('message-gsm').innerHTML =
          'Error Code : ' + response.status + '  ' + errorMessage;
      }

      document.getElementById('message-gsm').nextSibling.innerHTML = '';
      throw Error(response.statusText);
    } else {
      return response;
    }
  };
  hideWorkFlow = () => {
    if (
      document.getElementsByClassName('container-board-right')[0].clientWidth >
      600
    ) {
      document.getElementsByClassName('container-board-left')[0].style.display =
        'none';
    }
    if (
      document.getElementsByClassName('container-board-right')[0].clientWidth >
      600
    ) {
      // when user use mobile, container-board-right set to be 100% width
      document.getElementsByClassName('container-board-right')[0].style.width =
        this.getElementByXpath('//*[@id="tab_analysis"]/div[1]').clientWidth -
        document.getElementsByClassName('container-board-left')[0].clientWidth -
        80 +
        'px';
    }
    document.getElementById('panel-show').style.display = 'inherit';
    document.getElementById('panel-hide').style.display = 'none';
    this.resetBoxPlotAN();
    this.resetRLE();
    this.resetNUSE();
    this.resetPCA();
    this.resetBoxPlotBN();
  };
  showWorkFlow = () => {
    document.getElementsByClassName('container-board-left')[0].style.display =
      'block';
    document
      .getElementsByClassName('container-board-right')[0]
      .removeAttribute('style');
    document.getElementById('panel-show').style.display = 'none';
    document.getElementById('panel-hide').style.display = 'inherit';
    this.resetBoxPlotAN();
    this.resetRLE();
    this.resetNUSE();
    this.resetPCA();
    this.resetBoxPlotBN();
  };
  resetPCA = () => {
    let workflow = Object.assign({}, this.state.workflow);
    let pcaPlotLayout = {
      margin: workflow.PCA.layout.margin,
      width:
        document.getElementsByClassName('ant-tabs-tabpane-active')[0]
          .offsetWidth * 0.8,
      height:
        document.getElementsByClassName('ant-tabs-tabpane-active')[0]
          .offsetWidth * 0.6,
      scene: workflow.PCA.layout.scene,
    };
    if (!workflow.PCA.data == '') {
      workflow.PCA.plot = (
        <div style={workflow.PCA.style}>
          {' '}
          <Plot data={workflow.PCA.data} layout={pcaPlotLayout} />
        </div>
      );
    }
    this.setState({
      workflow: workflow,
    });
  };
  resetBoxPlotAN = () => {
    let workflow = Object.assign({}, this.state.workflow);
    workflow.BoxplotAN.style = {
      width:
        document.getElementsByClassName('ant-tabs-tabpane-active')[0]
          .offsetWidth * 0.9,
    };
    workflow.BoxplotAN.layout = {
      showlegend: false,
      autoSize: true,
    };
    if (!workflow.BoxplotAN.data == '') {
      workflow.BoxplotAN.plot = (
        <Plot
          id="BoxplotAN"
          data={workflow.BoxplotAN.data}
          layout={workflow.BoxplotAN.layout}
          style={workflow.BoxplotAN.style}
          useResizeHandler={true}
        />
      );
    }

    this.setState({
      workflow: workflow,
    });
  };
  resetBoxPlotBN = () => {
    let workflow = Object.assign({}, this.state.workflow);
    workflow.BoxplotBN.style = {
      width:
        document.getElementsByClassName('ant-tabs-tabpane-active')[0]
          .offsetWidth * 0.9,
    };
    workflow.BoxplotBN.layout = {
      showlegend: false,
      autoSize: true,
    };
    if (!workflow.BoxplotBN.data == '') {
      workflow.BoxplotBN.plot = (
        <Plot
          id="BoxplotAN"
          data={workflow.BoxplotBN.data}
          layout={workflow.BoxplotBN.layout}
          style={workflow.BoxplotBN.style}
          useResizeHandler={true}
        />
      );
    }

    this.setState({
      workflow: workflow,
    });
  };
  resetRLE = () => {
    let workflow = Object.assign({}, this.state.workflow);
    workflow.RLE.style = {
      width:
        document.getElementsByClassName('ant-tabs-tabpane-active')[0]
          .offsetWidth * 0.9,
    };
    workflow.RLE.layout = { showlegend: false, autoSize: true };
    if (!workflow.RLE.data == '') {
      workflow.RLE.plot = (
        <Plot
          id="BoxplotAN"
          data={workflow.RLE.data}
          layout={workflow.RLE.layout}
          style={workflow.RLE.style}
          useResizeHandler={true}
        />
      );
    }
    this.setState({ workflow: workflow });
  };
  resetNUSE = () => {
    let workflow = Object.assign({}, this.state.workflow);
    workflow.NUSE.style = {
      width:
        document.getElementsByClassName('ant-tabs-tabpane-active')[0]
          .offsetWidth * 0.9,
    };
    workflow.NUSE.layout = {
      showlegend: false,
      autoSize: true,
    };
    if (!workflow.NUSE.data == '') {
      workflow.NUSE.plot = (
        <Plot
          id="BoxplotAN"
          data={workflow.NUSE.data}
          layout={workflow.NUSE.layout}
          style={workflow.NUSE.style}
          useResizeHandler={true}
        />
      );
    }
    this.setState({
      workflow: workflow,
    });
  };
  changeTab(tab) {
    if (document.getElementById('li-about') != null) {
      if (tab == 'about') {
        document.getElementById('li-about').className = 'active';
        document.getElementById('li-analysis').className = '';
        document.getElementById('li-help').className = '';
        document.getElementById('tab_about').className = '';
        document.getElementById('tab_analysis').className = 'hide';
        document.getElementById('tab_help').className = 'hide';
        ReactGA.pageview(window.location.pathname + '#about');
      }
      if (tab == 'analysis') {
        document.getElementById('li-about').className = '';
        document.getElementById('li-analysis').className = 'active';
        document.getElementById('li-help').className = '';
        document.getElementById('tab_about').className = 'hide';
        document.getElementById('tab_analysis').className = '';
        document.getElementById('tab_help').className = 'hide';
        ReactGA.pageview(window.location.pathname + '#analysis');
      }
      if (tab == 'help') {
        document.getElementById('tab_about').className = 'hide';
        document.getElementById('tab_analysis').className = 'hide';
        document.getElementById('tab_help').className = '';
        document.getElementById('li-about').className = '';
        document.getElementById('li-analysis').className = '';
        document.getElementById('li-help').className = 'active';
        ReactGA.pageview(window.location.pathname + '#help');
      }
    }
  }
  initWithCode = (code) => {
    let workflow = Object.assign({}, this.state.workflow);
    let reqBody = {};
    reqBody.projectId = code;
    workflow.uploaded = false;
    workflow.progressing = true;
    workflow.loading_info = 'Running Contrast...';
    workflow.diff_expr_genes = defaultState.workflow.diff_expr_genes;
    workflow.ssGSEA = defaultState.workflow.ssGSEA;
    workflow.pathways_up = defaultState.workflow.pathways_up;
    workflow.pathways_down = defaultState.workflow.pathways_down;
    workflow.preplots = defaultState.workflow.preplots;
    workflow.postplot = defaultState.workflow.postplot;
    workflow.volcanoPlot = '';
    workflow.progressing = true;
    workflow.loading_info = 'Loading...';
    this.setState({
      workflow: workflow,
    });
    try {
      fetch('./api/analysis/getResultByProjectId', {
        method: 'POST',
        body: JSON.stringify(reqBody),
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then(this.handleErrors)
        .then((response) => response.json())
        .then((result) => {
          if (result.status == 200) {
            result = result.data;
            let workflow2 = Object.assign({}, this.state.workflow);
            if (result.gsm[0].gsm) {
              workflow2.dataList = result.gsm;
            } else {
              let tmp_gsms = [];
              for (let i in result.gsm) {
                tmp_gsms.push({
                  index: result.gsm[i].index,
                  title: result.gsm[i].title,
                  gsm: result.gsm[i]._row,
                  groups: result.gsm[i].groups,
                  colors: result.gsm[i].colors,
                });
              }
              workflow2.dataList = tmp_gsms;
            }
            if (result.source && result.source == 'upload') {
              // change analysis type
              workflow2.analysisType = '1';
              workflow2.uploaded = true;
            }
            workflow2.accessionCode = result.accessionCode;
            workflow2.projectID = result.projectId[0];
            workflow2.group_1 = result.group_1;
            workflow2.group_2 = result.group_2;
            workflow2.groups = result.groups;
            workflow2.normal = result.normal;
            workflow2.loadChip =
              Object.entries(result.chip).length > 0 ? result.chip : '';
            // replace default group
            for (let i in workflow2.dataList) {
              if (
                result.groups[i].toLowerCase() == 'others' ||
                result.groups[i].toLowerCase() == 'clt'
              ) {
                workflow2.dataList[i].groups = '';
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
            workflow2.volcanoPlot = '';
            workflow2.compared = true;
            workflow2.done_gsea = true;
            workflow2.progressing = false;
            workflow2.histplotBN_url = result.histplotBN;
            workflow2.histplotAN_url = result.histplotAN;
            workflow2.heatmapolt_url = result.heatmapolt;
            workflow2.disableContrast = true;

            // disable the input , prevent user to change the access code
            document.getElementById('input-access-code').disabled = true;
            // change the word of load btn
            document.getElementById('btn-project-load-gse').disabled = true;
            //
            document.getElementById('analysisType_selection').disabled = true;
            //
            document
              .getElementById('btn-project-load-gse')
              .classList.replace('ant-btn-primary', 'ant-btn-default');

            this.setState({
              workflow: workflow2,
            });
            this.getSSGSEAGeneHeatMap();
            this.hideWorkFlow();
          } else {
            if (document.getElementById('message-gsm') != null) {
              document.getElementById('message-gsm').innerHTML =
                'Run Contrast has failed to complete, please contact admin or try again. ';
              document.getElementById('message-gsm').nextSibling.innerHTML = '';
            }
            workflow.progressing = false;
            this.setState({
              workflow: workflow,
            });
          }
        });
    } catch (err) {
      workflow.uploading = false;
      workflow.progressing = false;
      if (document.getElementById('message-gsm') != null) {
        document.getElementById('message-gsm').innerHTML = err;
        document.getElementById('message-gsm').nextSibling.innerHTML = '';
      }
      this.setState({
        workflow: workflow,
      });
    }
  };
  getCurrentNumberOfJobsinQueue = () => {
    fetch('./api/analysis/getCurrentNumberOfJobsinQueue', {
      method: 'POST',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(this.handleErrors)
      .then((res) => res.json())
      .then((result) => {
        result = result.data;
        let workflow = Object.assign({}, this.state.workflow);
        workflow.numberOfTasksInQueue = result;
        this.setState({
          workflow: workflow,
        });
      })
      .catch((error) => console.log(error));
  };
  render() {
    // define group modal
    let queueModal = (
      <Modal
        width={'75%'}
        key="queue_modal"
        visible={this.state.workflow.QueueModalvisible}
        className="custom_modal"
        title="MicroArray Queue"
        onCancel={this.handleCancel}
        footer={[
          <Button key="back" type="primary" onClick={this.handleCancel}>
            Close
          </Button>,
        ]}
      >
        {' '}
        <div>
          <p>
            {' '}
            Your job will be sent to the queuing system for processing. Results
            will be sent to you via email when all model runs are completed{' '}
          </p>
          <p>
            Please note: Depending on model complexity and queue length it could
            be up to a day before you receive your results.
          </p>
        </div>
      </Modal>
    );
    // end  group modal
    let modal = this.state.workflow.progressing
      ? 'progress'
      : 'progress-hidden';
    const antIcon = (
      <Icon
        type="loading"
        style={{ fontSize: 48, width: 48, height: 48 }}
        spin
      />
    );
    let workflow = (
      <Workflow
        data={this.state.workflow}
        handleNormalSelect={this.handleNormalSelect}
        resetWorkFlowProject={this.resetWorkFlowProject}
        changeCode={this.changeCode}
        changeChip={this.changeChip}
        handleSelectChip={this.handleSelectChip}
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
        resetContrast={this.resetContrast}
      />
    );
    let page_status =
      this.props.location.search && this.props.location.search != '';
    let tabs = (
      <div>
        {' '}
        <div className="header-nav">
          <div className="div-container">
            <ul className="nav navbar-nav" id="header-navbar">
              <li
                onClick={() => {
                  this.changeTab('about');
                }}
                id="li-about"
                className={page_status ? '' : 'active'}
              >
                {' '}
                <a href="#about" className="nav-link">
                  ABOUT
                </a>
              </li>
              <li
                onClick={() => {
                  this.changeTab('analysis');
                }}
                id="li-analysis"
                className={page_status ? 'active' : ''}
              >
                {' '}
                <a href="#analysis" className="nav-link">
                  ANALYSIS
                </a>
              </li>
              <li
                onClick={() => {
                  this.changeTab('help');
                }}
                id="li-help"
                className=""
              >
                {' '}
                <a href="#help" className="nav-link">
                  HELP
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="content">
          <div id="tab_about" className={page_status ? 'hide' : ''}>
            {' '}
            <About />
          </div>
          <div id="tab_help" className="hide">
            {' '}
            <Help />
          </div>
          <div id="tab_analysis" className={page_status ? '' : 'hide'}>
            <div className="container container-board">
              {workflow}
              <div id="btn-controll-data-table-display">
                <a
                  aria-label="panel display controller "
                  id="panel-hide"
                  onClick={this.hideWorkFlow}
                  size="small"
                  style={{ display: page_status ? 'none' : 'block' }}
                >
                  <Icon type="caret-left" />
                </a>
                <a
                  aria-label="panel display controller"
                  id="panel-show"
                  onClick={this.showWorkFlow}
                  size="small"
                  style={{ display: page_status ? 'block' : 'none' }}
                >
                  <Icon type="caret-right" />
                </a>
              </div>
              <DataBox
                data={this.state.workflow}
                resetGSMDisplay={this.resetGSMDisplay}
                updateCurrentWorkingObject={this.updateCurrentWorkingObject}
                updateCurrentWorkingTab={this.updateCurrentWorkingTab}
                assignGroup={this.assignGroup}
                deleteGroup={this.deleteGroup}
                handleGeneChange={this.handleGeneChange}
                changessGSEA={this.changessGSEA}
                changeLoadingStatus={this.changeLoadingStatus}
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
                getVolcanoPlot={this.getVolcanoPlot}
                getssGSEA={this.getssGSEA}
                exportGSE={this.exportGSE}
                exportGSEA={this.exportGSEA}
                exportPathwayUp={this.exportPathwayUp}
                exportPathwayDown={this.exportPathwayDown}
                exportDEG={this.exportDEG}
                exportNormalAll={this.exportNormalAll}
                exportNormalTSV={this.exportNormalTSV}
                uploadGroup={this.uploadGroup}
              />
            </div>
            <div className={modal}>
              <div id="loading">
                <Spin
                  indicator={antIcon}
                  style={{ color: 'black' }}
                  aria-label="loading"
                />
                <label className="loading-info" aria-label="loading-info">
                  {this.state.workflow.loading_info}
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    );

    return (
      <div>
        {tabs}
        {queueModal}
      </div>
    );
  }
}

export default Analysis;
