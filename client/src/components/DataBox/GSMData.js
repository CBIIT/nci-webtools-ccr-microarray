import React, { Component } from 'react';
import { Table ,Select,Input} from 'antd';
import ReactSVG from 'react-svg'
const Search = Input.Search;


const Option = Select.Option;

class GSMData extends Component {


 state = {
    selectedRowKeys: [], // Check here to configure the default column
    loading: false,
    term:"" ,
    boxplot:""
  };

	constructor(props){
		super(props);
	this.handleSelectionChange = this.handleSelectionChange.bind(this);
	}

	
	componentDidMount() {
	    // When the component is mounted, add your DOM listener to the elem.
	    // (The "nv" elem is assigned in the render function.)
	   	document.getElementById("tag3").addEventListener("mouseover", function(e){
    	if(e.target.localName === "use"){
    		let words = e.target.parentElement.cloneNode(true);
    		let defs =e.target.parentElement.parentElement.parentElement.childNodes[1].cloneNode(true)
    		var last_o_y=0;
    		var last_t_y=0;
    		for(let i = words.children.length-1; i>=0; i--){
    			console.log(1)
    			// change x and y accordinate
    			words.children[i].setAttribute("x",20);
    			if(last_o_y===0){
    				// the last element
    				last_o_y=words.children[i].getAttribute("y");
    				last_t_y=20;
    				words.children[i].setAttribute("y",20);
    			}else{
    				let diff = words.children[i].getAttribute("y")-last_o_y;
    				last_o_y=words.children[i].getAttribute("y");
					words.children[i].setAttribute("y",last_t_y+diff);
					last_t_y=last_t_y+diff
    			}
    		}
    		document.getElementById('tag3-tooltip-defs').removeChild(document.getElementById('tag3-tooltip-defs').firstChild)
    		document.getElementById('tag3-tooltip-defs').appendChild(defs);
    		document.getElementById('tag3-tooltip-svg').removeChild(document.getElementById('tag3-tooltip-svg').firstChild)
    		document.getElementById('tag3-tooltip-svg').appendChild(words);
	    	}
		});	
  	}

	onSelectChange=(selectedRowKeys)=>{
		this.props.selected(selectedRowKeys);	
		this.setState({ selectedRowKeys });
		}


    unselect = () => {
      this.setState({
        selectedRowKeys: [],
        loading: false,
      });
 	 }

 	compareByAlph=(a, b)=> { if (a > b) { return -1; } if (a < b) { return 1; } return 0; }
 	
 	 handleSearch = (val) => {
      	if(val==""){
      		// clear search 
      		this.setState({
				data:Object.assign({},this.props.data.dataList)
			})
      	}else{
			let data = Object.assign({},this.props.data.dataList);
			const result = data.filter(d => d["gsm"].indexOf(val)>0||d["title"].indexOf(val)>0||d["description"].indexOf(val)>0);
			this.setState({
				data:result
			})
      	}


 	 }
 	 	handleSelectionChange(value) {

		let link2="http://localhost:9000/images/8a2386c28f0d4c578adf3cb57c5e63d0/boxplotsAfterNorm.svg";
	 
	    let link3="http://localhost:9000/images/8a2386c28f0d4c578adf3cb57c5e63d0/NUSEBeforeNorm.svg";


	 	let link4="http://localhost:9000/images/8a2386c28f0d4c578adf3cb57c5e63d0/RLEBeforeNorm.svg";
	 
	    var list = document.getElementsByClassName("plot2");
				  for (var i = 0; i < list.length; i++) {
						list[i].classList.add("hide");
					}
		if(document.getElementById('tag3-tooltip-defs').firstChild!==null){
			document.getElementById('tag3-tooltip-defs').removeChild(document.getElementById('tag3-tooltip-defs').firstChild)
    	
		}

		if(document.getElementById('tag3-tooltip-svg').firstChild!==null){
    		document.getElementById('tag3-tooltip-svg').removeChild(document.getElementById('tag3-tooltip-svg').firstChild)
		}
		

    	
	 	if(value==="tag5"){
	 			this.setState({boxplot:link3});
				document.getElementById("tag3").className= document.getElementById("tag3").className.replace("hide", "");
	 	}

	 	if(value==="tag4"){
	 			this.setState({boxplot:link4});
				  document.getElementById("tag3").className= document.getElementById("tag3").className.replace("hide", "");
	 	}

	 	if(value==="tag3"){
	 			this.setState({boxplot:link2});
				document.getElementById("tag3").className= document.getElementById("tag3").className.replace("hide", "");
	 	}
		 
		 if(value!=="tag5"&&value!=="tag3"&&value!=="tag4"){

			  document.getElementById(value).className= document.getElementById(value).className.replace("hide", "");
			 }
		  

		}	



