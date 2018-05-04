import React, { Component } from 'react';
import { Input, Button } from 'antd';

class TransactionForm extends Component {
    state = {
        price: this.props.price,
        volume: this.props.volume || 0,
        amount: this.props.volume ? this.props.price * this.props.volume : '0.00',
    }

    componentWillReceiveProps(nextProps) {
        this.setState({ volume: nextProps.volume || 0 });
    }

    handleSubmit = (e) => {
        e.preventDefault();
        const { exType } = this.props;
        const { price, volume } = this.state;
        if (Number(price) > 0 && Number(volume) > 0) {
            const { onSubmit } = this.props;
            onSubmit && onSubmit({ price, volume, exType});
        }
    }

    handlePrice = (e) => {
        this.setState({ price: e.target.value });
    }

    handleVolume = (e) => {
        this.setState({ volume: e.target.value });
    }

    handleAmount = (e) => {
        this.setState({ amount: e.target.value });
    }

    render() {
        const { coin, exType } = this.props;
        const { price, volume, amount } = this.state;
        const typeText = {
            'buy': '买入',
            'sell': '卖出'
        }

        return (
            <ul className="c2c-form">
                <li>
                    <Input
                        addonBefore="价格（CNY）"
                        size="large"
                        value={price}
                        placeholder="请输入价格"
                        onChange={this.handlePrice}
                    />
                </li>
                <li>
                    <Input
                        addonBefore={`数量（${coin.symbol}）`}
                        size="large"
                        value={volume}
                        placeholder="请输入数量"
                        onChange={this.handleVolume}
                    />
                </li>
                <li>
                    <Input
                        addonBefore="总额（CNY）"
                        size="large"
                        value={amount}
                        placeholder="请输入总额"
                        onChange={this.handleAmount}
                    />
                </li>
                <li>
                    <Button
                        type={exType}
                        size='large'
                        onClick={this.handleSubmit}
                    >
                        <i className="iconfont icon-jia"></i>{`${typeText[exType]}${coin.symbol}`}
                    </Button>
                </li>
                <li>费率0%</li>
            </ul>
        )
    }
}

export default TransactionForm;