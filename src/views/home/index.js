import React, { Component } from 'react';
import { Tabs, Carousel as Notice, Input, Table } from 'antd';
import { Carousel } from 'react-responsive-carousel';
import classnames from 'classnames';

import './carousel.css';
import './home.css';
import banner1 from '../../assets/images/banner/2018042619461603135.jpg';
import banner2 from '../../assets/images/banner/2018042619465659158.jpg';
import banner3 from '../../assets/images/banner/2018042619471682022.jpg';
import banner4 from '../../assets/images/banner/2018042619535967989.jpg';

import partner1 from '../../assets/images/partner/bixin.png';
import partner2 from '../../assets/images/partner/bi.png';
import partner3 from '../../assets/images/partner/nodecape.png';
import partner4 from '../../assets/images/partner/lians.png';
import partner5 from '../../assets/images/partner/lianwen.png';
import partner6 from '../../assets/images/partner/Jlab.png';

const TabPane = Tabs.TabPane;
const Search = Input.Search;
const searchBar = <Search
    placeholder="输入关键词"
    onSearch={value => console.log(value)}
    style={{ width: 200 }}
/>

const data = [{
    key: '1',
    coin: 'TCH',
    price: '0.000009/￥0.45',
    change: '+0.63%',
    high: '0.00000807',
    low: '0.00000740',
    total: '100.05907138',
}, {
    key: '2',
    coin: 'BCH',
    price: '0.00000709/￥0.48',
    change: '+0.65%',
    high: '0.00000807',
    low: '0.00000740',
    total: '200.05907138',
}, {
    key: '3',
    coin: 'ETH',
    price: '0.00000801/￥0.48',
    change: '+1.63%',
    high: '0.00000807',
    low: '0.00000740',
    total: '300.05907138',
}, {
    key: '4',
    coin: 'LTC',
    price: '0.00000015/￥0.48',
    change: '+0.05%',
    high: '0.00000807',
    low: '0.00000740',
    total: '412.05907138',
}, {
    key: '5',
    coin: 'LTC',
    price: '0.00000015/￥0.48',
    change: '+0.05%',
    high: '0.00000807',
    low: '0.00000740',
    total: '412.05907138',
}, {
    key: '6',
    coin: 'LTC',
    price: '0.00000015/￥0.48',
    change: '+0.05%',
    high: '0.00000807',
    low: '0.00000740',
    total: '412.05907138',
}, {
    key: '7',
    coin: 'LTC',
    price: '0.00000015/￥0.48',
    change: '+0.05%',
    high: '0.00000807',
    low: '0.00000740',
    total: '412.05907138',
}, {
    key: '8',
    coin: 'LTC',
    price: '0.00000015/￥0.48',
    change: '+0.05%',
    high: '0.00000807',
    low: '0.00000740',
    total: '412.05907138',
}];

class Home extends Component {

    state = {
        coinType: 'my',
        sortedInfo: null,
    };

    handleSwitchTabs = (coinType) => {
        this.setState({ coinType })
    }

    handleCollect = () => {
        console.log('收藏')
    }

    handleChange = (pagination, filters, sorter) => {
        console.log('Various parameters', pagination, filters, sorter);
        this.setState({
            sortedInfo: sorter,
        });
    }

