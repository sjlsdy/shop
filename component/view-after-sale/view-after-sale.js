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
		}
	},

	/**
	 * 组件的初始数据
	 */
	data: {
		isMask: false,
		logisticsData: [],
        reason_input:'',
        orderInfo:''
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
            this.triggerEvent('closeAfterSale', {})
			// wx.showToast({
			// 	title: '申请售后成功',
			// 	icon: 'success',
			// 	duration: 2000
			// });
			// this.triggerEvent('closeAfterSale', {})
		},submit(){
			var that = this;
            util.request(api.GetOrderReturn, {
                orderId: that.properties.orderId,
                desc:this.data.reason_input
            }).then(function (res) {
                if (res.errno === 0) {
                    wx.showToast({
                        title: res.data
                    });
                    that.triggerEvent('closeAfterSale', {})
                    //that.payTimer();
                }
            });
		},

		getLogisticsInfo() {
			// var _self = this;
			// util.request(api.QueryLogistics, {
			// 	orderId: _self.properties.orderId
			// }, 'POST', 'application/x-www-form-urlencoded').then(function(res) {
			// 	if(res.errno === 0) {
			// 	}
			// });
		},bindinput(e){
            this.setData({
                reason_input: e.detail.value
            });
		}

	},

	ready() {
		//this.getLogisticsInfo();
		var that = this;
        util.request(api.OrderDetail, {
            orderId: that.properties.orderId
        }).then(function (res) {
            if (res.errno === 0) {
                that.setData({
                    orderInfo: res.data.orderInfo
                });
                //that.payTimer();
            }
        });
	}
})