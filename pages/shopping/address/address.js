var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');
var app = getApp();

Page({
	data: {
		addressList: [],
	},
	onLoad: function(options) {
		// 页面初始化 options为页面跳转所带来的参数

	},
	onReady: function() {
		// 页面渲染完成
	},
	onShow: function() {
		// 页面显示
		this.getAddressList();
	},
	getAddressList() {
		let that = this;
		util.request(api.AddressList).then(function(res) {
			if(res.errno === 0) {
				res.data.filter((val)=>{
					val.nameIcon = val.userName ? val.userName.substring(0, 1) : ''
				});
				that.setData({
					addressList: res.data
				});
				/*
				if(res.data.length == 1) {
					wx.showToast({
						title: '将选择唯一收货地址',
						icon: 'none',
					});
					wx.setStorage({
						key: 'addressId',
						data: res.data[0]['id'],
						success(res) {
							setTimeout(res => {
								//选择该收货地址
								wx.navigateBack({
									url: '/pages/shopping/checkout/checkout'
								});
							},1000)
						}
					})
				}
				*/
			}
		});
	},
	addressAddOrUpdate(event) {
		wx.navigateTo({
			url: '/pages/shopping/addressAdd/addressAdd?id=' + event.currentTarget.dataset.addressId
		});
	},
	selectAddress(event) {
		wx.setStorage({
			key: 'addressId',
			data: event.currentTarget.dataset.addressId,
			success(res) {
				//选择该收货地址
				wx.navigateBack({
					url: '/pages/shopping/checkout/checkout'
				});
			}
		})
	},
	onHide: function() {
		// 页面隐藏
	},
	onUnload: function() {
		// 页面关闭
	}
})