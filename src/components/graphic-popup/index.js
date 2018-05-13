import React, { Component } from 'react';
import { message } from 'antd';
import Popup from '../popup';
import request from '../../utils/request';
import { IMAGES_ADDRESS }from '../../utils/constants';

class GraphicPopup extends Component {
    state = {
        code: '',
        imgName: '',
    }

    componentWillMount() {
        this.getValidImg();
    }

    inputValue = (e) => {
        this.setState({ [e.target.id]: e.target.value });
    }

    sendCode = () => {
        const { code } = this.state;
        const {
            mail,
            type,
            cancelHandle,
            confirmHandle,
        } = this.props;

        if (this.state.code) {
            request('/mail/sendCode', {
                body: { mail, type, code, }
            }).then(json => {
                if (json.code === 10000000) {
                    cancelHandle && cancelHandle();
                    confirmHandle && confirmHandle();
                } else if (json.code === -2) {
                    this.setState({ errorTip: '验证码输入错误！' });
                } else {
                    this.setState({ errorTip: json.msg });
                }
            });
        } else {
            this.setState({ errorTip: '请输入验证码！' });
        }
    }

    getValidImg = () => {
        const { mail, type } = this.props;
        request('/valid/createCode', {
            method: 'GET',
            body: {
                type,
                username: mail,
            }
        }).then(json => {
            if (json.code === 10000000) {
                this.setState({ imgName: json.data.imageName });
            } else {
                message.error(json.msg);
            }
        })
    }

    render() {
        const { cancelHandle } = this.props;

        const { imgName } = this.state;

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
                        {imgName && (
                            <img
                                src={`${IMAGES_ADDRESS}/image/view/${imgName}`}
                                className="inner-graphic"
                                alt="图形验证码"
                                onClick={this.getValidImg}
                            />
                        )}
                    </li>
                    <li style={{ textAlign: 'right' }}>点击图片刷新验证码</li>
                </ul>
            </Popup>
        )
    }
}

export default GraphicPopup;