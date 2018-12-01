var api = require('../config/api.js');
var Mock = require('./mock.js');
var mockApi = require('./mock-api.js')
const DEBUG = false;

/**
 * 设定请求是不是要被mock拦截
 */
function request(url, data = {}, method = "POST", header = "application/x-www-form-urlencoded") {
	if(!!DEBUG) {
		return wxRequest(url, data, method, header);
	} else {
		return new Promise(function(resolve, reject) {
			let str = url.split('.com/')[1];
			let arr = str.split("/");
			let apiStr = arr.join("__");
			console.log("api::::::::::>>", url);
			console.log("api request::::::::::>>", data);
			console.log("api result::::::::::>>", Mock.mock(mockApi.apiRes(apiStr)));
			resolve(Mock.mock(mockApi.apiRes(apiStr)));
		})
	}
}

function wxRequest(url, data = {}, method = "POST", header = "application/x-www-form-urlencoded") {
	wx.showLoading({
		title: '加载中...',
	});
	return new Promise(function(resolve, reject) {
		wx.request({
			url: url,
			data: data,
			method: method,
			header: {
				'Content-Type': header,
				'X-Nideshop-Token': wx.getStorageSync('token')
			},
			success: function(res) {
				wx.hideLoading();
				if(res.statusCode == 200) {

					if(res.data.errno == 401) {
						//有待于修改
						// wx.navigateTo({
						//     url: '/pages/auth/btnAuth/btnAuth',
						// })
						wx.showModal({
							title: '',
							content: '请先登录',
							showCancel: false, //是否显示取消按钮
							confirmText: '知道了',
							success: function(res) {
								if(res.confirm) {
									wx.removeStorageSync("userInfo");
									wx.removeStorageSync("token");
									wx.switchTab({
										url: '/pages/ucenter/index/index'
									});
								}
							}
						});
					} else {
						resolve(res.data);
					}
				} else {
					reject(res.errMsg);
				}

			},
			fail: function(err) {
				reject(err)
			}
		})
	});
}

function formatTime(date) {
	var year = date.getFullYear()
	var month = date.getMonth() + 1
	var day = date.getDate()

	var hour = date.getHours()
	var minute = date.getMinutes()
	var second = date.getSeconds()

	return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatNumber(n) {
	n = n.toString()
	return n[1] ? n : '0' + n
}

/**
 * 检查微信会话是否过期
 */
function checkSession() {
	return new Promise(function(resolve, reject) {
		wx.checkSession({
			success: function() {
				resolve(true);
			},
			fail: function() {
				reject(false);
			}
		})
	});
}

/**
 * 调用微信登录
 */
function login() {
	return new Promise(function(resolve, reject) {
		wx.login({
			success: function(res) {
				if(res.code) {
					resolve(res);
				} else {
					reject(res);
				}
			},
			fail: function(err) {
				reject(err);
			}
		});
	});
}

function redirect(url) {

	//判断页面是否需要登录
	if(false) {
		wx.redirectTo({
			url: '/pages/auth/login/login'
		});
		return false;
	} else {
		wx.redirectTo({
			url: url
		});
	}
}

function showErrorToast(msg) {
	wx.showToast({
		title: msg,
		image: '/static/images/icon_error.png'
	})
}

function showSuccessToast(msg) {
	wx.showToast({
		title: msg,
	})
}

module.exports = {
	formatTime,
	request,
	redirect,
	showErrorToast,
	showSuccessToast,
	checkSession,
	login,
}