    render() {
        const banners = [banner1, banner2, banner3, banner4];

        let { coinType, sortedInfo } = this.state;
        coinType = coinType === 'my' ? '' : coinType;
        sortedInfo = sortedInfo || {};
        const columns = [{
            title: '币种',
            dataIndex: 'coin',
            key: 'coin',
            sorter: (a, b) => a.coin.length - b.coin.length,
            sortOrder: sortedInfo.columnKey === 'coin' && sortedInfo.order,
            render: (text, record) => (
                <span className={classnames({
                    'name-wrap': true,
                    'attention': true
                })}>
                    <i 
                        className="iconfont icon-shoucang"
                        onClick={this.handleCollect}
                    ></i>
                    {text}
                </span>
            )
        }, {
            title: `最新价${coinType && `(${coinType})`}`,
            dataIndex: 'price',
            key: 'price',
            sorter: (a, b) => a.price - b.price,
            sortOrder: sortedInfo.columnKey === 'price' && sortedInfo.order,
        }, {
            title: '涨跌幅',
            dataIndex: 'change',
            key: 'change',
            sorter: (a, b) => a.change - b.change,
            sortOrder: sortedInfo.columnKey === 'change' && sortedInfo.order,
        }, {
            title: '最高价',
            dataIndex: 'high',
            key: 'high',
        }, {
            title: '最低价',
            dataIndex: 'low',
            key: 'low',
        }, {
            title: `成交额${coinType && `(${coinType})`}`,
            dataIndex: 'total',
            key: 'total',
            sorter: (a, b) => a.total - b.total,
            sortOrder: sortedInfo.columnKey === 'total' && sortedInfo.order,
        }];

        return (
            <div className="content home">
                <Carousel
                    autoPlay
                    infiniteLoop
                    showArrows={false}
                    showStatus={false}
                    showThumbs={false}
                >
                    {banners.map(banner => <img key={banner} src={banner} alt="" />)}
                </Carousel>
                <div className="content-inner">
                    <div className="scroll-notice">
                        <i className="iconfont icon-notice"></i>
                        <Notice
                            autoplay
                            vertical
                            dots={false}
                        >
                            <div><a href="javascript:;">CoinTiger系统维护公告&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2018-04-24 </a></div>
                            <div><a href="javascript:;">CoinTiger将于4月26日上线CTXC的公告&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2018-04-24 </a></div>
                            <div><a href="javascrip:;">CoinTiger将于5月4日16:00上线INC/BTC、INC/ETH交易对&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;018-04-26 </a></div>
                        </Notice>
                        <a href="javascript:;" className="notice-more">更多>></a>
                    </div>
                </div>
                <div className="content-inner">
                    <div className="coins-market">
                        <Tabs
                            tabBarExtraContent={searchBar}
                            onChange={this.handleSwitchTabs}
                        >
                            <TabPane tab={<span><i className="iconfont icon-shoucang-active"></i>自选市场</span>} key="my">
                                <Table
                                    columns={columns}
                                    dataSource={data}
                                    onChange={this.handleChange}
                                    pagination={false}
                                />
                            </TabPane>
                            <TabPane tab="BTC 市场" key="BTC">
                                <Table
                                    columns={columns}
                                    dataSource={data}
                                    onChange={this.handleChange}
                                    pagination={false}
                                />
                            </TabPane>
                            <TabPane tab="ETH 市场" key="ETH">
                                <Table
                                    columns={columns}
                                    dataSource={data}
                                    onChange={this.handleChange}
                                    pagination={false}
                                />
                            </TabPane>
                            <TabPane tab="BitCNY 市场" key="BitCNY">
                                <Table
                                    columns={columns}
                                    dataSource={data}
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
                                <a href="https://po.im/#/home" target="_blank" rel="noopener noreferrer"><img src={partner1} alt="" /></a>
                            </li>
                            <li>
                                <a href="https://www.magicw.net/" target="_blank" rel="noopener noreferrer"><img src={partner2} alt="" /></a>
                            </li>
                            <li>
                                <a href="http://www.nodecap.com/" target="_blank" rel="noopener noreferrer"><img src={partner3} alt="" /></a>
                            </li>
                            <li>
                                <a href="http://chainup.com/" target="_blank" rel="noopener noreferrer"><img src={partner4} alt="" /></a>
                            </li>
                            <li>
                                <a href="https://www.chainnews.com/" target="_blank" rel="noopener noreferrer"><img src={partner5} alt="" /></a>
                            </li>
                            <li>
                                <a href="javascript:;" target="_blank" rel="noopener noreferrer"><img src={partner6} alt="" /></a>
                            </li>
                            <li></li>
                            <li></li>
                        </ul>
                    </div>
                </div>
            </div>
        )
    }
}

export default Home;