const app = getApp();

Component({
	properties: {},
	data: {
		randomNumber: Math.ceil(Math.random()*1000)
	},
	methods: {
		watch() {
			const _self = this;
			return {
				__newMessage: function(newValue) {
					wx.showToast({
						title: 'new Message!!!',
						icon: 'none',
						duration: 1000
					});
					_self.showMsgModal();
				},
			}
		},
		showMsgModal() {
			const _self = this;
			_self.setData({
				__messageModal: true,
			});
		},
		getRes(djs) {
			console.log(new Date(), "请求新请求")
			var context = wx.createCanvasContext('firstCanvas', this)
			context.setStrokeStyle("#3a52e9")
			context.setLineWidth(6)
			context.arc(46, 46, 43, 1.5 * Math.PI, (1.5 + this.data.djs / 100 * 2) * Math.PI, false)
			context.stroke()
			context.draw();
			this.setData({
				djs: this.data.djs + 1
			})
		},
		startTime() {
			this.getRes();
			this.order = setInterval((res) => (this.getRes()), 1000);
		},
		clearTime() {
			clearInterval(this.order);
		},
		random() {
			var _self = this;
			_self.showNumber();
			_self.setData({
				randomNumber: _self.data.randomNumber + Math.ceil(Math.random()*1000)
			});
			setTimeout(() => {
				_self.random();
			}, 1000);
		},
		showNumber() {
			var _self = this;
			var numArr = (this.data.randomNumber.toString()).split("");
			for(let i = 0; i <= 8; i++) {
				if(i > numArr.length) {
					numArr.unshift("0");
				}
			}
			_self.setData({
				ahref: 'a' + numArr[0],
				bhref: 'b' + numArr[1],
				chref: 'c' + numArr[2],
				dhref: 'd' + numArr[3],
				ehref: 'e' + numArr[4],
				fhref: 'f' + numArr[5],
				ghref: 'g' + numArr[6],
				hhref: 'h' + numArr[7],
			})
		}
	},
	ready() {
		this.random();
	},
})