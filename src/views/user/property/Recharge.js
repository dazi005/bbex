import React, { Component } from 'react';
import { message } from 'antd';
import QRCode from 'qrcode.react';
import copy from 'copy-to-clipboard';
import request from '../../../utils/request';
import './recharge.css';

class Recharge extends Component{
  constructor(props){
    super(props);
    this.state={
      address: '',
      show: false
    }
  }
  componentWillMount(){
    
    let { id, name } = this.props;
    request('/coin/user/address/'+id, {
        method: 'GET',
    }).then(json => {
        if(json.code === 10000000) {
          this.setState({address: json.data});
        }
        
    })
  }
  render(){
    const { address, show } = this.state;
    const { name } = this.props;
    return <div className="recharge_content">
      <div>充币地址</div>
      <ul className="address">
        <li>{address}</li>
        <li className="copy" onClick={()=>{
          copy(address)
          message.destroy()
          message.success('复制成功',1);
        }}>复制</li>
        <li className="ercode">
          <div className="text" onClick={()=>{
            this.setState({show: !show})
          }}>二维码</div>
          { show && <div className="ercon">
            <QRCode
                value={address}
                size={110}
                bgColor={"#ffffff"}
                fgColor={"#000000"}
                level={"L"}
            />
          </div>}
        </li>
      </ul>
      <h4>温馨提示</h4>
      <ul>
        <li>请勿向上述地址充值任何非{name}资产，否则资产将不可找回</li>
        <li>您充值至上述地址后，需要整个网络节点的确认，1次网络确认后到账，6次网络确认后可提币</li>
        <li>最小充值余额：100{name}, 小于最小金额的充值将不会上账</li>
        <li>您的充值地址不会经常改变，可以重复充值，若有更改，我们会尽量通过网站公告或邮件通知你</li>
        <li>请务必确认电脑及浏览器安全，防止信息被篡改或泄漏</li>
      </ul>
    </div>
  }
}
export default Recharge;