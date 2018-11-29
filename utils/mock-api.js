const apiList = {
	'api__ad__list': {
		'errno': 0,
		'errmsg': 'success',
		'data|3': [{
			'id|+1': 1,
			'image_url': "http://baifen-app.oss-cn-beijing.aliyuncs.com/goods/20181120/145621858cf3b8.png",
		}]
	},
	'api__front__get_goods_list': {
		'errno': 0,
		'errmsg': 'success',
		'data|3': [{
			'id|+1': 1,
			'image_url': "http://baifen-app.oss-cn-beijing.aliyuncs.com/goods/20181120/145621858cf3b8.png",
		}]
	},
	'api__trade__category': {
		'errno': 0,
		'errmsg': 'success',
		'data|3': [{
			'id|+1': 1,
			'image_url': "http://baifen-app.oss-cn-beijing.aliyuncs.com/goods/20181120/145621858cf3b8.png",
		}]
	},
	'api__trade__list': {
		'errno': 0,
		'errmsg': 'success',
		'data|3': [{
			'id|+1': 1,
			'image_url': "http://baifen-app.oss-cn-beijing.aliyuncs.com/goods/20181120/145621858cf3b8.png",
		}]
	}
}

function apiRes(str) {
	return apiList[str]
}

module.exports = {
	apiRes
}
