import React, { Component } from 'react';
import { Select,message} from 'antd';
import ReactSVG from 'react-svg'
import Plot from 'react-plotly.js';

const Option = Select.Option;


class PostPlotsBox extends Component {


    constructor(props) {
        super(props);

        this.state = { content: "No Data" };
        this.handleSelectionChange("Histogram")

        this.handleSelectionChange = this.handleSelectionChange.bind(this);


    }



    handleSelectChange = (key) => {
        console.log(key);
    }

    handleSelectionChange(value) {

        if (value == "Histogram") { // 


            this.props.upateCurrentWorkingTabAndObject("HistplotAN")
            try {
                fetch('./api/analysis/getHistplotAN', {
                        method: "POST",
                        body: "",
                        processData: false,
                        contentType: false
                    }).then(res => res.json())
                    .then(result => {
                        if (result.status == 200) {
                            if (result.data != "") {
                                let histplotANLink = './images/' + this.props.data.projectID + result.data;
                                let histplotAN = <img src={ histplotANLink } style={{ width: "75%" }} alt="Histogram" />;
                                this.setState({ content: histplotAN });

                            } else {

                                this.setState({ content: "No Data" });

                            }


                        } else {
                            message.error('Load histplot fails.');
                        }

                    })
            } catch (error) {
                message.error('Load data fails.');
            }

        }

        if (value == "MAplots") { // 
            this.props.upateCurrentWorkingTabAndObject("MAplotsAN")
            try {
                fetch('./api/analysis/getMAplotAN', {
                        method: "POST",
                        body: "",
                        processData: false,
                        contentType: false
                    }).then(res => res.json())
                    .then(result => {
                        if (result.status == 200) {
                            if (result.data != "") {
                                let list_mAplotBN = [];
                                for (let i = result.data.length - 1; i >= 0; i--) {
                                    let link = "./images/" + this.props.data.projectID + result.data[i]
                                    list_mAplotBN.push(<div key={"mAplotBN"+i}  > <img  src={ link } style ={{ width: "75%" }} alt="MAplot"/> </div>)
                                }
                                let maplot_style = {
                                    'height': 'auto',
                                    'maxHeight': '100%',
                                    'overflow': 'scroll'
                                };

                                this.setState({ content: <div style={ maplot_style } > { list_mAplotBN } </div> });
                            } else {

                                this.setState({ content: "No Data" });
                            }


                        } else {
                            message.error('Load histplot fails.');
                        }

                    })
            } catch (error) {
                message.error('Load data fails.');
            }



        }

        if (value == "Boxplots") { // 


            this.props.upateCurrentWorkingTabAndObject("BoxplotBN");
            try {
                fetch('./api/analysis/getBoxplotAN', {
                        method: "POST",
                        body: "",
                        processData: false,
                        contentType: false
                    }).then(res => res.json())
                    .then(result => {
                        if (result.status == 200) {
                            if (result.data != "") {
                                let BoxplotRenderData = []
                                let BoxplotsData = result.data
                                for (let i = 0; i < result.data.col.length - 1; i++) {

                                    let boxplotData = {
                                        y: BoxplotsData.data[i],
                                        type: "box",
                                        name: BoxplotsData.col[i],
                                        marker: {
                                            color: BoxplotsData.color[i]
                                        }
                                    }
                                    BoxplotRenderData.push(boxplotData)
                                }

                                let plot_layout = { showlegend: false, autosize: true }
                                let plot_style = {}

                                let Boxplots = <Plot  data={BoxplotRenderData} layout={plot_layout}  style={plot_style} useResizeHandler={true}/>

                                this.setState({ content: <div> {Boxplots}</div> });
                            } else {

                                this.setState({ content: "No Data" });
                            }


                        } else {
                            message.error('Load histplot fails.');
                        }

                    })
            } catch (error) {
                message.error('Load data fails.');
            }

        }

        if (value == "PCA") { //

            this.props.upateCurrentWorkingTabAndObject("PCA");
            try {
                fetch('./api/analysis/getPCA', {
                        method: "POST",
                        body: "",
                        processData: false,
                        contentType: false
                    }).then(res => res.json())
                    .then(result => {
                        if (result.status == 200) {
                            if (result.data != "") {


                                let pcaData = result.data;
                                var PCAIframe = <Plot  data={[{

                                        x: pcaData.x,
                                        y: pcaData.y,
                                        z: pcaData.z,
                                        text: pcaData.row,
                                        mode: 'markers',
                                        marker: {
                                            size: 10,
                                            color: pcaData.color
                                        },
                                        type: 'scatter3d',
                                       
                                    }]} layout={{
                                        autosize:true,
                                        margin: {
                                            l: 0,
                                            r: 0,
                                            b: 0,
                                            t: 0
                                        },
                                        scene: {
                                            xaxis: {
                                                title: pcaData.col[0],
                                                backgroundcolor: "#DDDDDD",
                                                gridcolor: "rgb(255, 255, 255)",
                                                showbackground: true,
                                                zerolinecolor: "rgb(255, 255, 255)"

                                            },
                                            yaxis: {
                                                title:  pcaData.col[1],
                                                backgroundcolor: "#EEEEEE",
                                                gridcolor: "rgb(255, 255, 255)",
                                                showbackground: true,
                                                zerolinecolor: "rgb(255, 255, 255)"
                                            },
                                            zaxis: {
                                                title:  pcaData.col[2],
                                                backgroundcolor: "#cccccc",
                                                gridcolor: "rgb(255, 255, 255)",
                                                showbackground: true,
                                                zerolinecolor: "rgb(255, 255, 255)"
                                            }
                                        }}
                                    }  useResizeHandler={true} />

                                this.setState({ content: <div> {PCAIframe}</div> });
                            } else {

                                this.setState({ content: "No Data" });
                            }


                        } else {
                            message.error('Load histplot fails.');
                        }

                    })
            } catch (error) {
                message.error('Load data fails.');
            }

        }


        if (value == "Heatmap") { // 

            this.props.upateCurrentWorkingTabAndObject("Heatmapolt");
            try {
                fetch('./api/analysis/getHeatmapolt', {
                        method: "POST",
                        body: "",
                        processData: false,
                        contentType: false
                    }).then(res => res.json())
                    .then(result => {
                        if (result.status == 200) {
                            if (result.data != "") {

                                let HeatMapIframe = <div><iframe title={"Heatmap"} src={"./images/"+this.props.data.projectID+this.props.data.Heatmapolt}  width={'90%'} height={'90%'} frameBorder={'0'}/></div>

                                this.setState({ content: <div>{HeatMapIframe}</div> });
                            } else {

                                this.setState({ content: "No Data" });
                            }

                        } else {
                            message.error('Load histplot fails.');
                        }

                    })
            } catch (error) {
                message.error('Load data fails.');
            }


        }
    }

    // HistplotBN,MAplotBN,BoxplotBN,RLEplotBN,NUSEplotBN,HistplotAN,MAplotAN,BoxplotAN,PCA,Heatmapolt,time_cost

    render() {

        let content =[<Select key="select_post_tag2" defaultValue="Histogram" style={{ width: 240 }} onChange={this.handleSelectionChange}>
                                  <Option key="opt_post_tag1" value="Histogram">Histogram</Option>
                                  <Option key="opt_post_tag2" value="MAplots">MAplots</Option>
                                  <Option key="opt_post_tag3" value="Boxplots">Boxplots</Option>
                                  <Option key="opt_post_tag4" value="PCA">PCA</Option>
                                  <Option key="opt_post_tag5" value="Heatmap">Heatmap</Option>
                                </Select>, this.state.content]


        return (
            <div>
            {content}
          </div>
        )
    }
}

export default PostPlotsBox;