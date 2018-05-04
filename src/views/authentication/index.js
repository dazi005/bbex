import React, { Component } from 'react';
import { Link } from "react-router-dom";
import request from '../../utils/request';
import QRCode from 'qrcode.react';
import classnames from 'classnames';
import './authentication.css';

class Authentication extends Component {
    state = {
        current: 0,
        qrcodeContent: '',
        secret: '',
        code: '',
        errorTip: '',
    }

    componentDidMount() {
        request('/user/createGoogleSecret').then(json => {
            if(json.code === 10000000) {
                this.setState(json.data);
            }
        });
    }

    inputValue = (e) => {
        this.setState({[e.target.id]: e.target.value});
    }

    nextStep = () => {
        this.setState({ current: this.state.current+1 });
    }

    prevStep = () => {
        this.setState({ current: this.state.current-1 });
    }

    submit = () => {
        const {
            secret,
            code,
        } = this.state;
        request('/user/googleBinder', {
            body: {secret, code,}
        }).then(json => {
            if(json.code === 10000000) {
                const account = JSON.parse(sessionStorage.getItem('account'));
                account.googleAuth = secret;
                sessionStorage.setItem('account', JSON.stringify(account));
                this.props.history.push('/userCenter');
            }
        });
    }

    render() {
        const { 
            current,
            qrcodeContent,
            secret,
            code,
            errorTip,
        } = this.state;

        return (
            <div className="content">
                <div className="auth-progress">
                    <div className="content-inner">
                        <h1 className="auth-tit">开启谷歌验证</h1>
                        <ul className="auth-progress-bar clear">
                            {['下载App', '扫描二维码', '备份密钥', '开启谷歌验证'].map((text, index) => {
                                return (
                                    <li 
                                        className={classnames({
                                            'auth-progress-step': true,
                                            'current': current === index
                                        })}
                                        key={text}
                                    >
                                        <span className="auth-progress-no">{index+1}</span>{text}
                                    </li>
                                )
                            })}
                        </ul>
                    </div>
                </div>
                <div className="auth-box">
                    {current === 0 && <div className="auth-box-inner">
                        <h1><strong className="stress">第一步：</strong>下载并安装谷歌验证器APP</h1>
                        <div className="down-google-app">
                            <Link to="https://itunes.apple.com/us/app/google-authenticator/id388497605?mt=8" className="down-btn apple" target="_blank" rel="noopener noreferrer"> </Link>
                            <Link to="https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2" className="down-btn google" target="_blank" rel="noopener noreferrer"> </Link>
                        </div>
                        <div className="auth-direction">
                            <button className="button primary next-step" style={{width: '358px'}} onClick={this.nextStep}>我已经安装 下一步</button>
                        </div>
                    </div>}
                    {current === 1 && <div className="auth-box-inner">
                        <h1><strong className="stress">第二步：</strong>扫描二维码</h1>
                        <div className="scan-qrcode clear">
                            <div className="qrcode-box pull-left">
                                <QRCode
                                    value={qrcodeContent}
                                    size={110}
                                    bgColor={"#ffffff"}
                                    fgColor={"#000000"}
                                    level={"L"}
                                />
                                <p>使用谷歌验证器APP扫描该二维码</p>
                            </div>
                            <div className="qrcode-text">
                                <span className="qrcode-num">{secret}</span>
                                <p>如果您无法扫描二维码，<br /> 可以将该16位密钥手动输入到谷歌验证APP中</p>
                            </div>
                        </div>
                        <div className="auth-direction">
                            <button className="button normal prev-step" onClick={this.prevStep}>上一步</button>
                            <button className="button primary next-step" onClick={this.nextStep}>下一步</button>
                        </div>
                    </div>}
                    {current === 2 && <div className="auth-box-inner">
                        <h1><strong className="stress">第三步：</strong>备份密钥</h1>
                        <div className="key-box"><i className="iconfont icon-miyao"></i>{secret}</div>
                        <div className="key-text">
                            <p>请将16位密钥记录在纸上，并保存在安全的地方。<br />如遇手机丢失，你可以通过该密钥恢复你的谷歌验证。</p>
                            <p><strong className="iconfont icon-zhuyishixiang stress"></strong>通过人工客服重置你的谷歌验证需提交工单，可能需要<strong className="stress">至少7天</strong>时间来处理。</p>
                        </div>
                        <div className="auth-direction">
                            <button className="button normal prev-step" onClick={this.prevStep}>上一步</button>
                            <button className="button primary next-step" onClick={this.nextStep}>下一步</button>
                        </div>
                    </div>}
                    {current === 3 && <div className="auth-box-inner">
                        <h1><strong className="stress">第四步：</strong>开启谷歌验证</h1>
                        <p className="error-tip">{errorTip && <i className="iconfont icon-zhuyishixiang"></i>}{errorTip}</p>
                        <ul className="form-list">
                            <li>
                                <i className="iconfont icon-miyao"></i>
                                <input type="text" className="text" value={secret} placeholder="16位秘钥" disabled />
                            </li>
                            <li>
                                <i className="iconfont icon-google"></i>
                                <input type="text" className="text" id="code" value={code} onChange={this.inputValue} placeholder="谷歌验证码" />
                            </li>
                        </ul>
                        <div className="auth-direction">
                            <button className="button normal prev-step" onClick={this.prevStep}>上一步</button>
                            <button className={classnames({
                                'button primary submit': true,
                                'disabled': !code,
                            })} onClick={this.submit}>提交</button>
                        </div>
                    </div>}
                </div>
            </div>
        )
    }
}

export default Authentication;