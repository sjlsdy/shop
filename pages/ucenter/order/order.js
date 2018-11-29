var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');

Page({
  data:{
    orderList: [],
    page: 1,
    size: 10,
    loadmoreText: '正在加载更多数据',
    nomoreText: '全部加载完成',
    nomore: false,
    totalPages: 1,
    currentTab: 999,
    isFirst: true,
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    // 页面显示
console.log(options)
    wx.showLoading({
      title: '加载中...',
      success: function () {
      }
    });
    this.getOrderList();
  },

  /**
       * 页面上拉触底事件的处理函数
       */
  onReachBottom: function () {
      if(this.data.totalPages >= this.data.page){
        this.getOrderList()
      }
  },
  getOrderList(){
    let that = this;
		that.setData({
			isFirst: false
		});
        util.request(api.OrderList, {orderStatus:that.data.currentTab==999?'':that.data.currentTab,page: that.data.page, size: that.data.size}).then(function (res) {
      if (res.errno === 0) {
          if (res.data.currentPage < res.data.totalPages) {
            that.setData({
              nomore: false
            })
          }else{
              console.log('true');
              that.setData({
                  nomore: true
              })
          }
        that.setData({
          orderList: that.data.orderList.concat(res.data.data),
          page: res.data.currentPage + 1,
          totalPages: res.data.totalPages
        });
        wx.hideLoading();
      }
    });
  },
  payOrder(event){
      let that = this;
      let orderIndex = event.currentTarget.dataset.orderIndex;
      let order = that.data.orderList[orderIndex];
      wx.redirectTo({
          url: '/pages/pay/pay?orderId=' + order.id + '&actualPrice=' + order.actual_price,
      })
  },
  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){

  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  },
  //滑动切换
	swiperTab: function(e) {
		let _self = this;
		_self.setData({
			currentTab: e.detail.current
		});
	},
	//点击切换
	clickTab: function(e) {
		var _self = this;
		if(this.data.currentTab === e.target.dataset.current) {
			return false;
		} else {
			_self.setData({
				isFirst: true,
				currentTab: e.target.dataset.current,
				orderList: []
			});
			_self.setData({
				page: 1,
			})
			_self.getOrderList();
		}
	}
})