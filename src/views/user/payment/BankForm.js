import React, { Component } from 'react';
import { Form, Input, Select, Button, message } from 'antd';
import request from '../../../utils/request';

const FormItem = Form.Item;
const Option = Select.Option;

class BankForm extends Component {
    state = {
        confirmDirty: false,
    };

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                const { bankInfo, setBankInfo } = this.props;
                const {
                    realName,
                    mobile,
                    bankName,
                    branchBankName,
                    cardNo,
                } = values;

                let body = {
                    realName,
                    mobile,
                    bankName,
                    branchBankName,
                    cardNo,
                }

                if(bankInfo) {
                    body.id = bankInfo.id;
                }

                request(`/offline/bank/bind`, { body }).then(json => {
                    if (json.code === 10000000) {
                        setBankInfo(body);
                        message.success(`银行卡绑定成功！`);
                    }else {
                        message.success(json.msg);
                    }
                });
            }
        });
    }

    handleConfirmBlur = (e) => {
        const value = e.target.value;
        this.setState({ confirmDirty: this.state.confirmDirty || !!value });
    }

    compareToFirstCardNo = (rule, value, callback) => {
        const form = this.props.form;
        if (value && value !== form.getFieldValue('cardNo')) {
            callback('您输入的两个银行卡号不一致!');
        } else {
            callback();
        }
    }

    validateToNextCardNo = (rule, value, callback) => {
        const form = this.props.form;
        if (value && this.state.confirmDirty) {
            form.validateFields(['confirm'], { force: true });
        }
        callback();
    }

    render() {
        const { bankInfo, form } = this.props;
        const { getFieldDecorator } = form;

        const submitBtnText = bankInfo ? '确认修改' : '确认绑定';

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

        let bankOption = {
            rules: [{ required: true, message: '请选择开户银行!' }]
        }
        if(bankInfo) {
            bankOption.initialValue = bankInfo.bankName;
        }

        const bankList = ['工商银行', '交通银行', '建设银行', '农业银行', '中国银行', '招商银行'];

        return (
            <Form onSubmit={this.handleSubmit}>
                <FormItem
                    {...formItemLayout}
                    label="姓名"
                >
                    {getFieldDecorator('realName', {
                        rules: [{ required: true, message: '请输入姓名!', whitespace: true }],
                        initialValue: bankInfo && bankInfo.realName,
                    })(
                        <Input size="large" placeholder="请输入姓名!" />
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="手机号码"
                >
                    {getFieldDecorator('mobile', {
                        rules: [{ required: true, message: '请输入手机号码!' }],
                        initialValue: bankInfo && bankInfo.mobile,
                    })(
                        <Input size="large" placeholder="请输入手机号码!" />
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="开户银行"
                    hasFeedback
                >
                    {getFieldDecorator('bankName', bankOption)(
                        <Select size="large" placeholder="请选择开户银行">
                            {bankList.map(bank => {
                                return <Option key={bank} value={bank}>{bank}</Option>
                            })}
                        </Select>
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="开户支行"
                >
                    {getFieldDecorator('branchBankName', {
                        rules: [{ required: true, message: '请输入开户支行!', whitespace: true }],
                        initialValue: bankInfo && bankInfo.branchBankName,
                    })(
                        <Input size="large" placeholder="请输入开户支行!" />
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="银行卡号"
                >
                    {getFieldDecorator('cardNo', {
                        rules: [{ 
                            required: true, message: '请输入银行卡号!', whitespace: true 
                        }, {
                            validator: this.compareToNextCardNo,
                        }],
                        initialValue: bankInfo && bankInfo.cardNo,
                    })(
                        <Input size="large" placeholder="请输入银行卡号!" />
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="确认卡号"
                >
                    {getFieldDecorator('confirm', {
                        rules: [{
                            required: true, message: '请确认银行卡号!',
                        }, {
                            validator: this.compareToFirstCardNo,
                        }],
                        initialValue: bankInfo && bankInfo.cardNo,
                    })(
                        <Input size="large" onBlur={this.handleConfirmBlur} placeholder="请确认银行卡号!" />
                    )}
                </FormItem>
                <FormItem {...tailFormItemLayout}>
                    <Button type="primary" size="large" htmlType="submit">{submitBtnText}</Button>
                </FormItem>
            </Form>
        )
    }
}

export default Form.create()(BankForm);