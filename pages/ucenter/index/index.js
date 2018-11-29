var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');
var user = require('../../../services/user.js');
var app = getApp();

Page({
    data: {
        userInfo: {},
        hasMobile: '',
        hiddenLoading:''
    },
    onLoad: function (options) {
        // 页面初始化 options为页面跳转所带来的参数
        this.setData({
            hiddenLoading: false
        });
    },
    onReady: function () {

    },
    onShow: function () {

        let userInfo = wx.getStorageSync('userInfo');
        let token = wx.getStorageSync('token');

        // 页面显示
        if (userInfo && token) {
            app.globalData.userInfo = userInfo;
            app.globalData.token = token;
        }

        this.setData({
            userInfo: app.globalData.userInfo,
        });

    },
    onHide: function () {
        // 页面隐藏
    },
    onUnload: function () {
        // 页面关闭
    },
    handler(e){
//二次授权页面
        var that = this;
        if(e.detail.authSetting['scope.userInfo']){
            wx.getUserInfo({
                success: function(res) {
                    that.setData({
                        hiddenLoading: false
                    });
                    user.loginByWeixin(res).then(res => {
                        that.setData({
                            userInfo: res.data.userInfo
                        });
                        app.globalData.userInfo = res.data.userInfo;
                        app.globalData.token = res.data.token;
                    }).catch((err) => {
                        console.info("错误");
                        console.log(err)
                    });
                }
            })

        }else{
            that.setData({
                hiddenLoading: true
            });
            wx.showModal({
                title: '警告通知',
                content: '您点击了拒绝授权,将无法正常显示个人信息',
                showCancel:false,//是否显示取消按钮
                confirmText:'知道了',
                success: function (res) {
                    if (res.confirm) {
                        wx.removeStorageSync("userInfo");
                        wx.removeStorageSync("token");
                        wx.switchTab({
                            url: '/pages/ucenter/index/index'
                        });
                    }
                }
            });
        }
    },
    bindGetUserInfo(e) {
      console.info("begin");
      let userInfo = wx.getStorageSync('userInfo');
      let token = wx.getStorageSync('token');
      if (userInfo && token) {
        return;
      }
        if (e.detail.userInfo){
          console.info('点击登录');
            //用户按了允许授权按钮
            user.loginByWeixin(e.detail).then(res => {
                this.setData({
                    userInfo: res.data.userInfo
                });
                app.globalData.userInfo = res.data.userInfo;
                app.globalData.token = res.data.token;
            }).catch((err) => {
              console.info("错误");
                console.log(err)
            });
        } else {
            //用户按了拒绝按钮
            this.setData({
                hiddenLoading: true
            });
            wx.showModal({
                title: '警告通知',
                content: '您点击了拒绝授权,将无法正常显示个人信息',
                showCancel:false,//是否显示取消按钮
                confirmText:'知道了',
                success: function (res) {
                    if (res.confirm) {
                        wx.removeStorageSync("userInfo");
                        wx.removeStorageSync("token");
                        wx.switchTab({
                            url: '/pages/ucenter/index/index'
                        });
                    }
                }
            });
        }
    },
    exitLogin: function () {
        wx.showModal({
            title: '',
            confirmColor: '#b4282d',
            content: '退出登录？',
            success: function (res) {
                if (res.confirm) {
                    wx.removeStorageSync('token');
                    wx.removeStorageSync('userInfo');
                    wx.switchTab({
                        url: '/pages/index/index'
                    });
                }
            }
        })

    }
})