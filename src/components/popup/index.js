import React, { Component } from 'react';
import classnames from 'classnames';
import './popup.css';

class Popup extends Component {
    state = {
        title: this.props.title,
        cancelBtn: this.props.cancelBtn || '取消',
        confirmBtn: this.props.confirmBtn || '确定',
        cancelHandle: () => {
            this.props.cancelHandle && this.props.cancelHandle();
        },
        confirmHandle: () => {
            this.props.confirmHandle && this.props.confirmHandle();
        },
    }

    render() {
        const { 
            title,
            cancelBtn,
            confirmBtn,
            cancelHandle,
            confirmHandle,
        } = this.state;
        return (
            <div className={classnames({
                "popup": true,
                [this.props.wrapClassName]: this.props.wrapClassName
            })}>
                <div className="popup-box">
                    <button className="popup-close" onClick={cancelHandle}><i className="iconfont icon-guanbi"></i></button>
                    <h1 className="popup-tit">{title}</h1>
                    <div className="popup-content">
                        {this.props.children}
                    </div>
                    <div className="popup-footer">
                        {cancelBtn && <button className="popup-cancel" onClick={cancelHandle}>{cancelBtn}</button>}
                        {confirmBtn && <button className="popup-confirm" onClick={confirmHandle}>{confirmBtn}</button>}
                    </div>
                </div>
            </div>
        )
    }
}

export default Popup;