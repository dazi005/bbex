import React, { Component } from 'react';
import { message } from 'antd';
import request from '../../utils/request';
import './detail.css'

class Detail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      content: '<p></p>'
    }
  }
  componentWillMount() {
    console.log(this.props.match.params.id);
    this.getNoticeDetail(this.props.match.params.id);
  }

  //获取公告
  getNoticeDetail = (id) => {
    request('/cms/view/'+id, {
      method: 'GET',
    }).then(json => {
        if (json.code === 10000000) {
            this.setState({content: json.data.content})
        } else {
            message.error(json.msg);
        }
    });
  }

  render() {
    return <div className="content-inner notice_detail">
      <div dangerouslySetInnerHTML={{__html: this.state.content}}/>
    </div>
  }
}

export default Detail;