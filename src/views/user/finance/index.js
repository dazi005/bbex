import React, { Component } from 'react';
import { Tabs, List } from 'antd';
import './finance.css';

const TabPane = Tabs.TabPane;
class Finance extends Component {
  constructor(props){
    super(props);
    this.state={
      data: [
        {
          time: '2017-08-12',
          currency: 'btc',
          type: '类型',
          number: 23,
          status: "状态",
          opreate: "操作",
          show: true
        },
        {
          time: '2017-08-12',
          currency: 'btc',
          type: '类型',
          number: 23,
          status: "状态",
          opreate: "操作",
          show: false
        },
        {
          time: '2017-08-12',
          currency: 'btc',
          type: '类型',
          number: 23,
          status: "状态",
          opreate: "操作",
          show: true
        },
        {
          time: '2017-08-12',
          currency: 'btc',
          type: '类型',
          number: 23,
          status: "状态",
          opreate: "操作",
          show: false
        }

      ]
    }
  }

  tabChange = () => {
    
  }

  render() {
    let { data } = this.state;
    return <div className="finance_content">
      <Tabs defaultActiveKey="1" onChange={this.tabChange}>
        <TabPane tab="充币记录" key="1">
          <List
            itemLayout="vertical"
            header={<ul className="recharge_record">
              <li>时间</li>
              <li>币种</li>
              <li>类型</li>
              <li>数量</li>
              <li>状态</li>
              <li className="operate">操作</li>
            </ul>}
            bordered
            dataSource={data}
            renderItem={item => (<List.Item className="recharge_item">
              <ul>
                <li>{item.time}</li>
                <li>{item.currency}</li>
                <li>{item.type}</li>
                <li>{item.number}</li>
                <li>{item.status}</li>
                <li className="operate">{item.opreate}</li>
              </ul>
              {item.show && <div>333333</div>}
            </List.Item>)}
          />
        </TabPane>
        <TabPane tab="提币记录" key="2">
          2
        </TabPane>
        <TabPane tab="划转记录" key="3">
          3
        </TabPane>
        <TabPane tab="其他记录" key="4">
          4
        </TabPane>
    </Tabs>
    </div>
  }
}
export default Finance;