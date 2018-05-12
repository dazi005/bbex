import React, { Component } from 'react';
import { Route, NavLink, Switch } from 'react-router-dom';
import Property from './property';
import Verified from './verified';
import Payment from './payment';
import Transaction from './transaction';
import Finance from './finance';
import Popup from '../../components/popup';

import './user.css';

class UserCenter extends Component {
    state = {
        popup: false,
    }

    componentDidMount() {
        if(sessionStorage.getItem('account')) {
            const account = JSON.parse(sessionStorage.getItem('account'));
            if(!account.googleAuth) {
                this.setState({
                    popup: <Popup
                        wrapClassName="verification-popup" 
                        cancelBtn="暂不设置"
                        confirmBtn="立即设置"
                        cancelHandle={this.closePopup}
                        confirmHandle={() => {
                            this.closePopup();
                            this.props.history.push('/authentication');
                        }}
                    >
                        <i className="iconfont icon-icon"></i>
                        <p className="message">为了您的账号安全，我们强烈建议您开启二次验证。</p>
                        <a href="/authentication" className="input-verification">
                            请输入谷歌验证码
                        </a>
                    </Popup>
                });
            }
        }
    }

    closePopup = () => {
        this.setState({ popup: false });
    }

    render() {
        const { match } = this.props;
        const { popup } = this.state;
        const account = JSON.parse(sessionStorage.getItem('account'));
        return (
            <div className="content user">
                <div className="content-inner clear">
                    <div className="user-bar pull-left">
                        <div className="user-header">   
                            <div className="user-avatar">{account.realName ? account.realName.substr(0,1) : '?'}</div>
                            {account.mail}
                        </div>
                        <div className="user-nav">
                            <NavLink
                                to={`${match.url}`}
                                exact
                                className="user-link"
                                activeClassName="active"
                            >
                                <i className="iconfont icon-zichan"></i>我的资产
                            </NavLink>
                            <NavLink
                                to={`${match.url}/transaction`}
                                className="user-link"
                                activeClassName="active"
                            >
                                <i className="iconfont icon-jiaoyi"></i>我的交易
                            </NavLink>
                            <NavLink
                                to={`${match.url}/finance`}
                                className="user-link"
                                activeClassName="active"
                            >
                                <i className="iconfont icon-caiwu"></i>财务记录
                            </NavLink>
                            <NavLink
                                to={`${match.url}/security`}
                                className="user-link"
                                activeClassName="active"
                            >
                                <i className="iconfont icon-anquanzhongxin"></i>安全中心
                            </NavLink>
                            <NavLink
                                to={`${match.url}/verified`}
                                className="user-link"
                                activeClassName="active"
                            >
                                <i className="iconfont icon-shimingrenzheng"></i>实名认证
                            </NavLink>
                            <NavLink
                                to={`${match.url}/payment`}
                                className="user-link"
                                activeClassName="active"
                            >
                                <i className="iconfont icon-zhifu"></i>支付绑定
                            </NavLink>
                            <NavLink
                                to={`${match.url}/address`}
                                className="user-link"
                                activeClassName="active"
                            >
                                <i className="iconfont icon-zhifu"></i>地址管理
                            </NavLink>
                        </div>
                    </div>
                    <Switch>
                        <Route path={`${match.url}/`} exact component={Property} />
                        <Route path={`${match.url}/verified`} component={Verified} />
                        <Route path={`${match.url}/payment`} component={Payment} />
                        <Route path={`${match.url}/transaction`} component={Transaction} />
                        <Route path={`${match.url}/finance`} component={Finance} />
                    </Switch>
                </div>
                {popup}
            </div>
        )
    }
}

export default UserCenter;