import React, { Component } from 'react';
import { Tabs, List, Table, Select, message, Button } from 'antd';
import request from '../../../utils/request';
import { stampToDate } from '../../../utils/index';
import './finance.css';

const TabPane = Tabs.TabPane;
const Option = Select.Option;

class Finance extends Component {
  constructor(props){
    super(props);
    this.state={
      symbol: '全部',
      coinList: [],

      currentTab: 'recharge',

      rechargeList: [],
      rechargeTotal: 0,

      withdrawList: [],
      withdrawTotal: 0,

      transferList: [],
      transferTotal: 0,
    }
  }

  componentDidMount(){
    this.getCoinList();
    this.getRechargeList(1,"","");
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
            myData.unshift({id:'', name:"全部"});
            this.setState({ coinList: myData, symbol: '全部' });
        } else {
            message.error(json.msg);
        }
    })
  }

  getRechargeList = (page, coinId, symbol) => {
     let mSymbol = symbol=="全部" ? '' : symbol;
     let mCoinId = symbol=="全部" ? '' : coinId;
    request('/coin/deposit/list', {
        method: 'POST',
        body: {
          coinId: mCoinId,
          symbol: mSymbol,
          currentPage: page,
          showCount: 10,
        }
    }).then(json => {
        if (json.code === 10000000) {
            this.setState({rechargeList: json.data.list, rechargeTotal: json.data.count})
        } else {
            message.error(json.msg);
        }
    })
  }

  getWithdrawList = (page, coinId, symbol) => {
    let mSymbol = symbol=="全部" ? '' : symbol;
    let mCoinId = symbol=="全部" ? '' : coinId;
    request('/coin/withdraw/list ', {
        method: 'POST',
        body: {
          coinId: mCoinId,
          symbol: mSymbol,
          currentPage: page,
          showCount: 10,
        }
    }).then(json => {
        if (json.code === 10000000) {
          this.setState({withdrawList: json.data.list, withdrawTotal: json.data.count})
        } else {
            message.error(json.msg);
        }
    })
  }

  getTransferList = (page, coinId, symbol) => {
    let mSymbol = symbol=="全部" ? '' : symbol;
    let mCoinId = symbol=="全部" ? '' : coinId;
    request('/offline/coin/transfer/list', {
        method: 'POST',
        body: {
          coinId: mCoinId,
          symbol: mSymbol,
          currentPage: page,
          showCount: 10,
        }
    }).then(json => {
        if (json.code === 10000000) {
          this.setState({transferList: json.data.list, transferTotal: json.data.count})
        } else {
            message.error(json.msg);
        }
    })
  }

  tabChange = (value) => {
    this.setState({ symbol:"全部", currentTab: value })
    if(value=="recharge") {
      this.getRechargeList(1,"","");
    }else if(value=="withdraw"){
      this.getWithdrawList(1,"","");
    }else{
      this.getTransferList(1,"","");
    }
  }

  coinSelect = (value) =>{
    const { currentTab, coinList } = this.state;
    const coinId = coinList.filter((item)=>{
      return item.name == value;
    })[0].id;

    this.setState({symbol: value});

    if(currentTab=="recharge") {
      this.getRechargeList(1,coinId,value);
    }else if(currentTab=="withdraw"){
      this.getWithdrawList(1,coinId,value);
    }else{
      this.getTransferList(1,coinId,value);
    }
  }

  rechargePageChange = (page) => {
    const {symbol, coinList} = this.state;
    const coinId = coinList.filter((item)=>{
      return item.name == symbol;
    })[0].id;
    ///coin/deposit/list
    this.getRechargeList(page, coinId, symbol )
  }

  withdrawPageChange = (page)=>{
    const {symbol, coinList} = this.state;
    const coinId = coinList.filter((item)=>{
      return item.name == symbol;
    })[0].id;
    ///coin/deposit/list
    this.getWithdrawList(page, coinId, symbol )
  }

  transferPageChange = (page)=>{
    const {symbol, coinList} = this.state;
    const coinId = coinList.filter((item)=>{
      return item.name == symbol;
    })[0].id;
    ///coin/deposit/list
    this.getTransferList(page, coinId, symbol)
  }

  render() {
    let { data } = this.state;
    const rechargeColumns = [
      {
        title: '时间',
        dataIndex: 'createDate',
        key: 'createDate',
        render: (text)=>{
          return <div>{stampToDate(text*1)}</div>
        }
      },
      {
        title: '币种',
        dataIndex: 'coinSymbol',
        key: 'coinSymbol',
      },
      {
        title: '类型',
        dataIndex: 'type',
        key: 'type',
        render: ()=>{
          return <div>币币交易</div>
        }
      },
      {
        title: '数量',
        dataIndex: 'volume',
        key: 'volume',
      },
      {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        render: (text)=>{
          if(text==0){
            return <div>确认中</div>
          }else if(text==1){
            return <div>已成功</div>
          }else{
            return <div>{text}</div>
          }
        }
      },
      {
        title: '操作',
        dataIndex: 'address',
        key: 'address',
        render: ()=>{
          return <div>操作</div>
        }
      }
    ]
    const withdrowColumns = [
      {
        title: '时间',
        dataIndex: 'createDate',
        key: 'createDate',
        render: (text)=>{
          return <div>{stampToDate(text*1)}</div>
        }
      },
      {
        title: '币种',
        dataIndex: 'coinSymbol',
        key: 'coinSymbol',
      },
      {
        title: '类型',
        dataIndex: 'type',
        key: 'type',
        render: ()=>{
          return <div>币币交易</div>
        }
      },
      {
        title: '数量',
        dataIndex: 'volume',
        key: 'volume',
      },
      {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        render: (text)=>{
          let myNote = ''
          switch(text){
            case 0:
              myNote=<Button type="primary">取消</Button>
            break;
            case 1:
              myNote = "审核通过";
            break;
            case 2:
              myNote = "审核不通过";
            break;
            case 3:
              myNote = "已汇出";
            break;
            case 8:
              myNote = "预处理";
            break;
            case 9:
              myNote = "已取消"
            break;
            default:

          }
          return <div>{myNote}</div>
        }
      },
      {
        title: '操作',
        dataIndex: 'address',
        key: 'address',
        render: ()=>{
          return <div>操作</div>
        }
      }
    ]
    const transferColumns = [
      {
        title: '时间',
        dataIndex: 'createDate',
        key: 'createDate',
        render: (text)=>{
          return <div>{stampToDate(text*1)}</div>
        }
      },
      {
        title: '币种',
        dataIndex: 'coinSymbol',
        key: 'coinSymbol',
      },
      {
        title: '类型',
        dataIndex: 'type',
        key: 'type',
        render: (text)=>{
          if(text==0){
            return <div>转入</div>
          } else {
            return <div>转出</div>
          }
        }
      },
      {
        title: '数量',
        dataIndex: 'volume',
        key: 'volume',
      },
      {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        render: ()=>{
          return <div>成功</div>
        }
      },
      {
        title: '操作',
        dataIndex: 'address',
        key: 'address',
        render: ()=>{
          return <div>操作</div>
        }
      }
    ]

    const {symbol, coinList, currentTab, rechargeList, rechargeTotal, withdrawList, withdrawTotal, transferList, transferTotal} = this.state;
    return <div className="finance_content user-cont">
      <div className="finance_select">
          <Select size="large" style={{ width: 120 }} value={symbol} onChange={this.coinSelect}>
            {
              coinList.map((item)=>{
                return <Option key={item.id} value={item.name}>{item.name}</Option>
              })
            }
          </Select>
      </div>
      <Tabs value={currentTab} onChange={this.tabChange}>
        <TabPane tab="充币记录" key="recharge">
          <Table
              dataSource={rechargeList}
              columns={rechargeColumns}
              pagination={{
                defaultCurrent: 1,
                total: rechargeTotal,
                pageSize: 10,
                onChange: (page)=>{
                  this.rechargePageChange(page);
                }
              }}
          />
        </TabPane>
        <TabPane tab="提币记录" key="withdraw">
            <Table
              dataSource={withdrawList}
              columns={withdrowColumns}
              pagination={{
                defaultCurrent: 1,
                total: withdrawTotal,
                pageSize: 10,
                onChange: (page)=>{
                  this.withdrawPageChange(page);
                }
              }}
            />
        </TabPane>
        <TabPane tab="划转记录" key="transfer">
            <Table
              dataSource={transferList}
              columns={transferColumns}
              pagination={{
                defaultCurrent: 1,
                total: transferTotal,
                pageSize: 10,
                onChange: (page)=>{
                  this.transferPageChange(page);
                }
              }}
            />
        </TabPane>
    </Tabs>
    </div>
  }
}
export default Finance;