import React, { Component } from 'react';
import Chart from 'react-google-charts';

const ItemName = props => {
	if (props.item.item_name) {
		if (props.item.max_rank && props.item.max_rank > -1) {
			var buttonVal = 'Rank ' + props.item.rank
			return (
				<div className="rankLabel">
					<h1>{props.item.item_name}</h1>
					<input type="button" className="rankButton" value={buttonVal} onClick={props.changeRank} />
				</div>
			)
		} else {
			return (
				<h1>{props.item.item_name}</h1>
			)
		}
	} else {
		return (<h5>Select an item.</h5>)
	}
}

const AvgPrice = props => {
	if (props.stats.length > 0 && props.item) {
		if (props.item.max_rank && props.item.max_rank > -1 && props.item.rank > 0) {
			return (
				<div className="averagePrice"><h3>Average Price: </h3><h1 className="price">{props.stats[props.stats.length-2].avg_price}</h1></div>
			)
		} else {
			return (
				<div className="averagePrice"><h3>Average Price: </h3><h1 className="price">{props.stats[props.stats.length-1].avg_price}</h1></div>
			)
		}
	} else {
		return(<p>Loading stats...</p>)
	}
}

const OrderPrice = props => {
	if (props.orders.length > 0 && props.item) {
		var buy_prices, buy_max, sell_prices, sell_min
		if (props.item.max_rank && props.item.max_rank > -1) {
			buy_prices = props.orders
								.filter(order => (order.user.status === "ingame" && order.order_type === "buy" && order.mod_rank === props.item.rank))
								.map(order => order.platinum)
			buy_max =  Math.max.apply(Math, buy_prices)
			if (!isFinite(buy_max)) {
				buy_max = '-'
			}
			
			sell_prices = props.orders
								.filter(order => (order.user.status === "ingame" && order.order_type === "sell" && order.mod_rank === props.item.rank))
								.map(order => order.platinum)
			sell_min =  Math.min.apply(Math, sell_prices)
			if (!isFinite(sell_min)) {
				sell_min = '-'
			}
		} else {
			buy_prices = props.orders
								.filter(order => (order.user.status === "ingame" && order.order_type === "buy"))
								.map(order => order.platinum)
			buy_max =  Math.max.apply(Math, buy_prices)
			if (!isFinite(buy_max)) {
				buy_max = '-'
			}
			
			sell_prices = props.orders
								.filter(order => (order.user.status === "ingame" && order.order_type === "sell"))
								.map(order => order.platinum)
			sell_min =  Math.min.apply(Math, sell_prices)
			if (!isFinite(sell_min)) {
				sell_min = '-'
			}
		}
		
		return(
			<div className="prices">
				<div className="orderPrice"><h3>Max offer: </h3><h1 className="price">{buy_max}</h1></div>
				<div className="orderPrice"><h3>Min asked: </h3><h1 className="price">{sell_min}</h1></div>
			</div>
		)
	} else {
		return(<p>Loading orders...</p>)
	}
}

const StatChart = props => {
	if (props.stats.length > 0 && props.item) {
		var data
		if (props.item.max_rank && props.item.max_rank > -1) {
			data = props.stats
								.filter(stat => (stat.mod_rank === props.item.rank))
								.map(stat => [new Date(stat.datetime), stat.avg_price])
		} else {
			data = props.stats.map(stat => [new Date(stat.datetime), stat.avg_price])
		}
		
		data.unshift([
			{ type: 'datetime', label: 'time' },
			{ type: 'number', label: 'price' }
		])
		var options = {
			backgroundColor: '#3b3b3b',
			colors: ['#94bdff'],
			intervals: { style: 'sticks' },
			hAxis:{textStyle:{color:'white'}},
			vAxis:{textStyle:{color:'white'}},
			legend:{textStyle:{color:'white'}}
		}
		return(
			<Chart
				width="100%"
				height="30%"
				chartType="LineChart"
				loader={<div>Loading Chart</div>}
				data={data}
				options={options}
			/>
		)
	} else {
		return(<p>Loading stats...</p>)
	}
}

class PriceInfo extends Component {
	render() {
		const {item, stats, orders, changeRank} = this.props
		if (item.item_name !== undefined) {
			return(
				<div className="stats" >
					<ItemName item={item} changeRank={changeRank}/>
					<table>
					<tbody>
							<tr>
								<td><AvgPrice stats={stats} item={item} /></td>
								<td><OrderPrice orders={orders} item={item} /></td>
								<td><input className="marketButton" type="button" value="Check the market" onClick={()=> window.open("https://warframe.market/items/" + item.url_name, "_blank")} /></td>
							</tr>
						</tbody>
					</table>
					<StatChart stats={stats} item={item} />
				</div>
			)
		} else {
			return (null)
		}
	}
}

export default PriceInfo;