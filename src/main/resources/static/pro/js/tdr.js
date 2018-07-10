var TDR = function() {};

TDR.util = {
    /**
    * 判断是否是对象类型
    * util.isObject
    * @param {Object} obj - 要判断的参数
    * @return {boolean}
    */
    isObject: function (obj) {
        return Object.prototype.toString.call(obj) === "[object Object]";
    },

    /**
    * 判断是否是数组类型
    * util.isArray
    * @param {Array} array - 要判断的参数
    * @return {boolean}
    */
    isArray: function (array) {
        return Object.prototype.toString.call(array) === "[object Array]";
    },
    
    /**
    * 判断浏览器是不是支持原生css动画
    * util.supportAnimation
    * @return {boolean}
    */
    supportAnimation: function () {
        return ("onanimationend" in document.createElement("div"));
    },
    
	/**
	* util.isMobile
	* @param {string} mobile - 手机号码
	* @return {null}
	*/
	isMobile: function(mobile) {
		return /^1[3|4|5|8][0-9]\d{8}$/.test(mobile);
	},

    /**
    * util.isCertificateID
    * @param {string} mobile - 身份证号码
    * @return {null}
    */
    isCertificateID: function(code) {
        var city = { 11: "北京", 12: "天津", 13: "河北", 14: "山西", 15: "内蒙古", 21: "辽宁", 22: "吉林", 23: "黑龙江 ", 31: "上海", 32: "江苏", 33: "浙江", 34: "安徽", 35: "福建", 36: "江西", 37: "山东", 41: "河南", 42: "湖北 ", 43: "湖南", 44: "广东", 45: "广西", 46: "海南", 50: "重庆", 51: "四川", 52: "贵州", 53: "云南", 54: "西藏 ", 61: "陕西", 62: "甘肃", 63: "青海", 64: "宁夏", 65: "新疆", 71: "台湾", 81: "香港", 82: "澳门", 91: "国外 " };
        var pass = true;

        if (!code || !city[code.substr(0, 2)] || !/^\d{6}(19|20)?\d{2}(0[1-9]|1[12])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)$/i.test(code)) {
            pass = false;
        }
        else {
            if (code.length == 18) {
                code = code.split('');
                var factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
                var parity = [1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2];
                var sum = 0;
                var ai = 0;
                var wi = 0;
                for (var i = 0; i < 17; i++) {
                    ai = code[i];
                    wi = factor[i];
                    sum += ai * wi;
                }
                if (parity[sum % 11] != code[17]) {
                    pass = false;
                }
            }
        }
        return pass;
    },

	/**
	* util.setCountDown
	* @param {string} button - 发送按钮
	* @param {string} time - 倒计时
    * @param {string} active - 发送按钮样式 
	* @return {null}
	*/
	setCountDown: function(button, time, active) {
		button.disabled = true;

	    var timeMax = time;
	    setTimeout(function down() {
	        if (timeMax <= 0) {
	            button.innerHTML = "再次发送";
	            button.removeAttribute("disabled");
                if(active) {
                    button.classList.remove(active);
                }
	        }
	        else {
                if(active) {
                    button.classList.add(active);
                }
	            button.innerHTML = timeMax + "S";
                timeMax--;
	            setTimeout(down, 1000);
	        }
	        
	    }, 1000);

        return false;
	},

    /**
	* 获取该dom对象的类名列表
	* util.getClassList
	* @param {domElement} dom - dom对象
	* @return {list/array}
	*/
    getClassList: function (dom) {
        if ("classList" in dom) {
            return dom.classList;
        }
        else {
            return dom.className.split(/\s+/);
        }
    },

    /**
	* 判断某dom对象是否存在某个类
	* util.containsClass
	* @param {domElement} dom - dom对象
	* @param {string} className - 类名
	* @return {boolean}
	*/
    containsClass: function (dom, className) {
        if ("classList" in dom) {
            return dom.classList.contains(className);
        }
        else {
            return dom.className.indexOf(className) > -1;
        }
    },
}

var util = TDR.util;

(function () {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame']
            || window[vendors[x] + 'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function (callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function () {callback(currTime + timeToCall);},
                timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };

    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function (id) {
            clearTimeout(id);
        };
}());
/**
 * 动画对象
 * @constructor
 * TDR.Animation
 * @param {number} time - 动画的时间长度
 * @param {AnimationType} type - 动画插值类型， 可选
 */
