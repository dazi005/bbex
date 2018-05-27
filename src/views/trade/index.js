import React, { Component } from 'react';
import { Tabs, Input, Table, Menu, Dropdown, Icon, Tooltip, Button, Select, message } from 'antd';
import NoticeBar from '../../components/noticeBar';
import classnames from 'classnames';
import Scrollbars from 'react-custom-scrollbars';
import { stampToDate, getQueryString } from '../../utils';
import { WS_ADDRESS } from '../../utils/constants';
import TradeBox from './TradeBox';
import Tradeview from '../../tradeview';

import './trade.css';

const Search = Input.Search;
const TabPane = Tabs.TabPane;
const Option = Select.Option;

class Trade extends Component {
  state = {
    market: getQueryString('market') || 'USDT',
    coinList: null,
    marketName: getQueryString('market') || 'USDT',
    coinName: getQueryString('coin') || 'LOOM',
    mainVolume: 0,
    coinVolume: 0,
    tradeList: {
      buyOrderVOList: [],
      sellOrderVOList: []
    },
    streamList: null,
    pendingOrderList: [],
    completedOrderList: [],
    coinPrice: '0.00000878 &asymp;￥0.54',
    listType: -1,
    mergeNumber: 8,
    orderStatus: 0,
    coinDetail: '',
  };

  request = window.request;

  favoriteCoins = localStorage.getItem('favoriteCoins')
    ? JSON.parse(localStorage.getItem('favoriteCoins'))
    : [];

  componentWillMount() {
    this.getRate();
    if (sessionStorage.getItem('account')) {
      const { marketName, coinName } = this.state;
      this.findOrderList({ marketName, coinName, status: 0 });
    }
  }

  // 获取USDT汇率
  getRate = () => {
    this.request('/index/lastPrice', {
      method: 'GET'
    }).then(json => {
      if (json.code === 10000000) {
        const { btcLastPrice, ethLastPrice } = json.data;
        this.setState({ btcLastPrice, ethLastPrice });
      } else {
        message.error(json.msg);
      }
    });
  };

  // 未完成订单
  findOrderList = ({ marketName, coinName, status }) => {
    const { id } = JSON.parse(sessionStorage.getItem('account'));
    this.request('/order/findOrderProposeList', {
      body: {
        status,
        userId: id,
        coinMain: marketName,
        coinOther: coinName
      }
    }).then(json => {
      if (json.code === 10000000) {
        json.data = json.data.map(order => {
          order.key = order.orderNo;
          return order;
        });
        if (status === 0) {
          this.setState({ pendingOrderList: json.data });
        } else {
          this.setState({ completedOrderList: json.data });
        }
      } else {
        message.error(json.msg);
      }
    });
  };

  // 获取币种详情
  getCoinDetail = (coinName) => {
    this.request(`/coin/detail/${coinName}`, {
      method: 'GET'
    }).then(json => {
      if (json.code === 10000000) {
        this.setState({ coinDetail: json.data });
      } else {
        message.error(json.msg);
      }
    });
  };

  // 撤单
  cancelTrade = orderNo => {
    this.request(`/trade/cancelTrade/${orderNo}`, {
      method: 'GET'
    }).then(json => {
      if (json.code === 10000000) {
        message.success('撤单成功！');
      } else {
        message.error(json.msg);
      }
    });
  };

  // 订单详情
  getOrderDetail = orderNo => {
    this.request(`/coin/tradeOrderDetail/${orderNo}`, {
      method: 'GET'
    }).then(json => {
      if (json.code === 10000000) {
        console.log(json.data);
      } else {
        message.error(json.msg);
      }
    });
  };

  componentDidMount() {
    const { marketName, coinName } = this.state;
    this.getCoinList();
    this.getStream({
      coinMain: marketName,
      coinOther: coinName
    });
    this.getTradeList({
      coinMain: marketName,
      coinOther: coinName
    });
    this.getCoinDetail(coinName);

    //websocket 链接
    this.openStreamWebsocket();
    this.openBuyAndSellWebsocket();
    if (sessionStorage.getItem('account')) {
      this.openUserWebsocket();
    }
  }

