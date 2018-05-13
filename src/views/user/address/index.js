import React, { Component } from 'react';
import { Input, Select, Button, Table } from 'antd';
import './adress.css';

const Option = Select.Option;

class Address extends Component {

  constructor(props) {
    super(props);
    this.state = {
      currencys: []
    }
  }

  handleChange = () => {

  }
  render(){
    const { currencys } = this.state;
    const routineColumns = [{
      title: '币种',
      dataIndex: 'name',
      key: 'name',
    }, {
        title: '提币地址',
        dataIndex: 'volume',
        key: 'volume',
    }, {
        title: '备注',
        dataIndex: 'lockVolume',
        key: 'lockVolume',
    }, {
        title: '操作',
        dataIndex: '',
        key: 'totalPrice',
    }]
    return <div className="address_manger user-cont">
      <ul >
        <li>
          <h4>币种</h4>
          <Select size="large" style={{ width: 120 }} onChange={this.handleChange}>
            {
              currencys.map((currency)=>{
                return <Option key={currency} value={currency}>{currency}</Option>
              })
            }
          </Select>
        </li>
        <li className="li_item">
          <h4>提币地址</h4>
          <Input size="large" style={{borderRadius: 4}}/>
        </li>
        <li className="li_item">
          <h4>备注</h4>
          <Input size="large" style={{borderRadius: 4}} />
        </li>
      </ul>
      <div className="btn_block">
        <Button type="primary" style={{width:120, height: 40,borderRadius: 4}}>添加</Button>
      </div>
      <Table
        dataSource={currencys}
        columns={routineColumns}
        pagination={false} 
      />
    </div>
  }
}
export default Address;