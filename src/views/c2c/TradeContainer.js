import React, { Component } from 'react';
import { Table, Button, Modal, Tabs, message } from 'antd';
import classnames from 'classnames';
import { stampToDate, copy } from '../../utils';
import request from '../../utils/request';
import TransactionForm from './TransactionForm';
import { IMAGES_ADDRESS, WS_ADDRESS } from '../../utils/constants';

const TabPane = Tabs.TabPane;

message.config({
    top: 200,
    maxCount: '1',
});

const ExpandComponent = ({
    record,
    previewImage,
    onPreview,
    onCloseImage,
    confirmPay,
    cancelPay,
    confirmReceipt,
}) => {
    const { bankInfo, totalPrice, radomNum, remarks, status } = record;
    return (
        <div className="payment-box">
            <Tabs tabBarExtraContent={
                <div className="extra-cont">
                    <span><i className="iconfont icon-phone"></i>卖家：{bankInfo.mobile}</span>
                    <a href="javascript:;"><i className="iconfont icon-kefu"></i>申请客服处理</a>
                </div>
            }>
                <TabPane tab={<span><i className="iconfont icon-yinhangqia"></i>卖家银行卡信息</span>} key="bank">
                    <div className="payment-box-cont">
                        <h3>请使用绑定的银行卡完成付款，付款时填写以下信息</h3>
                        <table>
                            <tbody>
                                <tr>
                                    <th><span className="font-color-red">*</span>收款姓名</th>
                                    <th><span className="font-color-red">*</span>银行卡号</th>
                                    <th><span className="font-color-red">*</span>开户行/支行名称</th>
                                    <th><span className="font-color-red">*</span>付款金额</th>
                                    <th>付款备注</th>
                                </tr>
                                <tr>
                                    <td onClick={copy}>{bankInfo.realName} <i className="iconfont icon-copy"></i></td>
                                    <td onClick={copy}>{bankInfo.cardNo} <i className="iconfont icon-copy"></i></td>
                                    <td onClick={copy}>{bankInfo.bankName}/{bankInfo.branchBankName} <i className="iconfont icon-copy"></i></td>
                                    <td onClick={copy}>{totalPrice} <i className="iconfont icon-copy"></i></td>
                                    <td onClick={copy}>{radomNum} <i className="iconfont icon-copy"></i></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </TabPane>
                <TabPane tab={<span><i className="iconfont icon-zhifubao"></i>卖家支付宝信息</span>} key="alipay">
                    <div className="payment-box-cont clear">
                        <div className="payment-box-qrcode pull-left clear">
                            <img
                                src={`${IMAGES_ADDRESS}/view/${bankInfo.alipayQrcodeId}`}
                                alt="支付宝收款"
                                onClick={() => { onPreview(bankInfo.alipayQrcodeId) }}
                            />
                            <h4>点击图片<br />扫码支付</h4>
                        </div>
                        <div className="payment-box-attr pull-left">
                            <h3>手动付款</h3>
                            <table>
                                <tbody>
                                    <tr>
                                        <th width="100px"><span className="font-color-red">*</span>收款姓名</th>
                                        <th width="200px"><span className="font-color-red">*</span>支付宝</th>
                                        <th width="150px"><span className="font-color-red">*</span>付款金额</th>
                                        <th width="100px">付款备注</th>
                                    </tr>
                                    <tr>
                                        <td onClick={copy}>{bankInfo.realName} <i className="iconfont icon-copy"></i></td>
                                        <td onClick={copy}>{bankInfo.alipayNo} <i className="iconfont icon-copy"></i></td>
                                        <td onClick={copy}>{totalPrice} <i className="iconfont icon-copy"></i></td>
                                        <td onClick={copy}>{radomNum} <i className="iconfont icon-copy"></i></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </TabPane>
                <TabPane tab={<span><i className="iconfont icon-wxpay"></i>卖家微信支付信息</span>} key="wechat">
                    <div className="payment-box-cont clear">
                        <div className="payment-box-qrcode pull-left clear">
                            <img
                                src={`${IMAGES_ADDRESS}/view/${bankInfo.wechatQrcodeId}`}
                                alt="微信收款"
                                onClick={() => { onPreview(bankInfo.wechatQrcodeId) }}
                            />
                            <h4>点击图片<br />扫码支付</h4>
                        </div>
                        <div className="payment-box-attr pull-left">
                            <h3>手动付款</h3>
                            <table>
                                <tbody>
                                    <tr>
                                        <th width="100px"><span className="font-color-red">*</span>收款姓名</th>
                                        <th width="200px"><span className="font-color-red">*</span>微信</th>
                                        <th width="150px"><span className="font-color-red">*</span>付款金额</th>
                                        <th width="100px">付款备注</th>
                                    </tr>
                                    <tr>
                                        <td onClick={copy}>{bankInfo.realName} <i className="iconfont icon-copy"></i></td>
                                        <td onClick={copy}>{bankInfo.wechatNo} <i className="iconfont icon-copy"></i></td>
                                        <td onClick={copy}>{totalPrice} <i className="iconfont icon-copy"></i></td>
                                        <td onClick={copy}>{radomNum} <i className="iconfont icon-copy"></i></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </TabPane>
            </Tabs>
            <div className="payment-box-action">
                {remarks === 'buy' && <Button type="primary" size="large" onClick={() => { confirmPay(record) }}>我已付款给卖家</Button>}
                {remarks === 'sell' && status === 0 && <Button size="large" disabled>等待卖家确认付款</Button>}
                {remarks === 'sell' && status === 1 && <Button type="primary" size="large" onClick={() => { confirmReceipt(record) }}>确认收款</Button>}
                <Button type="normal" size="large" onClick={() => { cancelPay(record) }}>取消订单</Button>
            </div>
            <div className="payment-box-notice">
                <h3>交易须知：</h3>
                <ul>
                    <li>买家有<span className="font-color-red">一个未完成买单</span>，无法继续买入，完成后方可进行买卖</li>
                    <li>买家当天取消<span className="font-color-red">3笔</span>交易，将禁止当天C2C买卖功能</li>
                    <li>买家当天被申诉<span className="font-color-red">3次以上</span>，禁止当天C2C买卖功能</li>
                    <li>大于<span className="font-color-red">5万</span>的付款，请务必将单笔金额拆分为<span className="font-color-red">5万以内分批转账</span>，否则将延迟到账</li>
                </ul>
            </div>
            <Modal visible={!!previewImage} footer={null} onCancel={onCloseImage}>
                <img alt="example" style={{ width: '100%' }} src={previewImage} />
            </Modal>
        </div>
    )
}

