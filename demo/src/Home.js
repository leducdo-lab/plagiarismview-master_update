// @flow

import React, { Component } from "react";

import URLSearchParams from "url-search-params";
import Sidebar from "./Sidebar";

import type { T_Highlight, T_NewHighlight } from "../../src/types";

import "./style/App.css";

// import res from './res.json';
// import res from '../../result.json';
import PDFViewer from "./PDFViewer";
import iconDownload from '../images/cloud-download.png';
import iconLeftArrow from '../images/left-arrow.png';
import iconRightArrow from '../images/right-arrow.png';
import iconClosePopup from '../images/close.png';
import axios from 'axios';

type T_ManuscriptHighlight = T_Highlight;

type Props = {};

type State = {
  highlights: Array<T_ManuscriptHighlight>
};

let offset = 0;
let hightlight_link = '';
let uni_id;

// const searchParams = new URLSearchParams(location.search);
// const url = searchParams.get("url") || DEFAULT_URL;


class Home extends Component {

  constructor(props) {
    super(props);
    this.state = {
      highlights: JSON,
      contentPopup: {
        name: '',
        link: '',
        text: ''
      },
      dataSameArray: new Array(),
      showPopup: false,
      showPopUpErr: false,
      url: String,
      res: JSON,
      toggleSidebar: false,
      document_id: 0,
    }
    this.state.State;
  }
  onPressSentence= (value) => {
    offset = 0;
    this.setState({
      dataSameArray: value
    });
    let detailDoc = this.state.res.res.s[value[0][0]];
    this.setState({
      contentPopup: {
        name: detailDoc.n,
        link: detailDoc.o,
        text: value[0][2],
        private: detailDoc.private
      }
    })
    if (document.getElementById('document-popup-sidebar') !== null) {
      document.getElementById('document-popup-sidebar').remove();
    }
    this.setState({
      showPopup: true
    })
  }

  preSlide = () => {
    if (offset == 0) {
      offset = this.state.dataSameArray.length - 1;
    } else {
      offset--;
    }
    let detailDoc = this.state.res.res.s[this.state.dataSameArray[offset][0]];
    this.setState({
      contentPopup: {
        name: detailDoc.n,
        link: detailDoc.o,
        text: this.state.dataSameArray[offset][2],
        private: detailDoc.private
      }
    })
  }

  nextSlide = () => {
    if (offset == this.state.dataSameArray.length - 1) {
      offset = 0;
    } else {
      offset++;
    }
    let detailDoc = this.state.res.res.s[this.state.dataSameArray[offset][0]];
    this.setState({
      contentPopup: {
        name: detailDoc.n,
        link: detailDoc.o,
        text: this.state.dataSameArray[offset][2],
        private: detailDoc.private
      }
    })
  }

  closePopup = () => {
    this.setState({
      showPopup: false
    })
  }

  componentWillMount () {
      let query = new URLSearchParams(this.props.location.search);
      let origin_link = query.get('origin_link');
      let json_link = query.get('json_link');
      uni_id = query.get('uni_id');
      if (query.has('hightlight_link')) {
        hightlight_link = query.get('hightlight_link');
      }

      this.setState({
        url: origin_link
      });
      const preview = this.preview;
      fetch(json_link)
      .then((Response) => Response.json())
      .then((responseJson) => {
        preview(responseJson);
      })
      .catch(function (error) {
        console.log(error);
      });
  }
  // init highlights
  preview = (responseJson) => {
    let highlights = [];
    this.setState({
      res: responseJson
    });
    const {res} = this.state;
    Object.keys(res.highlight).map((page, _) => {
      Object.keys(res.highlight[page]).map((senIdx, _) => {
        let highlight = res.highlight[page][senIdx];
        if (!highlight.hasOwnProperty("boxes")) return;
        highlight.boxes.map((box, _) => {
        let highlight_elm = {
          'position': {
            'boundingRect': {
              height: res.highlight[page]["height"],
              width: res.highlight[page]["width"],
              x1: box[0],
              x2: box[0] + box[2],
              y1: box[1],
              y2: box[1] + box[3]
            },
            'pageNumber': parseInt(page.replace("page", "")) + 1,
            'rects': [
              {
                height: res.highlight[page]["height"],
                width: res.highlight[page]["width"],
                x1: box[0],
                x2: box[0] + box[2],
                y1: box[1],
                y2: box[1] + box[3]
              }
              ] 
            },
            'content': {
              'text': highlight['refs'][0][2],
            },
            'comment': {
              'emoji': "",
              'text': highlight['refs'][0][2]
            },
            'sentence': {
              'number': senIdx
            } 
          }; // end highlight elm
          highlights.push(highlight_elm);
        }); // end boxes.map
      }); // end object.keys
    });
    this.setState({
      highlights: highlights
    });
  }

