import React, { Component } from 'react';
import request from '../../utils/request';
import classnames from 'classnames';

class SubmitRest extends Component {
    state = {
        ptoken: this.props.location.search.substr(1).split('=')[1],
        password: '',
        repassword: '',
        errorTip: '',
    }

    inputValue = (e) => {
        this.setState({ [e.target.id]: e.target.value });
    }

    reset = () => {
        request('/user/resetPassword',{
            body: {
                password: this.state.password,
                ptoken: this.state.ptoken,
            }
        });
    }

    render() {
        const {
            password,
            repassword,
            errorTip,
        } = this.state;
        const ok = password && repassword;
        return (
            <div className="content">
                <div className="form-box">
                    <h1>重置密码</h1>
                    <p className="error-tip">{errorTip && <i className="iconfont icon-zhuyishixiang"></i>}{errorTip}</p>
                    <ul className="form-list">
                        <li><i className="iconfont icon-youxiang"></i><input type="password" className="text" id="password" value={password} onChange={this.inputValue} placeholder="新密码" /></li>
                        <li><i className="iconfont icon-youxiang"></i><input type="password" className="text" id="repassword" value={repassword} onChange={this.inputValue} placeholder="确认密码" /></li>
                        <li><input type="submit" className={classnames({
                            button: true,
                            disabled: !ok
                        })} onClick={this.reset} value="确定" /></li>
                    </ul>
                </div>
            </div>
        )
    }
}

export default SubmitRest;