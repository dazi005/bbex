import React, { Component } from 'react';
import { Tabs, Input, Select, Button, Table, message } from 'antd';
import request from '../../../utils/request';
import './transaction.css';

const TabPane = Tabs.TabPane;
const Option = Select.Option;

class Transaction extends Component {

  constructor(props){
    super(props);
    this.state = {
      currency: '',
      expendRecordKey:'',

      currentTab: '',
      coin: '',
      coinList: [],

      currentList: [],
      recordList: [],
      detailList: [],
    }
  }

  componentDidMount(){

    this.getCoinList();
    this.getCurrentTrade();

  }

  tabChange = () => {

  }

  handleChange = (value) => {
    this.setState({coin: value});
  }

  getCoinList = () => {
    request('/coin/list', {
        method: 'GET'
    }).then(json => {
        if (json.code === 10000000) {
            let myData = json.data.map((item)=>{
              const { name } = item;
              return { name }
            });
            this.setState({ coinList: myData ,coin: myData[0].name});
        } else {
            message.error(json.msg);
        }
    })
  }

  getCurrentTrade = () =>{
    request('/coin/userTradeOrder', {
        method: 'POST',
        body: {
          coinMain: 'USDT',
          coinOther: 'HT',
          status: 0,
          currentPage: 1,
          showCount: 10
        }
    }).then(json => {
        if (json.code === 10000000) {
           
        } else {
            message.error(json.msg);
        }
    })
  }

  getRecordDetail = (id) =>{
    request(`/coin/tradeOrderDetail/${id}`, {
      method: 'GET',
    }).then(json => {
        if (json.code === 10000000) {
          
        } else {
            message.error(json.msg);
        }
    })
  }

  getTradeDetail = () =>{
    request('/coin/userTradeOrderDetail', {
      method: 'POST',
      body: {

      }
    }).then(json => {
        if (json.code === 10000000) {
          
        } else {
            message.error(json.msg);
        }
    })
  }


  currencyChange = (e) =>{
    this.setState({currency: e.target.value});
  }

  render() {

    const currentColumns = [
      {
        title: '时间',
        dataIndex: 'createDate',
        key: 'createDate',
      },
      {
        title: '交易类型',
        dataIndex: 'exType',
        key: 'exType',
      }, 
      {
        title: '交易对',
        dataIndex: 'coinMain',
        key: 'coinMain',
      }, 
      {
        title: '方向',
        dataIndex: 'direction',
        key: 'direction',
      }, 
      {
        title: '价格',
        dataIndex: 'price',
        key: 'price',
      }, 
      {
        title: '数量',
        dataIndex: 'askVolume',
        key: 'askVolume',
      }, 
      {
        title: '委托总额',
        dataIndex: 'all',
        key: 'all',
      }, 
      {
        title: '已成交',
        dataIndex: 'has',
        key: 'has',
      }, 
      {
        title: '未成交',
        dataIndex: 'not',
        key: 'not',
      }, 
      {
        title: '操作',
        dataIndex: 'toCoinVolume',
        key: 'toCoinVolume',
      }, 
    ]
    const recordColumns = [
      {
        title: '时间',
        dataIndex: 'volume',
        key: 'volume',
      },
      {
        title: '交易类型',
        dataIndex: 'lockVolume4',
        key: 'lockVolume4',
      }, 
      {
        title: '交易对',
        dataIndex: 'lockVolume44',
        key: 'lockVolume44',
      }, 
      {
        title: '方向',
        dataIndex: 'lockVolume444',
        key: 'lockVolume444',
      }, 
      {
        title: '价格',
        dataIndex: 'lockVolume5',
        key: 'lockVolume5',
      }, 
      {
        title: '委托量',
        dataIndex: 'lockVolume6',
        key: 'lockVolume6',
      }, 
      {
        title: '已成交',
        dataIndex: 'lockVolume7',
        key: 'lockVolume7',
      }, 
      {
        title: '成交均价',
        dataIndex: 'lockVolume8',
        key: 'lockVolume8',
      }, 
      {
        title: '状态',
        dataIndex: 'lockVolume9',
        key: 'lockVolume9',
      }, 
      {
        title: '操作',
        dataIndex: 'lockVolume0',
        key: 'lockVolume0',
      }, 
    ]
    const detailColumns = [
      {
        title: '时间',
        dataIndex: 'volume',
        key: 'volume',
      },
      {
        title: '交易类型',
        dataIndex: 'lockVolume1',
        key: 'lockVolume1',
      }, 
      {
        title: '交易对',
        dataIndex: 'lockVolume2',
        key: 'lockVolume2',
      }, 
      {
        title: '方向',
        dataIndex: 'lockVolume3',
        key: 'lockVolume3',
      }, 
      {
        title: '价格',
        dataIndex: 'lockVolume4',
        key: 'lockVolume4',
      }, 
      {
        title: '数量',
        dataIndex: 'lockVolume5',
        key: 'lockVolume5',
      }, 
      {
        title: '成交量',
        dataIndex: 'lockVolume6',
        key: 'lockVolume6',
      }, 
      {
        title: '手续费',
        dataIndex: 'lockVolume7',
        key: 'lockVolume7',
      }, 
    ]
    const { currency, expendRecordKey, coinList, coin } = this.state

    return <div className="transation_content user-cont">
      <div className="search">
        <Input value={currency} onChange={this.currencyChange} placeholder='币种' style={{width: 80, borderRadius: 4}}/>
        <span className="line">/</span>
        <Select value={coin} style={{ width: 100 , borderRadius: 4}} onChange={this.handleChange}>
          {coinList.map((item)=>{
            return  <Option key={item.name} value={item.name}>{item.name}</Option>
          })}
        </Select>
        <Button type="primary" style={{marginLeft: 10, borderRadius: 4}}>搜索</Button>
      </div>
      <Tabs defaultActiveKey="current" onChange={this.tabChange}>
        <TabPane tab="当前委托" key="current">
          <Table
              dataSource={[]}
              columns={currentColumns}
              pagination={true}
          />
        </TabPane>
        <TabPane tab="委托记录" key="record">
            <Table
              dataSource={[]}
              columns={recordColumns}
              pagination={true}
              expandedRowRender={(record)=>{ 
                return <p>1111</p>
              }}
              expandedRowKeys={[expendRecordKey]}
            />
        </TabPane>
        <TabPane tab="成交明细" key="detail">
            <Table
              dataSource={[]}
              columns={detailColumns}
              pagination={true}
            />
        </TabPane>
    </Tabs>
    </div>
  }
}
export default Transaction;