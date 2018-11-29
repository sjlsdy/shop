var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');
var app = getApp();

Page({
  data: {
    addressList: [],
      androidisTrue:false,
      tools:'',
      addressId:''
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
      let that = this;
      //获取当前设备 [ios,android,pc]
      wx.getSystemInfo({
          success:function(res){
              that.setData({
                  tools:res,
              })
          }
      })
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
    this.getAddressList();
  },
  getAddressList (){
    let that = this;
    util.request(api.AddressList).then(function (res) {
      if (res.errno === 0) {
        for(let i=0;i<res.data.length;i++){
            res.data[i].surname=res.data[i].userName.substr(0,1)
        }

        that.setData({
          addressList: res.data
        });
      }
    });
  },
  addressAddOrUpdate (event) {
      let isFirst = this.data.addressList.length>0?true:false
    wx.navigateTo({
      url: '/pages/ucenter/addressAdd/addressAdd?id=' + event.currentTarget.dataset.addressId+'&isFirst='+isFirst
    })
  },
  deleteAddress(event){
    let that = this;
    wx.showModal({
      title: '',
      content: '确定要删除地址？',
      success: function (res) {
        if (res.confirm) {
          let addressId = event.target.dataset.addressId?event.target.dataset.addressId:that.data.addressId;
          util.request(api.AddressDelete, { id: addressId },'POST', 'application/json').then(function (res) {
            if (res.errno === 0) {
              that.getAddressList();
                that.setData({
                    addressId:'',
                    androidisTrue: false
                });
            }
          });
        }else{
            that.setData({
                androidisTrue: false
            });
        }
      }
    })
    return false;
    
  },
//手指触摸动作开始 记录起点X坐标

    touchstart: function (e) {

//开始触摸时 重置所有删除

    this.data.addressList.forEach(function (v, i) {

        if (v.isTouchMove)//只操作为true的

            v.isTouchMove = false;

    })

    this.setData({

        startX: e.changedTouches[0].clientX,

        startY: e.changedTouches[0].clientY,

        addressList: this.data.addressList

    })

},

//滑动事件处理

touchmove: function (e) {

    var that = this,

        index = e.currentTarget.dataset.index,//当前索引

        startX = that.data.startX,//开始X坐标

        startY = that.data.startY,//开始Y坐标

        touchMoveX = e.changedTouches[0].clientX,//滑动变化坐标

        touchMoveY = e.changedTouches[0].clientY,//滑动变化坐标
//获取滑动角度
        angle = that.angle({ X: startX, Y: startY }, { X: touchMoveX, Y: touchMoveY });

    that.data.addressList.forEach(function (v, i) {

        v.isTouchMove = false

//滑动超过30度角 return

        if (Math.abs(angle) > 30) return;

        if (i == index) {

            if (touchMoveX > startX){ //右滑
                v.isTouchMove = false
            }else{ //左滑
                v.isTouchMove = true
            }
        }

    })

//更新数据

    that.setData({

        addressList: that.data.addressList

    })

},

/**

 * 计算滑动角度

 * @param {Object} start 起点坐标

 * @param {Object} end 终点坐标

 */

angle: function (start, end) {

    var _X = end.X - start.X,

        _Y = end.Y - start.Y

//返回角度 /Math.atan()返回数字的反正切值

    return 360 * Math.atan(_Y / _X) / (2 * Math.PI);

},otherClick(){
        //点击空白位置 重置所有删除
        this.data.addressList.forEach(function (v, i) {

            if (v.isTouchMove)//只操作为true的

                v.isTouchMove = false;

        })
        this.setData({
            addressList: this.data.addressList,
            androidisTrue: false
        })
    },handleLongPress(event){
        //android长按 1.存储地址Id 2.弹出删除窗
        this.setData({
            addressId:event.currentTarget.dataset.addressId,
            androidisTrue: true
        });
    },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  }
})