  openStreamWebsocket = () => {
    //打开websockets
    const streamWS = new window.ReconnectingWebSocket(`${WS_ADDRESS}/bbex/platsocket`);
    streamWS.onopen = evt => {
      console.log('stream Websocket Connection open ...');
      let t = setInterval(() => {
        if(!streamWS) {
          clearInterval(t);
          return;
        }
        streamWS.send('ping');
      }, 1000 * 3);
    };

    streamWS.onmessage = evt => {
      if (evt.data === 'pong') {
        console.log('stream: ', evt.data);
        return;
      }
      const record = JSON.parse(evt.data);
      console.log('======stream record: ', record);

      const { coinList, tradeList, streamList, marketName } = this.state;

      if (record.matchStreamVO) {
        const matchVo = record.matchStreamVO;
        coinList[marketName] = coinList[marketName].map(item => {
          if (matchVo.coinOther === item.coinOther) {
            item.latestPrice = matchVo.price;
          }
          return item;
        });

        tradeList.buyOrderVOList = tradeList.buyOrderVOList.filter(item => {
          if (
            item.coinMain === matchVo.coinMain &&
            item.coinOther === matchVo.coinOther &&
            item.price === matchVo.price
          ) {
            item.volume -= matchVo.volume;
          }
          return item.volume > 0;
        });
        tradeList.sellOrderVOList = tradeList.sellOrderVOList.filter(item => {
          if (
            item.coinMain === matchVo.coinMain &&
            item.coinOther === matchVo.coinOther &&
            item.price === matchVo.price
          ) {
            item.volume -= matchVo.volume;
          }
          return item.volume > 0;
        });
        streamList.unshift(record.matchStreamVO);
      }

      this.setState({ coinList, tradeList, streamList });
    };

    streamWS.onclose = evt => {
      console.log('stream Websocket Connection closed.');
    };

    streamWS.onerror = evt => {
      console.log(evt);
    };

    this.setState({ streamWS });
  };

  openBuyAndSellWebsocket = () => {
    //打开websockets
    const { marketName, coinName } = this.state;
    const buyandsellWS = new window.ReconnectingWebSocket(
      `${WS_ADDRESS}/bbex/buysellsocket?${coinName}_${marketName}`
    );
    buyandsellWS.onopen = evt => {
      console.log('buyandsell Websocket Connection open ...');
      let t = setInterval(() => {
        if(!buyandsellWS) {
          clearInterval(t);
          return;
        }
        buyandsellWS.send('ping');
      }, 1000 * 3);
    };

    buyandsellWS.onmessage = evt => {
      if (evt.data === 'pong') {
        console.log('buyandsell: ', evt.data);
        return;
      }
      const record = JSON.parse(evt.data);
      console.log('======buyandsell record: ', record);

      const { tradeList } = this.state;

      let isnNewRecord = true;

      if (record.buyOrderVO) {
        if (tradeList && tradeList.buyOrderVOList && tradeList.buyOrderVOList.length > 0) {
          tradeList.buyOrderVOList = tradeList.buyOrderVOList.map(item => {
            if (item.price === record.buyOrderVO.price) {
              item.volume += record.buyOrderVO.volume;
              isnNewRecord = false;
            }
            return item;
          });
        }
        if (isnNewRecord) {
          tradeList.buyOrderVOList.push(record.buyOrderVO);
          tradeList.buyOrderVOList = tradeList.buyOrderVOList.sort((x, y) => y.price - x.price);
        }
      }

      if (record.sellOrderVO) {
        if (tradeList && tradeList.sellOrderVOList && tradeList.sellOrderVOList.length > 0) {
          tradeList.sellOrderVOList = tradeList.sellOrderVOList.map(item => {
            if (item.price === record.sellOrderVO.price) {
              item.volume += record.sellOrderVO.volume;
              isnNewRecord = false;
            }
            return item;
          });
        }
        if (isnNewRecord) {
          tradeList.sellOrderVOList.push(record.sellOrderVO);
          tradeList.sellOrderVOList = tradeList.sellOrderVOList.sort((x, y) => y.price - x.price);
        }
      }

      this.setState({ tradeList });
    };

    buyandsellWS.onclose = evt => {
      console.log('buyandsell Websocket Connection closed.');
    };

    buyandsellWS.onerror = evt => {
      console.log(evt);
    };

    this.setState({ buyandsellWS });
  };

