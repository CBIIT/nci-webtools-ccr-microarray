import { Collapse } from 'antd';
import React, { Component } from 'react';

const Panel = Collapse.Panel;

class MAPlot extends Component {

    state = {
        dataList:[]
    };

    constructor(props) {
        super(props);
        this.state.dataList = this.props.data.dataList;
    }


    render() {
        let projectID = this.props.data.projectID;
        let pics = this.props.pics;
        let dataList = this.state.dataList;
        let tmp_pics = [];
        let tmp_groups =[];
        if (dataList.length > 0 && pics!="No Data") {

            pics.forEach(function(e, i) {
                tmp_pics.push([e + "@" + dataList[i].title])
                tmp_groups.push(dataList[i].groups)
            })
            pics = tmp_pics;

            let groups = tmp_groups;
            let unique_groups = groups.filter(function(item, i, ar) { return ar.indexOf(item) === i; });
            // reorder the group list, put ungroup to the end of list
            let _tmp = [];
            let unGroupLabel;
            for (let i = 0; i <= unique_groups.length - 1; i++) {

                if (unique_groups[i].toLowerCase() == "ctl" || unique_groups[i].toLowerCase() == "others") {
                    unGroupLabel = unique_groups[i];
                } else {
                    _tmp.push(unique_groups[i]);
                }
            }
            if (unGroupLabel) {
                _tmp.push(unGroupLabel);
            }

            unique_groups = _tmp;


            // unique groups with their pics
            let unique_groups_pic = new Array(unique_groups.length)

            for (let i = 0; i <= unique_groups.length - 1; i++) {

                for (let j = groups.length - 1; j >= 0; j--) {
                    if (groups[j] == unique_groups[i]) {
                        if (unique_groups_pic[i]) {
                            unique_groups_pic[i].push(pics[j][0]);
                        } else {
                            unique_groups_pic[i] = new Array(pics[j][0]);
                        }
                    }
                }
            }
            // construct html
            let count = 0;

            let panels = new Array(unique_groups.length)

            for (let i = unique_groups_pic.length - 1; i >= 0; i--) {

                for (let j = unique_groups_pic[i].length - 1; j >= 0; j--) {

                    count = count + 1;

                    let link = "./images/" + projectID + unique_groups_pic[i][j].split("@")[0];
                    let title = unique_groups_pic[i][j].split("@")[1];
                    if (panels[i]) {

                        panels[i].push(<div className="col-md-3" key={"mAplotBN"+count}  >
                                         <div> <img  src={link } alt="MAplot"/></div>
                                </div>);

                    } else {
                        panels[i] = new Array(<div className="col-md-3" key={"mAplotBN"+count}  >
                                            <div>  <img  src={link } alt="MAplot"/> </div>
                     </div>);

                    }
                }
                let samples = unique_groups_pic[i].length == 1 ? " Sample )" : " Samples )";
                panels[i] = <Panel header={unique_groups[i] + "   ("+unique_groups_pic[i].length+ samples} key={i} >
                            <div className="row">
                                {panels[i]}
                            </div>
                      </Panel>;
            }
            let keys = [];

            for (let i = unique_groups.length - 1; i >= 0; i--) {
                keys.push(String(i))
            }
            return <Collapse defaultActiveKey={keys} >{panels}</Collapse>
        }else{

            return "No Data"
        }
       

    } // end render
}

export default MAPlot;