import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import request from '../../utils/request';
import classnames from 'classnames';

class Signin extends Component {
    state = {
        username: '',
        password: '',
        imgURL: '',
        errorTip: '',
        displayCode: false,
        code: '',
    }

    inputValue = (e) => {
        this.setState({ [e.target.id]: e.target.value });
    }

    submit = () => {
        const {
            username,
            password,
            code,
        } = this.state;
        if(username && password) {
            request('/user/login', {
                body: {
                    username,
                    password,
                    code,
                }
            }).then(json => {
                if (json.code === 10000000) {
                    sessionStorage.setItem('account', JSON.stringify(json.data));
                    this.props.history.push('/user');
                } else {
                    this.setState({ errorTip: json.msg });
                    if (json.code === 10004002 && json.data === 10001001) {
                        this.setState({
                            displayCode: true,
                            imgURL: `/bbex/valid/createCode?username=${this.state.username}&type=login`,
                        });
                    } 
                }
            });
        }
    }

    render() {
        const {
            username,
            password,
            errorTip,
            displayCode,
            code,
        } = this.state;
        const ok = this.state.username && this.state.password;
        return (
            <div className="content">
                <div className="form-box">
                    <h1>用户登录</h1>
                    <div className="attention">
                        <i className="iconfont icon-zhuyishixiang"></i>请确认您正在访问 <strong>https://www.bbex.one</strong>
                    </div>
                    <div className="safety-site"><i className="iconfont icon-suo1"></i><em>https</em>://www.bbex.one</div>
                    <p className="error-tip">{errorTip && <i className="iconfont icon-zhuyishixiang"></i>}{errorTip}</p>
                    <ul className="form-list">
                        <li>
                            <i className="iconfont icon-youxiang"></i>
                            <input type="text" className="text" id="username" value={username} onChange={this.inputValue} placeholder="邮箱" />
                        </li>
                        <li>
                            <i className="iconfont icon-suo"></i>
                            <input type="password" className="text" id="password" value={password} onChange={this.inputValue} placeholder="密码" />
                        </li>
                        {displayCode && <li>
                            <i className="iconfont icon-yanzhengma2"></i>
                            <input
                                type="text" 
                                className="text" 
                                id="code" 
                                value={code} 
                                onChange={this.inputValue} 
                                placeholder="验证码" 
                            />
                            <img
                                src={`/bbex/valid/createCode?username=${username}&type=login`}
                                className="inner-graphic"
                                alt="图形验证码"
                                onClick={(e) => {
                                    e.target.src = e.target.src;
                                }}
                            />
                        </li>}
                        <li><input type="submit" className={classnames({
                            button: true,
                            disabled: !ok
                        })} onClick={this.submit} value="登录" /></li>
                        <li className="clear"><Link to="/reset" className="pull-left">忘记密码？</Link> <span className="pull-right">还没账号？<Link to="/register">立即注册</Link></span></li>
                    </ul>
                </div>
            </div>
        )
    }
}

export default Signin;