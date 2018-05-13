import React, { Component } from 'react';
import { Form, Input, Select, List, Button, message } from 'antd';
import { withRouter } from 'react-router-dom';
import './withdraw.css';
import request from '../../../utils/request';
import Validate from './Validate';
import GraphicPopup from '../../../components/graphic-popup';

const FormItem = Form.Item;
const Option = Select.Option;


class Withdraw extends Component {
  constructor(props){
    super(props);
    this.state = {
      addressHistory: [
        
      ],
      myCoinCount: "",
      address:'',
      fee: 0,
      popup: "",
      vmodal: ''
    }
  }

  closeModal = () =>{
    this.setState({vmodal: ''})
  }

  withdrawClick = () => {
    this.submitWithdraw((json)=>{
      let mail = JSON.parse(sessionStorage.getItem('account')).mail;

      if(json.code === 10000000) {
        let id = json.data;
        this.setState({
          popup: <Validate id={id} cancelClick={()=>{
            this.setState({popup: ''});
          }} okClick={()=>{
            this.setState({popup: ''});
            const { name } = this.props;
            const { myCoinCount, address} = this.state;

            this.props.history.push("/user/status",{name, myCoinCount, address});
          }} getCode={()=>{

            this.setState({
              vmodal: <GraphicPopup
                  mail={mail}
                  type="withdraw"
                  cancelHandle={this.closeModal}
                  confirmHandle={this.closeModal}
              >
              </GraphicPopup>
            })

          }}/>
        })
      }else {
        message.destroy();
        message.info(json.msg);
      }
      
    });
    
  }

  submitWithdraw = (callback) => {
    const { id, name } = this.props;
    let { address, myCoinCount } = this.state;
    request('/coin/volume/withdraw', {
        method: 'POST',
        body: {
          coinId: id,
          symbol: name,
          address: address,
          volume: myCoinCount,
        }
    }).then(json => {
        callback(json);
    })
  }
  
  componentWillMount(){
    
    const { id, name, volume } = this.props;
    request('/coin/withdraw/address/list/'+id, {
        method: 'POST',
    }).then(json => {

    })
  }

  addressOnChange = (value) =>{
    this.setState({address: value})
  }

  countChange = (e) => {
    
    let { withdrawFee, withdrawFeeType } = this.props;
    this.setState({myCoinCount: e.target.value});
    if(withdrawFeeType == 0) {

    } else if(withdrawFeeType == 1){

    } else {

    }
  }

  render(){
    const { id, name, volume, withdrawFee, withdrawFeeType, withdrawMaxVolume } = this.props;
    let { addressHistory, myCoinCount, address, fee } = this.state;

    return <div className="withdraw_content">
      <div className="title">提币地址</div>
      <div>
        <Select style={{width: '100%'}} onChange={this.addressOnChange} size="large" value={address} mode="combobox">
          { addressHistory.map((item)=>{
            return <Option key={item} value={item}>{item}</Option>
          })}
        </Select>
      </div>
      <ul className="count_top">
        <li className="title">数量</li>
        <li className="title">可用限额 {volume}  限额: {withdrawMaxVolume}</li>
      </ul>
      <Input placeholder="请输入数量" onChange={this.countChange} value={myCoinCount} size="large" />
         
      <ul className="my_count">
        <li>
          <div className="title">
           手续费
          </div>
          <div className="money">
            <Input disabled size="large" value="10" />
            <span>{name}</span>
          </div>
        </li>
        <li>
          <div className="title">到账数量</div>
          <div className="number">
            <Input disabled size="large" value="0.00000" />
            <span>{name}</span>
          </div>
        </li>
      </ul>
      <div className="btn_block">
        <List size="small" split={false}>
          <List.Item>
            温馨提示
          </List.Item>
          <List.Item>
            .最小提币数量为：300USDT
          </List.Item>
          <List.Item>
            .为保障资金安全，当您账户安全策略变更，密码修改，使用新地址提币。我们会对你提笔币进行人工审核，请耐心等待工作人员电话或邮件联系。
          </List.Item>
          <List.Item>
            .请务必确认电脑及浏览器安全，防止信息被篡改或泄漏。
          </List.Item>
        </List>
        <div className="btn">
            <Button onClick={this.withdrawClick} type="primary" style={{width: 140,height: 50, borderRadius: 4}}>提币</Button>
        </div>
      </div>

      { this.state.popup }
      { this.state.vmodal }
    </div>
  }
}

export default withRouter(Withdraw);