import React, { Component } from 'react';
import { List, Spin, Button, message } from 'antd';
import { stampToDate } from '../../utils';
import request from '../../utils/request';
import './notice.css';

class Notice extends Component {
  constructor(props){
    super(props);
    this.state = {
      loading: false,
      loadingMore: true,
      showLoadingMore: true,
      notices: [],
      page: 1,
    }
  }

  componentWillMount() {
    
    this.getNotice(1, (list)=>{
      this.setState({loadingMore: false})
      if(list.length<10){
        this.setState({showLoadingMore: false})
      } 
      this.setState({ notices: list});
    });
  }

  //获取公告
  getNotice = (page, callback) => {
    request('/cms/notice/list', {
        body: {
            language: "zh_CN",
            currentPage: page,
            showCount: 10,
        }
    }).then(json => {
        if (json.code === 10000000) {
            callback(json.data.list)
            
        } else {
            message.error(json.msg);
        }
    });
  }

  itemClick = (item) =>{
    this.props.history.push(`/notice/${item.id}`);
  }
  onLoadMore = () => {
    const {page, notices } = this.state;
    let myPage = page*1+1;
    this.setState({
      loadingMore: true,
      page: myPage
    });
    this.getNotice(myPage, (list)=>{
      this.setState({loadingMore: false});
      if(list.length<10){
        this.setState({showLoadingMore: false})
      } 
      this.setState({ notices: notices.concat(list)});
    })
  }
  render() {
    const {loading, loadingMore,showLoadingMore, notices} = this.state;
    const loadMore = showLoadingMore ? (
      <div className="loadmore">
        {loadingMore && <Spin />}
        {!loadingMore && <Button onClick={this.onLoadMore}>加载更多</Button>}
      </div>
    ) : null;
    return <List
      className="bbex_notice"
      loading={loading}
      itemLayout="horizontal"
      loadMore={loadMore}
      size="small"
      header={<p className="notice_title">公告</p>}
      dataSource={notices}
      renderItem={item => (
        <List.Item className="notice_item" onClick={()=>{
          this.itemClick(item);
        }}>
          <div>{item.title}</div>
          <div>{stampToDate(Number(item.createDate), 'YYYY-MM-DD')}</div>
        </List.Item>
    )}
  />
  }
}

export default Notice;