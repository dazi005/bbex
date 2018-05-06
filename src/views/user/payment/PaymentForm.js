import React, { Component } from 'react';
import { Form, Input, Button, Upload, Icon, message } from 'antd';
import request from '../../../utils/request';
import { IMAGES_ADDRESS } from '../../../utils/constants';

const FormItem = Form.Item;

function getBase64(img, callback) {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
}

class PaymentForm extends Component {

    state = {
        loading: false,
    };

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                const { type } = this.props;
                const urlpart = type === 'wechat' ? 'wechatpay' : 'alipay';
                const typeText = this.props.type === 'wechat' ? '微信' : '支付宝';
                request(`/offline/${urlpart}/bind`, {
                    body: {
                        realName: values.realName,
                        [`${type}No`]: values[`${type}No`],
                        [`${type}QrcodeId`]: values.qrcode[0].response,
                    }
                }).then(json => {
                    if (json.code === 10000000) {
                        const account = JSON.parse(sessionStorage.getItem('account'));
                        account[`${type}No`] = values[`${type}No`];
                        account[`${type}QrcodeId`] = values.qrcode[0].response;
                        sessionStorage.setItem('account', JSON.stringify(account));
                        message.success(`${typeText}账号绑定成功！`);
                    }
                });
            }
        });
    }

    normFile = (e) => {
        if (Array.isArray(e)) {
            return e;
        }
        return e && e.fileList;
    }

    beforeUpload = (file) => {
        const isLt3M = file.size / 1024 / 1024 < 3;
        if (!isLt3M) {
            message.error('照片必须小于3MB!');
        }
        return isLt3M;
    }

    handleChange = ({ file }) => {
        if (file.status === 'uploading') {
            this.setState({ loading: true });
            return;
        }
        if (file.status === 'done') {
            getBase64(file.originFileObj, imageUrl => this.setState({
                imageUrl,
                qrcode: file,
                loading: false,
            }));
        }
    }

    render() {
        const { type, form } = this.props;
        const { getFieldDecorator } = form;
        const { loading, imageUrl } = this.state;
        const typeText = this.props.type === 'wechat' ? '微信' : '支付宝';
        const account = JSON.parse(sessionStorage.getItem('account'));
        const qrcodeId = account[`${this.props.type}QrcodeId`];
        const qrcodeUrl = imageUrl ? imageUrl : (qrcodeId ? `${IMAGES_ADDRESS}/view/${qrcodeId}` : '');

        let submitBtnText = '确认绑定';
        if ((type === 'wechat' && account.wechatNo) || (type === 'alipay' && account.alipayNo)) {
            submitBtnText = '确认修改';
        }

        const formItemLayout = {
            labelCol: {
                xs: { span: 10 },
                sm: { span: 6 },
            },
            wrapperCol: {
                xs: { span: 10 },
                sm: { span: 10 },
            },
        };

        const tailFormItemLayout = {
            wrapperCol: {
                xs: {
                    span: 10,
                    offset: 6,
                },
                sm: {
                    span: 10,
                    offset: 6,
                },
            },
        };

        return (
            <Form onSubmit={this.handleSubmit}>
                <FormItem
                    {...formItemLayout}
                    label="姓名"
                >
                    {getFieldDecorator('realName', {
                        rules: [{ required: true, message: '请输入姓名!', whitespace: true }],
                        initialValue: account.realName,
                    })(
                        <Input size="large" placeholder="请输入姓名!" />
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label={`${typeText}账号`}
                >
                    {getFieldDecorator(`${type}No`, {
                        rules: [{ required: true, message: `请输入${typeText}账号!` }],
                        initialValue: account[`${type}No`],
                    })(
                        <Input size="large" placeholder={`请输入${typeText}账号!`} />
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="收款二维码"
                >
                    <div className="dropbox">
                        {getFieldDecorator('qrcode', {
                            valuePropName: 'file',
                            getValueFromEvent: this.normFile,
                            rules: [{ required: true, message: '请上传收款二维码!' }],
                        })(
                            <Upload
                                key={type}
                                action={`${IMAGES_ADDRESS}/upload`}
                                listType="picture-card"
                                showUploadList={false}
                                beforeUpload={this.beforeUpload}
                                onChange={this.handleChange}
                            >
                                {qrcodeUrl ?
                                    <img src={qrcodeUrl} alt="" /> : (
                                        <div>
                                            <Icon type={loading ? 'loading' : 'plus'} />
                                            <div className="ant-upload-text">{`上传${typeText}二维码`}</div>
                                        </div>
                                    )}
                            </Upload>
                        )}
                    </div>
                </FormItem>
                <FormItem {...tailFormItemLayout}>
                    <Button type="primary" size="large" htmlType="submit">{submitBtnText}</Button>
                </FormItem>
            </Form>
        )
    }
}

export default Form.create()(PaymentForm);