class TradeContainer extends Component {
    state = {
        coinVolume: 0,
        advertList: null,
        current: 1,
        pageSize: 10,
        selectedCoin: null,
        recordIndex: 0,
        releaseVisible: false,
        transactionVisible: false,
        myOrderList: null,
        myAdvertList: null,
        previewImage: '',
        ws: null,
    }

    componentWillReceiveProps(nextProps) {
        this.getAdvertList(1, nextProps);
    }

    componentWillMount() {
        this.getAdvertList(1);

        if (sessionStorage.getItem('account')) {
            this.getMyOrderList();
            this.getMyAdvertList();
        }
    }

    componentDidMount() {

        //登录后才打开websockets
        if (JSON.parse(sessionStorage.getItem('account'))) {
            const userId = JSON.parse(sessionStorage.getItem('account')).id;
            var ws = new window.ReconnectingWebSocket(`${WS_ADDRESS}/bbex/websocket?${userId}`);
            ws.onopen = (evt) => {
                console.log("Connection open ...");
                ws.send("Hello bbex!");
            };

            ws.onmessage = (evt) => {
                const record = JSON.parse(evt.data);
                if (record.id) {
                    let hasRecord = false;
                    const myOrderList = this.state.myOrderList.map(item => {
                        if (record.subOrderId === item.subOrderId) {
                            record.key = record.id;
                            hasRecord = true;
                            return record;
                        }
                        return item;
                    });
                    if (!hasRecord) {
                        record.key = record.id;
                        myOrderList.push(record);
                    }
                    this.setState({ myOrderList });
                }
            };

            ws.onclose = (evt) => {
                console.log("Connection closed.");
            };

            ws.onerror = (evt) => {
                console.log(evt);
            }

            this.setState({ ws });
        }
    }

    componentWillUnmount() {
        if (JSON.parse(sessionStorage.getItem('account'))) {
            this.state.ws.close();
        }
    }

