import React from 'react';
import MAPlot from './MAPlot';

export default function PostPlotsBox(props) {
  function handleSelectionChange(event) {
    let value = event == null ? 'postHistogram' : event.target.value;

    if (value == 'postHistogram') {
      props.updateCurrentWorkingObject('getHistplotAN', 'postplot', value);
      if (props.data.postplot.histplotAN == '') {
        props.getHistplotAN();
      }
    }
    if (value == 'postMAplots') {
      props.updateCurrentWorkingObject('getMAplotAN', 'postplot', value);
      if (props.data.list_mAplotAN == '') {
        props.getMAplotAN();
      }
    }
    if (value == 'postBoxplots') {
      props.updateCurrentWorkingObject('getBoxplotAN', 'postplot', value);
      if (props.data.postplot.Boxplots == '') {
        props.getBoxplotAN();
      }
    }
    if (value == 'postPCA') {
      props.updateCurrentWorkingObject('getPCA', 'postplot', value);
      if (props.data.postplot.PCA == '') {
        props.getPCA();
      }
    }
    if (value == 'postHeatmap') {
      props.updateCurrentWorkingObject('getHeatmapolt', 'postplot', value);
      if (props.data.postplot.Heatmapolt == '') {
        props.getHeatmapolt();
      }
    }
  }

  let tabs = [
    <div
      id="postHistogram"
      key="post_tag1"
      className="plot2"
      style={{ display: props.data.postplot.selected == 'postHistogram' ? 'block' : 'none' }}
    >
      {' '}
      <div>
        {' '}
        <p className="err-message" id="message-post-histogram"></p>
      </div>{' '}
      {props.data.postplot.histplotAN}{' '}
    </div>,
    <div
      id="postMAplots"
      key="post_tag2"
      className="plot2"
      style={{ display: props.data.postplot.selected == 'postMAplots' ? 'block' : 'none' }}
    >
      {' '}
      <div>
        {' '}
        <p className="err-message" id="message-post-maplot"></p>
      </div>
      <div>
        {' '}
        <MAPlot pics={props.data.list_mAplotAN} data={props.data} />
      </div>
    </div>,
    <div
      id="postBoxplots"
      key="post_tag3"
      className="plot2"
      style={{ display: props.data.postplot.selected == 'postBoxplots' ? 'block' : 'none' }}
    >
      {' '}
      <div>
        {' '}
        <p className="err-message" id="message-post-boxplot"></p>
      </div>
      {props.data.BoxplotAN.plot}
    </div>,
    <div
      id="postPCA"
      key="post_tag4"
      className="plot2"
      style={{ display: props.data.postplot.selected == 'postPCA' ? 'block' : 'none' }}
    >
      {' '}
      <div>
        {' '}
        <p className="err-message" id="message-post-pca"></p>
      </div>
      {props.data.PCA.plot}{' '}
    </div>,
    <div
      id="postHeatmap"
      key="post_tag5"
      className="plot2"
      style={{ display: props.data.postplot.selected == 'postHeatmap' ? 'block' : 'none' }}
    >
      {' '}
      <div>
        {' '}
        <p className="err-message" id="message-post-heatmap"></p>
      </div>
      {props.data.postplot.Heatmapolt}{' '}
    </div>
  ];

  let content = [
    <label
      key="label-post-normalization-plots-selection"
      htmlFor="post-normalization-plots-selection"
    >
      Select Post-Normalization QC Plots
    </label>,
    <select
      value={props.data.postplot.selected}
      key="select-post-normalization-plots-selection"
      id="post-normalization-plots-selection"
      className="ant-select-selection ant-select-selection--single"
      key="select_post_tag2"
      onChange={e => handleSelectionChange(e)}
    >
      <option key="post_opt_post_tag1" value="postHistogram">
        Histogram
      </option>
      <option key="post_opt_post_tag2" value="postMAplots">
        MAplots
      </option>
      <option key="post_opt_post_tag3" value="postBoxplots">
        Boxplots
      </option>
      <option key="post_opt_post_tag4" value="postPCA">
        PCA
      </option>
      <option key="post_opt_post_tag5" value="postHeatmap">
        Heatmap
      </option>
    </select>,
    tabs
  ];

  return <div>{content}</div>;
}
