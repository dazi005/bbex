import React, { Component } from 'react';
import { Form, Input, Select, List, Button } from 'antd';
import './withdraw.css';
import request from '../../../utils/request';

const FormItem = Form.Item;
const Option = Select.Option;


class Withdraw extends Component {
  constructor(props){
    super(props);
    this.state = {
      addressHistory: [
        "1231323232323",
        "gsdjakhdksdhs"
      ],
      coinNumber: '',
      address:'',
    }
  }

  withdrawClick = () => {
    const { id, name, volume } = this.props;
    request('/coin/volume/withdraw', {
        method: 'POST',
        body: {
          coinId: id,
          symbol: name,
          address: '',
          volume: '',
        }
    }).then(json => {
        console.log(json);
    })
  }
  componentWillMount(){
    
    const { id, name, volume } = this.props;
    request('/coin/withdraw/address/list/'+id, {
        method: 'POST',
    }).then(json => {
        console.log(json);
    })
  }

  render(){
    const { id, name, volume, withdrawFee, withdrawFeeType, withdrawMaxVolume } = this.props;
    const { addressHistory, coinNumber, address } = this.state;
    console.log(addressHistory);
    return <div className="withdraw_content">
      <div className="title">提币地址</div>
      <div>
        <Select style={{width: '100%'}} size="large" value={address} mode="combobox">
          { addressHistory.map((item)=>{
            return <Option key={item} value={item}>{item}</Option>
          })}
        </Select>
      </div>
      <ul className="count_top">
        <li className="title">数量</li>
        <li className="title">可用限额 {volume}  限额: 60000.0000</li>
      </ul>
      <Input placeholder="请输入数量" size="large"/>
         
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
    </div>
  }
}

export default Withdraw;