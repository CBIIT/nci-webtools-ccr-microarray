import React from 'react';
import DEGTable from './DEGTable';
import PUGTable from './PUGTable';
import PDGTable from './PDGTable';

export default function DEGBox(props) {
  function handleSelectionChange(event) {
    let value = event.target.value;

    if (value == 'deg_tag1') {
      if (props.data.diff_expr_genes.data.length == 0) {
        this.getDEG();
      }
      props.updateCurrentWorkingObject('deg', 'deg', value);
    }
    if (value == 'deg_tag2') {
      if (props.data.pathways_up.data.length == 0) {
        props.getPathwayUp();
      }
      props.updateCurrentWorkingObject('pathways_up', 'deg', value);
    }
    if (value == 'deg_tag3') {
      if (props.data.pathways_down.data.length == 0) {
        props.getPathwayDown();
      }
      props.updateCurrentWorkingObject('pathways_down', 'deg', value);
    }
    if (value == 'deg_tag4') {
      props.updateCurrentWorkingObject('volcanoPlot', 'deg', value);
    }
  }

  let tabs = [
    <div
      key="deg_tag1"
      id="deg_tag1"
      className="deg_plot"
      style={{
        display: props.data.degSelected == 'deg_tag1' ? 'block' : 'none',
      }}
    >
      <DEGTable
        exportNormalAll={props.exportNormalAll}
        exportDEG={props.exportDEG}
        changeDeg={props.changeDeg}
        data={props.data}
        getDEG={props.getDEG}
      />
    </div>,
    <div
      key="deg_tag2_pathway_up"
      id="deg_tag2"
      className="deg_plot"
      style={{
        display: props.data.degSelected == 'deg_tag2' ? 'block' : 'none',
      }}
    >
      <PUGTable
        exportNormalAll={props.exportNormalAll}
        exportPathwayUp={props.exportPathwayUp}
        changeLoadingStatus={props.changeLoadingStatus}
        changePathways_up={props.changePathways_up}
        data={props.data}
        getPathwayUp={props.getPathwayUp}
      />
    </div>,
    <div
      key="deg_tag3_pathway_down"
      id="deg_tag3"
      className="deg_plot"
      style={{
        display: props.data.degSelected == 'deg_tag3' ? 'block' : 'none',
      }}
    >
      <PDGTable
        exportNormalAll={props.exportNormalAll}
        exportPathwayDown={props.exportPathwayDown}
        changeLoadingStatus={props.changeLoadingStatus}
        changePathways_down={props.changePathways_down}
        data={props.data}
        getPathwayDown={props.getPathwayDown}
      />
    </div>,
    <div
      key="deg_tag4_volcano"
      id="deg_tag4"
      className="deg_plot"
      style={{
        display: props.data.degSelected == 'deg_tag4' ? 'block' : 'none',
      }}
    >
      {props.data.volcanoPlot}
    </div>,
  ];

  let content = [
    <label key="label-deg_select_option" htmlFor="deg_select_option">
      <span key="deg_select_option_title">DEG section selection </span>
    </label>,
    <select
      value={props.data.degSelected}
      key="deg_select"
      className="ant-select-selection ant-select-selection--single"
      id="deg_select_option"
      onChange={(e) => handleSelectionChange(e)}
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
    tabs,
  ];

  return <div>{content}</div>;
}