  render() {

  	const { loading, selectedRowKeys } = this.state;



  	let content =<div>
		  			<p>Select one of the analyze type on the left and click on Load to load GSM data</p>
  			    </div>;

  	if(this.props.data.dataList.length > 0){
		const columns = [{
		  title: 'gsm',
		  dataIndex: 'gsm',
		  width:'15%',
		  sorter: (a, b) => ('' + a.gsm).localeCompare(b.gsm),
		}, {
		  title: 'title',
		  dataIndex: 'title',
		  width:'30%',
		  sorter: (a, b) => this.compareByAlph(a.title,b.title),
		}, {
		  title: 'description',
		  dataIndex: 'description',
		  width:'30%',
		  sorter: (a, b) => a.description.length - b.description.length,
		}, {
		  title: 'group',
		  dataIndex: 'groups',
		  width:'20%',
		  sorter: (a, b) => this.compareByAlph(a.groups,b.groups),
		}];
		let count = 1;
		this.props.data.dataList.forEach(function(fl){
			fl.key = count++;
		});


		const data = [...this.props.data.dataList];
		//this.state.data;

		const rowSelection = {
	      selectedRowKeys,
	      onChange: this.onSelectChange,
	    };

	  

	    const searchFilter = (row) => {
	    	if(this.state.term ===""){
	    		return true;
	    	}

	    	if (row["gsm"].includes(this.state.term)) return true;
	    	if (row["title"].includes(this.state.term)) return true;
	    	if (row["description"].includes(this.state.term)) return true;

	    	return false;
	    }

		content=<div>
					<div><Search  placeholder="input search text" className="input-search"  onSearch={value => this.setState({term: value})} /></div>
					<div><Table rowSelection={rowSelection} columns={columns} dataSource={data.filter(searchFilter,this)} /></div>
				</div>	
  	  	
  	}else{

	  let tooltip = {
						"position": "absolute",
					    "background": "white",
					    "left": "526px"
					}
		let tooltip_svg_div={
					   "transform": "rotate(90deg)",
					   "position": "absolute",
					   "top": "-365px",
					   "left": "-125px"
					}

		let tooltip_svg_title={
						"padding-top": "20px"
					}

  				 	let tabs =[ <div id="tag1" className="plot2">No data for Histogram  </div>,
	  				<div id="tag2" className="plot2 hide">ddd</div>,
	  	    		<div id="tag3" className="plot2 hide">
	  	    		<div id="tag3-tooltip" style={tooltip}>
							<div id="tag3-tooltip-svg-title" style={tooltip_svg_title}>Point :</div>
							<div id="tag3-tooltip-svg-div">
							<svg style={tooltip_svg_div} 
								 xmlns="http://www.w3.org/2000/svg"
								 xmlnsXlink="http://www.w3.org/1999/xlink" 
								 width="40pt" 
								 height="600pt" 
								 viewBox="0 0 40 600" 
								 version="1.1" >
								 <defs id="tag3-tooltip-defs">  </defs>
								 <g id="tag3-tooltip-svg">  </g>
							</svg>
							</div>
							</div><ReactSVG  
	  						path={this.state.boxplot}  
	  						renumerateIRIElements={false}
						 	svgClassName="svg-class-name"
						 	className="wrapper-class-name"/></div>,
	  	   		    <div id="tag4" className="plot2 hide">
	  	   		   </div>]

	  	content = [<Select defaultValue="tag1" style={{ width: 240 }} onChange={this.handleSelectionChange}>
						      <Option value="tag1">Histogram</Option>
						      <Option value="tag2">MAplots</Option>
						      <Option value="tag3">Boxplots</Option>
						      <Option value="tag4">RLE</Option>
						      <Option value="tag5">NUSE</Option>
						    </Select>,tabs]
  	}

	return content;
  }
}

export default GSMData;