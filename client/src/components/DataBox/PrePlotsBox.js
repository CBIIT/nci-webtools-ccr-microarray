import React from 'react';
import MAPlot from './MAPlot';

export default function PrePlotsBox(props) {
  function handleSelectionChange(event) {
    let value = event == null ? 'preHistogram' : event.target.value;

    if (value == 'preHistogram') {
      props.updateCurrentWorkingObject('getHistplotBN', 'preplots', value);
      if (props.data.preplots.histplotBN == '') {
        props.getHistplotBN();
      }
    }
    if (value == 'preMAplots') {
      props.updateCurrentWorkingObject('getMAplotsBN', 'preplots', value);
      if (props.data.preplots.list_mAplotBN == '') {
        props.getMAplotsBN();
      }
    }
    if (value == 'preBoxplots') {
      props.updateCurrentWorkingObject('getBoxplotBN', 'preplots', value);
      if (props.data.preplots.Boxplots == '') {
        props.getBoxplotBN();
      }
    }
    if (value == 'preRLE') {
      props.updateCurrentWorkingObject('getRLE', 'preplots', value);
      if (props.data.preplots.RLE == '') {
        props.getRLE();
      }
    }
    if (value == 'preNUSE') {
      props.updateCurrentWorkingObject('getNUSE', 'preplots', value);
      if (props.data.preplots.NUSE == '') {
        props.getNUSE();
      }
    }
  }

  // HistplotBN,MAplotBN,BoxplotBN,RLEplotBN,NUSEplotBN,HistplotAN,MAplotAN,BoxplotAN,PCA,Heatmapolt,time_cost

  let tabs = [
    <div
      id="preHistogram"
      key="pre_tag1"
      className="plot1"
      style={{ display: props.data.preplots.selected == 'preHistogram' ? 'block' : 'none' }}
    >
      <div>
        {' '}
        <p className="err-message" id="message-pre-histogram"></p>
      </div>{' '}
      {props.data.preplots.histplotBN}{' '}
    </div>,
    <div
      id="preMAplots"
      key="pre_tag2"
      className="plot1"
      style={{ display: props.data.preplots.selected == 'preMAplots' ? 'block' : 'none' }}
    >
      {' '}
      <div>
        {' '}
        <p className="err-message" id="message-pre-maplot"></p>
      </div>{' '}
      <div>
        {' '}
        <MAPlot pics={props.data.list_mAplotBN} data={props.data} />
      </div>{' '}
    </div>,
    <div
      id="preBoxplots"
      key="pre_tag3"
      className="plot1"
      style={{ display: props.data.preplots.selected == 'preBoxplots' ? 'block' : 'none' }}
    >
      {' '}
      <div>
        {' '}
        <p className="err-message" id="message-pre-boxplot"></p>
      </div>{' '}
      {props.data.BoxplotBN.plot}
    </div>,
    <div
      id="preRLE"
      key="pre_tag4"
      className="plot1"
      style={{ display: props.data.preplots.selected == 'preRLE' ? 'block' : 'none' }}
    >
      {' '}
      <div>
        {' '}
        <p className="err-message" id="message-pre-rle"></p>
      </div>{' '}
      {props.data.RLE.plot}{' '}
    </div>,
    <div
      id="preNUSE"
      key="pre_tag5"
      className="plot1"
      style={{ display: props.data.preplots.selected == 'preNUSE' ? 'block' : 'none' }}
    >
      {' '}
      <div>
        {' '}
        <p className="err-message" id="message-pre-nuse"></p>
      </div>{' '}
      {props.data.NUSE.plot}{' '}
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
      value={props.data.preplots.selected}
      key="pre-normalization-plots-selection"
      id="pre-normalization-plots-selection"
      className="ant-select-selection ant-select-selection--single"
      key="select-pre-plots"
      onChange={e => handleSelectionChange(e)}
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
