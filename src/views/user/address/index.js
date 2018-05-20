import React, { Component } from 'react';
import { Input, Select, Button, Table, message} from 'antd';
import request from '../../../utils/request';
import './adress.css';

const Option = Select.Option;

class Address extends Component {

  constructor(props) {
    super(props);
    this.state = {
      currencys: [],
      list: [],
      symbol: '',
      address: '',
      remark: ''
    }
  }

  componentWillMount(){
    this.getCoinList();
    this.getAddress();
  }

  getAddress = () => {
    request('/withdraw/address/list', {
        method: 'GET'
    }).then(json => {
        if (json.code === 10000000) {
          let list = json.data.map((item)=>{
            const { id, coinSymbol, address, tag, type } = item;
            return { id, coinSymbol, address, tag, type }
          })
            this.setState({ list });
        } else {
            message.error(json.msg);
        }
    })
  }

  getCoinList = () => {
    request('/coin/list', {
        method: 'GET'
    }).then(json => {
        if (json.code === 10000000) {
            let myData = json.data.map((item)=>{
              const { id, name } = item;
              return { id, name }
            });
            this.setState({ currencys: json.data, symbol: myData[0].name });
        } else {
            message.error(json.msg);
        }
    })
  }

  handleChange = (value) => {
    this.setState({symbol: value});
  }

  addressChange = (e) => {
    this.setState({address: e.target.value});
  }

  remarkChange = (e) =>{
    this.setState({remark: e.target.value});
  }
  add = (coinId, symbol, address, tag) => {
    request('/withdraw/address/add', {
        body: {
          coinId,
          symbol,
          address,
          tag
        }
    }).then(json => {
        if (json.code === 10000000) {
            message.success("添加成功",1);
            this.getAddress();
        } else {
            message.error(json.msg);
        }
    })
  }
  delete = (id) => {
    request('/withdraw/address/delete/'+id,{
      method: 'GET'
    }).then(json => {
        if (json.code === 10000000) {
            message.success("删除成功",1);
            let list = this.state.list.filter((item)=>{
              return item.id !==id;
            })
            this.setState({list});
        } else {
            message.error(json.msg);
        }
    })

  }
  addClick = () =>{
    let {currencys, address, symbol, remark} = this.state;
    let coinId = "";
    if(currencys.length > 0) {
      coinId = currencys.filter((item)=>{
        return item.name === symbol;
      })[0].id;
    }
    if(address){
      if(remark) {
        this.add(coinId, symbol, address, remark);
      } else{
        message.destroy();
        message.info('请输入备注');
      }
     
    }else{
      message.destroy();
      message.info('请输入地址');
    }
  }


  deleteClick = (record) => {
    this.delete(record.id);
  }

  render(){
    const { currencys, list, symbol, address, remark } = this.state;
    const routineColumns = [{
      title: '币种',
      dataIndex: 'coinSymbol',
      key: 'coinSymbol',
    }, {
        title: '提币地址',
        dataIndex: 'address',
        key: 'address',
    }, {
        title: '备注',
        dataIndex: 'tag',
        key: 'tag',
    }, {
        title: '操作',
        dataIndex: 'type',
        key: 'type',
        render: (text, record)=>{
          return <div className="delete" onClick={()=>{this.deleteClick(record)}}>删除</div>
        }
    }]
    return <div className="address_manger user-cont">
      <ul >
        <li>
          <h4>币种</h4>
          <Select size="large" style={{ width: 120 }} value={symbol} onChange={this.handleChange}>
            {
              currencys.map((item)=>{
                return <Option key={item.id} value={item.name}>{item.name}</Option>
              })
            }
          </Select>
        </li>
        <li className="li_item">
          <h4>提币地址</h4>
          <Input size="large"  value={address} onChange={this.addressChange} style={{borderRadius: 4}}/>
        </li>
        <li className="li_item">
          <h4>备注</h4>
          <Input size="large" value={remark} onChange={this.remarkChange} style={{borderRadius: 4}} />
        </li>
      </ul>
      <div className="btn_block">
        <Button type="primary"  onClick={this.addClick} style={{width:120, height: 40,borderRadius: 4}}>添加</Button>
      </div>
      <Table
        dataSource={list}
        columns={routineColumns}
        pagination={false} 
      />
    </div>
  }
}
export default Address;