    //根据币种和交易类型分页获取广告列表
    getAdvertList = (current, props = this.props) => {
        const { exType, coin } = props;
        const { pageSize } = this.state;
        const typeMap = {
            'buy': 1,
            'sell': 0,
        }
        request('/offline/advert/list', {
            body: {
                exType: typeMap[exType],
                coinId: coin.coinId,
                currentPage: current,
                showCount: pageSize,
            }
        }).then(json => {
            if (json.code === 10000000) {
                const list = json.data.list.map(coin => {
                    coin.key = coin.id;
                    return coin;
                });
                let advertList = json.data;
                advertList.list = list;
                advertList.price = 0.999;
                this.setState({ advertList, current });
            } else {
                message.error(json.msg);
            }
        });
    }

    switchRecord = index => {
        this.setState({ recordIndex: index });
    }

    showModal = visible => {
        this.setState({ [visible]: true });
    }

    hideModal = visible => {
        this.setState({ [visible]: false });
    }

    triggerRelease = () => {
        if (!sessionStorage.getItem('account')) {
            message.info('请先登录');
            return;
        }

        //验证是否可以发布广告
        request('/offline/topublish', {
            method: 'GET'
        }).then(json => {
            if (json.code === 10000000) {
                //通过验证，可以发广告
                this.showModal('releaseVisible');
            } else if (json.code === 10004017) {
                //请进行身份认证
                Modal.confirm({
                    title: '发布广告',
                    content: '为保证资金安全，请在交易前实名认证',
                    okText: '去实名',
                    cancelText: '取消',
                    onOk: () => {
                        this.props.history.push('/user/verified')
                    }
                });
            } else if (json.code === 10004018) {
                //请先绑定银行卡
                Modal.confirm({
                    title: '发布广告',
                    content: '为保证交易顺畅，请在交易前绑定银行卡',
                    okText: '去绑卡',
                    cancelText: '取消',
                    onOk: () => {
                        this.props.history.push('/user/payment')
                    }
                });
            }
        });

    }

    //发布广告
    handleRelease = ({ price, volume, exType }) => {
        this.hideModal('releaseVisible');
        const typeMap = {
            'buy': 0,
            'sell': 1,
        }
        const { coin } = this.props;
        request('/offline/publish', {
            body: {
                volume,
                price,
                exType: typeMap[exType],
                coinId: coin.coinId,
                symbol: coin.symbol,
            }
        }).then(json => {
            if (json.code === 10000000) {
                message.success('发布广告成功！');
                //刷新广告列表
                this.getAdvertList(this.state.current);
                //刷新我发布的广告列表
                this.getMyAdvertList();
            } else {
                message.error(json.msg);
            }
        });
    }

    triggerTransaction = ({ exType, record }) => {
        if (!sessionStorage.getItem('account')) {
            message.info('请先登录');
            return;
        }

        this.showModal('transactionVisible');
        this.setState({ selectedCoin: record });
    }

    handleTransaction = ({ price, volume, exType }) => {
        this.hideModal('transactionVisible');
        const { selectedCoin } = this.state;
        const typeText = {
            'buy': '买入',
            'sell': '卖出'
        };
        request(`/offline/${exType}`, {
            body: {
                volume,
                orderId: selectedCoin.id,
                coinId: selectedCoin.coinId,
                symbol: selectedCoin.symbol,
            }
        }).then(json => {
            if (json.code === 10000000) {
                message.success(`${typeText[exType]}${selectedCoin.symbol}成功！`);
                this.getMyOrderList();
            } else if (json.code === 10004016) {
                //自己不能卖给自己
                Modal.error({
                    title: typeText[exType],
                    content: '自己不能卖给自己',
                    okText: '确定',
                });
            } else if (json.code === 10004009) {
                //没有足够资产
                Modal.error({
                    title: typeText[exType],
                    content: '您没有足够资产',
                    okText: '确定',
                });
            } else if (json.code === 10004017) {
                //请进行身份认证
                Modal.confirm({
                    title: '发布广告',
                    content: '为保证资金安全，请在交易前实名认证',
                    okText: '去实名',
                    cancelText: '取消',
                    onOk: () => {
                        this.props.history.push('/user/verified')
                    }
                });
            } else if (json.code === 10004018) {
                //请先绑定银行卡
                Modal.confirm({
                    title: '发布广告',
                    content: '为保证交易顺畅，请在交易前绑定银行卡',
                    okText: '去绑卡',
                    cancelText: '取消',
                    onOk: () => {
                        this.props.history.push('/user/payment')
                    }
                });
            } else {
                message.error(json.msg);
            }
        });
    }

