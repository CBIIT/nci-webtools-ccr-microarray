import React, { Component } from 'react';
import DEGTable from './DEGTable';
import PUGTable from './PUGTable';
import PDGTable from './PDGTable';
import { Menu, Dropdown, Button, Icon, Table, Select, Input, Tooltip } from 'antd';

class DEGBox extends Component {
  constructor(props) {
    super(props);
    this.handleSelectionChange = this.handleSelectionChange.bind(this);
    this.state = { content: 'No Data' };
  }

  handleSelectionChange(event) {
    let value = event.target.value;
    var list = document.getElementsByClassName('deg_plot');
    for (var i = 0; i < list.length; i++) {
      list[i].classList.add('hide');
    }
    document.getElementById(value).className = document
      .getElementById(value)
      .className.replace('hide', '');
    if (value == 'deg_tag1') {
      this.props.updateCurrentWorkingObject('deg');
    }
    if (value == 'deg_tag2') {
      this.props.updateCurrentWorkingObject('pathways_up');
      if (this.props.data.pathways_up.data.length == 0) {
        this.props.getPathwayUp();
      }
    }
    if (value == 'deg_tag3') {
      this.props.updateCurrentWorkingObject('pathways_down');
      if (this.props.data.pathways_down.data.length == 0) {
        this.props.getPathwayDown();
      }
    }
    if (value == 'deg_tag4') {
      this.props.updateCurrentWorkingObject('volcanoPlot');
    }
  }

  render() {
    let tabs = [
      <div key="deg_tag1" id="deg_tag1" className="deg_plot">
        <DEGTable
          exportNormalAll={this.props.exportNormalAll}
          exportDEG={this.props.exportDEG}
          changeDeg={this.props.changeDeg}
          data={this.props.data}
          getDEG={this.props.getDEG}
        />
      </div>,
      <div key="deg_tag2_pathway_up" id="deg_tag2" className="deg_plot hide">
        <PUGTable
          exportNormalAll={this.props.exportNormalAll}
          exportPathwayUp={this.props.exportPathwayUp}
          changeLoadingStatus={this.props.changeLoadingStatus}
          changePathways_up={this.props.changePathways_up}
          data={this.props.data}
          getPathwayUp={this.props.getPathwayUp}
        />
      </div>,
      <div key="deg_tag3_pathway_down" id="deg_tag3" className="deg_plot hide">
        <PDGTable
          exportNormalAll={this.props.exportNormalAll}
          exportPathwayDown={this.props.exportPathwayDown}
          changeLoadingStatus={this.props.changeLoadingStatus}
          changePathways_down={this.props.changePathways_down}
          data={this.props.data}
          getPathwayDown={this.props.getPathwayDown}
        />
      </div>,
      <div key="deg_tag4_volcano" id="deg_tag4" className="deg_plot hide">
        {this.props.data.volcanoPlot}
      </div>
    ];

    let content = [
      <label key="label-deg_select_option" htmlFor="deg_select_option">
        <span key="deg_select_option_title">DEG section selection </span>
      </label>,
      <select
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
