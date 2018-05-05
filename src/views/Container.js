import React, { Component } from 'react';
import { withRouter, Link } from "react-router-dom";
import request from '../utils/request';

import logo from '../logo.svg';

class Container extends Component {
    state = {
        login: false,
    }

    componentDidMount() {
        const login = !!sessionStorage.getItem('account');
        this.setState({ login }); //判断登录状态
    }

    componentWillUpdate() {
        const login = !!sessionStorage.getItem('account');
        if(login !== this.state.login) {
            this.setState({ login }); //切换登录状态
        }
    }

    logout = () => {
        request('/user/logout').then(json => {
            if (json.code === 10000000) {
                sessionStorage.removeItem('account');
                this.props.history.push('/signin');
            }
        });
    }

    render() {
        const {
            login,
        } = this.state;
        return (
            <div className="container">
                <header className="header">
                <Link className="logo" to="/">
                    <img src={logo} alt="logo" width="60" height="60" />
                </Link>
                <ul className="nav-bar">
                    <li>
                    <Link to="/trade">交易中心</Link>
                    </li>
                    <li>
                    <Link to="/c2c">C2C</Link>
                    </li>
                </ul>
                {!login && (
                    <div className="user-status">
                        <i className="iconfont icon-yonghu"></i>
                        <Link to="/signin">登录</Link>
                        /
                        <Link to="/register">注册</Link>
                    </div>
                )}
                {login && (
                    <div className="user-status">
                        <div className="select-bar">
                            <i className="iconfont icon-yonghu"></i>
                            <i className="iconfont icon-jiantou_down"></i>
                            <span>用户中心</span>
                            <ul className="select-list">
                                <li><Link to="/user">用户中心</Link></li>
                                <li onClick={this.logout}>退出</li>
                            </ul>
                        </div>
                    </div>
                )}
                <div className="select-bar language">
                    <i className="iconfont icon-diqiu"></i>
                    <i className="iconfont icon-jiantou_down"></i>
                    <span>中文</span>
                    <ul className="select-list">
                        <li>中文</li>
                        <li>英文</li>
                    </ul>
                </div>
                </header>

                {this.props.children}

                <footer className="footer">
                <div className="footer-container">
                    <div className="footer-main clear">
                    <div className="footer-logo">
                        <img src={logo} alt="logo" width="60" height="60" />
                        <p>市场有风险 投资需谨慎</p>
                    </div>
                    <div className="footer-main-right">
                        <ul className="footer-nav clear">
                        <li>
                            <span>关于我们</span>
                            <Link to="javascript:void(0)">关于我们</Link>
                            <Link to="javascript:void(0)">交换链接</Link>
                            <Link to="javascript:void(0)">上币申请</Link>
                        </li>
                        <li>
                            <span>用户支持</span>
                            <Link to="javascript:void(0)">服务协议</Link>
                            <Link to="javascript:void(0)">隐私声明</Link>
                            <Link to="javascript:void(0)">费率标准</Link>
                            <Link to="javascript:void(0)">法律声明</Link>
                        </li>
                        <li>
                            <span>其他</span>
                            <Link to="javascript:void(0)">公告中心</Link>
                            <Link to="javascript:void(0)">常见问题</Link>
                            <Link to="javascript:void(0)">币种介绍</Link>
                            <Link to="javascript:void(0)">提交工单</Link>
                        </li>
                        </ul>
                        <ul className="footer-contact">
                        <li>联系我们</li>
                        <li>
                            <Link to="javascript:void(0)" target="_blank" rel="noopener noreferrer"><i className="iconfont icon-weixin"></i></Link>
                            <Link to="javascript:void(0)" target="_blank" rel="noopener noreferrer"><i className="iconfont icon-weibo"></i></Link>
                            <Link to="javascript:void(0)" target="_blank" rel="noopener noreferrer"><i className="iconfont icon-qq"></i></Link>
                        </li>
                        <li>联系邮箱：<Link to="mailto: support@bbex.com">support@bbex.com</Link></li>
                        </ul>
                    </div>
                    </div>
                    <div className="footer-link">
                    友情链接：
                    <Link to="https://www.coinmarketcap.com" target="_blank" rel="noopener noreferrer">coinmarketcap</Link>
                    <Link to="https://www.bitcointalk.org" target="_blank" rel="noopener noreferrer">BitcoinTalk</Link>
                    <Link to="https://www.coindesk.com" target="_blank" rel="noopener noreferrer">coindesk</Link>
                    <Link to="https://www.btc123.com" target="_blank" rel="noopener noreferrer">btc123</Link>
                    <Link to="https://tradeblock.com/ethereum" target="_blank" rel="noopener noreferrer">tradeblock</Link>
                    <Link to="https://www.bitcoin.org" target="_blank" rel="noopener noreferrer">bitcoin.org</Link>
                    <Link to="https://pool.btc.com" target="_blank" rel="noopener noreferrer">BTC.com矿池</Link>
                    </div>
                    <div className="footer-copyright">Copyright 2018 9coin All Rights Reserved.</div>
                </div>
                </footer>
            </div>
        )
    }
}

export default withRouter(Container);
