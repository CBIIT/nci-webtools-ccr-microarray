import React, { Component } from 'react';
import { Table, Select, message,Input} from 'antd';
const Search = Input.Search;
const Option = Select.Option;

const columns = [{
    title: 'Name',
    dataIndex: '_row',
    sorter: true,
}, {
    title: 'logFC',
    dataIndex: 'logFC',
    sorter: true,
}, {
    title: 'Avg.Enrichment.Score',
    dataIndex: '',
    sorter: true,
}, {
    title: 't',
    dataIndex: 't',
    sorter: true,
}, {
    title: 'P.Value',
    dataIndex: 'P.Value',
    sorter: true,
}, {
    title: 'adj.P.Val',
    dataIndex: 'adj.P.Val',
    sorter: true,
}, {
    title: 'B',
    dataIndex: 'B',
    sorter: true,
}, ];



class SSGSEATable extends Component {

    constructor(props) {
        super(props);
        this.handleTableChange = this.handleTableChange.bind(this)
        this.handleSelectionChange = this.handleSelectionChange.bind(this)

    }


    componentDidMount() {
        this.props.getssGSEA();
        this.props.upateCurrentWorkingTabAndObject("ssGSEA")
    }


  search=(value)=>{
        this.props.changessGSEA({
                        loading: true,
                        data: []
         })

         this.props.getssGSEA({
            search_keyword: value
        });
    }
    


    handleTableChange = (pagination, filters, sorter) => {
        this.props.changessGSEA({
            loading: true,
            data: [],
            pagination,
        })
        if (!sorter) {
            sorter = {
                field: "P.Value",
                rder: "descend"
            }
        }
        if (!sorter.field) {
            sorter.field = "P.Value"
        }

        if (!sorter.order) {
            sorter.order = "descend"
        }


        this.props.getssGSEA({
            page_size: pagination.pageSize,
            page_number: pagination.current,
            sorting: {
                name: sorter.field,
                order: sorter.order,
            },
            pPathways: this.props.data.pPathways,
            search_keyword: "",
            pssGSEA: this.props.data.pssGSEA,
            foldssGSEA: this.props.data.foldssGSEA,
        });
    }

  
    handleSelectionChange(value) {

        if(value=="ss_tag1"){
         this.props.upateCurrentWorkingTabAndObject("ssGSEA")
        }
        if(value=="ss_tag2"){
         this.props.upateCurrentWorkingTabAndObject("pathwayHeatMap")
        }


        var list = document.getElementsByClassName("ss_plot");
        for (var i = 0; i < list.length; i++) {
            list[i].classList.add("hide");
        }
        document.getElementById(value).className = document.getElementById(value).className.replace("hide", "");
    }


    render() {

        let content = "";

        var link = "./images/" + this.props.data.projectID + this.props.data.geneHeatmap

        let tabs = [<div id="ss_tag1" className="ss_plot">
                        <div><Search  placeholder="input search text" className="input-search-for-ssgsea"  onSearch={value => this.search(value)} /></div>
                         <div>
                            <Table 
                                columns={columns}
                                dataSource={this.props.data.ssGSEA.data}
                                pagination={this.props.data.ssGSEA.pagination}
                                loading={this.props.data.ssGSEA.loading}
                                onChange={this.handleTableChange}
                                />
                            </div>
                                </div>,
            <div id="ss_tag2" className="ss_plot hide" >
                                 <img src= {link}  style={{width:"100%"}} alt="Pathway Heatmap"/>
                                </div>
        ]
        content = [<Select defaultValue="ss_tag1" style={{ width: 240 }} onChange={this.handleSelectionChange}>
                                  <Option value="ss_tag1">Single Sample GSEA</Option>
                                  <Option value="ss_tag2">Pathway Heatmap</Option>
                                </Select>, tabs]


        return content;
    }
}

export default SSGSEATable;