import React, { Component } from 'react';
import { Tabs, Input, Select, Button, Table } from 'antd';
import './transaction.css';

const TabPane = Tabs.TabPane;
const Option = Select.Option;

class Transaction extends Component {

  tabChange = () => {

  }

  handleChange = () => {

  }
  render() {

    return <div className="transation_content user-cont">
      <div className="search">
        <Input style={{width: 80, borderRadius: 4}}/>
        <span className="line">/</span>
        <Select defaultValue="BTC" style={{ width: 100 , borderRadius: 4}} onChange={this.handleChange}>
          <Option value="BTC">BTC</Option>
          <Option value="USDT">USDT</Option>
        </Select>
        <Button type="primary" style={{marginLeft: 10, borderRadius: 4}}>搜索</Button>
      </div>
      <Tabs defaultActiveKey="1" onChange={this.tabChange}>
        <TabPane tab="当前委托" key="1">
        
        </TabPane>
        <TabPane tab="委托记录" key="2">
        </TabPane>
        <TabPane tab="成交明细" key="3">
        </TabPane>
    </Tabs>
    </div>
  }
}
export default Transaction;