const util = require('../../utils/util.js');
const api = require('../../config/api.js');
const user = require('../../services/user.js');

//获取应用实例
const app = getApp()
Page({
  data: {
  	indexCountdownVisible: true,
    newGoods: [],
    hotGoods: [],
    topics: [],
    brands: [],
    floorGoods: [],
    floorGoodsHeight: 0,
    floorGoodsNow: 1,
    floorGoodsById: '',
    banner: [],
    channel: [],
    todayitems: [],
    currentTab: 0,
    tabData: [],
  },
  onShareAppMessage: function () {
    return {
      title: 'NideShop',
      desc: '百分之六小程序商城',
      path: '/pages/index/index'
    }
  },onPullDownRefresh(){
	  	// 增加下拉刷新数据的功能
	    var self = this;
	    this.getIndexData();
 },
  getIndexData: function () {
    let that = this;
    var data = new Object();
    /*
    util.request(api.IndexUrlNewGoods).then(function (res) {
      if (res.errno === 0) {
        data.newGoods= res.data.newGoodsList
      that.setData(data);
      }
    });
    util.request(api.IndexUrlHotGoods).then(function (res) {
      if (res.errno === 0) {
        data.hotGoods = res.data.hotGoodsList
      that.setData(data);
      }
    });
    util.request(api.IndexUrlTopic).then(function (res) {
      if (res.errno === 0) {
        data.topics = res.data.topicList
      that.setData(data);
      }
    });
    util.request(api.IndexUrlBrand).then(function (res) {
      if (res.errno === 0) {
        data.brand = res.data.brandList
      that.setData(data);
      }
    });
    util.request(api.IndexUrlCategory).then(function (res) {
      if (res.errno === 0) {
        data.floorGoods = res.data.categoryList
      that.setData(data);
      }
    });
    util.request(api.IndexUrlBanner).then(function (res) {

      if (res.errno === 0) {
        data.banner = res.data.banner
      that.setData(data);
      }
    });
    util.request(api.IndexUrlChannel).then(function (res) {
      if (res.errno === 0) {
        data.channel = res.data.channel
      that.setData(data);
      }
    });
		*/
		util.request(api.IndexUrlTopBanner,'','GET').then(function (res) {
      if (res.errno === 0) {
      	that.setData({
        	topics: res.data
        })
      }
    });
		util.request(api.TodayGoodsList,{
			categoryValue: 'todaycategory'
		},'GET','application/json').then(function (res) {
      if (res.errno === 0) {
        that.setData({
        	todayitems: res.data.list
        })
      }
    });
    util.request(api.TradeCategory,'','GET').then(function (res) {
      if (res.errno === 0) {
      	let arr = res.data;
      	arr.unshift({
					name: '推荐',
					banner_url: '',
					id: '',
					front_desc: ''
				})
        that.setData({
        	tabData: arr
        })
      }
    });
    this.getFloorGoodsData();
  },
  getFloorGoodsData() {
  	var _self = this;
  	util.request(api.TradeList,{
    	page: this.data.floorGoodsNow,
    	size: 12,
    	categoryId: this.data.floorGoodsById,
    	is_hot: 2,
    	is_new: 2,
    },'POST','application/x-www-form-urlencoded').then(function (res) {
      if (res.errno === 0) {
        _self.setData({
        	floorGoods: _self.data.floorGoods.concat(res.data),
        })
        _self.setData({
        	floorGoodsHeight: Math.ceil(_self.data.floorGoods.length / 2) * (545 +　12) - 12
        })
      }
    });
  },
  onLoad: function (options) {
    this.getIndexData();
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  },
  // 获取滚动条当前位置
  onPageScroll: function(e) {
  	if(e['scrollTop']>90) {
  		this.setData({
  			indexCountdownVisible: false,
  		})
  	}
  },
  onPullDownRefresh () {
    wx.stopPullDownRefresh({
    	success: (()=>{
    		this.setData({
  				indexCountdownVisible: true,
  			})
    	})
    })
  },
  onReachBottom() {
  	if(this.data.floorGoodsNow < 4) {
  		this.setData({
				floorGoodsNow: this.data.floorGoodsNow + 1,
			})
	  	this.getFloorGoodsData();
  	}
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
				floorGoodsById: e.target.dataset.current,
				currentTab: e.target.dataset.current,
				floorGoods: [],
				floorGoodsNow: 1,
			});
		}
		this.getFloorGoodsData();
	}
})
