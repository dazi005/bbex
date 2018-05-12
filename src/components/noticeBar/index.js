import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Carousel as Notice, message } from 'antd';
import request from '../../utils/request';
import { stampToDate } from '../../utils';

class NoticeBar extends Component {
  constructor(props) {
    super(props);
    this.state={
      notices: [],
    }
  }
  componentWillMount(){
    this.getNotice();
  }
  moreNoticeClick = () => {   
    this.props.history.push("/notice");
  }

  //获取公告
  getNotice = () => {
    request('/cms/notice/list', {
        body: {
            language: "zh_CN",
            currentPage: 1,
            showCount: 3,
        }
    }).then(json => {
        if (json.code === 10000000) {
            this.setState({ notices: json.data.list })
        } else {
            message.error(json.msg);
        }
    });
  }

  render() {
    const { notices } = this.state;
    return <div className="scroll-notice">
        <i className="iconfont icon-notice"></i>
        <Notice
            autoplay
            vertical
            dots={false}
        >
            {notices.map(notice => {
                return (
                    <div key={notice.id}>
                        <Link to={`/notice/${notice.id}`}>{notice.title}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{stampToDate(Number(notice.createDate), 'YYYY-MM-DD')}</Link>
                    </div>
                )
            })}
        </Notice>
        <span className="notice-more" onClick={this.moreNoticeClick} >更多>></span>
    </div>
  }
}

export default withRouter(NoticeBar);