  openUserWebsocket = () => {
    //打开websockets
    const { id } = JSON.parse(sessionStorage.getItem('account'));
    const userWS = new window.ReconnectingWebSocket(`${WS_ADDRESS}/bbex/bbusersocket?${id}`);
    userWS.onopen = evt => {
      console.log('user Websocket Connection open ...');
      let t = setInterval(() => {
        if(!userWS) {
          clearInterval(t);
          return;
        }
        userWS.send(`ping_${id}`);
      }, 1000 * 3);
    };

    userWS.onmessage = evt => {
      if (evt.data === 'pong') {
        console.log('user: ', evt.data);
        return;
      }
      const { orderVo, coinMainVolume, coinOtherVolume } = JSON.parse(evt.data);
      console.log('======user record: ', JSON.parse(evt.data));

      const { pendingOrderList } = this.state;

      let isNewRecord = true;
      const pendingList = pendingOrderList.filter(order => {
        if (order.orderNo === orderVo.orderNo) {
          isNewRecord = false;
          if (orderVo.status !== 2) {
            order = orderVo;
          }
          return order.status !== 2;
        }
        return true;
      });

      if (isNewRecord) {
        orderVo.key = orderVo.orderNo;
        pendingList.unshift(orderVo);
      }

      const { mainVolume, coinVolume } = this.state;

      this.setState({
        pendingOrderList: pendingList,
        mainVolume: coinMainVolume ? coinMainVolume.volume : mainVolume,
        coinVolume: coinOtherVolume ? coinOtherVolume.volume : coinVolume
      });
    };

    userWS.onclose = evt => {
      console.log('user Websocket Connection closed.');
    };

    userWS.onerror = evt => {
      console.log(evt);
    };

    this.setState({ userWS });
  };

  componentWillUnmount() {
    if (JSON.parse(sessionStorage.getItem('account'))) {
      this.state.streamWS.close();
      this.state.buyandsellWS.close();
      this.state.userWs.close();
    }
  }

  componentWillUpdate(nextProps, nextState) {
    if (
      this.state.marketName !== nextState.marketName ||
      this.state.coinName !== nextState.coinName
    ) {
      const { marketName, coinName } = nextState;
      this.getStream({
        coinMain: marketName,
        coinOther: coinName
      });
      this.getTradeList({
        coinMain: marketName,
        coinOther: coinName
      });

      // 重新建 buyandsell websocket
      this.state.buyandsellWS.close();
      this.openBuyAndSellWebsocket();
    }
  }

  componentWillUnmount() {
    const { coinList } = this.state;
    if (coinList) {
      const favoriteCoins = [];
      Object.keys(coinList).forEach(key => {
        coinList[key].forEach(coin => {
          if (coin.favorite && !favoriteCoins.includes(`${coin.coinMain}.${coin.coinOther}`)) {
            favoriteCoins.push(`${coin.coinMain}.${coin.coinOther}`);
          }
        });
      });
      localStorage.setItem('favoriteCoins', JSON.stringify(favoriteCoins));
    }
  }

  // 获取币种列表
  getCoinList = () => {
    this.request('/index/allTradeExpair', {
      method: 'GET'
    }).then(json => {
      if (json.code === 10000000) {
        let coinList = {};
        Object.keys(json.data).forEach(key => {
          if (key === this.state.market && !getQueryString('coin')) {
            this.setState({ coinName: json.data[key][0].coinOther });
          }
          const coins = json.data[key].map(coin => {
            if (this.favoriteCoins.includes(`${coin.coinMain}.${coin.coinOther}`)) {
              coin.favorite = true;
            }
            return coin;
          });
          coinList[key] = coins;
          this.setState({ coinList });
        });
      } else {
        message.error(json.msg);
      }
    });
  };

  // 获取交易列表
  getTradeList = ({ coinMain, coinOther }) => {
    this.request('/index/buyAndSellerOrder', {
      method: 'GET',
      body: { coinMain, coinOther }
    }).then(json => {
      if (json.code === 10000000) {
        this.setState({ tradeList: json.data });
      } else {
        message.error(json.msg);
      }
    });
  };

  // 获取流水记录
  getStream = ({ coinMain, coinOther }) => {
    this.request('/index/findMatchStream', {
      method: 'GET',
      body: { coinMain, coinOther }
    }).then(json => {
      if (json.code === 10000000) {
        this.setState({ streamList: json.data });
      } else {
        message.error(json.msg);
      }
    });
  };

