import React, { Component } from 'react';
import {
    Tabs,
    Carousel as Notice,
    Input,
    Table,
    Menu,
    Dropdown,
    Icon,
    Tooltip,
    Button,
    Select,
} from 'antd';
import classnames from 'classnames';
import Scrollbars from 'react-custom-scrollbars';

import './trade.css';
import { list } from 'postcss';

const Search = Input.Search;
const TabPane = Tabs.TabPane;
const Option = Select.Option;

class Trade extends Component {
    state = {
        market: 'BTC',
        marketName: 'BTC',
        coinName: 'TRX',
        coinPrice: '0.00000878 &asymp;￥0.54',
        listType: 0,
    }

    // 切换市场
    switchMarket = (obj) => {
        this.setState({ market: obj.key });
    }

    // 根据币种跳转市场
    jumpMarket = (obj) => {
        this.setState({
            market: obj.key,
            marketName: obj.key,
            coinPrice: obj.item.props.children.join('').split(' ')[1].replace('/', '&nbsp;&asymp;')
        });
    }

    // 选择币种
    selectCoin = (coin) => {
        console.log(coin);
    }

    // 按小数位数合并列表
    handleMerge = (value) => {
        console.log('merge: ', value)
    }

    // 切换列表    
    switchList = (index) => {
        console.log('switch list:', index);
        this.setState({ listType: index });
    }

