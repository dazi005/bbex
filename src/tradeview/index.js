import React, { Component } from 'react';
import datafeeds from '../datafeed/datafeed.js';
import tradeviewPageUtil from './TradeviewPageUtil';
import { WS_ADDRESS } from '../utils/constants';

class TradeviewPage extends Component {
  websocketUrl = `${WS_ADDRESS}/bbex/klinesocket`;

  componentDidMount() {
    this.tradingViewGetReady();
    this.websocketStart();

    // window.ws.onopen = evt => {
    //   console.log('Kline Connection open ...');
    // };

    window.ws.onclose = evt => {
      console.log('Kline Connection closed.');
    };
  }

  componentWillUpdate(nextProps, nextState) {
    if(this.props !== nextProps) {
      const { market, coin } = this.props;
    }
  }

  // 开启websocket
  websocketStart() {
    window.ws = new window.ReconnectingWebSocket(this.websocketUrl);
  }

  // tradeView准备
  tradingViewGetReady() {
    const { market, coin } = this.props;
    let params = {
      resolution: '5',
      Datafeeds: datafeeds(`${coin}/${market}`),
      serverUrl: this.websocketUrl,
      pushInterval: 1000,
      language: 'zh_CN',
      symbol: `${coin}/${market}`
    };

    const TradingView = window.TradingView;
    TradingView.onready(
      (() => {
        const widget = new TradingView.widget(tradeviewPageUtil.datafeedConfig(params));

        widget.onChartReady(() => {
          tradeviewPageUtil.chartReady(widget);
        });
      })()
    );
  }

  componentWillMount() {
    if (window.ws) {
      window.ws.close();
    }
  }

  render() {
    return <div id="tv_chart_container" />;
  }
}

export default TradeviewPage;
