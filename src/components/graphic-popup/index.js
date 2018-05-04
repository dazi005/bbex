import React, { Component } from 'react';
import Popup from '../popup';
import request from '../../utils/request';
// import './graphic-popup.css';

class GraphicPopup extends Component {
    state = {
        code: '',
    }

    inputValue = (e) => {
        this.setState({[e.target.id]: e.target.value});
    }

    sendCode = () => {
        const { code } = this.state;
        const {
            mail,
            type,
            cancelHandle,
            confirmHandle,
        } = this.props;

        if(this.state.code) {
            request('/mail/sendCode',{
                body: { mail, type, code, }
            }).then((json) => {
                if(json.code === 10000000) {
                    cancelHandle && cancelHandle();
                    confirmHandle && confirmHandle();
                }else if(json.code === -2) {
                    this.setState({ errorTip: '验证码输入错误！'});
                }else {
                    this.setState({ errorTip: json.msg});
                }
            });
        }else {
            this.setState({ errorTip: '请输入验证码！'});
        }
    }

    render() {
        const {
            mail,
            type,
            cancelHandle,
        } = this.props;
        return (
            <Popup
                wrapClassName="graphic-popup"
                title="验证码"
                cancelHandle={cancelHandle}
                confirmHandle={this.sendCode}
            >
                <p className="error-tip">
                    {this.state.errorTip && <i className="iconfont icon-zhuyishixiang"></i>}
                    {this.state.errorTip}
                </p>
                <ul className="form-list">
                    <li>
                        <i className="iconfont icon-yanzhengma1"></i>
                        <input
                            type="text"
                            className="text"
                            id="code"
                            value={this.state.code}
                            onChange={this.inputValue}
                            placeholder="图形验证码"
                        />
                        <img
                            src={`/bbex/valid/createCode?username=${mail}&type=${type}`}
                            className="inner-graphic"
                            alt="图形验证码"
                            onClick={(e) => {
                                e.target.src = e.target.src;
                            }}
                        />
                    </li>
                </ul>
            </Popup>
        )
    }
}

export default GraphicPopup;