  clickLink = () => {
    this.setState({
        showPopUpErr: true,
    })
  }

  closePopupErr=() => {
    this.setState({
      showPopUpErr: false,
    })
  }

  onToggleSidebar = () => {
    this.setState({
      toggleSidebar: !this.state.toggleSidebar,
      document_id: 0,
    })
  }

  render() {
    const { highlights, url, res, toggleSidebar, document_id } = this.state;
    return (
      <div className="Home" style={{ display: "flex", height: "100vh" }}>
        <div
          style={{
            height: "100vh",
            width: !toggleSidebar? '99%': "75vw",
            overflowY: "scroll",
            position: "relative"
          }}
        >
          <PDFViewer  
            onPressSentence={this.onPressSentence}
            url={url} 
            highlights={highlights} 
            res={res.highlight}
          />
          <div className="room w3-xxlarge">
              <a className="w3-bar-item w3-button"><span className="fa fa-minus"></span></a> 
              <a className="w3-bar-item w3-button"><span className="fa fa-search-plus"></span></a> 
              <a className="w3-bar-item w3-button"><span className="fa fa-plus"></span></a> 
          </div>
        </div>
        <div style={{ width: !toggleSidebar ? '1%': "10vw" }} >
          <nav id="sidebar" className={!toggleSidebar? "order-last active":"order-last"} >
            <div className="custom-menu" >
              <button 
                type="button" 
                id="sidebarCollapse" 
                className="btn btn-primary"
                onClick={this.onToggleSidebar}
              ></button>
              <div className="w3-bar-block w3-xlarge" style={{width:'30px', right: '4px'}}>
                <a 
                  className="w3-bar-item w3-button"
                  onClick={() => {this.setState({document_id: 0, toggleSidebar: true,});}}
                >
                  <span className="fa fa-home" style={{color:'#2F89FC'}} data-toggle="tooltip" data-original-title="Home" ></span>
                </a> 
                <a 
                  className="w3-bar-item w3-button"
                  onClick={() => {this.setState({document_id: 1,toggleSidebar: true})}}
                >
                  <span className="fa fa-clipboard" style={{color:'#2F89FC'}} data-toggle="tooltip" data-original-title="Tai lieu noi bo"></span>
                </a> 
                <a 
                  className="w3-bar-item w3-button"
                  onClick={() => {this.setState({document_id: 2,toggleSidebar: true})}}
                >
                  <span className="fa far fa-building" style={{color:'#2F89FC'}} data-toggle="tooltip" data-original-title="Tai lieu truong khac"></span>
                </a> 
                <a 
                  className="w3-bar-item w3-button"
                  onClick={() => {this.setState({document_id: 3,toggleSidebar: true})}}
                >
                  <span className="fa fa-globe" style={{color:'#2F89FC'}} data-toggle="tooltip" data-original-title="Tai lieu internet"></span>
                </a>
                <a 
                  className="w3-bar-item w3-button"
                  onClick={() => {this.setState({document_id: 4,toggleSidebar: true})}}
                >
                  <span className="fa fas fa-share" style={{color:'#2F89FC'}} data-toggle="tooltip" data-original-title="Share"></span>
                </a> 
              </div>
            </div>
            {
              toggleSidebar === false ?
              '' :
              <Sidebar
                uni_id={uni_id}
                data={res}
                document_id={document_id}
                ref={(ref)=>{this.sidebar=ref;}}
              />  
            }
          </nav>
        </div>
        
      </div>
    );
  }
}

export default Home;
