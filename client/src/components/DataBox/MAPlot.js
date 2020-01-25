import { Collapse } from 'antd';
import React, { Component } from 'react';

const Panel = Collapse.Panel;

class MAPlot extends Component {
  state = {
    dataList: []
  };

  constructor(props) {
    super(props);
    this.state.dataList = this.props.data.dataList;
  }

  render() {
    let projectID = this.props.data.projectID;
    let pics = this.props.pics;
    let gsmGroups = this.props.data.groups.filter(group => group != 'Others');
    let group1 = this.props.data.group_1;
    let group2 = this.props.data.group_2;
    let dataList = this.state.dataList;
    let group1Pics = [];
    let group2Pics = [];
    let panels = [];

    if (dataList.length > 0 && pics != 'No Data' && pics != '') {
      gsmGroups.forEach((g, i) => {
        let group = g.split(',');
        if (group.indexOf(group1) > -1) {
          group1Pics.push(pics[i]);
        } else if (group.indexOf(group2) > -1) {
          group2Pics.push(pics[i]);
        }
      });

      [group1Pics, group2Pics].map(group => {
        let tmp = [];
        group.forEach((file, i) => {
          let link = './images/' + projectID + file;
          tmp.push(
            <div className="col-md-3" key={'mAplotBN' + i}>
              <div>
                {' '}
                <img src={link} alt="MAplot" />
              </div>
            </div>
          );
        });
        panels.push(tmp);
      });

      let panel1 = (
        <Panel
          header={`${group1} (${group1Pics.length} ${
            group1Pics.length == 1 ? ' Sample )' : ' Samples )'
          }`}
          key={String(group1)}
        >
          <div className="row">{panels[0]}</div>
        </Panel>
      );

      let panel2 = (
        <Panel
          header={`${group2} (${group2Pics.length} ${
            group2Pics.length == 1 ? ' Sample )' : ' Samples )'
          }`}
          key={String(group2)}
        >
          <div className="row">{panels[1]}</div>
        </Panel>
      );

      return <Collapse defaultActiveKey={[group1, group2]}>{[panel1, panel2]}</Collapse>;
    } else {
      return 'No Data';
    }
  } // end render
}

export default MAPlot;
