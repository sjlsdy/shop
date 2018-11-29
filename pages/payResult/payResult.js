var util = require('../../utils/util.js');
var api = require('../../config/api.js');
const pay = require('../../services/pay.js');

var app = getApp();
Page({
	data: {
		status: false,
		orderId: 0,
		orderInfo: '',
		floorGoods: [],
		floorGoodsHeight: '',
	},
	onLoad: function(options) {
		// 页面初始化 options为页面跳转所带来的参数
		this.setData({
			orderId: options.orderId || 24,
			status: options.status
		})
		this.updateSuccess();
		this.getOrderDetail();
		if(this.data.status) {
			this.getRecommendGoodsData();
		}
	},
	onReady: function() {

	},
	onShow: function() {
		// 页面显示

	},
	onHide: function() {
		// 页面隐藏

	},
	onUnload: function() {
		let _self = this;
		if(!_self.data.status) {
			// 页面关闭
			wx.showModal({
				title: '确认要放弃付款吗?',
				content: '订单会为您保留1小时,请尽快支付',
				cancelText: '确认离开',
				cancelColor: '#2D2D2D',
				confirmText: '继续付款',
				confirmColor: '#952934',
				success(res) {
					if(res.confirm) {
						_self.continuePayOrder();
					} else if(res.cancel) {}
				}
			})
		}
	},

	// 查询订单状态
	updateSuccess: function() {
		let that = this
		util.request(api.OrderQuery, {
			orderId: this.data.orderId
		}).then(function(res) {})
	},

	/*
	payOrder() {
		pay.payOrder(parseInt(this.data.orderId)).then(res => {
			this.setData({
				status: true
			});
		}).catch(res => {
			util.showErrorToast('支付失败');
		});
	},
	*/
	// 订单详情
	getOrderDetail() {
		let _self = this;
		util.request(api.OrderDetail, {
			orderId: _self.data.orderId
		}).then(function(res) {
			if(res.errno === 0) {
				_self.setData({
					orderInfo: res.data.orderInfo,
				});
			}
		});
	},
	// 用户选择继续付款,所以跳到付款页面
	continuePayOrder(event) {
		wx.redirectTo({
			url: '/pages/pay/pay?orderId=' + this.data.orderId + '&actualPrice=' + this.data.orderInfo.actual_price,
		})
	},

	/* 成功商品推荐 */
	getRecommendGoodsData() {
		var _self = this;
		util.request(api.TodayGoodsList,{
			categoryValue: 'cart'
		},'GET','application/json').then(function (res) {
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