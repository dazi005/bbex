import React, { Component } from 'react';
import { Input, InputNumber, Slider, Button, Tooltip } from 'antd';
import classnames from 'classnames';

class TradeForm extends Component {

    handleChange = (value) => {
        console.log('changed', value);
    }

    render() {

        const marks = {
            0: '',
            25: '',
            50: '',
            75: '',
            100: '',
        };

        const {
            type,
            tradeType,
            marketName,
            coinName,
        } = this.props;

        const typeToText = {
            'buy': '买入',
            'sell': '卖出',
        }

        return (
            <ul className="trade-form-list">
                {tradeType === 'stop' && (
                    <li>
                        <span className="trade-form-name">触发价</span>
                        <InputNumber min={0.00000001} step={0.00000001} onChange={this.handleChange} />
                        <span className="trade-form-marketName">{marketName}</span>
                    </li>
                )}
                {tradeType !== 'market' && (
                    <li>
                        <span className="trade-form-name">价格</span>
                        <InputNumber min={0.00000001} step={0.00000001} onChange={this.handleChange} />
                        <div className="toCNY">&asymp;￥57555.50</div>
                        <span className="trade-form-marketName">{marketName}</span>
                    </li>
                )}
                {(tradeType !== 'market' || (tradeType === 'market' && type === 'sell')) && (
                    <li>
                        <span
                            className={classnames({
                                'trade-form-name': true,
                                'market': tradeType === 'market'
                            })}
                        >数量</span>
                        {tradeType === 'market' && (
                            <span className="trade-form-tips">
                                以市场上最优价格卖出
                                <Tooltip
                                    placement="top"
                                    title={`当使用市场价卖出时，系统会根据您设置的卖出数量在市场上从高到低扫单，直至数量卖完为止`}
                                >
                                    <i className="iconfont icon-zhuyishixiang" />
                                </Tooltip>
                            </span>
                        )}
                        <Input placeholder={`${typeToText[type]}量`} />
                        <Slider marks={marks} defaultValue={0} />
                        <span
                            className={classnames({
                                'trade-form-coinName': true,
                                'market': tradeType === 'market'
                            })}
                        >{coinName}</span>
                    </li>
                )}
                {tradeType === 'market' && type === 'buy' && (
                    <li>
                        <span
                            className={classnames({
                                'trade-form-name': true,
                                'market': tradeType === 'market'
                            })}
                        >交易额</span>
                        {tradeType === 'market' && (
                            <span className="trade-form-tips">
                                以市场上最优价格买入
                                <Tooltip
                                    placement="top"
                                    title={`当使用市价买入时，系统会根据您预留的金额在市场上从低到高进行扫单，直至金额用完为止`}
                                >
                                    <i className="iconfont icon-zhuyishixiang" />
                                </Tooltip>
                            </span>
                        )}
                        <Input placeholder={`${typeToText[type]}量`} />
                        <Slider marks={marks} defaultValue={0} />
                        <span
                            className={classnames({
                                'trade-form-coinName': true,
                                'market': tradeType === 'market'
                            })}
                        >{coinName}</span>
                    </li>
                )}
                <li>
                    {tradeType !== 'market' && (
                        <div className="trade-form-total">交易额 0 {marketName}</div>
                    )}
                    {(tradeType === 'market' && type === 'buy') && (
                        <div className="trade-form-txt">
                            <span>0.00000000 {marketName}</span>
                            <span>0.00000000 {marketName}</span>
                        </div>
                    )}
                    {(tradeType === 'market' && type === 'sell') && (
                        <div className="trade-form-txt">
                            <span>0.00000000 {coinName}</span>
                            <span>0.00000000 {coinName}</span>
                        </div>
                    )}
                    <Button
                        type={type}
                        size="large"
                    >
                        {typeToText[type]}{coinName}
                    </Button>
                </li>
            </ul>
        )
    }
}

export default TradeForm;