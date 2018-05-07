import React, { Component } from 'react';
import { Tabs, Checkbox, Tooltip, Icon, Table, Button, Input, message, Modal } from 'antd';
import request from '../../../utils/request';

import './property.css';

const TabPane = Tabs.TabPane;

message.config({
    top: 200,
    maxCount: 3,
});

class Property extends Component {
    state = {
        modalTit: '',
        showModal: false,
        actionType: '',
        availableC2c: 0,
        handleCoin: null,
        handleVolume: 0,
        c2cData: null,
    }

    componentWillMount() {
        this.getC2cData();
    }

    inputVolume = (e) => {
        this.setState({ handleVolume: e.target.value });
    }

    getC2cData = () => {
        request('/offline/volume/list', {
            method: 'GET'
        }).then(json => {
            if (json.code === 10000000) {
                const c2cData = json.data.map(item => {
                    item.key = item.coinId;
                    item.volume = item.volume || '0.000000';
                    item.advertVolume = item.advertVolume || '0.000000';
                    item.lockVolume = item.lockVolume || '0.000000';
                    item.totalPrice = (Number(item.volume) + Number(item.advertVolume) + Number(item.lockVolume)).toFixed(6);
                    return item;
                })
                this.setState({ c2cData });
            } else {
                message.error(json.msg);
            }
        })
    }

    handleZero = (e) => {
        console.log(e.target.checked);
    }

    handleRecharge = () => {

    }

    triggerAction = ({ type, coin }) => {
        const typeToTit = {
            'turnIn': '从常规账户转入到C2C账户',
            'turnOut': '从C2C账户转出到常规账户',
        }
        let url;
        if(type.indexOf('turn') > -1) {
            url = `/${type === 'turnIn' ? 'coin' : 'offline'}/volume/${coin.coinId}`;
        }
        request(url, {
            method: 'GET'
        }).then(json => {
            if (json.code === 10000000) {
                if(!json.data) {
                    message.info('您没有该币种资产！');
                    return;
                }
                this.setState({
                    modalTit: typeToTit[type],
                    showModal: true,
                    actionType: type,
                    handleCoin: coin,
                    availableC2c: json.data.volume,
                });
            } else {
                message.error(json.msg)
            }
        }); 
        
    }

    turnAction = (type) => {
        const { handleCoin, handleVolume } = this.state;
        request(`/offline/volume/${type.substr(4).toLowerCase()}`, {
            body: {
                coinId: handleCoin.coinId,
                symbol: handleCoin.symbol,
                volume: handleVolume,
            }
        }).then(json => {
            if (json.code === 10000000) {
                this.getC2cData();
                message.success('操作成功！');
                this.hideModal();
            } else {
                message.error(json.msg);
            }
        })
    }

    handelOutto = () => {

    }

    hideModal = () => {
        this.setState({
            modalTit: '',
            showModal: false,
            handleVolume: 0,
            availableC2c: 0,
        });
    }

