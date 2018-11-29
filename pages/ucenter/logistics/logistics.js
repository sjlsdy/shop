// pages/ucenter/order/logistics.js
var app = getApp();

var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');



Page({
  /**
   * 页面的初始数据
   */
  data:{
      orderId:'',
      logisticsData:[],
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
      this.setData({
          orderId: options.id
      })
console.log(this.data.orderId)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
      this.getLogistics();
  },
  getLogistics() {
    let that = this;
    util.request(api.QueryLogistics, {orderId:that.data.orderId} ).then(function (res) {
      if (res.errno === 0) {
          that.setData({
              logisticsData: res.data.reverse()
          })
      }
    });
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})