TDR.Animation = function (time, type) {
    this.time = time;
    this.animationType = type || TDR.Animation.easeIn;
    this.requestId = null;
};
TDR.Animation.prototype = {
    /**
    * TDR.Animation#start
    * 开始启动动画
    * @return {null}
    */
    start: function () {
        var that = this;
        var now = new Date().getTime();
        if (this.startFn) {
            this.startFn();
        }
        (function step(time) {
            time = new Date().getTime() - now;
            if (time < that.time) {
                var k = that.animationType(time, that.time);
                if (that.updateFn) {
                    that.updateFn(k);
                }
                that.requestId = requestAnimationFrame(step);
            }
            else {
                that.updateFn(1);
                if (that.completeFn) {
                    that.completeFn();
                }
                that.stop();
            }
        })();
    },
    /**
    * TDR.Animation#onUpdate
    * 切换动画期间的回调函数
    * @param {function} fn - 回调函数
    * @return {Animation}
    */
    onUpdate: function (fn) {
        this.updateFn = fn;
        return this;
    },

    /**
    * TDR.Animation#onComplete
    * 切换动画结束的回调函数
    * @param {function} fn - 回调函数
    * @return {Animation}
    */
    onComplete: function (fn) {
        this.completeFn = fn;
        return this;
    },

    /**
    * TDR.Animation#onComplete
    * 切换动画开始的回调函数
    * @param {function} fn - 回调函数
    * @return {Animation}
    */
    onStart: function (fn) {
        this.startFn = fn;
        return this;
    },

    /**
    * TDR.Animation#stop
    * 停止动画
    * @return {null}
    */
    stop: function () {
        window.cancelAnimationFrame(this.requestId);
    }
}
/**
* TDR.Animation.linear
* 线性渐变动画类型
* @return {function}
*/
TDR.Animation.linear = function (elapsed, end) {
    return elapsed / end;
};
/**
* TDR.Animation.easeIn
* 缓进渐变动画类型
* @return {function}
*/
TDR.Animation.easeIn = function (elapsed, end) {
    var k = elapsed / end;
    return k * k;
};
/**
* TDR.Animation.easeOut
* 缓出渐变动画类型
* @return {function}
*/
TDR.Animation.easeOut = function (elapsed, end) {
    var k = elapsed / end;
    return k * (2 - k);
};
/**
* TDR.Animation.easeInOut
* 缓进缓出渐变动画类型
* @return {function}
*/
TDR.Animation.easeInOut = function (elapsed, end) {
    var k = elapsed / end;
    if ((k *= 2) < 1) {
        return 0.5 * k * k;
    }

    return -0.5 * (--k * (k - 2) - 1);
};
/**
* TDR.Animation.easeInOut
* 光滑渐变动画类型
* @return {function}
*/
TDR.Animation.smooth = function (elapsed, end) {
    var k = elapsed / end;
    return k * k * (2 - k);
};
/**
* TDR.Animation.selfCubic
* 自定义贝塞尔函数渐变动画类型
* @return {function}
*/
TDR.Animation.selfCubic = function (c1, c2) {
    return function (elapsed, end) {
        var k = elapsed / end;
        return 3 * c1 * k * (1 - k) * (1 - k) + 3 * c2 * k * k * (1 - k) + k * k * k;
    }
};
/**
* TDR.Animation.steps
* 自定义间隔渐变动画类型
* @return {function}
*/
TDR.Animation.steps = function (num) {
    return function (elapsed, end) {
        var k = elapsed / 1000;
        var i = parseInt(k * num);
        return i / num;
    };
};

/**
* 加载动画组件对象， 继承于弹出框组件
* @constructor
* TDR.Loader
*/
TDR.Loader = function() {
	var that = this;
	this.loaderDiv = document.createElement("div");
	this.loaderDiv.className = "roundLoader";
 	this.maskDiv = document.createElement("div");
    this.maskDiv.className = "popMask";
    this.domElement = document.createElement("div");
    this.domElement.className = "loarderBox";

    this.animation = new TDR.Animation(Infinity, TDR.Animation.steps(12)).onUpdate(function (value) {
        that.domElement.querySelector(".roundLoader").style.backgroundPosition = "-" + (value * 12 * 50) + "px 0px";
    });
}

/**
* 调用加载动画动画
* TDR.showLoader
* @return {null}
*/
TDR.showLoader = function () {
    TDR.loader.show();
};

/**
* 取消加载动画动画
* TDR.hiddenLoader
* @return {null}
*/
TDR.hiddenLoader = function () {
    TDR.loader.hide();
}

/**
* TDR.Loader#show
* 显示弹出框
* @return {null}
*/
TDR.Loader.prototype.show = function() {
	var that = this;

 	that.domElement.appendChild(that.maskDiv);
    that.maskDiv.appendChild(that.loaderDiv);
    document.body.appendChild(that.domElement);

    if (!util.supportAnimation()) {
        that.animation.start();
    }
}

/**
* TDR.Loader#hide
* 隐藏弹出框
* @return {null}
*/
TDR.Loader.prototype.hide = function() {
    var that = this;
    if (!util.supportAnimation()) {
        this.animation.stop();
    }

    document.body.removeChild(this.domElement);
}

TDR.loader = new TDR.Loader();


