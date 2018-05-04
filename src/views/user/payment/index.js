import React, { Component } from 'react';
import { Button, message } from 'antd';
import classnames from 'classnames';
import BankForm from './BankForm';
import PaymentForm from './PaymentForm';
import request from '../../../utils/request';

import './payment.css';

class Payment extends Component {
    state = {
        editType: '',
        bankInfo: null,
    }

    componentWillMount() {  
        request(`/offline/bank/get`, {
            method: 'GET',
        }).then(json => {
            if (json.code === 10000000) {
                this.setState({ bankInfo: json.data });
            }else {
                message.error(json.msg);
            }
        });
    }

    edit = (type) => {
        this.setState({ editType: type});
    }

    handleSetBankInfo = (bankInfo) => {
        this.setState({ bankInfo });
    }

    render() {
        const {
            editType,
            bankInfo,
        } = this.state;

        const { realName, wechatNo, alipayNo } = JSON.parse(sessionStorage.getItem('account'));

        const bankTriggerBtnText = bankInfo ? '修改' : '立即绑定';
        const wechatTriggerBtnText = wechatNo ? '修改' : '立即绑定';
        const alipayTriggerBtnText = alipayNo ? '修改' : '立即绑定';
        

        return (
            <div className="user-cont payment pull-right">
                <h2 className="payment-tit">绑定支付方式</h2>
                <div className={classnames({
                    'payment-cell': true,
                    'unfold': editType === 'bank',
                })}>
                    <div className="payment-cell-block clear">
                        <div className="payment-header pull-left">
                            <i className="iconfont icon-yinhangqia"></i>银行卡
                        </div>
                        <div className="payment-account-name pull-left">{bankInfo && bankInfo.cardNo}</div>
                        <Button
                            type="primary"
                            onClick={this.edit.bind(this, editType === 'bank' ? '' : 'bank')}
                            className="pull-right"
                        >
                            {editType === 'bank' ? '取消' : `${bankTriggerBtnText}`}
                        </Button>
                    </div>
                    <div className="payment-cell-form">
                        {editType === 'bank' && (
                            <BankForm bankInfo={bankInfo} setBankInfo={this.handleSetBankInfo} />
                        )}
                    </div>
                </div>
                <div className={classnames({
                    'payment-cell': true,
                    'unfold': editType === 'wechat',
                })}>
                    <div className="payment-cell-block clear">
                        <div className="payment-header pull-left">
                            <i className="iconfont icon-wxpay"></i>微信支付
                        </div>
                        <div className="payment-account-name pull-left">{realName}</div>
                        <Button
                            type="primary"
                            onClick={this.edit.bind(this, editType === 'wechat' ? '' : 'wechat')}
                            className="pull-right"
                        >
                            {editType === 'wechat' ? '取消' : `${wechatTriggerBtnText}`}
                        </Button>
                    </div>
                    <div className="payment-cell-form">
                        {editType === 'wechat' && (
                            <PaymentForm 
                                type="wechat"
                            />
                        )}
                    </div>
                </div>
                <div className={classnames({
                    'payment-cell': true,
                    'unfold': editType === 'alipay',
                })}>
                    <div className="payment-cell-block clear">
                        <div className="payment-header pull-left">
                            <i className="iconfont icon-zhifubao"></i>支付宝
                        </div>
                        <div className="payment-account-name pull-left">{realName}</div>
                        <Button
                            type="primary"
                            onClick={this.edit.bind(this, editType === 'alipay' ? '' : 'alipay')}
                            className="pull-right"
                        >
                            {editType === 'alipay' ? '取消' : `${alipayTriggerBtnText}`}
                        </Button>
                    </div>
                    <div className="payment-cell-form">
                        {editType === 'alipay' && (
                            <PaymentForm
                                type="alipay"
                            />
                        )}
                    </div>
                </div>
            </div>
        )
    }
}



export default Payment;