  // 切换市场
  switchMarket = obj => {
    this.setState({ market: obj.key });
  };

  // 收藏币种
  collectCoin = (event, selectedCoin) => {
    event.stopPropagation();

    const { coinList } = this.state;
    Object.keys(coinList).forEach(key => {
      const coins = coinList[key].map(coin => {
        if (selectedCoin.coinMain === coin.coinMain && selectedCoin.coinOther === coin.coinOther) {
          if (coin.favorite) {
            delete coin.favorite;
          } else {
            coin.favorite = true;
          }
        }
        return coin;
      });
      coinList[key] = coins;
    });

    this.setState({ coinList });
  };

  // 根据币种跳转市场
  jumpMarket = obj => {
    this.props.history.push(`/trade?market=${obj.key}&coin=${this.state.coinName}`);
    this.setState({
      market: obj.key,
      marketName: obj.key,
      coinPrice: obj.item.props.children
        .join('')
        .split(' ')[1]
        .replace('/', '&nbsp;&asymp;')
    });
  };

  // 选择币种
  selectCoin = coin => {
    const { market, orderStatus } = this.state;
    this.props.history.push(`/trade?market=${market}&coin=${coin.coinOther}`);
    this.setState({
      marketName: market,
      coinName: coin.coinOther
    });
    //重新获取币种详情
    this.getCoinDetail(coin.coinOther);

    if (sessionStorage.getItem('account')) {
      this.findOrderList({
        status: orderStatus,
        marketName: market,
        coinName: coin.coinOther
      });
    }
  };

  // 按小数位数合并列表
  handleMerge = value => {
    const { listType } = this.state;
    this.setState({ mergeNumber: value });
    this.requestMerge({
      type: listType,
      length: value
    });
  };

  requestMerge = ({ type, length }) => {
    const { marketName, coinName } = this.state;
    this.request('/index/merge', {
      method: 'GET',
      body: {
        coinMain: marketName,
        coinOther: coinName,
        type,
        length
      }
    }).then(json => {
      if (json.code === 10000000) {
        const { tradeList } = this.state;
        if (json.data.buyOrderVOList) tradeList.buyOrderVOList = json.data.buyOrderVOList;
        if (json.data.sellOrderVOList) tradeList.sellOrderVOList = json.data.sellOrderVOList;
        this.setState({ tradeList });
      } else {
        message.error(json.msg);
      }
    });
  };

  // 切换列表
  switchList = index => {
    this.setState({ listType: index - 1 });
    this.requestMerge({
      type: index - 1,
      length: this.state.mergeNumber
    });
  };

