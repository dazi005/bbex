import React, { Component } from 'react';
import { Tabs, Input, Select, Button, Table, message } from 'antd';
import request from '../../../utils/request';
import { stampToDate } from '../../../utils/index';
import './transaction.css';

const TabPane = Tabs.TabPane;
const Option = Select.Option;

class Transaction extends Component {

  constructor(props){
    super(props);
    this.state = {
      
      currentTab: 'current',
      currency: '',
      coin: 'USDT',
      coinList: [{name: "USDT"},{name: "CNC"},{name: "ETH"},{name: "BTC"}],

      currentList: [],
      currentTotal: 0,
      expendRecordKey:'',

      recordList: [],
      recordTotal:0,
      recordAllDetail: [],

      detailList: [],
      detailTotal: 0,
    }
  }

  componentDidMount(){
    let {coin} = this.state;
    this.getCurrentTrade(1,"", coin);
  }

  tabChange = (value) => {
    if(value=="current"){
      this.getCurrentTrade(1,"", "USDT");

    } else if(value=="record"){
      this.setState({expendRecordKey: ''});
      this.getRecordTrade(1,"", "USDT");

    } else{
      this.getTradeDetail(1, "","USDT");
    }
    this.setState({ currentTab: value, currency: '', coin: "USDT"});
  }

  getCurrentTrade = (page, coinOther, coinMain ) =>{
    request('/coin/userTradeOrder', {
        method: 'POST',
        body: {
          coinMain,
          coinOther,
          status: 0,
          currentPage: page,
          showCount: 10
        }
    }).then(json => {
        if (json.code === 10000000) {
          let currentList = json.data.list.map((item)=>{
            item.key = item.id;
            return item;
          })
           this.setState({currentList, currentTotal: json.data.count})
        } else {
            message.error(json.msg);
        }
    })
  }

  getRecordTrade = (page, coinOther, coinMain ) =>{
    request('/coin/userTradeOrder', {
        method: 'POST',
        body: {
          coinMain,
          coinOther,
          status: 1,
          currentPage: page,
          showCount: 10
        }
    }).then(json => {
        if (json.code === 10000000) {
          let recordList = json.data.list.map((item)=>{
            item.key = item.id;
            return item;
          })
           this.setState({recordList, recordTotal: json.data.count})
        } else {
            message.error(json.msg);
        }
    })
  }


  detailPageChange = (page) =>{
    let {currency, coin} = this.state;
    this.getTradeDetail(page,currency, coin);
  }
  currentPageChange = (page) =>{
    let {currency, coin} = this.state;
    this.getCurrentTrade(page,currency, coin);
  }
  recordPageChange = (page)=>{
    let {currency, coin} = this.state;
    this.getRecordTrade(page,currency, coin);
  }

  getTradeDetail = (page, coinOther, coinMain) =>{
    request('/coin/userTradeOrderDetail', {
      method: 'POST',
      body: {
        coinMain,
        coinOther,
        status: 1,
        currentPage: page,
        showCount: 10
      }
    }).then(json => {
        if (json.code === 10000000) {
          let detailList = json.data.list.map((item)=>{
            item.key = item.id;
            return item;
          })
          this.setState({ detailList, detailTotal: json.data.count})
        } else {
            message.error(json.msg);
        }
    })
  }

  currencyChange = (e) =>{
    this.setState({currency: e.target.value});
  }

  coinSelectChange = (value) => {
    let { currentTab, currency } = this.state;
    this.setState({coin: value});
    if(currentTab=="current"){
      this.getCurrentTrade(1,currency,value)
    } else if(currentTab=="record"){
      this.setState({expendRecordKey: ''});
      this.getRecordTrade(1,currency,value)
    }else{
      this.getTradeDetail(1,currency,value);
    }
  }

  searchClick = () =>{
    let { currentTab, currency, coin } = this.state;
    if(currentTab=="current"){
      this.getCurrentTrade(1,currency,coin)
    } else if(currentTab=="record"){
      this.setState({expendRecordKey: ''});
      this.getRecordTrade(1,currency,coin)
    }else{
      this.getTradeDetail(1,currency,coin);
    }
  }

  detailClick = (record) => {
    this.setState({expendRecordKey: record.id});
    this.getDetailList(record.id);
  }

  getDetailList = (id)=>{
    request(`/coin/tradeOrderDetail/${id}`, {
      method: 'GET',
    }).then(json => {
        if (json.code === 10000000) {
          this.setState({recordAllDetail: json.data.list})
        } else {
            message.error(json.msg);
        }
    })
  }