    //获取我的订单列表
    getMyOrderList = () => {
        request('/offline/myOrderDetail/list', {
            method: 'GET',
        }).then(json => {
            if (json.code === 10000000) {
                const myOrderList = json.data.map(order => {
                    order.key = order.id;
                    return order;
                });
                this.setState({ myOrderList });
            } else {
                message.error(json.msg);
            }
        });
    }

    //获取我的广告列表
    getMyAdvertList = () => {
        request('/offline/myAdvert/list', {
            method: 'GET',
        }).then(json => {
            if (json.code === 10000000) {
                const typeMap = {
                    0: '买入',
                    1: '卖出',
                }
                const myAdvertList = json.data.map(order => {
                    order.key = order.id;
                    order.exType = typeMap[order.exType];
                    return order;
                });
                this.setState({ myAdvertList });
            } else {
                message.error(json.msg);
            }
        });
    }

    //根据币种ID获取余额
    getVolume = () => {
        request(`/offline/volume/${this.props.coin.coinId}`, {
            method: 'GET',
        }).then(json => {
            if (json.code === 10000000) {
                if (json.data) {
                    this.setState({ coinVolume: json.data.volume });
                }
            } else {
                message.error(json.msg);
            }
        });

    }

    //根据用户ID获取用户支付信息
    getBankInfo = (id, askUserId) => {
        let { myOrderList } = this.state;
        request(`/offline/bankInfo/${askUserId}`, {
            method: 'GET',
        }).then(json => {
            if (json.code === 10000000 && json.data) {
                // this.setState({ bankInfo: json.data });
                myOrderList = myOrderList.map(order => {
                    if (id === order.id) {
                        order.bankInfo = json.data;
                    }
                    return order;
                });
                this.setState({ myOrderList });
            } else {
                message.error(json.msg);
            }
        });
    }

    handleSwitchRelease = key => {
        if (key === '2') {
            this.getVolume();
        }
    }

    handleExpand = (expanded, record) => {
        if (expanded && !record.bankInfo) {
            this.getBankInfo(record.id, record.askUserId);
        }
    }

    handlePreview = qrcodeId => {
        this.setState({ previewImage: `${IMAGES_ADDRESS}/view/${qrcodeId}` });
    }

    handleCloseImage = () => {
        this.setState({ previewImage: '' });
    }

    //确认付款
    confirmPay = record => {
        request('/offline/buy/confirm', {
            body: {
                orderId: record.orderId,
                subOrderId: record.subOrderId
            }
        }).then(json => {
            if (json.code === 10000000) {
                this.getMyOrderList();
                message.success('确认付款成功！');
            } else {
                message.error(json.msg);
            }
        })
    }

    //确认收款
    confirmReceipt = record => {
        request('/offline/sell/confirm', {
            body: {
                orderId: record.orderId,
                subOrderId: record.subOrderId
            }
        }).then(json => {
            if (json.code === 10000000) {
                this.getMyOrderList();
                message.success('确认收款成功！');
            } else {
                message.error(json.msg);
            }
        })
    }

    //撤销交易
    cancelPay = record => {
        request('/offline/detail/cancel', {
            body: {
                orderId: record.orderId,
                subOrderId: record.subOrderId
            }
        }).then(json => {
            if (json.code === 10000000) {
                this.getMyOrderList();
                message.success('撤销交易成功！');
            } else {
                message.error(json.msg);
            }
        })
    }

    //撤销广告
    cancelAdvert = record => {
        request('/offline/advert/cancel', {
            body: { orderId: record.id }
        }).then(json => {
            if (json.code === 10000000) {
                this.getMyAdvertList();
                message.success('撤销广告成功！');
            } else {
                message.error(json.msg);
            }
        })
    }