  render() {
    const {
      market,
      coinList,
      marketName,
      coinName,
      mainVolume,
      coinVolume,
      tradeList,
      streamList,
      pendingOrderList,
      completedOrderList,
      coinPrice,
      listType,
      coinDetail
    } = this.state;

    let pairList = [];
    if (coinList) {
      if (market === 'optional') {
        Object.values(coinList).forEach(coins => {
          coins = coins.filter(coin => coin.favorite);
          Object.assign(pairList, coins);
        });
      } else {
        pairList = coinList[market] || [];
      }
    }

    const orderColumns = [
      {
        title: '委托时间',
        dataIndex: 'time',
        key: 'time',
        render: (text, record) => stampToDate(Number(text))
      },
      {
        title: '委托类别',
        dataIndex: 'exType',
        key: 'exType',
        render: (text, record) => {
          if (text === 0) {
            return <span className="font-color-green">买入</span>;
          } else {
            return <span className="font-color-red">卖出</span>;
          }
        }
      },
      {
        title: '委托价格',
        dataIndex: 'price',
        key: 'price'
      },
      {
        title: '委托数量',
        dataIndex: 'volume',
        key: 'volume'
      },
      {
        title: '委托金额',
        dataIndex: 'amount',
        key: 'amount',
        render: (text, record) => record.price * record.volume
      },
      {
        title: '成交量',
        dataIndex: 'successVolume',
        key: 'successVolume'
      },
      {
        title: '状态/操作',
        dataIndex: 'status',
        key: 'status',
        render: (text, record) => {
          if (record.status === 2 || record.status === 3) {
            return (
              <Button type="primary" onClick={this.getOrderDetail.bind(this, record.orderNo)}>
                详情
              </Button>
            );
          } else if (record.status === 0 || record.status === 1) {
            return (
              <Button type="primary" onClick={this.cancelTrade.bind(this, record.orderNo)}>
                撤单
              </Button>
            );
          } else {
            return '--';
          }
        }
      }
    ];

    let currentCoin = {
      highestPrice: '0.00000000',
      lowerPrice: '0.00000000',
      dayCount: '0.00000000',
      change: 0,
      trend: 'green'
    };
    if (coinList && coinList[marketName] && coinList[marketName].length > 0) {
      coinList[marketName].forEach(coin => {
        if (coin.coinOther === coinName) {
          currentCoin = Object.assign({}, currentCoin, coin);
          currentCoin.change = (coin.latestPrice - coin.firstPrice) / coin.firstPrice || 0;
          currentCoin.trend = currentCoin.change > 0 ? 'green' : 'red';
        }
      });
    }

    return (
      <div className="content trade">
        <div className="content-inner">
          <NoticeBar />
        </div>
        <div className="content-inner trade-area clear">
          <div className="trade-left">
            <div className="trade-plate">
              <header className="trade-plate-header">
                <Dropdown
                  overlay={
                    <Menu onClick={this.switchMarket}>
                      {['optional', 'USDT', 'ETH', 'BTC'].map(market => {
                        return (
                          <Menu.Item key={market}>
                            {market === 'optional' ? '自选' : `${market}市场`}
                          </Menu.Item>
                        );
                      })}
                    </Menu>
                  }
                  getPopupContainer={() => document.querySelector('.content.trade')}
                >
                  <a className="ant-dropdown-link" href="javascript:;">
                    {market === 'optional' ? '自选' : `${market}市场`}&nbsp;&nbsp;<Icon type="down" />
                  </a>
                </Dropdown>
                <div className="trade-plate-header-right">
                  <Search onSearch={value => console.log(value)} style={{ width: 80 }} />
                </div>
              </header>
              <div className="trade-plate-tit cell-3">
                <div className="trade-plate-tit-cell">币种</div>
                <div className="trade-plate-tit-cell sorter">
                  最新价
                  <div className="ant-table-column-sorter">
                    <span className="ant-table-column-sorter-up on" title="↑">
                      <i className="anticon anticon-caret-up" />
                    </span>
                    <span className="ant-table-column-sorter-down off" title="↓">
                      <i className="anticon anticon-caret-down" />
                    </span>
                  </div>
                </div>
                <div className="trade-plate-tit-cell sorter">
                  涨跌幅
                  <div className="ant-table-column-sorter">
                    <span className="ant-table-column-sorter-up off" title="↑">
                      <i className="anticon anticon-caret-up" />
                    </span>
                    <span className="ant-table-column-sorter-down off" title="↓">
                      <i className="anticon anticon-caret-down" />
                    </span>
                  </div>
                </div>
              </div>
              <div className="trade-plate-container market">
                <Scrollbars>
                  <table>
                    <tbody>
                      {pairList.map(coin => {
                        const change = (coin.latestPrice - coin.firstPrice) / coin.firstPrice || 0;
                        const trend = change > 0 ? 'green' : 'red';
                        return (
                          <tr
                            key={coin.coinOther}
                            onClick={this.selectCoin.bind(this, coin)}
                            className={classnames({
                              selected: coin.coinMain === marketName && coin.coinOther === coinName
                            })}
                          >
                            <td>
                              <i
                                className={classnames({
                                  iconfont: true,
                                  'icon-shoucang': !coin.favorite,
                                  'icon-shoucang-active': coin.favorite
                                })}
                                onClick={event => {
                                  this.collectCoin(event, coin);
                                }}
                              />
                              {coin.coinOther}
                            </td>
                            <td>{coin.latestPrice}</td>
                            <td className={`font-color-${trend}`}>{change.toFixed(2)}%</td>
                          </tr>
                        );
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
                      {streamList &&
                        streamList.map(stream => {
                          const trend = stream.type === 0 ? 'green' : 'red';
                          return (
                            <tr key={stream.date} className={`font-color-${trend}`}>
                              <td>{stampToDate(Number(stream.date), 'hh:mm:ss')}</td>
                              <td>{stream.price}</td>
                              <td>{stream.volume}</td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </Scrollbars>
              </div>
            </div>
          </div>
          <div className="trade-center">
            <div className="trade-plate">
              <header className="trade-plate-header">
                <Dropdown
                  overlay={
                    <Menu onClick={this.jumpMarket}>
                      {[
                        {
                          marketName: 'BTC',
                          pairPrice: '0.00000877',
                          pairCNY: '￥0.54'
                        },
                        {
                          marketName: 'USDT',
                          pairPrice: '0.514',
                          pairCNY: '￥0.54'
                        },
                        {
                          marketName: 'ETH',
                          pairPrice: '0.00010951',
                          pairCNY: '￥0.54'
                        }
                      ].map(market => {
                        return (
                          <Menu.Item key={market.marketName}>
                            {coinName}/{market.marketName} {market.pairPrice}/{market.pairCNY}
                          </Menu.Item>
                        );
                      })}
                    </Menu>
                  }
                  getPopupContainer={() => document.querySelector('.content.trade')}
                >
                  <a className="ant-dropdown-link" href="javascript:;">
                    {coinName}/{marketName}&nbsp;&nbsp;<Icon type="down" />
                  </a>
                </Dropdown>
                <span
                  className="trade-plate-header-price"
                  dangerouslySetInnerHTML={{
                    __html: coinPrice
                  }}
                />
                <div className="trade-plate-header-right">
                  <Tooltip
                    placement="rightTop"
                    title={coinDetail}
                  >
                    <Button type="introduction">币种介绍</Button>
                  </Tooltip>
                </div>
              </header>
              <div className="trade-plate-tit Kline">
                <div className="trade-plate-tit-cell">
                  最高<strong>{currentCoin.highestPrice || '0.00000000'}</strong>
                </div>
                <div className="trade-plate-tit-cell">
                  最低<strong>{currentCoin.lowerPrice || '0.00000000'}</strong>
                </div>
                <div className="trade-plate-tit-cell">
                  成交量<strong>{currentCoin.dayCount || '0.00000000'}</strong>
                </div>
                <div className="trade-plate-tit-cell">
                  涨跌幅
                  <strong className={`font-color-${currentCoin.trend}`}>
                    {currentCoin.change.toFixed(2)}%
                  </strong>
                </div>
              </div>
              <div className="trade-plate-container">
                <Tradeview market={marketName} coin={coinName} />
              </div>
            </div>
            <div className="trade-plate">
              <Tabs defaultActiveKey="1">
                <TabPane tab="限价交易" key="1">
                  <TradeBox
                    marketName={marketName}
                    coinName={coinName}
                    mainVolume={mainVolume}
                    coinVolume={coinVolume}
                    tradeType="limit"
                  />
                </TabPane>
                <TabPane tab="市价交易" key="2">
                  <TradeBox
                    marketName={marketName}
                    coinName={coinName}
                    mainVolume={mainVolume}
                    coinVolume={coinVolume}
                    tradeType="market"
                  />
                </TabPane>
                {false && (
                  <TabPane
                    tab={
                      <span>
                        止盈止损
                        <Tooltip
                          placement="rightTop"
                          title={`当市场价达到触发价时，将按计划设定的价格和数量进行下单`}
                        >
                          <i className="iconfont icon-web-icon-" />
                        </Tooltip>
                      </span>
                    }
                    key="3"
                  >
                    <TradeBox marketName={marketName} coinName={coinName} tradeType="stop" />
                  </TabPane>
                )}
              </Tabs>
            </div>
          </div>
          <div className="trade-right">
            <div className="trade-plate">
              <header className="trade-plate-header">
                <div className="trade-plate-tab">
                  {['icon-maimaipan', 'icon-maipan1', 'icon-maipan'].map((iconName, index) => {
                    const mapToTitle = {
                      'icon-maimaipan': 'buy and sell',
                      'icon-maipan1': 'buy',
                      'icon-maipan': 'sell'
                    };
                    return (
                      <i
                        key={iconName}
                        className={classnames({
                          iconfont: true,
                          [iconName]: true,
                          active: listType === index - 1
                        })}
                        title={mapToTitle[iconName]}
                        onClick={this.switchList.bind(this, index)}
                      />
                    );
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
              {listType === -1 ? (
                <div className="trade-plate-tit list">
                  <div className="trade-plate-tit-cell">类型</div>
                  <div className="trade-plate-tit-cell">价格({marketName})</div>
                  <div className="trade-plate-tit-cell">数量({coinName})</div>
                  {false && <div className="trade-plate-tit-cell">交易额({marketName})</div>}
                </div>
              ) : (
                <div className="trade-plate-tit list">
                  <div className="trade-plate-tit-cell">{listType === 0 ? '买入' : '卖出'}</div>
                  <div className="trade-plate-tit-cell">{listType === 0 ? '买入' : '卖出'}价</div>
                  <div className="trade-plate-tit-cell">委单量</div>
                  {false && <div className="trade-plate-tit-cell">交易额({marketName})</div>}
                </div>
              )}
              {listType === -1 ? (
                <div className="trade-plate-list">
                  <div className="trade-plate-list-wrap">
                    <table>
                      <tbody>
                        {tradeList &&
                          tradeList.sellOrderVOList.map((record, index, arr) => {
                            const length = arr.length < 15 ? arr.length : 15;
                            return (
                              index < length && (
                                <tr key={index}>
                                  <td className="font-color-red">卖出{length - index}</td>
                                  <td>{record.price}</td>
                                  <td>{record.volume}</td>
                                  {false && <td className="font-color-red">{record.sumTotal}</td>}
                                </tr>
                              )
                            );
                          })}
                      </tbody>
                    </table>
                  </div>
                  <div className="latest-price">
                    <span>
                      <i className="iconfont icon-xinhao font-color-green" />最新价
                    </span>
                    <span
                      className={
                        streamList &&
                        streamList.length > 0 &&
                        streamList[0].price <
                          (streamList[1] ? streamList[1].price : streamList[0].price)
                          ? 'font-color-red'
                          : 'font-color-green'
                      }
                    >
                      {streamList && streamList.length > 0 && streamList[0].price}
                      <i
                        className={classnames({
                          iconfont: true,
                          'icon-xiajiang':
                            streamList &&
                            streamList.length > 0 &&
                            streamList[0].price <
                              (streamList[1] ? streamList[1].price : streamList[0].price),
                          'icon-shangsheng':
                            streamList &&
                            streamList.length > 0 &&
                            streamList[0].price >=
                              (streamList[1] ? streamList[1].price : streamList[0].price)
                        })}
                      />
                    </span>
                  </div>
                  <div className="trade-plate-list-wrap">
                    <table>
                      <tbody>
                        {tradeList &&
                          tradeList.buyOrderVOList.map((record, index) => {
                            return (
                              index < 15 && (
                                <tr key={index}>
                                  <td className="font-color-green">买入{index + 1}</td>
                                  <td>{record.price}</td>
                                  <td>{record.volume}</td>
                                  {false && <td className="font-color-green">{record.sumTotal}</td>}
                                </tr>
                              )
                            );
                          })}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="trade-plate-list">
                  <Scrollbars>
                    <table>
                      <tbody>
                        {tradeList &&
                          (listType === 1
                            ? tradeList.sellOrderVOList
                            : tradeList.buyOrderVOList
                          ).map((record, index) => {
                            const colorName = listType === 0 ? 'green' : 'red';
                            const actionName = listType === 0 ? '买入' : '卖出';
                            return (
                              <tr key={index}>
                                <td className={`font-color-${colorName}`}>
                                  {actionName}
                                  {index + 1}
                                </td>
                                <td>{record.price}</td>
                                <td>{record.volume}</td>
                                <td className={`font-color-${colorName}`}>{record.sumTotal}</td>
                              </tr>
                            );
                          })}
                      </tbody>
                    </table>
                  </Scrollbars>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="content-inner">
          <div className="trade-plate">
            <Tabs
              defaultActiveKey="0"
              onChange={status => {
                if (sessionStorage.getItem('account')) {
                  this.findOrderList({ marketName, coinName, status });
                }
                this.setState({ orderStatus: status });
              }}
            >
              <TabPane tab="我的挂单" key="0">
                <Scrollbars>
                  <Table columns={orderColumns} dataSource={pendingOrderList} pagination={false} />
                </Scrollbars>
              </TabPane>
              <TabPane tab="成交历史" key="1">
                <Scrollbars>
                  <Table
                    columns={orderColumns}
                    dataSource={completedOrderList}
                    pagination={false}
                  />
                </Scrollbars>
              </TabPane>
            </Tabs>
          </div>
        </div>
      </div>
    );
  }
}

export default Trade;
