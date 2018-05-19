import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Tabs, Carousel as Notice, Input, Table, message } from 'antd';
import { Carousel } from 'react-responsive-carousel';
import classnames from 'classnames';
import NoticeBar from '../../components/noticeBar';
import request from '../../utils/request';

import './carousel.css';
import './home.css';

import partner1 from '../../assets/images/partner/bixin.png';
import partner2 from '../../assets/images/partner/bi.png';
import partner3 from '../../assets/images/partner/nodecape.png';
import partner4 from '../../assets/images/partner/lians.png';
import partner5 from '../../assets/images/partner/lianwen.png';
import partner6 from '../../assets/images/partner/Jlab.png';

const TabPane = Tabs.TabPane;
const Search = Input.Search;
const searchBar = (
  <Search placeholder="输入关键词" onSearch={value => console.log(value)} style={{ width: 200 }} />
);

class Home extends Component {
  state = {
    banners: [],
    coinType: 'my',
    sortedInfo: null,
    tradeExpair: null
  };

  componentWillMount() {
    this.getBanner();
    this.getTradeExpair();
  }

  //获取banner图
  getBanner = () => {
    request('/cms/banner/list', {
      method: 'GET',
      body: {
        language: 'zh_CN'
      }
    }).then(json => {
      if (json.code === 10000000) {
        this.setState({ banners: json.data });
      } else {
        message.error(json.msg);
      }
    });
  };

  //市场币种列表
  getTradeExpair = () => {
    request('/index/allTradeExpair', {
      method: 'GET'
    }).then(json => {
      if (json.code === 10000000) {
        const tradeExpair = {};
        Object.keys(json.data).forEach(key => {
          tradeExpair[key] = json.data[key].map(coin => {
            coin.key = coin.coinOther;
            return coin;
          });
        });
        this.setState({ tradeExpair });
      } else {
        message.error(json.msg);
      }
    });
  };

  handleSwitchTabs = coinType => {
    console.log(coinType);
    this.setState({ coinType });
  };

  handleCollect = () => {
    console.log('收藏');
  };

  handleChange = (pagination, filters, sorter) => {
    console.log('Various parameters', pagination, filters, sorter);
    this.setState({
      sortedInfo: sorter
    });
  };

  render() {
    let { banners, coinType, sortedInfo, tradeExpair } = this.state;
    coinType = coinType === 'my' ? '' : coinType;
    sortedInfo = sortedInfo || {};
    const columns = [
      {
        title: '币种',
        dataIndex: 'coinOther',
        key: 'coinOther',
        sorter: (a, b) => a.coin.length - b.coin.length,
        sortOrder: sortedInfo.columnKey === 'coin' && sortedInfo.order,
        render: (text, record) => (
          <span
            className={classnames({
              'name-wrap': true,
              attention: true
            })}
          >
            <i className="iconfont icon-shoucang" onClick={this.handleCollect} />
            {text}
          </span>
        )
      },
      {
        title: `最新价${coinType && `(${coinType})`}`,
        dataIndex: 'latestPrice',
        key: 'latestPrice',
        sorter: (a, b) => a.price - b.price,
        sortOrder: sortedInfo.columnKey === 'price' && sortedInfo.order
      },
      {
        title: '涨跌幅',
        dataIndex: 'change',
        key: 'change',
        sorter: (a, b) => a.change - b.change,
        sortOrder: sortedInfo.columnKey === 'change' && sortedInfo.order
      },
      {
        title: '最高价',
        dataIndex: 'highestPrice',
        key: 'highestPrice'
      },
      {
        title: '最低价',
        dataIndex: 'lowerPrice',
        key: 'lowerPrice'
      },
      {
        title: `成交额${coinType && `(${coinType})`}`,
        dataIndex: 'dayCount',
        key: 'dayCount',
        sorter: (a, b) => a.total - b.total,
        sortOrder: sortedInfo.columnKey === 'total' && sortedInfo.order
      }
    ];

    return (
      <div className="content home">
        <Carousel autoPlay infiniteLoop showArrows={false} showStatus={false} showThumbs={false}>
          {banners.length > 0 &&
            banners.map(banner => {
              const props = {
                target: banner.link && '_blank'
              };
              return (
                <Link key={banner.id} to={banner.link || banner.id} {...props}>
                  <img key={banner.id} src={banner.image} alt="" />
                </Link>
              );
            })}
        </Carousel>
        <div className="content-inner">
          <NoticeBar />
        </div>
        <div className="content-inner">
          <div className="coins-market">
            <Tabs tabBarExtraContent={searchBar} onChange={this.handleSwitchTabs}>
              <TabPane
                tab={
                  <span>
                    <i className="iconfont icon-shoucang-active" />
                    自选市场
                  </span>
                }
                key="my"
              >
                <Table
                  columns={columns}
                  dataSource={tradeExpair && tradeExpair['BTC']}
                  onChange={this.handleChange}
                  pagination={false}
                />
              </TabPane>
              <TabPane tab="BTC 市场" key="BTC">
                <Table
                  columns={columns}
                  dataSource={tradeExpair && tradeExpair['BTC']}
                  onChange={this.handleChange}
                  pagination={false}
                />
              </TabPane>
              <TabPane tab="ETH 市场" key="ETH">
                <Table
                  columns={columns}
                  dataSource={tradeExpair && tradeExpair['ETH']}
                  onChange={this.handleChange}
                  pagination={false}
                />
              </TabPane>
              <TabPane tab="USDT 市场" key="USDT">
                <Table
                  columns={columns}
                  dataSource={tradeExpair && tradeExpair['USDT']}
                  onChange={this.handleChange}
                  pagination={false}
                />
              </TabPane>
            </Tabs>
          </div>
        </div>
        <div className="partner">
          <div className="partner-inner">
            <h2>-合作伙伴-</h2>
            <ul className="content-inner">
              <li>
                <a href="https://po.im/#/home" target="_blank" rel="noopener noreferrer">
                  <img src={partner1} alt="" />
                </a>
              </li>
              <li>
                <a href="https://www.magicw.net/" target="_blank" rel="noopener noreferrer">
                  <img src={partner2} alt="" />
                </a>
              </li>
              <li>
                <a href="http://www.nodecap.com/" target="_blank" rel="noopener noreferrer">
                  <img src={partner3} alt="" />
                </a>
              </li>
              <li>
                <a href="http://chainup.com/" target="_blank" rel="noopener noreferrer">
                  <img src={partner4} alt="" />
                </a>
              </li>
              <li>
                <a href="https://www.chainnews.com/" target="_blank" rel="noopener noreferrer">
                  <img src={partner5} alt="" />
                </a>
              </li>
              <li>
                <a href="javascript:;" target="_blank" rel="noopener noreferrer">
                  <img src={partner6} alt="" />
                </a>
              </li>
              <li />
              <li />
            </ul>
          </div>
        </div>
      </div>
    );
  }
}

export default Home;
