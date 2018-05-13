import React, { Component } from 'react';
import request from '../../../utils/request';
import { Input, Button, Modal, message } from 'antd';

class Validate extends Component {
  constructor(props){
    super(props);
    this.state = {
      emailCode: '',
      googleCode: '',
      number: 59,
      disabled: false
    }
  }
  codeChange = (e) => {
    this.setState({emailCode: e.target.value});
  }
  handleOk = (id) => {
    const { emailCode, googleCode } = this.state;
    if((/^\d{6}$/).test(googleCode) && googleCode ){
      this.validate({id, emailCode, googleCode, callback: (json)=>{
        if(json.code===10000000){
          let { okClick } = this.props;
          okClick();
        }else{
          message.destroy();
          message.info(json.msg);
        }
      }})
    } else {
      message.destroy();
      message.info("请输入数据",1);
    }
    
  }

  handleCancel = () => {
    this.setState({emailCode: '', googleCode: ''})
    let { cancelClick } = this.props;
    cancelClick();
  }

  googleChange = (e) => {
    if((/^\d{0,6}$/).test(e.target.value)){
      this.setState({googleCode: e.target.value});
    }
  }

  getCodeClick = () => {
    let { getCode } = this.props;
    getCode();

    this.setState({
      disabled: true,
    })
    this.timer = setInterval(()=>{
      let { number }= this.state;
      if(number === 0 ){
        clearInterval(this.timer);
        this.setState({
          number: 59,
          disabled: false
        })
      }else {
        this.setState({number: number-1})
      }
    },1000);
  }


  validate = ({id, emailCode, googleCode, callback}) => {
    request('/coin/volume/withdraw/validate', {
      method: 'POST',
      body: {
        id,
        emailCode,
        googleCode
        }
    }).then(json => {
        callback(json);
    })
  }
  componentWillUnmount(){
    clearInterval(this.timer);
  }

  render() {
    const {emailCode, googleCode, disabled, number} = this.state;
    return <Modal title="提币验证"
        maskClosable={false}
        visible={true}
        cancelText="取消"
        okText="确认"
        onOk={()=> {
          let id = this.props.id;
          this.handleOk(id);
        }}
        onCancel={this.handleCancel}
      >
        <div style={{ display: "flex", justifyContent: 'space-between'}}>
          <Input style={{borderRadius: 4}} value={emailCode} onChange={this.codeChange} size="large" placeholder="请输入验证码"/>
          <Button 
            onClick={this.getCodeClick} 
            disabled = {disabled}
            type="primary"
            style={{width:100, height: 40, marginLeft:20, borderRadius: 4}}> 
              {!disabled? "获取验证码" : number + "s"}
          </Button>
        </div>
        <div style={{marginTop: 20}}>
          <Input style={{borderRadius: 4}} value={googleCode} size="large" onChange={this.googleChange} placeholder="请输入6位谷歌验证码"/>
        </div>
      </Modal>
  }
}
export default Validate;