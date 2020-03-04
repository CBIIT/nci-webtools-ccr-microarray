import React from 'react';
import Project from './Project';
import Contrast from './Contrast';

export default function Workflow(props) {
  let contrastBox = (
    <Contrast
      data={props.data}
      handleGroup1Select={props.handleGroup1Select}
      handleGroup2Select={props.handleGroup2Select}
      runContrast={props.runContrast}
      changeRunContrastMode={props.changeRunContrastMode}
      handleNormalSelect={props.handleNormalSelect}
      handleSelectChip={props.handleSelectChip}
    />
  );
  let project = (
    <Project
      data={props.data}
      resetWorkFlowProject={props.resetWorkFlowProject}
      changeCode={props.changeCode}
      changeChip={props.changeChip}
      handleSelectType={props.handleSelectType}
      fileRemove={props.fileRemove}
      beforeUpload={props.beforeUpload}
      handleUpload={props.handleUpload}
      loadGSE={props.loadGSE}
      exportGSE={props.exportGSE}
    />
  );
  return (
    <div className="container-board-left">
      <div className="blocks">
        {project}
        {contrastBox}
      </div>
    </div>
  );
}