  render() {

    const currentColumns = [
      {
        title: '时间',
        dataIndex: 'createDate',
        key: 'createDate',
        render: (text)=>{
          return <div>{stampToDate(text*1)}</div>
        }
      },
      {
        title: '交易类型',
        dataIndex: 'exType1',
        key: 'exType1',
        render: ()=>{
          return <div>币币交易</div>
        }
      }, 
      {
        title: '交易对',
        dataIndex: 'coinMain',
        key: 'coinMain',
        render: (text, record)=>{
          return <div>{record.coinOther}/{record.coinMain}</div>
        }
      }, 
      {
        title: '方向',
        dataIndex: 'exType',
        key: 'exType',
      }, 
      {
        title: '价格',
        dataIndex: 'price',
        key: 'price',
        render: (text)=>{
          return <div>{(text*1).toFixed(2)}</div>
        }
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
        render: (text, record)=>{
          return <div>{(record.price*record.askVolume).toFixed(4)}</div>
        }
      }, 
      {
        title: '已成交',
        dataIndex: 'successVolume',
        key: 'successVolume',
      }, 
      {
        title: '未成交',
        dataIndex: 'not',
        key: 'not',
        render: (text, record)=>{
          return <div>{(record.askVolume-record.successVolume).toFixed(4)}</div>
        }
      }, 
      {
        title: '操作',
        dataIndex: 'toCoinVolume',
        key: 'toCoinVolume',
        render: ()=>{
          return <Button type="primary" style={{borderRadius: 4}}>撤单</Button>
        }
      }, 
    ]
    const recordColumns = [
      {
        title: '时间',
        dataIndex: 'createDate',
        key: 'createDate',
        render: (text)=>{
          return <div>{stampToDate(text*1)}</div>
        }
      },
      {
        title: '交易类型',
        dataIndex: 'exType1',
        key: 'exType1',
        render: ()=>{
          return <div>币币交易</div>
        }
      }, 
      {
        title: '交易对',
        dataIndex: 'coinMain',
        key: 'coinMain',
        render: (text, record)=>{
          return <div>{record.coinOther}/{record.coinMain}</div>
        }
      }, 
      {
        title: '方向',
        dataIndex: 'exType',
        key: 'exType',
      }, 
      {
        title: '价格',
        dataIndex: 'price',
        key: 'price',
        render: (text)=>{
          return <div>{(text*1).toFixed(2)}</div>
        }
      }, 
      {
        title: '委托量',
        dataIndex: 'askVolume',
        key: 'askVolume',
      }, 
      {
        title: '已成交',
        dataIndex: 'successVolume',
        key: 'successVolume',
      }, 
      {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        render: (text)=>{
          switch(text){
            case 0:
              return <div>未成交</div>
              break;
            case 1:
              return <div>部分成交</div>
              break;
            case 2:
              return <div>全部成交</div>
              break;
            case 3:
              return <div>部分取消</div>
              break;
            case 4:
              return <div>全部取消</div>
              break;
            default: 
            return <div>--</div>
          }
        }
      }, 
      {
        title: '操作',
        dataIndex: 'lockVolume0',
        key: 'lockVolume0',
        render: (text, record)=>{
          return <div onClick={()=>{this.detailClick(record)}} style={{cursor: 'pointer', color:"#d4a668"}}>详情</div>
        }
      }, 
    ]
    const detailColumns = [
      {
        title: '时间',
        dataIndex: 'createDate',
        key: 'createDate',
        render: (text)=>{
          return <div>{stampToDate(text*1)}</div>
        }
      },
      {
        title: '交易类型',
        dataIndex: 'exType1',
        key: 'exType1',
        render: ()=>{
          return <div>币币交易</div>
        }
      }, 
      {
        title: '交易对',
        dataIndex: 'coinMain',
        key: 'coinMain',
        render: (text, record)=>{
          return <div>{record.coinOther}/{record.coinMain}</div>
        }
      }, 
      {
        title: '方向',
        dataIndex: 'exType',
        key: 'exType',
      }, 
      {
        title: '价格',
        dataIndex: 'price',
        key: 'price',
        render: (text)=>{
          return <div>{(text*1).toFixed(2)}</div>
        }
      }, 
      {
        title: '数量',
        dataIndex: 'successVolume',
        key: 'successVolume',
      }, 
      {
        title: '成交量额',
        dataIndex: 'toCoinVolume',
        key: 'toCoinVolume',
        render: (text, record)=>{
          return <div>{(record.price*record.successVolume).toFixed(4)}</div>
        }
      }, 
      {
        title: '手续费',
        dataIndex: 'exFee',
        key: 'exFee',
      }, 
    ]
    const { currency, expendRecordKey,currentTotal,recordTotal, currentList,recordList, detailList, detailTotal, coinList, coin } = this.state
    return <div className="transation_content user-cont">
      <div className="search">
        <Input value={currency} onChange={this.currencyChange} placeholder='币种' style={{width: 80, borderRadius: 4}}/>
        <span className="line">/</span>
        <Select value={coin} style={{ width: 100 , borderRadius: 4}} onChange={this.coinSelectChange}>
          {coinList.map((item)=>{
            return  <Option key={item.name} value={item.name}>{item.name}</Option>
          })}
        </Select>
        <Button type="primary" onClick={this.searchClick} style={{marginLeft: 10, borderRadius: 4}}>搜索</Button>
      </div>
      <Tabs defaultActiveKey="current" onChange={this.tabChange}>
        <TabPane tab="当前委托" key="current">
          <Table
              dataSource={currentList}
              columns={currentColumns}
              pagination={{
                defaultCurrent: 1,
                total: currentTotal,
                pageSize: 10,
                onChange: (page)=>{
                  this.currentPageChange(page);
                }
              }}
          />
        </TabPane>
        <TabPane tab="委托记录" key="record">
            <Table
              dataSource={recordList}
              columns={recordColumns}
              pagination={{
                defaultCurrent: 1,
                total: recordTotal,
                pageSize: 10,
                onChange: (page)=>{
                  this.recordPageChange(page);
                }
              }}
              expandedRowRender={(record)=>{ 
                return <p>1111</p>
              }}
              expandedRowKeys={[expendRecordKey]}
            />
        </TabPane>
        <TabPane tab="成交明细" key="detail">
            <Table
              dataSource={detailList}
              columns={detailColumns}
              pagination={{
                defaultCurrent: 1,
                total: detailTotal,
                pageSize: 10,
                onChange: (page)=>{
                  this.detailPageChange(page);
                }
              }}
            />
        </TabPane>
    </Tabs>
    </div>
  }
}
export default Transaction;