    render() {
        const {
            market,
            marketName,
            coinName,
            coinPrice,
            listType,
        } = this.state;
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
        }];

        const buyData = [{
            price: '0.00230541',
            volume: '70.03',
            totalPrice: '0.16144786'
        }, {
            price: '0.00230541',
            volume: '70.03',
            totalPrice: '0.16144786'
        }, {
            price: '0.00230541',
            volume: '70.03',
            totalPrice: '0.16144786'
        }, {
            price: '0.00230541',
            volume: '70.03',
            totalPrice: '0.16144786'
        }, {
            price: '0.00230541',
            volume: '70.03',
            totalPrice: '0.16144786'
        }, {
            price: '0.00230541',
            volume: '70.03',
            totalPrice: '0.16144786'
        }, {
            price: '0.00230541',
            volume: '70.03',
            totalPrice: '0.16144786'
        }, {
            price: '0.00230541',
            volume: '70.03',
            totalPrice: '0.16144786'
        }, {
            price: '0.00230541',
            volume: '70.03',
            totalPrice: '0.16144786'
        }, {
            price: '0.00230541',
            volume: '70.03',
            totalPrice: '0.16144786'
        }, {
            price: '0.00230541',
            volume: '70.03',
            totalPrice: '0.16144786'
        }, {
            price: '0.00230541',
            volume: '70.03',
            totalPrice: '0.16144786'
        }, {
            price: '0.00230541',
            volume: '70.03',
            totalPrice: '0.16144786'
        }, {
            price: '0.00230541',
            volume: '70.03',
            totalPrice: '0.16144786'
        }, {
            price: '0.00230541',
            volume: '70.03',
            totalPrice: '0.16144786'
        }, {
            price: '0.00230541',
            volume: '70.03',
            totalPrice: '0.16144786'
        }, {
            price: '0.00230541',
            volume: '70.03',
            totalPrice: '0.16144786'
        }, {
            price: '0.00230541',
            volume: '70.03',
            totalPrice: '0.16144786'
        }, {
            price: '0.00230541',
            volume: '70.03',
            totalPrice: '0.16144786'
        }, {
            price: '0.00230541',
            volume: '70.03',
            totalPrice: '0.16144786'
        }, {
            price: '0.00230541',
            volume: '70.03',
            totalPrice: '0.16144786'
        }, {
            price: '0.00230541',
            volume: '70.03',
            totalPrice: '0.16144786'
        }, {
            price: '0.00230541',
            volume: '70.03',
            totalPrice: '0.16144786'
        }, {
            price: '0.00230541',
            volume: '70.03',
            totalPrice: '0.16144786'
        }, {
            price: '0.00230541',
            volume: '70.03',
            totalPrice: '0.16144786'
        }, {
            price: '0.00230541',
            volume: '70.03',
            totalPrice: '0.16144786'
        }, {
            price: '0.00230541',
            volume: '70.03',
            totalPrice: '0.16144786'
        }, {
            price: '0.00230541',
            volume: '70.03',
            totalPrice: '0.16144786'
        }, {
            price: '0.00230541',
            volume: '70.03',
            totalPrice: '0.16144786'
        }, {
            price: '0.00230541',
            volume: '70.03',
            totalPrice: '0.16144786'
        }, {
            price: '0.00230541',
            volume: '70.03',
            totalPrice: '0.16144786'
        }, {
            price: '0.00230541',
            volume: '70.03',
            totalPrice: '0.16144786'
        }, {
            price: '0.00230541',
            volume: '70.03',
            totalPrice: '0.16144786'
        }, {
            price: '0.00230541',
            volume: '70.03',
            totalPrice: '0.16144786'
        }, {
            price: '0.00230541',
            volume: '70.03',
            totalPrice: '0.16144786'
        }, {
            price: '0.00230541',
            volume: '70.03',
            totalPrice: '0.16144786'
        }, {
            price: '0.00230541',
            volume: '70.03',
            totalPrice: '0.16144786'
        }, {
            price: '0.00230541',
            volume: '70.03',
            totalPrice: '0.16144786'
        }, {
            price: '0.00230541',
            volume: '70.03',
            totalPrice: '0.16144786'
        }, {
            price: '0.00230541',
            volume: '70.03',
            totalPrice: '0.16144786'
        }, {
            price: '0.00230541',
            volume: '70.03',
            totalPrice: '0.16144786'
        }, {
            price: '0.00230541',
            volume: '70.03',
            totalPrice: '0.16144786'
        }, {
            price: '0.00230541',
            volume: '70.03',
            totalPrice: '0.16144786'
        }, {
            price: '0.00230541',
            volume: '70.03',
            totalPrice: '0.16144786'
        }, {
            price: '0.00230541',
            volume: '70.03',
            totalPrice: '0.16144786'
        }];

        const pendingOrderColumns = [{
            title: '委托时间',
            dataIndex: 'time',
            key: 'time',
        }, {
            title: '委托类别',
            dataIndex: 'type',
            key: 'type',
        }, {
            title: '触发条件',
            dataIndex: 'condition',
            key: 'condition',
        }, {
            title: '委托价格',
            dataIndex: 'price',
            key: 'price',
        }, {
            title: '委托数量',
            dataIndex: 'delegateVolume',
            key: 'delegateVolume',
        }, {
            title: '委托金额',
            dataIndex: 'amount',
            key: 'amount',
        }, {
            title: '成交量',
            dataIndex: 'volume',
            key: 'volume',
        }, {
            title: '平均成交价',
            dataIndex: 'averagePrice',
            key: 'averagePrice',
        }, {
            title: '状态/操作',
            dataIndex: 'status&action',
            key: 'status&action',
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
                                            {market === 'optional' ? '自选' : `${market}市场`}&nbsp;&nbsp;<Icon type="down" />
                                        </a>
                                    </Dropdown>
                                    <div className="trade-plate-header-right">
                                        <Search
                                            onSearch={value => console.log(value)}
                                            style={{ width: 80 }}
                                        />
                                    </div>
                                </header>
                                <div className="trade-plate-tit cell-3">
                                    <div className="trade-plate-tit-cell">币种</div>
                                    <div className="trade-plate-tit-cell sorter">
                                        最新价
                                        <div className="ant-table-column-sorter">
                                            <span className="ant-table-column-sorter-up off" title="↑">
                                                <i className="anticon anticon-caret-up"></i>
                                            </span>
                                            <span className="ant-table-column-sorter-down off" title="↓">
                                                <i className="anticon anticon-caret-down"></i>
                                            </span>
                                        </div>
                                    </div>
                                    <div className="trade-plate-tit-cell sorter">
                                        涨跌幅
                                        <div className="ant-table-column-sorter">
                                            <span className="ant-table-column-sorter-up off" title="↑">
                                                <i className="anticon anticon-caret-up"></i>
                                            </span>
                                            <span className="ant-table-column-sorter-down off" title="↓">
                                                <i className="anticon anticon-caret-down"></i>
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
                                    <span className="trade-plate-header-text">最新成交</span>
                                </header>
                                <div className="trade-plate-tit cell-3">
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
                            <div className="trade-plate">
                                <header className="trade-plate-header">
                                    <Dropdown
                                        overlay={(
                                            <Menu onClick={this.jumpMarket}>
                                                {[{
                                                    marketName: 'BTC',
                                                    pairPrice: '0.00000877',
                                                    pairCNY: '￥0.54',
                                                }, {
                                                    marketName: 'BitCNY',
                                                    pairPrice: '0.514',
                                                    pairCNY: '￥0.54',
                                                }, {
                                                    marketName: 'ETH',
                                                    pairPrice: '0.00010951',
                                                    pairCNY: '￥0.54',
                                                }].map(market => {
                                                    return (
                                                        <Menu.Item key={market.marketName}>
                                                            {coinName}/{market.marketName} {market.pairPrice}/{market.pairCNY}
                                                        </Menu.Item>
                                                    )
                                                })}
                                            </Menu>
                                        )}
                                    >
                                        <a className="ant-dropdown-link" href="javascript:;">
                                            TRX/{marketName}&nbsp;&nbsp;<Icon type="down" />
                                        </a>
                                    </Dropdown>
                                    <span className="trade-plate-header-price" dangerouslySetInnerHTML={{ __html: coinPrice }} />
                                    <div className="trade-plate-header-right">
                                        <Tooltip
                                            placement="rightTop"
                                            title={`波场TRON是全球最大的区块链去中心化应用操作系统,
                                            波场TRON以推动互联网去中心化为己任，
                                            致力于为去中心化互联网搭建基础设施。
                                            旗下的波场TRON协议是全球最大的基于区块链的去中心化应用操作系统协议之一，
                                            为协议上的去中心化应用运行提供高吞吐，高扩展，高可靠性的底层公链支持。`}
                                        >
                                            <Button type="introduction">币种介绍</Button>
                                        </Tooltip>
                                    </div>
                                </header>
                                <div className="trade-plate-tit Kline">
                                    <div className="trade-plate-tit-cell">最高<strong>0.00000780</strong></div>
                                    <div className="trade-plate-tit-cell">最高<strong>0.00000750</strong></div>
                                    <div className="trade-plate-tit-cell">成交量<strong>44058464.3</strong></div>
                                    <div className="trade-plate-tit-cell">涨跌幅<strong className="font-color-red">-0.13%</strong></div>
                                </div>
                                <div className="trade-plate-container">

                                </div>
                            </div>
                            <div className="trade-plate">
                                <Tabs defaultActiveKey="1">
                                    <TabPane tab="限价交易" key="1">Content of Tab Pane 1</TabPane>
                                    <TabPane tab="市价交易" key="2">Content of Tab Pane 2</TabPane>
                                    <TabPane tab={<span>
                                        止盈质损
                                        <Tooltip
                                            placement="rightTop"
                                            title={`当市场价达到触发价时，将按计划设定的价格和数量进行下单`}
                                        >
                                            <i className="iconfont icon-web-icon-" />
                                        </Tooltip>
                                    </span>} key="3">Content of Tab Pane 3</TabPane>
                                </Tabs>
                            </div>
                        </div>
                        <div className="trade-right pull-right">
                            <div className="trade-plate">
                                <header className="trade-plate-header">
                                    <div className="trade-plate-tab">
                                        {['icon-maimaipan', 'icon-maipan1', 'icon-maipan'].map((iconName, index) => {
                                            const mapToTitle = {
                                                'icon-maimaipan': 'buy and sell',
                                                'icon-maipan1': 'buy',
                                                'icon-maipan': 'sell',
                                            }
                                            return <i
                                                key={iconName}
                                                className={classnames({
                                                    iconfont: true,
                                                    [iconName]: true,
                                                    active: listType === index
                                                })}
                                                title={mapToTitle[iconName]}
                                                onClick={this.switchList.bind(this, index)}
                                            />
                                        })}
                                    </div>
                                    <div className="trade-plate-header-right">
                                        合并
                                        <Select
                                            defaultValue="8"
                                            style={{ width: 100 }}
                                            dropdownClassName="merge-dropdown"
                                            onChange={this.handleMerge}
                                        >
                                            <Option value="8">8位小数</Option>
                                            <Option value="6">6位小数</Option>
                                            <Option value="4">4位小数</Option>
                                        </Select>
                                    </div>
                                </header>
                                {listType === 0 ? (
                                    <div className="trade-plate-tit list">
                                        <div className="trade-plate-tit-cell">类型</div>
                                        <div className="trade-plate-tit-cell">价格({marketName})</div>
                                        <div className="trade-plate-tit-cell">数量({coinName})</div>
                                        <div className="trade-plate-tit-cell">交易额({marketName})</div>
                                    </div>
                                ) : (
                                        <div className="trade-plate-tit list">
                                            <div className="trade-plate-tit-cell">{listType === 1 ? '买入' : '卖出'}</div>
                                            <div className="trade-plate-tit-cell">{listType === 1 ? '买入' : '卖出'}价</div>
                                            <div className="trade-plate-tit-cell">委单量</div>
                                            <div className="trade-plate-tit-cell">交易额({marketName})</div>
                                        </div>
                                    )}
                                {listType === 0 ? (
                                    <div className="trade-plate-list">
                                        <table>
                                            <tbody>
                                                {buyData.map((record, index) => {
                                                    return index < 15 && (
                                                        <tr key={index}>
                                                            <td className="font-color-red">卖出{15 - index}</td>
                                                            <td>{record.price}</td>
                                                            <td>{record.volume}</td>
                                                            <td className="font-color-red">{record.totalPrice}</td>
                                                        </tr>
                                                    )
                                                })}
                                            </tbody>
                                        </table>
                                        <div className="latest-price">
                                            <span>
                                                <i className="iconfont icon-xinhao font-color-green" />最新价
                                            </span>
                                            <span className="font-color-red">
                                                0.00229124 <i className="iconfont icon-xiajiang" />
                                            </span>
                                        </div>
                                        <table>
                                            <tbody>
                                                {buyData.map((record, index) => {
                                                    return index < 15 && (
                                                        <tr key={index}>
                                                            <td className="font-color-green">卖出{index + 1}</td>
                                                            <td>{record.price}</td>
                                                            <td>{record.volume}</td>
                                                            <td className="font-color-green">{record.totalPrice}</td>
                                                        </tr>
                                                    )
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                        <div className="trade-plate-list">
                                            <Scrollbars>
                                                <table>
                                                    <tbody>
                                                        {buyData.map((record, index) => {
                                                            const colorName = listType === 1 ? 'green' : 'red';
                                                            const actionName = listType === 1 ? '买入' : '卖出';
                                                            return <tr key={index}>
                                                                <td className={`font-color-${colorName}`}>{actionName}{index + 1}</td>
                                                                <td>{record.price}</td>
                                                                <td>{record.volume}</td>
                                                                <td className={`font-color-${colorName}`}>{record.totalPrice}</td>
                                                            </tr>
                                                        })}
                                                    </tbody>
                                                </table>
                                            </Scrollbars>
                                        </div>
                                    )}
                            </div>
                        </div>
                    </div>
                    <div className="trade-plate">
                        <Tabs defaultActiveKey="1">
                            <TabPane tab="我的挂单" key="1">
                                <Table
                                    columns={pendingOrderColumns}
                                    dataSource={null}
                                    pagination={false}
                                />
                            </TabPane>
                            <TabPane tab="全部委托" key="2">
                                <Table
                                    columns={pendingOrderColumns}
                                    dataSource={null}
                                    pagination={false}
                                />
                            </TabPane>
                            <TabPane tab="成交历史" key="3">
                                <Table
                                    columns={pendingOrderColumns}
                                    dataSource={null}
                                    pagination={false}
                                />
                            </TabPane>
                        </Tabs>
                    </div>
                </div>
            </div>
        )
    }
}

export default Trade;