    render() {
        const {
            modalTit,
            showModal,
            actionType,
            availableC2c,
            handleCoin,
            handleVolume,
            c2cData,
        } = this.state;

        const routineData = [{
            key: Math.random(),
            coin: 'BTC(Bitcoin)',
            available: '0.00000000',
            panding: '0.00000000',
            totalPrice: '0.000000'
        }, {
            key: Math.random(),
            coin: 'USDT(Tether USD)',
            available: '0.00000000',
            panding: '0.00000000',
            totalPrice: '0.000000'
        }, {
            key: Math.random(),
            coin: 'CNC(Global China Cash)',
            available: '0.00000000',
            panding: '0.00000000',
            totalPrice: '0.000000'
        }, {
            key: Math.random(),
            coin: 'BitCNY(BitCNY)',
            available: '0.00000000',
            panding: '0.00000000',
            totalPrice: '0.000000'
        }, {
            key: Math.random(),
            coin: 'GAT(Global AEX Token)',
            available: '0.00000000',
            panding: '0.00000000',
            totalPrice: '0.000000'
        }, {
            key: Math.random(),
            coin: 'ETH(Ethereum)',
            available: '0.00000000',
            panding: '0.00000000',
            totalPrice: '0.000000'
        }, {
            key: Math.random(),
            coin: 'DOGE(Dogecoin)',
            available: '0.00000000',
            panding: '0.00000000',
            totalPrice: '0.000000'
        }, {
            key: Math.random(),
            coin: 'LTC(Litecoin)',
            available: '0.00000000',
            panding: '0.00000000',
            totalPrice: '0.000000'
        }, {
            key: Math.random(),
            coin: 'XRP(Ripple)',
            available: '0.00000000',
            panding: '0.00000000',
            totalPrice: '0.000000'
        }, {
            key: Math.random(),
            coin: 'BTS(BitShares)',
            available: '0.00000000',
            panding: '0.00000000',
            totalPrice: '0.000000'
        }, {
            key: Math.random(),
            coin: 'YOYO(YOYOW)',
            available: '0.00000000',
            panding: '0.00000000',
            totalPrice: '0.000000'
        }, {
            key: Math.random(),
            coin: 'AE(Aeternity)',
            available: '0.00000000',
            panding: '0.00000000',
            totalPrice: '0.000000'
        }, {
            key: Math.random(),
            coin: 'ARDR(Ardor)',
            available: '0.00000000',
            panding: '0.00000000',
            totalPrice: '0.000000'
        }, {
            key: Math.random(),
            coin: 'ATN(AI Technology Network)',
            available: '0.00000000',
            panding: '0.00000000',
            totalPrice: '0.000000'
        }]

        const routineColumns = [{
            title: '资金名称',
            dataIndex: 'coin',
            key: 'coin',
            render: (text, record) => {
                const type = text.split('(')[0].toLowerCase();
                return <div>
                    <span className={`currency-logo ${type}`}></span>{text}
                </div>
            },
        }, {
            title: '可用资金',
            dataIndex: 'available',
            key: 'available',
            render: (text, record) => {
                return <div className="available-col">
                    <i className="iconfont icon-qianbao"></i> {text}
                </div>
            }
        }, {
            title: '挂单金额',
            dataIndex: 'panding',
            key: 'panding',
        }, {
            title: '总计',
            dataIndex: 'totalPrice',
            key: 'totalPrice',
        }, {
            title: '操作',
            dataIndex: 'action',
            key: 'action',
            render: (text, record) => (
                <div className="property-action">
                    <Button
                        type="normal"
                        onClick={this.handleRecharge}
                    >
                        充币
                    </Button>
                    <Button
                        type="normal"
                        onClick={this.handleWithdraw}
                    >
                        提币
                    </Button>
                    <Button
                        type="normal"
                        onClick={this.handleTrade}
                    >
                        交易
                    </Button>
                </div>
            )
        }]

        const c2cColumns = [{
            title: '资金名称',
            dataIndex: 'symbol',
            key: 'symbol',
            render: (text, record) => {
                const type = text.toLowerCase();
                return <div>
                    <span className={`currency-logo ${type}`}></span>{text}
                </div>
            },
        }, {
            title: '可用资金',
            dataIndex: 'volume',
            key: 'volume',
            render: (text, record) => {
                return <div className="available-col">
                    <i className="iconfont icon-qianbao"></i> {text}
                </div>
            }
        }, {
            title: '广告冻结',
            dataIndex: 'advertVolume',
            key: 'advertVolume',
        }, {
            title: '交易冻结',
            dataIndex: 'lockVolume',
            key: 'lockVolume',
        }, {
            title: '总计',
            dataIndex: 'totalPrice',
            key: 'totalPrice',
        }, {
            title: '操作',
            dataIndex: 'action',
            key: 'action',
            render: (text, record) => (
                <div className="property-action">
                    <Button
                        type="primary"
                        onClick={this.triggerAction.bind(this, { type: 'turnIn', coin: record})}
                    >
                        转入
                    </Button>
                    <Button
                        type="normal"
                        onClick={this.triggerAction.bind(this, { type: 'turnOut', coin: record})}
                    >
                        转出
                    </Button>
                </div>
            )
        }]

        return (
            <div className="user-cont property pull-right">
                <Tabs>
                    <TabPane tab="常规账户" key="routine">
                        <header className="property-header">
                            <h2 className="pull-left">
                                我的资金一览表
                                <Checkbox onChange={this.handleZero}>隱藏0余額</Checkbox>
                            </h2>
                            <ul className="pull-right">
                                <li className="assets-estimate">資產估算：0.000000 BTC</li>
                                <li>
                                    <span>
                                        <Tooltip title="还有 20:30:15 恢复全部额度，若需更高提币额度，请向客服申请">
                                            <span><Icon type="question-circle-o" /></span>
                                        </Tooltip>
                                        日提币额度：30BTC
                                    </span>
                                    <span>今日已用：0.000000BTC</span>
                                </li>
                            </ul>
                        </header>
                        <Table
                            dataSource={routineData}
                            columns={routineColumns}
                            pagination={false}
                        />
                    </TabPane>
                    <TabPane tab="C2C账户" key="c2c">
                        <header className="property-header">
                            <h2 className="pull-left">
                                我的资金一览表
                            </h2>
                            <ul className="pull-right">
                                <li>&nbsp;</li>
                                <li className="assets-estimate">資產估算：0.000000 BTC</li>
                            </ul>
                        </header>
                        <Table
                            dataSource={c2cData}
                            columns={c2cColumns}
                            pagination={false}
                        />
                    </TabPane>
                </Tabs>
                <Modal
                    title={modalTit}
                    wrapClassName="property-modal"
                    visible={showModal}
                    onCancel={this.hideModal}
                    footer={null}
                >
                    {((actionType) => {
                        if (actionType.indexOf('turn') > -1) {
                            //转入转出C2C
                            return <ul className="c2c-form">
                                <li>
                                    <Input
                                        addonBefore="币种名称"
                                        size="large"
                                        value={handleCoin.symbol}
                                        disabled
                                    />
                                </li>
                                <li>
                                    <Input
                                        addonBefore='输入划转数量'
                                        size="large"
                                        value={handleVolume}
                                        onChange={this.inputVolume}
                                    />
                                </li>
                                <li>
                                    可用：{availableC2c}{handleCoin.symbol}
                                </li>
                                <li>
                                    <Button
                                        type='primary'
                                        size='large'
                                        onClick={this.turnAction.bind(this, actionType)}
                                    >
                                       立即转{actionType === 'turnIn' ? '入' : '出'}
                                    </Button>
                                </li>
                            </ul>
                        } else if (actionType === 'recharge') {
                            return '充值';
                        }
                    })(actionType)}
                </Modal>
            </div>
        )
    }
}

export default Property;