import React from 'react';
import { Input, Upload, Button, Icon } from 'antd';

export default function Project(props) {
  function handleKeyDown(e) {
    if (e.key === 'Enter') {
      props.loadGSE();
    }
  }

  const { uploading } = props.data;
  const properties = {
    accept: '.gz,.cel,.CEL,.gz',
    action: '-',
    onRemove: file => {
      props.fileRemove(file);
    },
    beforeUpload: (file, fl) => {
      props.beforeUpload(fl);
      return false;
    },
    multiple: true,
    fileList: props.data.fileList
  };

  let type_content = (
    <div className="row">
      {' '}
      <div className="col-sm-12">
        <select
          disabled={props.data.fileList.length != 0}
          id="analysisType_selection"
          className="ant-select-selection ant-select-selection--single"
          value={props.data.analysisType}
          style={{ width: '100%' }}
          onChange={props.handleSelectType}
        >
          <option value="0">GEO Data</option>
          <option value="1">CEL Files</option>
        </select>
      </div>
    </div>
  );
  let source = '';

  if (props.data.analysisType == '0') {
    source = (
      <div>
        <div className="row">
          <div className="col-sm-12">
            <label className="title" htmlFor="input-access-code">
              Accession Code<span style={{ color: '#e41d3d', paddingLeft: '5px' }}> *</span>
            </label>
            <span className="err-message" id="message-load-accession-code"></span>
            <Input
              aria-label="input accessionCode"
              id="input-access-code"
              disabled={props.data.fileList.length !== 0}
              onChange={e => props.changeCode(e)}
              onKeyDown={handleKeyDown}
              value={props.data.accessionCode}
            />
          </div>
        </div>
        <div className="row">
          <div className="col-sm-12">
            <label className="title" htmlFor="chip">
              Include Chip(s)
            </label>
            <Input
              aria-label="input chip"
              id="chip"
              disabled={props.data.dataList.length > 0 || props.data.multichip}
              onChange={e => props.changeChip(e)}
              onKeyDown={handleKeyDown}
              value={props.data.loadChip}
              placeholder="<All Chips>"
            />
          </div>
        </div>
        <div className="row">
          <div className="col-sm-6">
            <button
              id="btn-project-load-gse"
              type="button"
              disabled={props.data.fileList.length !== 0}
              className="ant-btn upload-start ant-btn-primary"
              onClick={props.loadGSE}
            >
              <span>{uploading ? 'Load' : 'Load'}</span>
            </button>
          </div>
          <div className="col-sm-6">
            <Button className="upload-start" type="primary" onClick={props.resetWorkFlowProject}>
              Reset
            </Button>
          </div>
        </div>
      </div>
    );
  } else if (props.data.analysisType == '1') {
    source = (
      <div className="upload-block row">
        <div className="col-sm-12">
          <Upload {...properties} disabled={props.data.uploaded}>
            <Button>
              <Icon type="upload" /> Select File
            </Button>
          </Upload>
        </div>
        <div className="col-sm-6">
          <Button
            id="btn-project-upload"
            className="upload-start"
            type={props.data.fileList.length === 0 ? 'default' : 'primary'}
            onClick={props.handleUpload}
            disabled={props.data.fileList.length === 0}
            loading={uploading}
          >
            {uploading ? 'Load' : 'Load'}
          </Button>
        </div>

        <div className="col-sm-6">
          <Button className="upload-start" type="primary" onClick={props.resetWorkFlowProject}>
            Reset
          </Button>
        </div>
      </div>
    );
  } else {
    source = (
      <div className="upload-block row">
        <div className="col-sm-6">
          <Button className="upload-start" type="default" disabled>
            Load
          </Button>
        </div>
        <div className="col-sm-6">
          <Button className="upload-start" type="primary" onClick={props.resetWorkFlowProject}>
            Reset
          </Button>
        </div>
      </div>
    );
  }
  return (
    <div className="block">
      <div className="row">
        <div className="col-sm-12">
          <label className="title" htmlFor="analysisType_selection">
            Choose Analysis Type
          </label>
        </div>
      </div>
      {type_content}
      {source}
    </div>
  );
}
