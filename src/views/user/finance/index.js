import React, { Component } from 'react';
import { Tabs, List, Table } from 'antd';
import request from '../../../utils/request';
import './finance.css';

const TabPane = Tabs.TabPane;

class Finance extends Component {
  constructor(props){
    super(props);
    this.state={
      
    }
  }

  tabChange = () => {
    
  }


  render() {
    let { data } = this.state;
    const rechargeColumns = [
      {
        title: '时间',
        dataIndex: 'volume',
        key: 'volume',
      },
      {
        title: '币种',
        dataIndex: 'volume1',
        key: 'volume1',
      },
      {
        title: '类型',
        dataIndex: 'volume2',
        key: 'volume2',
      },
      {
        title: '数量',
        dataIndex: 'volume11',
        key: 'volume11',
      },
      {
        title: '状态',
        dataIndex: 'volume21',
        key: 'volume21',
      },
      {
        title: '操作',
        dataIndex: 'volume14',
        key: 'volume14',
      }
    ]
    const withdrowColumns = [
      {
        title: '时间',
        dataIndex: 'volume',
        key: 'volume',
      },
      {
        title: '币种',
        dataIndex: 'volume1',
        key: 'volume1',
      },
      {
        title: '类型',
        dataIndex: 'volume2',
        key: 'volume2',
      },
      {
        title: '数量',
        dataIndex: 'volume11',
        key: 'volume11',
      },
      {
        title: '状态',
        dataIndex: 'volume21',
        key: 'volume21',
      },
      {
        title: '操作',
        dataIndex: 'volume14',
        key: 'volume14',
      }
    ]
    const transferColumns = [
      {
        title: '时间',
        dataIndex: 'volume',
        key: 'volume',
      },
      {
        title: '币种',
        dataIndex: 'volume1',
        key: 'volume1',
      },
      {
        title: '类型',
        dataIndex: 'volume2',
        key: 'volume2',
      },
      {
        title: '数量',
        dataIndex: 'volume11',
        key: 'volume11',
      },
      {
        title: '状态',
        dataIndex: 'volume21',
        key: 'volume21',
      },
      {
        title: '操作',
        dataIndex: 'volume14',
        key: 'volume14',
      }
    ]
    return <div className="finance_content user-cont">
      <Tabs defaultActiveKey="1" onChange={this.tabChange}>
        <TabPane tab="充币记录" key="1">
          <Table
              dataSource={[]}
              columns={rechargeColumns}
              pagination={true}
          />
        </TabPane>
        <TabPane tab="提币记录" key="2">
            <Table
              dataSource={[]}
              columns={withdrowColumns}
              pagination={true}
            />
        </TabPane>
        <TabPane tab="划转记录" key="3">
            <Table
              dataSource={[]}
              columns={transferColumns}
              pagination={true}
            />
        </TabPane>
    </Tabs>
    </div>
  }
}
export default Finance;