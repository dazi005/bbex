import React, { Component } from 'react';
import GraphicPopup from '../../components/graphic-popup';
import classnames from 'classnames';

class Reset extends Component {
    state = { 
        mail: '', 
        errorTip: '',
        popup: false,
    }

    inputValue = (e) => {
        this.setState({[e.target.id]: e.target.value});
    }

    closePopup = () => {
        this.setState({popup: false});
    }

    getValidCode = () => {
        if(this.state.mail) {
            this.setState({ 
                popup: <GraphicPopup
                    mail={this.state.mail}
                    type="reset"
                    cancelHandle={this.closePopup}
                    confirmHandle={() => {
                        this.props.history.push('/resetPassword');
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
        } = this.state;
        return (
            <div className="content">
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
            </div>
        )
    }
}

export default Reset;