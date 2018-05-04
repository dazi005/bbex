import React, { Component } from 'react';
// import { Route, NavLink } from "react-router-dom";
import { message } from 'antd';
import TradeContainer from './TradeContainer';
import classnames from 'classnames';
import request from '../../utils/request';

import './c2c.css';

class C2c extends Component {
    state = {
        currentType: 'buy',
        currentCoin: '',
        coinList: [],
    }

    componentWillMount() {
        //获取币种列表
        request('/offline/coin/list', {
            method: 'GET'
        }).then(json => {
            if (json.code === 10000000) {
                this.setState({
                    coinList: json.data,
                    currentCoin: json.data[0],
                });
            } else {
                message.error(json.msg);
            }
        })
    }

    handleSwitch = ({ exType, coin }) => {
        const { currentType, currentCoin } = this.state;
        if (!(exType === currentType && coin === currentCoin)) {
            this.setState({ currentType: exType, currentCoin: coin });
        }
    }

    render() {
        const { currentType, currentCoin, coinList } = this.state;
        return (
            <div className="content c2c">
                <div className="content-inner clear">
                    <div className="side-bar pull-left">
                        {['buy', 'sell'].map((exType, index) => {
                            return <ul key={exType} className="nav-item">
                                <h2 className="nav-tit">
                                    {
                                        exType === 'buy'
                                            ? <i className="iconfont icon-mairu"></i>
                                            : <i className="iconfont icon-maichu"></i>
                                    }
                                    {exType === 'buy' ? '我要买入' : '我要卖出'}
                                </h2>
                                {coinList && coinList.map((coin, index) => {
                                    return <li
                                        key={coin.coinId}
                                        className={classnames({
                                            'nav-link': true,
                                            'active': exType === currentType && coin === currentCoin
                                        })}
                                        onClick={this.handleSwitch.bind(this, { exType, coin })}
                                    >
                                        {coin.symbol}
                                    </li>;
                                })}
                            </ul>
                        })}
                    </div>
                    {currentType && currentCoin && (
                        <TradeContainer
                            exType={currentType}
                            coin={currentCoin}
                        />)}
                </div>
            </div>
        )
    }
}

export default C2c;
