const util = require('../../utils/util.js');
const api = require('../../config/api.js');

const app = getApp();

Component({
	properties: {
		productType: {
			type: String,
			value: ''
		},
		productTitle: {
			type: String,
			value: ''
		}
	},
	data: {
		floorGoods: [],
		floorGoodsHeight: 0,
	},
	methods: {},
	ready() {
		let _self = this;
		_self.setData({
			floorGoods: [],
		})
		util.request(api.TodayGoodsList, {
			categoryValue: _self.data.productType
		}, 'GET', 'application/json').then(function(res) {
			if(res.errno === 0) {
				_self.setData({
					floorGoods: _self.data.floorGoods.concat(res.data.list),
				})
				_self.setData({
					floorGoodsHeight: Math.ceil(_self.data.floorGoods.length / 2) * (545 + 　12) - 12
				})
			}
		});
	},
})