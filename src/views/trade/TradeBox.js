import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { message } from 'antd';
import TradeForm from './TradeForm';

import request from '../../utils/request';

class TradeBox extends Component {
  state = {
    mainVolume: 0,
    coinVolume: 0
  };

  componentWillMount() {
    if (sessionStorage.getItem('account')) {
      const { tradeType, marketName, coinName } = this.props;
      this.getCoinVolume({
        coinType: 'mainVolume',
        symbol: marketName
      });
      this.getCoinVolume({
        coinType: 'coinVolume',
        symbol: coinName
      });
    }
  }
  // 根据币种名称获取资产
  getCoinVolume = ({ coinType, symbol }) => {
    request(`/coin/volume/symbol/${symbol}`, {
      method: 'GET'
    }).then(json => {
      if (json.code === 10000000) {
        this.setState({ [coinType]: json.data.volume });
      } else {
        message.error(json.msg);
      }
    });
  };

  render() {
    const { tradeType, marketName, coinName } = this.props;
    const { mainVolume, coinVolume } = this.state;

    return [
      <div key="info" className="property-info">
        <span>
          {marketName} 可用 {mainVolume}
          {false && (
            <Link className="recharge-link" to="#">
              充币
            </Link>
          )}
        </span>
        <span>
          {coinName} 可用 {coinVolume}
          {false && (
            <Link className="recharge-link" to="#">
              充币
            </Link>
          )}
        </span>
      </div>,
      <TradeForm
        key="buy"
        type="buy"
        tradeType={tradeType}
        marketName={marketName}
        coinName={coinName}
      />,
      <TradeForm
        key="sell"
        type="sell"
        tradeType={tradeType}
        marketName={marketName}
        coinName={coinName}
      />
    ];
  }
}

export default TradeBox;
