import React, { Component } from 'react';
import { Table ,Select,Input} from 'antd';
import ReactSVG from 'react-svg'
const Search = Input.Search;


const Option = Select.Option;

class GSMData extends Component {



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

    		if(document.getElementById('tag3-tooltip-defs').firstChild!==null){
			document.getElementById('tag3-tooltip-defs').removeChild(document.getElementById('tag3-tooltip-defs').firstChild)
			}
			document.getElementById('tag3-tooltip-defs').appendChild(defs);
			if(document.getElementById('tag3-tooltip-svg').firstChild!==null){
	    		document.getElementById('tag3-tooltip-svg').removeChild(document.getElementById('tag3-tooltip-svg').firstChild)
			}
    		document.getElementById('tag3-tooltip-svg').appendChild(words);

    		// change tootltip svg position
    		document.getElementById('tag3-tooltip').style.display = "block";
	    	document.getElementById('tag3-tooltip').style.left = e.clientX -365 + "px";
	    	document.getElementById('tag3-tooltip').style.top = e.clientY -100+ "px";

	    	}

	    	
		});

		// document.getElementById("tag3-svg-content").addEventListener("mouseleave", function(e){
  //   	document.getElementById('tag3-tooltip').style.display = "none";
		// });

  	}


 state = {
    selectedRowKeys: [], // Check here to configure the default column
    loading: false,
    term:"" ,
    boxplot:""
  };

	constructor(props){
		super(props);
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
					<div><Search  placeholder="input search text" className="input-search-gsm" onSearch={value => this.setState({term: value})} /></div>
					<div><Table rowSelection={rowSelection} columns={columns} dataSource={data.filter(searchFilter,this)} /></div>
				</div>	
  	  	
  	}else{
  			  let tooltip = {
						"position": "absolute",
					    "background": "white",
					    "width":"100%"
					    
					}
		let tooltip_svg_div={
					   "transform": "rotate(90deg)",
					   "position": "absolute",
					   "top": "-365px",
					   "left": "-125px"
					}

		let tooltip_svg_title={
						"paddingTop": "20px"
					}

	 content =<div id="tag3" className="plot2">
	 			<div id="tag3-tooltip" style={tooltip}>
							<div id="tag3-tooltip-svg-title" style={tooltip_svg_title}></div>
							<div id="tag3-tooltip-svg-div">Point:
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
							</div>
							<div id="tag3-svg-content">
							<ReactSVG  
	  						path="./images/test/boxplotsAfterNorm.svg"
	  						renumerateIRIElements={false}
						 	svgClassName="svg-class-name"
						 	className="wrapper-class-name"/>
						 	</div>

					</div>;

  	}

	return content;
  }
}

export default GSMData;