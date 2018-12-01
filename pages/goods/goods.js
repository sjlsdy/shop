var app = getApp();
var WxParse = require('../../lib/wxParse/wxParse.js');
var util = require('../../utils/util.js');
var api = require('../../config/api.js');

Page({
	data: {
		winHeight: "",
		id: 0,
		animationData: '',
		showModalStatus: false,
		goods: {},
		gallery: [],
		specificationList: [],
		productList: [],
		cartGoodsCount: 0,
		userHasCollect: 0,
		number: 1,
		checkedSpecText: '默认',
		openAttr: false,
		noCollectImage: "/static/images/icon_collect.png",
		hasCollectImage: "/static/images/icon_collect_checked.png",
		posters: {
			head_img: '',
		},
		isPosters: false,
		productInfo: {
			price: 0,
			stock: 0,
			marketprice: 0,
		},
		inStock: 0,
		// 商品信息
		spuInfo: '',
		// 点选规格后的售卖商品信息
		sku: {

		}
	},
	getGoodsInfo: function() {
		let that = this;
		util.request(api.GoodsDetail, {
			id: that.data.id
		}, 'POST', 'application/x-www-form-urlencoded').then(function(res) {
			if(res.errno === 0) {
				that.setData({
					goods: res.data.info,
					gallery: res.data.gallery.length > 0 ? res.data.gallery : [{
						img_url: 'https://baifen-app.oss-cn-beijing.aliyuncs.com/weixin/images/good-none.jpg'
					}],
					specificationList: res.data.specificationList,
					productList: res.data.productList,
					userHasCollect: res.data.userHasCollect
				});
				//设置默认值
				that.setDefSpecInfo(that.data.specificationList);

				WxParse.wxParse('goodsDetail', 'html', res.data.info.goods_desc, that);
			}
		});

	},
	clickSkuValue: function(event) {
		let that = this;
		let _self = this;
		let specNameId = event.currentTarget.dataset.nameId;
		let specValueId = event.currentTarget.dataset.valueId;

		let pindex = event.currentTarget.dataset['pindex'];
		let index = event.currentTarget.dataset['index'];

		//判断是否可以点击
		//TODO 性能优化，可在wx:for中添加index，可以直接获取点击的属性名和属性值，不用循环
		let _specificationList = this.data.specificationList;
		/*
		for(let i = 0; i < _specificationList.length; i++) {
			if(_specificationList[i].specification_id == specNameId) {
				for(let j = 0; j < _specificationList[i].valueList.length; j++) {
					if(_specificationList[i].valueList[j].id == specValueId) {
						//如果已经选中，则反选
						if(_specificationList[i].valueList[j].checked) {
							_specificationList[i].valueList[j].checked = false;
						} else {
							_specificationList[i].valueList[j].checked = true;
						}
					} else {
						_specificationList[i].valueList[j].checked = false;
					}
				}
			}
		}
		*/
		console.log(_specificationList);
		_specificationList[pindex].valueList.filter((val) => {
			if(val.id == specValueId) {
				val.checked = !val.checked;
			} else {
				val.checked = false;
			}
		})
		this.setData({
			'specificationList': _specificationList
		});
		//重新计算spec改变后的信息
		this.changeSpecInfo();
	},

	//获取选中的规格信息
	getCheckedSpecValue: function() {
		let checkedValues = [];
		let _specificationList = this.data.specificationList;
		for(let i = 0; i < _specificationList.length; i++) {
			let _checkedObj = {
				nameId: _specificationList[i].specification_id,
				valueId: 0,
				valueText: ''
			};
			for(let j = 0; j < _specificationList[i].valueList.length; j++) {
				if(_specificationList[i].valueList[j].checked) {
					_checkedObj.valueId = _specificationList[i].valueList[j].id;
					_checkedObj.valueText = _specificationList[i].valueList[j].value;
				}
			}
			checkedValues.push(_checkedObj);
		}
		return checkedValues;

	},
	// 根据点选的规格,拼成产品ID
	getCheckedSpecKey: function() {
		let checkedValue = this.getCheckedSpecValue().map(function(v) {
			return v.valueId;
		});
		return checkedValue.join('_');
	},
	// 根据选择更新规格
	changeSpecInfo: function() {
		let _self = this;
		let checkedNameValue = this.getCheckedSpecValue();

		let set = _self.getCheckedSpecKey();

		console.log('set', set)

		//设置选择的信息
		let checkedValue = checkedNameValue.filter(function(v) {
			if(v.valueId != 0) {
				return true;
			} else {
				return false;
			}
		}).map(function(v) {
			return v.valueText;
		});
		if(checkedValue.length > 0) {
			// 用户点选规格个数大于0时
			if(checkedNameValue.length == checkedValue.length) {
				// 下面从所有产品的列表里,找到点选的产品
				let num = 0;
				for(let i = 0; i < _self.data.productList.length; i++) {
					if(_self.data.productList[i].goods_specification_ids == set) {
						_self.setData({
							productInfo: {
								price: _self.data.productList[i].retail_price,
								stock: _self.data.productList[i].goods_number,
								marketprice: _self.data.productList[i].market_price,
							}
						});
						break;
					} else {
						num++
					}
				}
				if(num == _self.data.productList.length) {
					// 找不到产品
					_self.setData({
						productInfo: {
							price: 0,
							stock: 0,
							marketprice: 0,
						}
					});
				}
			} else {
				_self.setData({
					productInfo: {
						price: _self.data.goods.retail_price,
						stock: _self.data.goods.goods_number,
						marketprice: _self.data.goods.market_price,
					}
				})
			}
			this.setData({
				'checkedSpecText': checkedValue.join('　')
			});
		} else {
			// 用户点选数量为0时
			_self.setData({
				productInfo: {
					price: _self.data.goods.retail_price,
					stock: _self.data.goods.goods_number,
					marketprice: _self.data.goods.market_price,
				},
				'checkedSpecText': '请选择规格数量'
			});
		}

	},

	onLoad: function(options) {
		let _self = this;
		// 页面初始化 options为页面跳转所带来的参数
		_self.setData({
			id: parseInt(options.id)
		});
		wx.setStorageSync('referrerId', options.referrerId);
		// 延迟加载商品数据,避免切换页面卡顿情况
		setTimeout(() => {
			_self.getGoodsInfo();
			util.request(api.CartGoodsCount).then(function(res) {
				if(res.errno === 0) {
					_self.setData({
						cartGoodsCount: res.data.cartTotal.goodsCount
					});

				}
			});
		}, 200)
	},
	onReady: function() {
		// 页面渲染完成

	},
	onShow: function() {
		// 页面显示
	},
	onHide: function() {
		// 页面隐藏

	},
	onUnload: function() {
		// 页面关闭

	},
	onShareAppMessage() {
		// title:this.data.goods.name,
		//     desc: "",

		//console.log(this.data.goods)
		return {
			title: '我在百分之六发现一个不错商品，点开看看',
			path: '/pages/goods/goods?id=' + this.data.id + '&shareuserid=' + wx.getStorageSync('userId'),
			imageUrl: this.data.gallery[0]['img_url'],
			// path: `pages/index/index`, //点击分享的图片进到哪一个页面
			desc: this.data.goods.name,
			success: function(res) {
				// 转发成功
				console.log("转发成功:" + JSON.stringify(res));
			},
			fail: function(res) {
				// 转发失败
				console.log("转发失败:" + JSON.stringify(res));
			}
		}
	},
	// 根据产品ID,找到对应的产品
	getCheckedProductItem: function(key) {
		let _self = this;
		return this.data.productList.filter(function(v) {
			if(v.goods_specification_ids.indexOf(key) > -1) {
				return true;
			} else {
				return false;
			}
		});
	},

	// 关闭遮罩层
	closeMask() {
		let _self = this;
		_self.setData({
			isPosters: false,
			openAttr: false,
			showModalStatus: false,
		})
	},

	// 显示分享弹层
	showModal: function() {
		// 显示遮罩层
		var animation = wx.createAnimation({
			duration: 200,
			timingFunction: "linear",
			delay: 0
		})
		this.animation = animation
		animation.translateY(300).step()
		this.setData({
			animationData: animation.export(),
			showModalStatus: true
		})
		setTimeout(function() {
			animation.translateY(0).step()
			this.setData({
				animationData: animation.export()
			})
		}.bind(this), 100)
	},
	// 隐藏分享弹层
	hideModal: function() {
		// 隐藏遮罩层
		var animation = wx.createAnimation({
			duration: 200,
			timingFunction: "linear",
			delay: 0
		})
		this.animation = animation
		animation.translateY(300).step()
		this.setData({
			animationData: animation.export(),
		})
		setTimeout(function() {
			animation.translateY(0).step()
			this.setData({
				animationData: animation.export(),
				isPosters: false,
				openAttr: false,
				showModalStatus: false,
			})
		}.bind(this), 100)
	},
	generatePosters() {
		let _self = this;
		// 关闭分享框
		_self.setData({
			showModalStatus: false
		});
		wx.showLoading({
			title: '正在生成...',
		})
		let swidth = wx.getSystemInfoSync().screenWidth;
		wx.getImageInfo({
			src: this.data.gallery[0]['img_url'],
			success(res) {
				_self.data.posters.head_img = res.path;
				const ctx = wx.createCanvasContext('canvasIn');
				ctx.clearRect(0, 0, 0, 0);
				ctx.setFillStyle('white')
				ctx.fillRect(0, 0, 10000, 10000);
				ctx.drawImage(_self.data.posters.head_img, swidth * 0.08, swidth * 0.05, swidth * 0.56, swidth * 0.56);
				ctx.setFontSize(15)
				ctx.setFillStyle('#000')
				ctx.fillText(_self.data.goods.name, swidth * 0.08, swidth * 0.64 + 20);
				ctx.setFontSize(21)
				ctx.setFillStyle('#BD3543')
				ctx.setTextAlign('left')
				ctx.fillText(`￥` + _self.data.goods.retail_price, swidth * 0.08, swidth * 0.83)
				ctx.moveTo(swidth * 0.08, swidth * 0.86)
				ctx.lineTo(swidth * 0.64, swidth * 0.86)
				ctx.lineWidth = 1;
				ctx.strokeStyle = "#E1E1E1";
				ctx.stroke(); //绘制
				ctx.drawImage('/static/images/qrcode.png', swidth * 0.08, swidth * 0.88, swidth * 0.17, swidth * 0.17);
				ctx.setFontSize(14)
				ctx.setFillStyle('#2D2D2D')
				ctx.fillText('百分之六购物商城', swidth * 0.288, swidth * 0.95);
				ctx.setFontSize(11)
				ctx.setFillStyle('#7A7A7A')
				ctx.fillText('扫描或长按识别小程序', swidth * 0.288, swidth * 1);
				ctx.draw();
				/*
	  			setTimeout(function() {
	  				wx.canvasToTempFilePath({
	  					canvasId: 'canvasIn',
	  					fileType: 'png',
	  					success: function(res) {
	  						wx.saveImageToPhotosAlbum({
	  							filePath: res.tempFilePath,
	  							success(res) {
	  								wx.hideLoading();
	  								wx.showToast({
	  									title: '保存成功',
	  								});
	  							},
	  							fail() {
	  								wx.hideLoading()
	  							}
	  						})
	  					}
	  				})
	  			}, 500);
	  			*/
				_self.setData({
					isPosters: true
				});
				wx.hideLoading()
			},
			fail(res) {
				wx.hideLoading();
				wx.showToast({
					title: '图片地址非法,不能分享',
					icon: 'none'
				});
			}
		})
	},
	savePosters() {
		let _self = this;
		wx.canvasToTempFilePath({
			canvasId: 'canvasIn',
			fileType: 'png',
			success: function(res) {
				wx.saveImageToPhotosAlbum({
					filePath: res.tempFilePath,
					success(res) {
						wx.hideLoading();
						wx.showToast({
							title: '保存成功',
						});
						_self.setData({
							isPosters: false
						});
					},
					fail() {
						wx.hideLoading()
					}
				})
			}
		})
	},

	/* 关闭海报弹层 */
	colosePosters: function() {
		this.setData({
			isPosters: false
		});

	},

	/* 去首页 */
	goHome() {
		wx.switchTab({
			url: '/pages/index/index',
		});
	},

	goCart() {
		wx.switchTab({
			url: '/pages/cart/cart',
		});
	},
	/* 打开规格选择 */
	switchAttrPop: function() {
		if(this.data.openAttr == false) {
			this.setData({
				openAttr: !this.data.openAttr,
			});
		}
	},

	/* 判断规格是否选择完整 */
	isCheckedAllSpec: function() {
		return !this.getCheckedSpecValue().some(function(v) {
			if(v.valueId == 0) {
				return true;
			}
		});
	},

	/**
	 * 直接购买
	 */
	buyGoods: function() {
		let _self = this;
		var that = this;

		//提示选择完整规格
		if(!this.isCheckedAllSpec()) {
			wx.showToast({
				title: '请选择完整规格',
				icon: 'none'
			});
			this.setData({
				openAttr: true
			});
			return false;
		}

		//根据选中的规格，判断是否有对应的sku信息
		let checkedProduct = this.getCheckedProductItem(this.getCheckedSpecKey());
		if(!checkedProduct || checkedProduct.length <= 0) {
			//找不到对应的product信息，提示没有库存
			wx.showToast({
				title: '没有商品库存',
				icon: 'none'
			});
			return false;
		}

		//验证库存
		if(checkedProduct.goods_number < this.data.number) {
			//找不到对应的product信息，提示没有库存
			wx.showToast({
				title: '商品没有库存',
				icon: 'none'
			});
			return false;
		}

		// 直接购买商品
		util.request(api.BuyAdd, {
				goodsId: this.data.goods.id,
				number: this.data.number,
				productId: checkedProduct[0].id
			}, "POST", 'application/json')
			.then(function(res) {
				let _res = res;
				if(_res.errno == 0) {
					that.setData({
						openAttr: !that.data.openAttr,
					});
					wx.navigateTo({
						url: '/pages/shopping/checkout/checkout?isBuy=true',
					})
				} else {
					wx.showToast({
						icon: 'none',
						title: _res.msg,
					});
				}

			});

	},

	/**
	 * 添加到购物车
	 */
	addToCart: function() {
		let _self = this;
		let that = this;

		// 规格窗口没打开的话,把规格窗口打开(老方法)
		if(!this.isCheckedAllSpec()) {
			wx.showToast({
				title: '请选择完整规格',
				icon: 'none'
			});
			this.setData({
				openAttr: true
			});
			return false;
		}

		//根据选中的规格，判断是否有对应的sku信息
		let checkedProduct = this.getCheckedProductItem(this.getCheckedSpecKey());
		if(!checkedProduct || checkedProduct.length <= 0) {
			//找不到对应的product信息，提示没有库存
			wx.showToast({
				title: '没有商品库存',
				icon: 'none'
			});
			return false;
		}

		//验证库存
		if(checkedProduct.goods_number < this.data.number) {
			//找不到对应的product信息，提示没有库存
			wx.showToast({
				title: '商品没有库存',
				icon: 'none'
			});
			return false;
		}

		//添加到购物车
		util.request(api.CartAdd, {
				goodsId: _self.data.goods.id,
				number: _self.data.number,
				productId: checkedProduct[0].id
			}, 'POST', 'application/json')
			.then(function(res) {
				let _res = res;
				if(_res.errno == 0) {
					wx.showToast({
						title: '添加成功'
					});
					that.setData({
						openAttr: false,
						cartGoodsCount: _res.data.cartTotal.goodsCount
					});
				} else {
					wx.showToast({
						icon: 'none',
						title: _res.errmsg,
					});
				}

			});
	},
	// 减购买数量
	cutNumber: function() {
		this.setData({
			number: (this.data.number - 1 > 1) ? this.data.number - 1 : 1
		});
	},
	// 加购买数量
	addNumber: function() {
		this.setData({
			number: this.data.number + 1
		});
	},
	/* 将只有一个的规格进行默认选中 */
	setDefSpecInfo: function(specificationList) {
		//未考虑规格联动情况
		let that = this;
		if(!specificationList) return;
		for(let i = 0; i < specificationList.length; i++) {
			let specification = specificationList[i];
			let specNameId = specification.specification_id;
			//规格只有一个时自动选择规格
			if(specification.valueList && specification.valueList.length == 1) {
				let specValueId = specification.valueList[0].id;
				that.clickSkuValue({
					currentTarget: {
						dataset: {
							"nameId": specNameId,
							"valueId": specValueId
						}
					}
				});
			}
		}
		specificationList.map(function(item) {});
	},
	nowVip() {
		wx.navigateTo({
			url: '/pages/member/joinMember'
		})
	}
})