import React, { Component } from 'react';
import { Modal, Form, Input, Button, message } from 'antd';
import request from '../../../utils/request';
// import { JSEncrypt } from '../../../utils/jsencrypt.js'

const FormItem = Form.Item;

class Password extends Component {

  componentDidMount(){
    
  }

  handleSubmit = (e) =>{
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const {password, oldPassword} = values;
        // this.changePassword(oldPassword, password);
      }
    });
  }

  changePassword = (oldPassword, password) =>{
    request('/user/updatePassword', {
      method: 'POST',
      body: {
        password,
        oldPassword,
      }
  }).then(json => {
      if (json.code === 10000000) {
          console.log(json);
      } else {
        message.error(json.msg);
      }
  })
  }

  render(){
    const { getFieldDecorator } = this.props.form;
    return <Modal 
        title="修改密码"
        visible
        wrapClassName="change_pwd_modal"
        footer={null}
      >
      <Form onSubmit={this.handleSubmit} className="change_password">
        <FormItem>
          {getFieldDecorator('oldPassword', {
            rules: [{ required: true, message: '请输入原密码' }],
          })(
            <Input placeholder="请输入原密码" />
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('password', {
            rules: [{ required: true, message: '请输入新密码' }],
          })(
            <Input placeholder="请输入新密码" />
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('conPassword', {
            rules: [{ required: true, message: '确认密码' }],
          })(
            <Input placeholder="请再次输入密码" />
          )}
        </FormItem>
          
          <Button type="primary" htmlType="submit" onClick={this.handleSubmit}>
              确认
          </Button>
      </Form>
    </Modal>
  }
}

export default Form.create()(Password);