var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');
const pay = require('../../../services/pay.js');

var app = getApp();

Page({
	data: {
		checkedGoodsList: [],
		checkedAddress: {},
		checkedAddressIcon: '',
		checkedCoupon: [],
		couponList: [],
		goodsTotalPrice: 0.00, //商品总价
		freightPrice: 0.00, //快递费
		couponPrice: 0.00, //优惠券的价格
		orderTotalPrice: 0.00, //订单总价
		actualPrice: 0.00, //实际需要支付的总价
		addressId: 0,
		couponId: 0,
		isBuy: false,
		buyType: '',
		checkoutGoodsList: [],
		checkoutGoodsShow: false,
	},
	onLoad: function(options) {
		wx.setNavigationBarTitle({
			title: '订单确认',
		})
		// 页面初始化 options为页面跳转所带来的参数
		if(options.isBuy != null) {
			this.data.isBuy = options.isBuy
		}
		this.data.buyType = this.data.isBuy ? 'buy' : 'cart'
		//每次重新加载界面，清空数据
		app.globalData.userCoupon = 'NO_USE_COUPON'
		app.globalData.courseCouponCode = {}
	},

	onReady: function() {
		// 页面渲染完成
	},
	onShow: function() {
		let _self = this;
		wx.showLoading({
			title: '加载中...',
		})
		let addList = [];
		let addId = '';
		util.request(api.AddressList).then(function(res) {
			if(res.errno === 0) {
				addList = res.data;
				res.data.map(res => {
					if(res.is_default == 1) {
						addId = res.id;
					}
				})
				return true;
			}
		}).then(function(data) {
			if(addList.length > 0) {
				wx.getStorage({
					key: 'addressId',
					success(res) {
						if(res) {
							// 用户有地址&&点存过
							_self.setData({
								'addressId': res.data
							});
							_self.getCheckoutInfo();
						}
					},
					fail() {
						if(addId == '') {
							// 用户有地址&&没有点存过&&也没有默认地址
							wx.showToast({
								title: '请先选择收货地址',
								icon: 'none',
								duration: 1000
							});
							setTimeout((res)=>{
								_self.selectAddress();
							},1000)
						} else {
							// 用户有地址&&没有点选过&&有默认地址
							_self.setData({
								'addressId': addId
							});
							_self.getCheckoutInfo();
						}
					}
				});
			} else {
				// 用户没有添加过地址
				wx.showToast({
					title: '请先填加收货地址',
					icon: 'none',
					duration: 1000
				});
				setTimeout((res)=>{
					_self.addAddress();
				},1000)
			}
		});
	},

	onHide: function() {
		// 页面隐藏

	},
	onUnload: function() {
		// 页面关闭

	},

	getCheckoutInfo: function() {
		let that = this;
		var url = api.CartCheckout
		let buyType = this.data.isBuy ? 'buy' : 'cart'
		util.request(url, {
			addressId: that.data.addressId,
			couponId: that.data.couponId,
			type: buyType
		}, 'POST', 'application/x-www-form-urlencoded').then(function(res) {
			if(res.errno === 0) {
				that.setData({
					checkedGoodsList: res.data.checkedGoodsList,
					checkedAddress: res.data.checkedAddress,
					checkedAddressIcon: res.data.checkedAddress.userName ? res.data.checkedAddress.userName.substring(0, 1) : '',
					actualPrice: res.data.actualPrice,
					checkedCoupon: res.data.checkedCoupon ? res.data.checkedCoupon : "",
					couponList: res.data.couponList ? res.data.couponList : "",
					couponPrice: res.data.couponPrice,
					freightPrice: res.data.freightPrice,
					goodsTotalPrice: res.data.goodsTotalPrice,
					orderTotalPrice: res.data.orderTotalPrice
				});
				/*
				//设置默认收获地址
				if(that.data.checkedAddress.id) {
					let addressId = that.data.checkedAddress.id;
					if(!addressId) {
						that.setData({
							addressId: addressId
						});
					}
				} else {
					wx.showModal({
						title: '',
						content: '请添加默认收货地址!',
						success: function(res) {
							if(res.confirm) {
								that.selectAddress();
							}
						}
					})
				}
				*/
			}
			wx.hideLoading();
		});
	},
	selectAddress() {
		wx.navigateTo({
			url: '/pages/shopping/address/address',
			//url: '/pages/ucenter/address/address',
		})
	},
	addAddress() {
		wx.navigateTo({
			url: '/pages/shopping/addressAdd/addressAdd',
		})
	},
	// 点击去支付
	submitOrder: function() {
		if(this.data.addressId <= 0) {
			util.showErrorToast('请选择收货地址');
			return false;
		}
		util.request(api.OrderSubmit, {
			addressId: this.data.addressId,
			couponId: this.data.couponId,
			type: this.data.buyType
		}, 'POST', 'application/json').then(res => {
			if(res.errno === 0) {
				const orderId = res.data.orderInfo.id;
				pay.payOrder(parseInt(orderId)).then(res => {
					wx.redirectTo({
						url: '/pages/payResult/payResult?status=1&orderId=' + orderId
					});
				}).catch(res => {
					wx.redirectTo({
						url: '/pages/payResult/payResult?status=0&orderId=' + orderId
					});
				});
			} else {
				util.showErrorToast('下单失败');
			}
		});
	},
	// 显示多个商品预览层
	showCheckoutGoods(event) {
		let _self = this;
		_self.setData({
			checkoutGoodsShow: true,
			checkoutGoodsList: _self.data.checkedGoodsList[event.currentTarget.id]['list']
		})
	},
	// 隐藏多个商品预览层
	hideCheckoutGoods() {
		let _self = this;
		_self.setData({
			checkoutGoodsShow: false,
		})
	},
})