import React, { Component } from 'react';
import { Steps } from 'antd';
import './status.css';

const Step = Steps.Step;

class Status extends Component{
  constructor(props){
    super(props);
    console.log(this.props.location.state);
  }
  render(){
    const { name, address, myCoinCount } = this.props.location.state;
    return <div className="order_status user-cont">
      <h4>提币订单已提交，请耐心等待</h4>
      <div className="step_block">
          <Steps current={2}>
            <Step title="提交" status="process" />
            <Step title="审核" status="wait" />
            <Step title="处理" status="wait" />
            <Step title="完成" status="wait" />
          </Steps>
      </div>
      <ul className="order_content">
        <li>
          <div className="title">币种：</div>
          <div>{name}</div>
        </li>
        <li>
          <div className="title">提币地址：</div>
          <div>{address}</div>
        </li>
        <li>
          <div className="title">到账数量：</div>
          <div>{myCoinCount}</div>
        </li>
        <li>
          <div className="title">申请时间：</div>
          <div>ewewewe</div>
        </li>
      </ul>
    </div>
  }
}

export default Status;