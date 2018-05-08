import React, { Component } from 'react';
import { Tabs, Carousel as Notice, Input, Table, Menu, Dropdown, Icon } from 'antd';
import Scrollbars from 'react-custom-scrollbars';

import './trade.css';
import Item from 'antd/lib/list/Item';

const Search = Input.Search;

class Trade extends Component {
    state = {
        market: 'BTC市场',
    }

    switchMarket = (item) => {
        const market = item.key === 'optional' ? '自选' : `${item.key}市场`;
        this.setState({ market });
    }

    selectCoin = (coin) => {
        console.log(coin);
    }

    render() {
        const { market } = this.state;
        const marketData = [{
            key: 1,
            symbol: 'TCH',
            price: '0.00000789',
            change: '+2.47%'
        }, {
            key: 2,
            symbol: 'STORJ',
            price: '0.00000789',
            change: '-2.47%'
        }, {
            key: 3,
            symbol: 'LOOM',
            price: '0.00000789',
            change: '-2.47%'
        }, {
            key: 4,
            symbol: 'HTML',
            price: '0.00000789',
            change: '+2.47%'
        }, {
            key: 5,
            symbol: 'TCH',
            price: '0.00000789',
            change: '+2.47%'
        }, {
            key: 6,
            symbol: 'LTC',
            price: '0.00000789',
            change: '-2.47%'
        }, {
            key: 7,
            symbol: 'LOOM',
            price: '0.00000789',
            change: '-2.47%'
        }, {
            key: 8,
            symbol: 'HTML',
            price: '0.00000789',
            change: '+2.47%'
        }, {
            key: 9,
            symbol: 'TCH',
            price: '0.00000789',
            change: '+2.47%'
        }, {
            key: 10,
            symbol: 'LTC',
            price: '0.00000789',
            change: '-2.47%'
        }, {
            key: 11,
            symbol: 'LOOM',
            price: '0.00000789',
            change: '-2.47%'
        }, {
            key: 12,
            symbol: 'HTML',
            price: '0.00000789',
            change: '+2.47%'
        }, {
            key: 13,
            symbol: 'TCH',
            price: '0.00000789',
            change: '+2.47%'
        }, {
            key: 14,
            symbol: 'LTC',
            price: '0.00000789',
            change: '-2.47%'
        }, {
            key: 15,
            symbol: 'LOOM',
            price: '0.00000789',
            change: '-2.47%'
        }, {
            key: 16,
            symbol: 'HTML',
            price: '0.00000789',
            change: '+2.47%'
        }];

        const latestData = [{
            key: 1,
            time: '21:54:25',
            price: '0.00011478',
            volume: '19.52'
        }, {
            key: 2,
            time: '21:54:25',
            price: '0.00011478',
            volume: '19.52'
        }, {
            key: 3,
            time: '21:54:25',
            price: '0.00011478',
            volume: '19.52'
        }, {
            key: 4,
            time: '21:54:25',
            price: '0.00011478',
            volume: '19.52'
        }, {
            key: 5,
            time: '21:54:25',
            price: '0.00011478',
            volume: '19.52'
        }, {
            key: 6,
            time: '21:54:25',
            price: '0.00011478',
            volume: '19.52'
        }, {
            key: 7,
            time: '21:54:25',
            price: '0.00011478',
            volume: '19.52'
        }, {
            key: 8,
            time: '21:54:25',
            price: '0.00011478',
            volume: '19.52'
        }, {
            key: 9,
            time: '21:54:25',
            price: '0.00011478',
            volume: '19.52'
        }, {
            key: 10,
            time: '21:54:25',
            price: '0.00011478',
            volume: '19.52'
        }, {
            key: 11,
            time: '21:54:25',
            price: '0.00011478',
            volume: '19.52'
        }, {
            key: 12,
            time: '21:54:25',
            price: '0.00011478',
            volume: '19.52'
        }, {
            key: 13,
            time: '21:54:25',
            price: '0.00011478',
            volume: '19.52'
        }, {
            key: 14,
            time: '21:54:25',
            price: '0.00011478',
            volume: '19.52'
        }, {
            key: 15,
            time: '21:54:25',
            price: '0.00011478',
            volume: '19.52'
        }]

        return (
            <div className="content trade">
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
                    <div className="trade-area clear">
                        <div className="trade-left pull-left">
                            <div className="trade-plate">
                                <header className="trade-plate-header">
                                    <Dropdown
                                        overlay={(
                                            <Menu onClick={this.switchMarket}>
                                                <Menu.Item key="optional">自选</Menu.Item>
                                                <Menu.Item key="BTC">BTC市场</Menu.Item>
                                                <Menu.Item key="ETH">ETH市场</Menu.Item>
                                                <Menu.Item key="BitCNY">BitCNY市场</Menu.Item>
                                            </Menu>
                                        )}
                                    >
                                        <a className="ant-dropdown-link" href="javascript:;">
                                            {market}&nbsp;&nbsp;<Icon type="down" />
                                        </a>
                                    </Dropdown>
                                    <div className="trade-plate-header-right">
                                        <Search
                                            onSearch={value => console.log(value)}
                                            style={{ width: 80 }}
                                        />
                                    </div>
                                </header>
                                <div className="trade-plate-tit">
                                    <div className="trade-plate-tit-cell">币种</div>
                                    <div className="trade-plate-tit-cell">
                                        最新价
                                        <div class="ant-table-column-sorter">
                                            <span class="ant-table-column-sorter-up off" title="↑">
                                                <i class="anticon anticon-caret-up"></i>
                                            </span>
                                            <span class="ant-table-column-sorter-down off" title="↓">
                                                <i class="anticon anticon-caret-down"></i>
                                            </span>
                                        </div>
                                    </div>
                                    <div className="trade-plate-tit-cell">
                                        涨跌幅
                                        <div class="ant-table-column-sorter">
                                            <span class="ant-table-column-sorter-up off" title="↑">
                                                <i class="anticon anticon-caret-up"></i>
                                            </span>
                                            <span class="ant-table-column-sorter-down off" title="↓">
                                                <i class="anticon anticon-caret-down"></i>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="trade-plate-container">
                                    <Scrollbars>
                                        <table>
                                            <tbody>
                                                {marketData.map(coin => {
                                                    const trend = coin.change.substr(0, 1) === '+' ? 'green' : 'red';
                                                    return <tr
                                                        key={coin.key}
                                                        onClick={this.selectCoin.bind(this, coin)}
                                                    >
                                                        <td>
                                                            <i className="iconfont icon-shoucang"></i>
                                                            {coin.symbol}
                                                        </td>
                                                        <td>{coin.price}</td>
                                                        <td className={`font-color-${trend}`}>{coin.change}</td>
                                                    </tr>
                                                })}
                                            </tbody>
                                        </table>
                                    </Scrollbars>
                                </div>
                            </div>
                            <div className="trade-plate">
                                <header className="trade-plate-header">
                                    最新成交
                                </header>
                                <div className="trade-plate-tit">
                                    <div className="trade-plate-tit-cell">成交时间</div>
                                    <div className="trade-plate-tit-cell">成交价格</div>
                                    <div className="trade-plate-tit-cell">成交量</div>
                                </div>
                                <div className="trade-plate-container">
                                    <Scrollbars>
                                        <table>
                                            <tbody>
                                                {latestData.map((transaction, index) => {
                                                    const trend = index % 2 === 0 ? 'red' : 'green';
                                                    return <tr
                                                        key={transaction.key}
                                                        className={`font-color-${trend}`}
                                                    >
                                                        <td>{transaction.time}</td>
                                                        <td>{transaction.price}</td>
                                                        <td>{transaction.volume}</td>
                                                    </tr>
                                                })}
                                            </tbody>
                                        </table>
                                    </Scrollbars>
                                </div>
                            </div>
                        </div>
                        <div className="trade-center pull-left">

                        </div>
                        <div className="trade-right pull-right">

                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Trade;