import React, { Component } from 'react';
import ReactSVG from 'react-svg';
import { message } from 'antd';
import Plot from 'react-plotly.js';
import MAPlot from './MAPlot';

class PrePlotsBox extends Component {
  constructor(props) {
    super(props);
    this.state = { content: 'No Data' };
    this.handleSelectionChange = this.handleSelectionChange.bind(this);
  }

  componentDidMount() {
    if (this.props.data.dataList.length > 0) {
      this.handleSelectionChange(null);
    }
  }

  handleSelectionChange(event) {
    let value = event == null ? 'preHistogram' : event.target.value;

    if (value == 'preHistogram') {
      this.props.updateCurrentWorkingObject('getHistplotBN', 'preplots', value);
      if (this.props.data.preplots.histplotBN == '') {
        this.props.getHistplotBN();
      }
    }
    if (value == 'preMAplots') {
      this.props.updateCurrentWorkingObject('getMAplotsBN', 'preplots', value);
      if (this.props.data.preplots.list_mAplotBN == '') {
        this.props.getMAplotsBN();
      }
    }
    if (value == 'preBoxplots') {
      this.props.updateCurrentWorkingObject('getBoxplotBN', 'preplots', value);
      if (this.props.data.preplots.Boxplots == '') {
        this.props.getBoxplotBN();
      }
    }
    if (value == 'preRLE') {
      this.props.updateCurrentWorkingObject('getRLE', 'preplots', value);
      if (this.props.data.preplots.RLE == '') {
        this.props.getRLE();
      }
    }
    if (value == 'preNUSE') {
      this.props.updateCurrentWorkingObject('getNUSE', 'preplots', value);
      if (this.props.data.preplots.NUSE == '') {
        this.props.getNUSE();
      }
    }
  }

  // HistplotBN,MAplotBN,BoxplotBN,RLEplotBN,NUSEplotBN,HistplotAN,MAplotAN,BoxplotAN,PCA,Heatmapolt,time_cost

  render() {
    let tabs = [
      <div
        id="preHistogram"
        key="pre_tag1"
        className="plot1"
        style={{ display: this.props.data.preplots.selected == 'preHistogram' ? 'block' : 'none' }}
      >
        <div>
          {' '}
          <p className="err-message" id="message-pre-histogram"></p>
        </div>{' '}
        {this.props.data.preplots.histplotBN}{' '}
      </div>,
      <div
        id="preMAplots"
        key="pre_tag2"
        className="plot1"
        style={{ display: this.props.data.preplots.selected == 'preMAplots' ? 'block' : 'none' }}
      >
        {' '}
        <div>
          {' '}
          <p className="err-message" id="message-pre-maplot"></p>
        </div>{' '}
        <div>
          {' '}
          <MAPlot pics={this.props.data.list_mAplotBN} data={this.props.data} />
        </div>{' '}
      </div>,
      <div
        id="preBoxplots"
        key="pre_tag3"
        className="plot1"
        style={{ display: this.props.data.preplots.selected == 'preBoxplots' ? 'block' : 'none' }}
      >
        {' '}
        <div>
          {' '}
          <p className="err-message" id="message-pre-boxplot"></p>
        </div>{' '}
        {this.props.data.BoxplotBN.plot}
      </div>,
      <div
        id="preRLE"
        key="pre_tag4"
        className="plot1"
        style={{ display: this.props.data.preplots.selected == 'preRLE' ? 'block' : 'none' }}
      >
        {' '}
        <div>
          {' '}
          <p className="err-message" id="message-pre-rle"></p>
        </div>{' '}
        {this.props.data.RLE.plot}{' '}
      </div>,
      <div
        id="preNUSE"
        key="pre_tag5"
        className="plot1"
        style={{ display: this.props.data.preplots.selected == 'preNUSE' ? 'block' : 'none' }}
      >
        {' '}
        <div>
          {' '}
          <p className="err-message" id="message-pre-nuse"></p>
        </div>{' '}
        {this.props.data.NUSE.plot}{' '}
      </div>
    ];

    let content = [
      <label
        key="label-pre-normalization-plots-selection"
        htmlFor="pre-normalization-plots-selection"
      >
        Select Pre-Normalization QC Plots
      </label>,
      <select
        value={this.props.data.preplots.selected}
        key="pre-normalization-plots-selection"
        id="pre-normalization-plots-selection"
        className="ant-select-selection ant-select-selection--single"
        key="select-pre-plots"
        defaultValue="preHistogram"
        onChange={this.handleSelectionChange}
      >
        <option key="pre_opt-tag1" value="preHistogram">
          {' '}
          Histogram{' '}
        </option>
        <option key="pre_opt-tag2" value="preMAplots">
          {' '}
          MAplots{' '}
        </option>
        <option key="pre_opt-tag3" value="preBoxplots">
          {' '}
          Boxplots{' '}
        </option>
        <option key="pre_opt-tag4" value="preRLE">
          {' '}
          RLE{' '}
        </option>
        <option key="pre_opt-tag5" value="preNUSE">
          {' '}
          NUSE{' '}
        </option>
      </select>,
      tabs
    ];

    return <div> {content} </div>;
  }
}

export default PrePlotsBox;
