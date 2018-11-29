var util = require('../../utils/util.js');
var api = require('../../config/api.js');

var app = getApp();

Page({
	data: {
		cartGoods: [],
		cartTotal: {
			"goodsCount": 0,
			"goodsAmount": 0.00,
			"checkedGoodsCount": 0,
			"checkedGoodsAmount": 0.00
		},
		isEditCart: false,
		checkedAllStatus: true,
		floorGoods: [],
		addressText: '',
	},
	onLoad: function(options) {
		// 页面初始化 options为页面跳转所带来的参数
		wx.setNavigationBarTitle({
			title: '购物车',
		}) 

	},
	onReady: function() {
		// 页面渲染完成
	},
	onShow: function() {
		// 页面显示
		this.getCartList();
		this.getRecommendGoodsData();
	},
	onHide: function() {
		// 页面隐藏

	},
	onUnload: function() {
		// 页面关闭

	},

	/* 去首页挑商品 */
	toIndexPage: function() {
		wx.switchTab({
			url: "/pages/index/index"
		});
	},

	/* 去选择地址 */
	toAddressPage: function() {
		wx.navigateTo({
			url: "/pages/shopping/address/address"
		});
	},

	/* 工具方法 */

	/* 判断购物车商品是否已全选 */
	isCheckedAll: function() {
		let arr = [];
		this.data.cartGoods.map((val) => {
			val['list'].map((item) => {
				arr.push(item);
			})
		})
		return arr.every(function(element, index, array) {
			if(element.checked == true) {
				return true;
			} else {
				return false;
			}
		});
	},

	/* 获取购车数据 */
	getCartList: function() {
		let _self = this;
		util.request(api.CartList).then(function(res) {
			if(res.errno === 0) {
				_self.setData({
					cartGoods: res.data.cartList,
					cartTotal: res.data.cartTotal
				});
			}

			_self.setData({
				checkedAllStatus: _self.isCheckedAll()
			});
		});
		// 获取checkout的地址信息
		wx.getStorage({
			key: 'addressId',
			success(storageValue) {
				util.request(api.CartCheckout, {
					addressId: storageValue.data,
					couponId: 0,
					type: 'cart'
				}, 'POST', 'application/x-www-form-urlencoded').then(function(res) {
					if(res.errno === 0) {
						console.log(res.data.checkedAddress.full_region);
						_self.setData({
							addressText: !!res.data.checkedAddress.id ? res.data.checkedAddress.full_region + res.data.checkedAddress.detailInfo : '没有选择地址'
						})
					}
				});
			}
		});
	},

	/* 点击选中 */
	checkedItem: function(event) {
		let pIndex = event.currentTarget.dataset.pIndex;
		let itemIndex = event.currentTarget.dataset.itemIndex;
		let that = this;

		if(!this.data.isEditCart || 1) {
			util.request(api.CartChecked, {
				productIds: that.data.cartGoods[pIndex]['list'][itemIndex].product_id,
				isChecked: that.data.cartGoods[pIndex]['list'][itemIndex].checked ? 0 : 1
			}, 'POST', 'application/json').then(function(res) {
				if(res.errno === 0) {
					that.setData({
						cartGoods: res.data.cartList,
						cartTotal: res.data.cartTotal
					});
				}

				that.setData({
					checkedAllStatus: that.isCheckedAll()
				});
			});
		} else {
			//编辑状态
			let tmpCartData = this.data.cartGoods.map(function(element, index, array) {
				if(index == itemIndex) {
					element.checked = !element.checked;
				}

				return element;
			});

			that.setData({
				//cartGoods: tmpCartData,
				checkedAllStatus: that.isCheckedAll(),
				//'cartTotal.checkedGoodsCount': that.getCheckedGoodsCount()
			});
		}
	},
	/* 查看商品详情 */
	viewItem: function(event) {},
	/* 计算商品总数 */
	getCheckedGoodsCount: function() {
		let checkedGoodsCount = 0;
		let arr = [];
		this.data.cartGoods.map((val) => {
			val['list'].map((item) => {
				arr.push(item);
			})
		})
		arr.forEach(function(v) {
			if(v.checked) {
				checkedGoodsCount += v.number;
			}
		});
		return checkedGoodsCount;
	},
	/* 全选 */
	checkedAll: function() {
		let that = this;

		if(!this.data.isEditCart) {
			var productIds = [];
			this.data.cartGoods.map(function(v) {
				for(let i = 0; i < v.list.length; i++) {
					productIds.push(v.list[i]['product_id']);
				}
			});
			util.request(api.CartChecked, {
				productIds: productIds.join(','),
				isChecked: that.isCheckedAll() ? 0 : 1
			}, 'POST', 'application/json').then(function(res) {
				if(res.errno === 0) {
					that.setData({
						cartGoods: res.data.cartList,
						cartTotal: res.data.cartTotal
					});
				}

				that.setData({
					checkedAllStatus: that.isCheckedAll()
				});
			});
		} else {
			//编辑状态
			let checkedAllStatus = that.isCheckedAll();
			let tmpCartData = this.data.cartGoods.map(function(v) {
				v.checked = !checkedAllStatus;
				return v;
			});

			that.setData({
				cartGoods: tmpCartData,
				checkedAllStatus: that.isCheckedAll(),
				'cartTotal.checkedGoodsCount': that.getCheckedGoodsCount()
			});
		}

	},
	/* 进入购物车编辑状态 */
	editCart: function() {
		var _self = this;
		console.log(_self.data.isEditCart)
		if(_self.data.isEditCart) {
			_self.getCartList();
			_self.setData({
				isEditCart: !_self.data.isEditCart
			});
		} else {
			// 进入编辑状态
			let tmpCartList = _self.data.cartGoods.map(function(v) {
				v.checked = false;
				return v;
			});
			_self.setData({
				//cartGoods: tmpCartList,
				isEditCart: !_self.data.isEditCart,
				checkedAllStatus: _self.isCheckedAll(),
				'cartTotal.checkedGoodsCount': _self.getCheckedGoodsCount()
			});
		}

	},
	/* 更新购物车商品数量 */
	updateCart: function(productId, goodsId, number, id) {
		let that = this;

		util.request(api.CartUpdate, {
			productId: productId,
			goodsId: goodsId,
			number: number,
			id: id
		},'POST','application/json').then(function(res) {
			if(res.errno === 0) {
				that.setData({
					cartGoods: res.data.cartList,
					cartTotal: res.data.cartTotal
				});
			}

			that.setData({
				checkedAllStatus: that.isCheckedAll()
			});
		});

	},
	/* 商品减少 */
	cutNumber: function(event) {
		let pIndex = event.target.dataset.pIndex;
		let itemIndex = event.target.dataset.itemIndex;
		let cartItem = this.data.cartGoods[pIndex]['list'][itemIndex];
		let number = (cartItem.number - 1 > 1) ? cartItem.number - 1 : 1;
		cartItem.number = number;
		this.setData({
			cartGoods: this.data.cartGoods
		});
		this.updateCart(cartItem.product_id, cartItem.goods_id, number, cartItem.id);
	},
	/* 商品增加 */
	addNumber: function(event) {
		let pIndex = event.target.dataset.pIndex;
		let itemIndex = event.target.dataset.itemIndex;
		let cartItem = this.data.cartGoods[pIndex]['list'][itemIndex];
		let number = cartItem.number + 1;
		cartItem.number = number;
		this.setData({
			cartGoods: this.data.cartGoods
		});
		this.updateCart(cartItem.product_id, cartItem.goods_id, number, cartItem.id);

	},
	/* 去结算 */
	checkoutOrder: function() {
		//获取已选择的商品
		let that = this;

		//获取已选择的商品
		let checkedGoods = [];
		this.data.cartGoods.map(function(v) {
			for(let i = 0; i < v.list.length; i++) {
				if(v.list[i]['checked']) {
					checkedGoods.push(v.list[i]['product_id']);
				}
			}
		});

		if(checkedGoods.length <= 0) {
			wx.showToast({
				title: '请选择商品',
				icon: 'none'
			});
			return false;
		}

		wx.navigateTo({
			url: '../shopping/checkout/checkout'
		})
	},
	/* 删除所选 */
	deleteCart: function() {
		let that = this;

		//获取已选择的商品
		let productIds = [];
		this.data.cartGoods.map(function(v) {
			for(let i = 0; i < v.list.length; i++) {
				if(v.list[i]['checked']) {
					productIds.push(v.list[i]['product_id']);
				}
			}
		});

		if(productIds.length <= 0) {
			wx.showToast({
				icon: 'none',
				title: '请选择商品',
			})
			return false;
		}

		util.request(api.CartDelete, {
			productIds: productIds.join(',')
		}, 'POST', 'application/json').then(function(res) {
			if(res.errno === 0) {
				let cartList = res.data.cartList.map(v => {
					v.checked = false;
					return v;
				});

				that.setData({
					cartGoods: cartList,
					cartTotal: res.data.cartTotal
				});
			}

			that.setData({
				checkedAllStatus: that.isCheckedAll()
			});
		});
	},
	/* 空购车获取商品推荐 */
	getRecommendGoodsData() {
		var _self = this;
		_self.setData({
			floorGoods: [],
		})
		util.request(api.TodayGoodsList, {
			categoryValue: 'cart'
		}, 'GET', 'application/json').then(function(res) {
			if(res.errno === 0) {
				_self.setData({
					floorGoods: _self.data.floorGoods.concat(res.data.list),
				})
				_self.setData({
					floorGoodsHeight: Math.ceil(_self.data.floorGoods.length / 2) * (545 + 　12) - 12
				})
			}
		});
	},
	/* 选中分类继续全||反选分类下商品 */
	checkDaddy(event) {
		let _self = this;
		let pIndex = event.currentTarget.dataset.pIndex;
		var productIds = [];
		for(let i = 0; i < _self.data.cartGoods[pIndex]['list'].length; i++) {
			productIds.push(_self.data.cartGoods[pIndex]['list'][i]['product_id'])
		}
		util.request(api.CartChecked, {
			productIds: productIds.join(","),
			isChecked: _self.data.cartGoods[pIndex]['checked'] ? 0 : 1
		}, 'POST', 'application/json').then(function(res) {
			_self.setData({
				cartGoods: _self.data.cartGoods
			});
			_self.getCartList();
		});
	},
})