    render() {
        const { exType, coin } = this.props;
        const typeText = {
            'buy': '买入',
            'sell': '卖出'
        };

        const {
            coinVolume,
            advertList,
            current,
            pageSize,
            selectedCoin,
            releaseVisible,
            transactionVisible,
            recordIndex,
            myOrderList,
            myAdvertList,
            previewImage,
        } = this.state;

        let undoneOrderList, completedOrderList, cancelledOrderList;
        if (myOrderList) {
            //未完成订单列表
            undoneOrderList = myOrderList.filter(order => order.status === 0 || order.status === 1);

            //已完成订单列表
            completedOrderList = myOrderList.filter(order => order.status === 2);

            //已取消订单列表
            cancelledOrderList = myOrderList.filter(order => order.status === 9);
        }

        const listColumns = [{
            title: '卖家名称',
            dataIndex: 'realName',
            render: (text, record) => (
                <span className={classnames({
                    'name-wrap': true,
                    'online': true
                })}>
                    {text.substr(0, 1)}
                </span>
            )
        }, {
            title: '成交笔数',
            dataIndex: 'successVolume',
            key: 'successVolume',
        }, {
            title: '商家处理速度',
            dataIndex: 'speed',
            key: 'speed',
        }, {
            title: `数量(${coin.symbol})`,
            dataIndex: 'volume',
            key: 'volume',
        }, {
            title: '金额(CNY)',
            dataIndex: 'totalPrice',
            key: 'totalPrice'
        }, {
            title: '价格(CNY)',
            dataIndex: 'price',
            render: (text, record) => (
                <span className={classnames({
                    'price-wrap': true,
                    'font-color-green': exType === 'buy',
                    'font-color-red': exType === 'sell'
                })}>
                    {text}
                </span>
            )
        }, {
            title: '操作',
            dataIndex: 'action',
            key: 'action',
            render: (text, record) => (
                // console.log(text, record)
                <Button
                    type={exType}
                    onClick={this.triggerTransaction.bind(this, { exType, record })}
                >
                    {typeText[exType]}
                </Button>
            )
        }];

        const orderColumns = [{
            title: '类型',
            dataIndex: 'remarks',
            key: 'remarks',
            render: (text, record) => {
                const typeToText = {
                    'buy': '买入',
                    'sell': '卖出',
                }
                return `${typeToText[text]}${record.symbol}`;
            }
        }, {
            title: '价格(CNY)',
            dataIndex: 'price',
            key: 'price',
        }, {
            title: '数量',
            dataIndex: 'volume',
            key: 'volume',
        }, {
            title: '总额(CNY)',
            dataIndex: 'totalPrice',
            key: 'totalPrice',
        }, {
            title: '状态',
            dataIndex: 'status',
            key: 'status',
        }, {
            title: '对方姓名',
            dataIndex: 'name',
            key: 'name',
        }, {
            title: '下单时间',
            dataIndex: 'createDate',
            key: 'createDate',
            render: (text, record) => stampToDate(Number(text), 'MM-DD hh:mm:ss'),
        }, {
            title: '操作',
            dataIndex: 'action',
            key: 'action',
            render: (text, record) => {
                if (record.status === 0) {
                    if (record.remarks === 'buy') {
                        return (
                            <Button
                                type="primary"
                                onClick={this.confirmPay.bind(this, record)}
                            >
                                我已付款给卖家
                            </Button>
                        )
                    } else {
                        return '等待收款';
                    }
                } else if (record.status === 1) {
                    if (record.remarks === 'buy') {
                        return '已付款';
                    } else {
                        return (
                            <Button
                                type="primary"
                                onClick={this.confirmReceipt.bind(this, record)}
                            >
                                确认收款
                            </Button>
                        )
                    }
                } else {
                    return '--'
                }
            }
        }];

        const advertColumns = [{
            title: '创建时间',
            dataIndex: 'createDate',
            key: 'createDate',
            render: (text, record) => stampToDate(Number(text), 'MM-DD hh:mm:ss'),
        }, {
            title: '类型',
            dataIndex: 'exType',
            key: 'exType',
        }, {
            title: '价格(CNY)',
            dataIndex: 'price',
            key: 'price',
        }, {
            title: '数量',
            dataIndex: 'volume',
            key: 'volume',
        }, {
            title: '总额(CNY)',
            dataIndex: 'totalPrice',
            key: 'totalPrice',
        }, {
            title: '操作',
            dataIndex: 'action',
            key: 'action',
            render: (text, record) => {
                if (record.status === 0 || record.status === 2) {
                    return <Button
                        type="primary"
                        onClick={this.cancelAdvert.bind(this, record)}
                    >
                        撤销广告
                    </Button>
                } else {
                    return '--'
                }
            }
        }]

        return (
            <div className="trade-cont">
                <div className="trade-list">
                    <div className="trade-list-header clear">
                        <div className="trade-index pull-left">
                            <strong className="trade-part">{coin.symbol}/CNY</strong>
                            <strong className={classnames({
                                'now-trade-price': true,
                                'font-color-green': true,
                                'font-color-red': false
                            })}>￥{advertList ? advertList.price : 0.00}</strong>
                            <span className={classnames({
                                'now-trade-per': true,
                                'font-color-green': true,
                                'font-color-red': false
                            })}>+0.10%</span>
                            <span className="high-price">最高<em>￥1.003</em></span>
                            <span className="low-price">最低<em>￥0.995</em></span>
                        </div>
                        <Button
                            type="primary"
                            size='large'
                            onClick={this.triggerRelease}
                            className="trade-release pull-right"
                        >
                            <i className="iconfont icon-jia"></i>发布广告
                        </Button>
                        <Modal
                            title="发布广告"
                            wrapClassName="c2c-modal"
                            visible={releaseVisible}
                            onCancel={this.hideModal.bind(this, 'releaseVisible')}
                            footer={null}
                        >
                            <Tabs
                                defaultActiveKey="1"
                                onChange={this.handleSwitchRelease}
                            >
                                {releaseVisible && ([
                                    <TabPane tab={`买入${coin.symbol}`} key="1">
                                        {releaseVisible && (
                                            <TransactionForm
                                                coin={coin}
                                                exType='buy'
                                                price={advertList && advertList.price}
                                                onSubmit={this.handleRelease}
                                            />
                                        )}
                                    </TabPane>,
                                    <TabPane tab={`卖出${coin.symbol}`} key="2">
                                        {releaseVisible && (
                                            <TransactionForm
                                                coin={coin}
                                                exType='sell'
                                                price={advertList && advertList.price}
                                                volume={coinVolume}
                                                onSubmit={this.handleRelease}
                                            />
                                        )}
                                    </TabPane>
                                ])}
                            </Tabs>
                        </Modal>
                    </div>
                    <Table
                        dataSource={advertList && advertList.list}
                        columns={listColumns}
                        pagination={{
                            current,
                            pageSize,
                            total: advertList && advertList.count,
                            onChange: (page, pageSize) => {
                                this.getAdvertList(page);
                            }
                        }}
                    />
                </div>
                <div className="trade-record">
                    <ul className="trade-record-nav">
                        {['我的未完成订单', '我发布的广告', '我的已完成订单', '我的已取消订单'].map((text, index) => {
                            return <li
                                key={text}
                                className={classnames({
                                    active: recordIndex === index
                                })}
                                onClick={this.switchRecord.bind(this, index)}
                            >
                                {text}
                            </li>
                        })}
                    </ul>
                    <div className="trade-record-cont">
                        {recordIndex === 0 && (
                            <Table
                                dataSource={undoneOrderList}
                                columns={orderColumns}
                                onExpand={this.handleExpand}
                                pagination={false}
                                expandedRowRender={(record) => (
                                    record.bankInfo ? (
                                        <ExpandComponent
                                            record={record}
                                            previewImage={previewImage}
                                            onPreview={this.handlePreview}
                                            onCloseImage={this.handleCloseImage}
                                            confirmPay={this.confirmPay}
                                            cancelPay={this.cancelPay}
                                            confirmReceipt={this.confirmReceipt}
                                        />
                                    ) : null
                                )}
                            />
                        )}
                        {recordIndex === 1 && (
                            <Table
                                dataSource={myAdvertList}
                                columns={advertColumns}
                                pagination={false}
                            />
                        )}
                        {recordIndex === 2 && (
                            <Table
                                dataSource={completedOrderList}
                                columns={orderColumns}
                                pagination={false}
                            />
                        )}
                        {recordIndex === 3 && (
                            <Table
                                dataSource={cancelledOrderList}
                                columns={orderColumns}
                                pagination={false}
                            />
                        )}
                    </div>
                </div>
                <Modal
                    title={`${typeText[exType]}${coin.symbol}`}
                    wrapClassName="c2c-modal"
                    visible={transactionVisible}
                    onCancel={this.hideModal.bind(this, 'transactionVisible')}
                    footer={null}
                >
                    {transactionVisible && (
                        <TransactionForm
                            freezePrice
                            coin={coin}
                            exType={exType}
                            price={selectedCoin.price}
                            volume={selectedCoin.volume - selectedCoin.lockVolume - selectedCoin.successVolume}
                            onSubmit={this.handleTransaction}
                        />
                    )}
                </Modal>
            </div>
        )
    }
}

export default TradeContainer;