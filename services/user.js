/**
 * 用户相关服务
 */

const util = require('../utils/util.js');
const api = require('../config/api.js');


/**
 * 调用微信登录
 */
function loginByWeixin(userInfo) {

    wx.checkSession({
        success: function () {
            console.log("sucess!!!");
        },
        fail: function () {
          console.log("login again!!!");
            wx.login() //重新登录
        }
    })

  let code = null;
  return new Promise(function (resolve, reject) {
    return util.login().then((res) => {
      code = res.code;
      return userInfo;
    }).then((userInfo) => {
      //登录远程服务器
      util.request(api.AuthLoginByWeixin, { code: code, userInfo: userInfo }, 'POST', 'application/json').then(res => {
        if (res.errno === 0) {
          //存储用户信息
          wx.setStorageSync('userInfo', res.data.userInfo);
          wx.setStorageSync('token', res.data.token);
            util.request(api.AuthLoginBindMobile, {
            }).then((res) => {
                if (res.errno === 0) {
                    if(res.data===""){
                        wx.navigateTo({
                            url: '/pages/auth/mobile/mobile'
                        })
                        //微信授权手机号
                        // wx.navigateTo({
                        //     url: '/pages/auth/wxMobile/wxMobile'
                        // })
                    }
                } else {
                    reject(res);
                }
            });
          resolve(res);
        } else {
          util.showErrorToast(res.errmsg)
          reject(res);
        }
      }).catch((err) => {
        reject(err);
      });
    }).catch((err) => {
      reject(err);
    })
  });
}

/**
 * 判断用户是否登录
 */
function checkLogin() {
  return new Promise(function (resolve, reject) {
    if (wx.getStorageSync('userInfo') && wx.getStorageSync('token')) {

      util.checkSession().then(() => {
        resolve(true);
      }).catch(() => {
        reject(false);
      });

    } else {
      reject(false);
    }
  });
}


module.exports = {
  loginByWeixin,
  checkLogin,
};











