import React, { Component } from 'react';
import { Button } from 'antd';
import Password from './Password';
import './security.css'

class Security extends Component {
  constructor(props){
    super(props);
    this.state = {
      dialog: '',
    }
  }

  showDialog = () =>{
    this.setState({dialog: <Password />})
  }

  render(){
    const mobile = sessionStorage.getItem('account')? JSON.parse(sessionStorage.getItem('account')).mobile : "";
    return <div className="security_con user-cont">
      <div>
        <span className="title">手机号</span>
        <span>{mobile}</span>
      </div>
      <div className="line">
        <span className="title">密码</span>
        <Button onClick={this.showDialog} type="primary" style={{borderRadius: 4}}>修改密码</Button>
      </div>
      {this.state.dialog}
    </div>
  }
}

export default Security;