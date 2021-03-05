// @flow

import React,{PureComponent} from "react";
import type { T_Highlight } from "../../src/types";
import iconLeftArrow from '../images/left-arrow.png';
import iconRightArrow from '../images/right-arrow.png';
import iconClosePopup from '../images/close.png';
import iconDownArrow from '../images/down-arrow.png';
import iconUpArrow from '../images/up-arrow.png';

type T_ManuscriptHighlight = T_Highlight;

type Props = {
  highlights: Array<T_ManuscriptHighlight>,
  resetHighlights: () => void
};

var offset = -1;
var arrayValue;

class Sidebar extends PureComponent{
  constructor(props) {
    super(props);
    this.state={
      data: props.data,
      uni_id: props.uni_id,
      currentItem:{},
      showPopUp:false,
      showPopUpErr:false,
      source: [
        {
          id: 1,
          typeName: "Tài liệu nội bộ"
        },
        {
          id: 2,
          typeName: "Tài liệu nội bộ trường khác"
        },
        {
          id: 3,
          typeName: "Internet"
        },
      ],
      valueClick: {
        name: '',
        link: '',
        text: ''
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    let {document_id} = nextProps;
    // let resourceType = []
    // if (data.hasOwnProperty("res") && data.res.s) {
    //   data.res.s.forEach(function (element, index) {
    //     if (!resourceType.includes(element.type)) {
    //       resourceType.push(element.type)
    //     }
    //   })
    //   this.setState({
    //     source: resourceType
    //   })
    // }
  }

  handleClick=(element, index)=>()=>{
    var x = document.getElementsByClassName("sidebar__highlight");
    for (let i = 0; i < x.length; i++) {
      x[i].classList.remove('active');
    }
    if (document.getElementById('document-popup-primary') !== null) {
      document.getElementById('document-popup-primary').remove();
    }
    document.getElementById(index).classList.add('active');
    offset = 0;
    if (element.s.length) {
      arrayValue = element;
      this.setState({
        valueClick: {
          name: element.n,
          link: element.o,
          text: element.s[offset][9],
          private: element.private
        }
      })
      this.setState({
        showPopUp: true
      });
    } else {
      this.setState({
        showPopUp: false
      });
    }
  }

  showDetail=(index) =>()=>{
    let ele = document.getElementById('type-document-' + index)
    if (ele.classList.contains('show')) {
      ele.classList.remove('show')
      document.getElementById('img-down-' + index).src = iconDownArrow
    } else {
      ele.classList.add('show')
      document.getElementById('img-down-' + index).src = iconUpArrow
    }
  }

  nextSlide = () => {
    if (offset == arrayValue.s.length - 1) {
      offset = 0;
    } else {
      offset++;
    }
    const {valueClick}=this.state;
    valueClick.text=arrayValue.s[offset][9];
    this.setState({
      valueClick: {
        ...valueClick
      }
    })
  }

  clickLink = () => {
    this.setState({
        showPopUpErr: true,
    })
  }

  preSlide = () => {
    if (offset == 0) {
      offset = arrayValue.s.length - 1;
    } else {
      offset--;
    }
    const {valueClick}=this.state;
    valueClick.text=arrayValue.s[offset][9];
    this.setState({
      valueClick: {
        ...valueClick
      }
    })
  }

  updateCustomValue=(customValue)=>{
    this.setState({
      customValue
    });
  }

  closePopup = () => {
    this.setState({
      showPopUp: false
    })
  }

  closePopupErr=() => {
    this.setState({
      showPopUpErr: false,
    })
  }

  render(){
    const {
        uni_id,
        showPopUp,
        showPopUpErr,
        valueClick,
        source
    } = this.state;
    const { data, document_id } = this.props;
    
    const title = document_id === 0 ? 'Tất cả các nguồn': source[document_id-1].typeName;
    let percent = document_id === 0 ? parseInt(data.res.r*100)/100 : 0 ;
    let count = 0;
    const item_docs = document_id !== 0? data.res.s.map((element, index) => {
      if(
        element.r && (
          (source[document_id-1].typeName == 'Tài liệu nội bộ' && 
            element['uni-id'] == uni_id && 
            element.private &&
            document_id === 1
          )
          || (source[document_id-1].typeName == 'Tài liệu nội bộ trường khác' && 
              element['uni-id'] != uni_id && 
              element.private &&
              document_id === 2
            )
          || (!element.private && source[document_id-1].typeName == 'Internet' &&
              document_id === 3)) ) {
                percent += parseInt( element.r*100 );
                count++;
                return(
                <li
                  key={index}
                  id={index}
                  className="sidebar__highlight"
                  onClick={this.handleClick(element, index)}
                >
                  <div className="item_document_org clearfix">
                    <div className="float-left">
                      {element.n.replace("txt", "pdf")}
                    </div>
                    <div className="float-right">
                      <strong>{parseInt(element.r*100)/100} %</strong>
                    </div>
                  </div>
                </li>)
              } else return '';
    }) : '';
    percent = count !== 0 ? ( percent /count )/100 : percent;
    return(
      <div id="sidebar1" className="sidebar" style={{ width: "25vw" }} >
        <div className="content-sidebar" >
          <div className="title__sidebar">{title} ({ data.res ? percent : '' }%)</div>
          { item_docs !== ''?
            <ul
              id={'type-document-' + (document_id-1)}
              className="sidebar__highlights collapse show"
            >
            {item_docs}
            </ul>
            :
            <ul className="sidebar__highlights ">
              { source ? source.map((type, order) => (
                <li key={order}>
                  <div className="title-type" onClick={this.showDetail(order)}>
                    <span>{ type.typeName }</span>
                    <img src={iconDownArrow} className="img-fluid" id={'img-down-' + order} />
                  </div>
                  <ul
                    id={'type-document-' + order}
                    className="sidebar__highlights collapse"
                  >
                  {data.hasOwnProperty("res") && data.res.s ? data.res.s.map((element, index) => (
                    element.r && (
                      (type.typeName == 'Tài liệu nội bộ' && element['uni-id'] == uni_id && element.private)
                      || (type.typeName == 'Tài liệu nội bộ trường khác' && element['uni-id'] != uni_id && element.private)
                      || (!element.private && type.typeName == 'Internet')) ?
                    <li
                      key={index}
                      id={index}
                      className="sidebar__highlight"
                      onClick={this.handleClick(element, index)}
                    >
                      <div className="item_document_org clearfix">
                        <div className="float-left">
                          {element.n.replace("txt", "pdf")}
                        </div>
                        <div className="float-right">
                          <strong>{parseInt(element.r*100)/100} %</strong>
                        </div>
                      </div>
                    </li> : ''
                  )) : ''}
                  </ul>
                </li>
              )) : ''}
            </ul>
          }
          <div className="footer px-4">
            <p>
              Copyright &copy;<script>document.write(new Date().getFullYear());</script> Dai Hoc Bach Khoa Ha Noi <i className="icon-heart" aria-hidden="true"></i><br/> by <a href="https://soict.hust.edu.vn/" target="_blank">Vien CNTT - TT</a>
            </p>
          </div>
        </div>
        { showPopUp ? 
          <div className="item_document_popup" id="document-popup-sidebar">
            <div className="link_popup">
              <div className="float-left">
              { valueClick.private == false?
                <a href={valueClick.link} target="_blank">{valueClick.name.replace("txt", "pdf")}</a>
                : <p onClick={this.clickLink}>{valueClick.name.replace("txt", "pdf")}</p>
              }
              </div>
              <div className="float-right">
                <div className="icon-arrow mr-3" onClick={this.preSlide}>
                  <img src={iconLeftArrow} className="img-fluid" />
                </div>
                <div className="icon-arrow" onClick={this.nextSlide}>
                <img src={iconRightArrow} className="img-fluid"/>
                </div>
              </div>
              <div className="icon-close-popup" onClick={this.closePopup}>
                <img src={iconClosePopup} className="img-fluid"/>
              </div>
            </div>
            <div className="content_popup">
              {valueClick.text}
            </div>
          </div> : ''}

          { showPopUpErr ?
            <div className="backpop fixed">
                <div className="item_document_popup_2" id="document-popup-sidebar">
                <div className="link_popup element-center">
                  <div className="float-left text-center">
                    Tài liệu lưu trong hệ thống
                  </div>
                  <div className="float-right">
                  </div>
                  <div className="icon-close-popup" onClick={this.closePopupErr}>
                    <img src={iconClosePopup} className="img-fluid"/>
                  </div>
                </div>
                <div className="content_popup">
                  Do tài liệu là tài sản trí tuệ của tác giả và chưa được công bố rộng rãi trên Internet, chúng tôi không thể cho bạn xem toàn bộ nội dung tại thời điểm này
                </div>
              </div>
            </div>: ''
          }
        </div>
    );
  }

}

export default Sidebar;
