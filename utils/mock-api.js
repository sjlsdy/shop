const apiList = {
	// 首页幻灯片
	'api__ad__list': {
		'errno': 0,
		'errmsg': 'success',
		'data|3': [{
			'id|+1': 1,
			'image_url': "http://baifen-app.oss-cn-beijing.aliyuncs.com/goods/20181120/145621858cf3b8.png",
		}]
	},
	// 首页推荐商品
	'api__front__get_goods_list': {
		'errno': 0,
		'errmsg': 'success',
		'data|6': [{
			'id|+1': 1,
			'imgUrl': "https://yanxuan.nosdn.127.net/2eb0624b89d2cce1a5fb13187a0c10d8.jpg?imageView&quality=95&thumbnail=245x245",
			'name': '印花四件套',
			'retailPrice': '998.88'
		}]
	},
	// 首页分类
	'api__trade__category': {
		'errno': 0,
		'errmsg': 'success',
		'data|10': [{
			'id|+1': 1,
			'name|+1': ['居家', '服装', '配饰', '鞋包', '电器', '洗护', '饮食', '餐厨', '婴童', '文体'],
			'banner_url': "http://baifen-app.oss-cn-beijing.aliyuncs.com/goods/20181120/145621858cf3b8.png",
			'front_desc': '',
		}]
	},
	// 首页商品列表
	'api__trade__list': {
		'errno': 0,
		'errmsg': 'success',
		'data|10': [{
			'id|+1': 1,
			'list_pic_url': "https://yanxuan.nosdn.127.net/2eb0624b89d2cce1a5fb13187a0c10d8.jpg?imageView&quality=95&thumbnail=245x245",
			'name|+1': ['压榨葵花籽油 5升', '纯牛奶12盒*2提+酸牛奶12盒*2提', '男式咖啡碳+5℃保暖（上衣/裤子）', '日本制造 燕三条精铁炒锅'],
			'retail_price|1': [58, 158, 83.9, 299]
		}]
	},
	// 获取购物车商品数量
	'api__cart__goodscount': {
		'errno': 0,
		'errmsg': 'success',
		'data|10': {
			cartTotal: {
				goodsCount: 99,
			}
		}
	},
	// 商品详细
	'api__goods__detail': {
		'errno': 0,
		'errmsg': 'success',
		'data': {
			'id|+1': 1,
			'name|+1': ['压榨葵花籽油 5升', '纯牛奶12盒*2提+酸牛奶12盒*2提', '男式咖啡碳+5℃保暖（上衣/裤子）', '日本制造 燕三条精铁炒锅'],
			'retail_price|1': [58, 158, 83.9, 299],
			'info': {
				'name|1': ['多功能人体工学转椅', '100%羊毛 女式撞色V领羊毛衫', '纯牛奶12盒*2提+酸牛奶12盒*2提'],
				'list_pic_url': 'http://yanxuan.nosdn.127.net/929de135ad0c1fea90aa0468a246bd8b.jpg?imageView&thumbnail=430x430&quality=95',
				'retail_price': 130,
				'market_price': 260,
				'sell_volume': 6876,
				'goods_desc': '<p><img src="http://yanxuan.nosdn.127.net/7a8a26d0571973e37daf9727696553f3.jpg"></p><p><img src="http://yanxuan.nosdn.127.net/861a511445ed47af77aafe259f58003e.jpg"></p><p><img src="http://yanxuan.nosdn.127.net/f04de614b64fa0d9c981da16df3047fa.jpg"></p>'
			},
			'gallery': [{
				'id|+1': 1,
				'img_url': 'http://yanxuan.nosdn.127.net/929de135ad0c1fea90aa0468a246bd8b.jpg?imageView&thumbnail=430x430&quality=95'
			}, {
				'id|+1': 1,
				'img_url': 'http://yanxuan.nosdn.127.net/a616510345bf049c1df840b4fd5c9c08.jpg?imageView&thumbnail=430x430&quality=95'
			}, {
				'id|+1': 1,
				'img_url': 'http://yanxuan.nosdn.127.net/168dc9c9e7005aefa3b9d9473cd358c4.jpg?imageView&thumbnail=430x430&quality=95'
			}],
			'attribute': '',
			'comment': [],
			'specificationList': [{
				'specification_id': '1001',
				'retail_price': 998,
				'goods_number': 100,
				'market_price': 1228,
				'name': '规格',
				'valueList': [{
					'id': 1,
					'value': '白色'
				}, {
					'id': 2,
					'value': '黑色'
				}],
			}, {
				'specification_id': '1002',
				'retail_price': 998,
				'goods_number': 100,
				'market_price': 1228,
				'name': '大小',
				'valueList': [{
					'id': 3,
					'value': '1M'
				}, {
					'id': 4,
					'value': '2M'
				}],
			}],
			'productList': [{
				'specification_id': 1013,
				'goods_specification_ids': '1_3',
				'retail_price': 130,
				'market_price': 260,
				'goods_number': 13,
			}, {
				'specification_id': 1014,
				'goods_specification_ids': '1_4',
				'retail_price': 140,
				'market_price': 280,
				'goods_number': 14,
			}, {
				'specification_id': 1023,
				'goods_specification_ids': '2_3',
				'retail_price': 230,
				'market_price': 460,
				'goods_number': 23,
			}, {
				'specification_id': 1024,
				'goods_specification_ids': '2_4',
				'retail_price': 240,
				'market_price': 480,
				'goods_number': 24,
			}],
			'userHasCollect': [],
		}
	},
	// 添加进购物车
	'api__cart__add': {
		'errno': 0,
		'errmsg': 'success',
		'data': {
			cartTotal: {
				goodsCount: 100
			}
		}
	},
	// 立即购买
	'api__buy__add': {
		'errno': 0,
		'errmsg': 'success',
		'data': {}
	},
	// 地址列表
	'api__address__list': {
		'errno': 0,
		'errmsg': 'success',
		'data': [{
			'is_default': 1,
			'id': 1,
			'addressId': 1,
			'userName': '王泥喜',
			'telNumber': '13800008888',
			'full_region': '北京市朝阳区',
			'detailInfo': '光华路远大胡同112号',
		}]
	},
	// 购买check
	'api__cart__checkout': {
		'errno': 0,
		'errmsg': 'success',
		'data': {
			'checkedGoodsList|3': [{
				'id': 1,
				'app_list_pic_url': 'http://yanxuan.nosdn.127.net/168dc9c9e7005aefa3b9d9473cd358c4.jpg?imageView&thumbnail=430x430&quality=95',
				'title|1': ['苹果旗舰店', '八九间旗舰店', '乐乐趣官方旗舰店', 'Sunton海外专营店', '心家宜旗舰店'],
				'list|1-6': [{
					'id': 1,
					'list_pic_url': 'http://yanxuan.nosdn.127.net/168dc9c9e7005aefa3b9d9473cd358c4.jpg?imageView&thumbnail=430x430&quality=95',
					'goods_name|1': ['多功能人体工学转椅', '100%羊毛 女式撞色V领羊毛衫', '纯牛奶12盒*2提+酸牛奶12盒*2提'],
					'goods_specifition_name_value|1': ['白色 1M', '白色 2M', '黑色 1M', '黑色 2M'],
					'retail_price|1-1000': 0,
				}]
			}],
			'checkedAddress': {
				'id|1-100': 0,
				'userName': '王泥喜',
				'telNumber': '13800008888',
				'full_region': '北京市朝阳区',
				'detailInfo': '光华路灵静胡同112号',
			},
			'checkedAddressIcon': '',
			'actualPrice': '1013.00',
			'checkedCoupon': '',
			'couponList': '',
			'couponPrice': '0.00',
			'freightPrice': '15.00',
			'goodsTotalPrice': '998.00',
			'orderTotalPrice': '',
		}
	},
}

function apiRes(str) {
	return apiList[str]
}

module.exports = {
	apiRes
}