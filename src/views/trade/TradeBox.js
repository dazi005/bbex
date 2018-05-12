import React, { Component } from 'react';
import { Link } from "react-router-dom";
import TradeForm from './TradeForm';

class TradeBox extends Component {

    render() {
        const {
            tradeType,
            marketName,
            coinName,
        } = this.props;

        return (
            <div className="trade-box">
                {false && <div className="property-info">
                    <span>
                        {marketName} 可用 0.00000000
                        <Link className="recharge-link" to="#">充币</Link>
                    </span>
                    <span>
                        {coinName} 可用 0.00000000
                        <Link className="recharge-link" to="#">充币</Link>
                    </span>
                </div>}
                <div className="trade-form">
                    <TradeForm 
                        type="buy"
                        tradeType={tradeType}
                        marketName={marketName}
                        coinName={coinName}
                    />
                    <TradeForm 
                        type="sell"
                        tradeType={tradeType}
                        marketName={marketName}
                        coinName={coinName}
                    />
                </div>
            </div>
        )
    }
}

export default TradeBox;