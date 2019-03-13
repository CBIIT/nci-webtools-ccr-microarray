import { Collapse } from 'antd';
import React, { Component } from 'react';

const Panel = Collapse.Panel;

class MAPlot extends Component {

    constructor(props) {
        super(props);

    }


    render() {

        let projectID = this.props.data.projectID;

        let pics = this.props.data.pics;

        let groups = this.props.data.groups;



        let unique_groups = groups.filter(function(item, i, ar) { return ar.indexOf(item) === i; });

        // unique groups with their pics
        let unique_groups_pic = new Array(unique_groups.length)

        for (let i = unique_groups.length - 1; i >= 0; i--) {

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

                let link = "./images/" + projectID + unique_groups_pic[i][j];
                if (panels[i]) {
                	
                    panels[i].push(<div class="col-md-3" key={"mAplotBN"+count}  > <img  src={link } alt="MAplot"/> </div>);

                } else {
                    panels[i] = new Array(<div class="col-md-3" key={"mAplotBN"+count}  > <img  src={link } alt="MAplot"/> </div>);

                }

            }

            panels[i] = <Panel header={unique_groups[i]} key={i}>
            				<div className="row">
								{panels[i]}
    						</div>
    				  </Panel>;
        }

        return   <Collapse >{panels}</Collapse>

    }// end render


}

export default MAPlot;