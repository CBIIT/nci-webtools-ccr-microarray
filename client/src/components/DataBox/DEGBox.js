import React, { Component } from 'react';
import DEGTable from './DEGTable';
import PUGTable from './PUGTable';
import PDGTable from './PDGTable';
import { Menu, Dropdown, Button, Icon, Table, Select, Input, Tooltip } from 'antd';

class DEGBox extends Component {
  constructor(props) {
    super(props);
    this.state = { content: 'No Data' };
    this.handleSelectionChange = this.handleSelectionChange.bind(this);
  }

  handleSelectionChange(event) {
    let value = event.target.value;

    if (value == 'deg_tag1') {
      if (this.props.data.diff_expr_genes.data.length == 0) {
        this.getDEG();
      }
      this.props.updateCurrentWorkingObject('deg', 'deg', value);
    }
    if (value == 'deg_tag2') {
      if (this.props.data.pathways_up.data.length == 0) {
        this.props.getPathwayUp();
      }
      this.props.updateCurrentWorkingObject('pathways_up', 'deg', value);
    }
    if (value == 'deg_tag3') {
      if (this.props.data.pathways_down.data.length == 0) {
        this.props.getPathwayDown();
      }
      this.props.updateCurrentWorkingObject('pathways_down', 'deg', value);
    }
    if (value == 'deg_tag4') {
      this.props.updateCurrentWorkingObject('volcanoPlot', 'deg', value);
    }
  }

  render() {
    let tabs = [
      <div
        key="deg_tag1"
        id="deg_tag1"
        className="deg_plot"
        style={{ display: this.props.data.degSelected == 'deg_tag1' ? 'block' : 'none' }}
      >
        <DEGTable
          exportNormalAll={this.props.exportNormalAll}
          exportDEG={this.props.exportDEG}
          changeDeg={this.props.changeDeg}
          data={this.props.data}
          getDEG={this.props.getDEG}
        />
      </div>,
      <div
        key="deg_tag2_pathway_up"
        id="deg_tag2"
        className="deg_plot"
        style={{ display: this.props.data.degSelected == 'deg_tag2' ? 'block' : 'none' }}
      >
        <PUGTable
          exportNormalAll={this.props.exportNormalAll}
          exportPathwayUp={this.props.exportPathwayUp}
          changeLoadingStatus={this.props.changeLoadingStatus}
          changePathways_up={this.props.changePathways_up}
          data={this.props.data}
          getPathwayUp={this.props.getPathwayUp}
        />
      </div>,
      <div
        key="deg_tag3_pathway_down"
        id="deg_tag3"
        className="deg_plot"
        style={{ display: this.props.data.degSelected == 'deg_tag3' ? 'block' : 'none' }}
      >
        <PDGTable
          exportNormalAll={this.props.exportNormalAll}
          exportPathwayDown={this.props.exportPathwayDown}
          changeLoadingStatus={this.props.changeLoadingStatus}
          changePathways_down={this.props.changePathways_down}
          data={this.props.data}
          getPathwayDown={this.props.getPathwayDown}
        />
      </div>,
      <div
        key="deg_tag4_volcano"
        id="deg_tag4"
        className="deg_plot"
        style={{ display: this.props.data.degSelected == 'deg_tag4' ? 'block' : 'none' }}
      >
        {this.props.data.volcanoPlot}
      </div>
    ];

    let content = [
      <label key="label-deg_select_option" htmlFor="deg_select_option">
        <span key="deg_select_option_title">DEG section selection </span>
      </label>,
      <select
        value={this.props.data.degSelected}
        key="deg_select"
        className="ant-select-selection ant-select-selection--single"
        id="deg_select_option"
        defaultValue="deg_tag1"
        onChange={this.handleSelectionChange}
      >
        <option key="deg_select_option_1" value="deg_tag1">
          Differentially Expressed Genes
        </option>
        <option key="deg_select_option_2" value="deg_tag2">
          Pathways for Upregulated Genes
        </option>
        <option key="deg_select_option_3" value="deg_tag3">
          Pathways for Downregulated Genes
        </option>
        <option key="deg_select_option_4" value="deg_tag4">
          Interactive Volcano Plot
        </option>
      </select>,
      tabs
    ];

    return <div>{content}</div>;
  }
}

export default DEGBox;
