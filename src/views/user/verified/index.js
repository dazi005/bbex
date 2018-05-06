import React, { Component } from 'react';
import { Steps, Button, message, Upload, Icon } from 'antd';
import request from '../../../utils/request';
import { IMAGES_ADDRESS } from '../../../utils/constants';

import './verified.css';
import exampleImg from '../../../assets/images/card-template.png';

const Step = Steps.Step;

function getBase64(img, callback) {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
}

class Verified extends Component {
    constructor(props) {
        super(props);
        const { cardStatus } = this.account;
        const currentMap = {
            0: 0,
            9: 0,
            1: 2,
            2: 1,
        }
        this.state = {
            current: currentMap[cardStatus],
            showExampleImage: false,
        };
    }

    account = JSON.parse(sessionStorage.getItem('account'));

    showExample = () => {
        this.setState({ showExampleImage: true });
    }

    hideExample = () => {
        this.setState({ showExampleImage: false });
    }

    handleVerification = () => {
        const {
            frontIdCard,
            backIdCard,
            handheldIdCard,
        } = this.state;

        request('/user/updateUser', {
            body: {
                cardUpId: frontIdCard.response,
                cardDownId: backIdCard.response,
                cardFaceId: handheldIdCard.response,
            }
        }).then(json => {
            if (json.code === 10000000) {
                //设置认证状态
                this.account.cardStatus = 2;
                sessionStorage.setItem('account', JSON.stringify(this.account));

                const current = this.state.current + 1;
                this.setState({ current });
                message.success('证件提交成功!');
            } else {
                message.success(json.msg);
            }
        });
    }

    beforeUpload = (file) => {
        const isLt3M = file.size / 1024 / 1024 < 3;
        if (!isLt3M) {
            message.error('照片必须小于3MB!');
        }
        return isLt3M;
    }

    handleChange = ({ file }, type) => {
        if (file.status === 'uploading') {
            this.setState({ [`${type}Loading`]: true });
            return;
        }
        if (file.status === 'done') {
            getBase64(file.originFileObj, imageUrl => this.setState({
                [`${type}IdCard`]: file,
                [`${type}ImageUrl`]: imageUrl,
                [`${type}Loading`]: false,
            }));
        }
    }

    render() {

        const {
            current,
            showExampleImage,
            frontIdCard,
            backIdCard,
            handheldIdCard,
        } = this.state;

        const canSumbit = frontIdCard && backIdCard && handheldIdCard;

        return (
            <div className="user-cont verified pull-right">
                <Steps current={current}>
                    {['上传证件', '等待审核', '完成认证'].map(text => <Step key={text} title={text} />)}
                </Steps>
                {current === 0 && (
                    <div className="steps-content step1">
                        <h2 className="steps-attention" id="attention">
                            照片要求：大小不超过3M，照片清晰，右手掌心持有效证件，左手持带有认证当天时间及用户ID的字条
                            <Button
                                onFocus={this.showExample}
                                onBlur={this.hideExample}
                            >
                                示例
                            </Button>
                            {showExampleImage && (
                                <div className="example-box">
                                    <img src={exampleImg} alt="" />
                                    <div className="example-text">
                                        <span>标准</span>
                                        <span>边缘缺失</span>
                                        <span>照片模糊</span>
                                        <span>证件不在手心</span>
                                    </div>
                                </div>
                            )}
                        </h2>
                        <div className="steps-photos clear">
                            {['front', 'back', 'handheld'].map(type => {
                                const uploadText = {
                                    'front': '上传身份证正面照',
                                    'back': '上传身份证背面照',
                                    'handheld': '上传手持身份证及字条图',
                                }
                                const uploaded = this.state[`${type}IdCard`];
                                return <Upload
                                    key={type}
                                    action={`${IMAGES_ADDRESS}/card/upload`}
                                    listType="picture-card"
                                    className={`steps-photo-box${uploaded ? '' : ` ${type}`}`}
                                    showUploadList={false}
                                    beforeUpload={this.beforeUpload}
                                    onChange={info => { this.handleChange(info, type) }}
                                >
                                    {this.state[`${type}ImageUrl`] ?
                                        <img src={this.state[`${type}ImageUrl`]} alt="" /> : (
                                            <div>
                                                <Icon type={this.state[`${type}Loading`] ? 'loading' : 'plus'} />
                                                <div className="ant-upload-text">{uploadText[type]}</div>
                                            </div>
                                        )}
                                </Upload>
                            })}
                        </div>
                    </div>
                )}
                {current === 1 && (
                    <div className="steps-content step2">
                        <i className="iconfont icon-tubiaolunkuo-"></i>
                        <h3>您的资料已递交审核，我们会在三个工作日内完成审核</h3>
                        <p>我们承诺保证您的个人隐私安全，请您积极配合，耐心等待审核</p>
                    </div>
                )}
                {current === 2 && (
                    <div className="steps-content step3">
                        <i className="iconfont icon-shimingrenzheng1"></i>
                        <h3>您已完成身份认证</h3>
                        <p>您的真实姓名为：{this.account.realName}</p>
                    </div>
                )}
                <div className="steps-action">
                    {this.state.current === 0 && (
                        <Button
                            type="primary"
                            size="large"
                            onClick={this.handleVerification}
                            disabled={!canSumbit}
                        >
                            提交审核
                    </Button>
                    )}
                </div>
            </div >
        )
    }
}

export default Verified;