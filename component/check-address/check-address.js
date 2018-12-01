// component/show-empty-data/show-empty-data.js

var util = require('../../utils/util.js');
var api = require('../../config/api.js');

Component({
	/**
	 * 组件的属性列表
	 */
	properties: {
		orderId: {
			type: String,
			value: ''
		},
		shippingName: {
			type: String,
			value: ''
		},
		shippingNo: {
			type: String,
			value: ''
		},
	},

	/**
	 * 组件的初始数据
	 */
	data: {
		isMask: false,
		addressData: [],
	},

	/**
	 * 组件的方法列表
	 */
	methods: {

		/**
		 * 团转到首页
		 */
		gotoHome: function(event) {
			wx.reLaunch({
				url: '../index/index'
			})
		},
		hideModal() {
			this.triggerEvent('closeAddressModal', {})
		},

		getAddressList() {
			var _self = this;
			util.request(api.AddressList, {}, 'POST', 'application/x-www-form-urlencoded').then(function(res) {
				if(res.errno === 0) {
					_self.setData({
						addressData: res.data
					})
				}
			});
		},

	},

	ready() {
		this.getAddressList();
	}
})