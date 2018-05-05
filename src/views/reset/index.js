import React, { Component } from 'react';
import GraphicPopup from '../../components/graphic-popup';
import classnames from 'classnames';

class Reset extends Component {
    state = {
        mail: '',
        errorTip: '',
        popup: false,
        resetConfirm: false,
    }

    inputValue = (e) => {
        this.setState({ [e.target.id]: e.target.value });
    }

    closePopup = () => {
        this.setState({ popup: false });
    }

    getValidCode = () => {
        if (this.state.mail) {
            this.setState({
                popup: <GraphicPopup
                    mail={this.state.mail}
                    type="reset"
                    cancelHandle={this.closePopup}
                    confirmHandle={() => {
                        this.setState({ resetConfirm: true });
                    }}
                >
                </GraphicPopup>
            });

        } else {
            this.setState({ errorTip: '请输入邮箱' });
        }
    }

    render() {
        const {
            mail,
            errorTip,
            popup,
            resetConfirm,
        } = this.state;
        return (
            <div className="content">
                {resetConfirm ? (
                    <div className="form-box">
                        <h1>重置密码确认</h1>
                        <ul className="form-list">
                            <li className="form-box-text">
                                已向您的注册邮箱发送了一封重置密码邮件，请点击邮件中的链接前去重置登录密码。 如果长时间未收到邮件，请尝试在垃圾邮件中查找。
                            </li>
                        </ul>
                    </div>
                ) : (
                        <div className="form-box">
                            <h1>找回密码</h1>
                            <p className="error-tip">{errorTip && <i className="iconfont icon-zhuyishixiang"></i>}{errorTip}</p>
                            <ul className="form-list">
                                <li><i className="iconfont icon-youxiang"></i><input type="text" className="text" id="mail" value={mail} onChange={this.inputValue} placeholder="输入您的邮箱" /></li>
                                <li><input type="submit" className={classnames({
                                    button: true,
                                    disabled: !mail
                                })} onClick={this.getValidCode} value="确定" /></li>
                            </ul>
                            {popup}
                        </div>
                    )}
            </div>
        )
    }
}

export default Reset;