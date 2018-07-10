/* 接口域名 */
var commonUrl = 'http://scout.java.yunzhan.biz';


/* 公共组件对象 */
var component = {};
(function(component_js) {
	/* 底部 */
	component_js.footerComponent = function(type) {
		var footer = document.createElement('div');
		var footerHTML;

		footer.className = 'footer';
		document.body.appendChild(footer);

		/* type 关联 active */
		if(type) {
			footerHTML = "" +  
				'<a href="camp.html" class="camp active">训练营</a>' +
				'<a href="person.html" class="center">个人中心</a>';
		}else {
			footerHTML = "" +  
				'<a href="camp.html" class="camp">训练营</a>' +
				'<a href="person.html" class="center active">个人中心</a>';
		}
		
		footer.innerHTML = footerHTML;

		return this;
	}

	/* carousel */
	component_js.carousel = function(type) {
		$.ajax({
			url: commonUrl + '/inter/shufflingFigureList',
			type: 'post',
			data: {
				type: type
			},
	 		timeout: 5000,
			success: function(data) {	
				// console.log(data);
				if(data.code == 0) {
					var html = template.render('Carousel', data);
					$('.swiper-common .swiper-wrapper').html(html);

					var swiper = new Swiper('.swiper-common', {
				        loop: true,
						autoplay: 3000,
						pagination: '.swiper-pagination',
				   		paginationClickable: true,
				   		autoplayDisableOnInteraction : false,
				    });
				}else {
					component.validation(data.msg);
				}
			}
		})

	    return this;
	}

	/* 联系我们弹窗组件 */
	component_js.popContact = function() {
		var popStr = "" +
			'<div class="pop-contact">' +
				'<p>如果有疑问</p>' +
				'<p>请联系教官</p>' +
				'<a href="javascript:;" class="tel">0577-89895188</a>' +
				'<div class="btns">' +
					'<div class="close-btn">取消</div>' +
					'<div class="confirm-btn">确认</div>' +
				'</div>' +
			'</div>';

		layer.open({
		  type: 1,
		  skin: 'pop-contact-layer',
		  title: false,
		  closeBtn: 0,
		  shadeClose: true,
		  content: popStr
		});

		/* 取消 */
		$('.close-btn').on('click', function() {
			layer.closeAll();
		})

		$('.confirm-btn').on('click', function() {
			layer.closeAll();
			location.href = 'tel://0577-88367789';
		})

	}

	/* 成功提示组件 */
	component_js.successTips = function(text) {
		var popStr = "" +
			'<div class="pop-success">' +
				'<p>'+ text +'</p>' +
				'<p>感谢您的参与</p>' +
			'</div>';

		layer.open({
		  type: 1,
		  skin: 'pop-success-layer',
		  title: false,
		  closeBtn: 0,
		  shade: [0.1, '#fff'],
		  shadeClose: true,
		  time: 1000,
		  content: popStr
		});
	}

	/* 验证提示信息 */
	component_js.validation = function(inf, className) {
		layer.msg(inf, {time: 1000});

		if(className) {
			// $(className).focus();
		}
	}

	/* 本地存储 */
	component_js.setLocal = function(k, v) {
		localStorage.setItem(k, JSON.stringify(v));
	}

	/* 获取存储值 */
	component_js.getLocal = function(k) {
		return JSON.parse(localStorage.getItem(k));
	}

	/* 时间截取 */
	component_js.timeSlice = function(className) {
		$(className).each(function(index, list) {
			var time = list.innerHTML;
			var newTime = time.substr(0, 10);

			list.innerHTML = newTime;
		})
	}

	/* 获取url参数 */
	component_js.GetUrlParam = function(paraName) {
        var url = document.location.toString();
        var arrObj = url.split('?');

        if(arrObj.length > 1) {
            var arrPara = arrObj[1].split('&');
            var arr;

            for(var i = 0; i < arrPara.length; i++) {
                arr = arrPara[i].split('=');

                if(arr != null && arr[0] == paraName) {
                    return arr[1];
                }
            }
            return '';
            
        }else {
            return '';
        }
    }

    /* 禁止默认行为 */
    component_js.cancelEvent = function(ev) {
    	console.info('禁止默认行为');
    	ev.preventDefault();
    	ev.stopPropagation();
    }
})(component)

/* 登录页面对象 */
var tzj = {};
(function(tzj_js) {
	/* 获取验证码 */
	tzj_js.getVCode = function() {
		var phoneValue = $('.phone input').val(),
			sendCode = $('.send-code')[0];

		var sendData;

		if(util.isMobile(phoneValue)) {
			util.setCountDown(sendCode, 60, 'active');
			// console.log(phoneValue);
			sendData  ={
				PhoneNumbers: phoneValue
			}
			
			$.ajax({
				url: commonUrl + '/inter/sendMsg',
				type: 'post',
				data: sendData,
				timeout: 5000,
				beforeSend:function(){
	 				TDR.showLoader();
		 		},
		 		complete:function(){
	 		        TDR.hiddenLoader();
		 		},
				success: function(data) {	
					console.log(data);
					if(data.code == 0) {

					}else {
						component.validation(data.msg);
					}
				}
			})
		}else {
			component.validation('请输入正确的手机号码', '.phone input');
		}

		return this;
	}

	/* 登录页 */
	tzj_js.login = function() {
		var phoneValu, vCode, sendData;
		var that = this;
		var sendData;

		//发送验证码
		$('.send-code').on('click', that.getVCode);

		//登录
		$('.login-btn').on('click', login);

		function login() {
			phoneVal = $('.phone input').val();
			vCode = $('.v-code input').val();
			
			if(phoneVal === '' || !util.isMobile(phoneVal)) {
				component.validation('请填写正确的手机号码', '.phone input');
			}else if(vCode === '') {
				component.validation('请填写验证码', '.v-code input');
			}else {
				sendData = {
					PhoneNumbers: phoneVal,
					code: vCode
				}

				$.ajax({
					url: commonUrl + '/inter/validateNum',
					type: 'post',
					data: sendData,
					timeout: 5000,
					beforeSend:function(){
		 				TDR.showLoader();
			 		},
			 		complete:function(){
		 		        TDR.hiddenLoader();
			 		},
					success: function(data) {	
						console.log(data);
						if(data.code == 0) {
							var userInf = {
								parentId: data.ParentDO.parentId
							}
							// console.log(userInf);
							component.setLocal('userInf', userInf);
							location.href = 'person.html';
						}else {
							component.validation(data.msg);
						}
					}
				})
			}
		}

		return this;
	}

})(tzj);

/* 报名弹窗对象 */
var popCamp = {};
(function(popCamp_js) {
	/* 重置动画 */
	popCamp_js.reset = function() {
		$('.pay-box').removeClass('fadeOutDown fadeInUp fadeInRight fadeOutLeft').addClass('animate');
		
		
		return this;
	}

	/* 关闭弹窗 */
	popCamp_js.closePop = function() {
		//解除禁止滑动
		var popMask = document.querySelector('.pop-mask');
		popMask.removeEventListener('touchmove', component.cancelEvent, false);

		popCamp_js.reset();
		$('.pay-box').off('click');
		$('.pop-mask').removeClass('active');
		$(this).parent().parent().addClass('fadeOutDown');
		$('html').removeClass('noscroll');
		return this;
	}

	/* 单选切换 */
	popCamp_js.changeActive = function(className1, className2) {
		$(className1).on('click', className2, function() {
			$(this).addClass('active').siblings().removeClass('active');
		})

		return this;
	}

	/* 获取单选选择 */
	popCamp_js.getSex = function(className) {
		var sex;
		$(className).each(function(index, list) {
			var isActive = util.containsClass(list, 'active');

			if(isActive) {
				sex = list.innerHTML;
			}
		})

		return sex;
	}

	/* 点击选择训练营 */
	popCamp_js.select = function() {
		$(this).addClass('active').siblings().removeClass('active');

		return this;
	}

	/* 选择身高 */
	popCamp_js.sHeight = function(index) {
		var _index = index;
		var heightArr = [];
		var num = 115;
		if(_index === undefined) {
			_index = 2;
		}else{
			_index = (parseInt(index) -num)/5 
		}
		console.info(index);

		
		while(num <= 180) {
			heightArr.push(num);
			num = num + 5;
		}
		var mobileSelect1 = new MobileSelect({
		    trigger: '#selectHeight',
		    title: '身高',
		    wheels: [
		                {data: heightArr}
		            ],
		    position:[_index],
		    callback:function(indexArr, data){
		        $('.height-box').addClass('active');
		    }
		    
		});

		return this;
	}
	
	/* 选择身份证 */
	popCamp_js.sIDCard = function(index) {
		var _index = index;
		if(_index === undefined) {
			_index = 0;
		}else{
			_index = parseInt(index)-1;
		}

		var mobileSelect2 = new MobileSelect({
		    trigger: '#id_trigger', 
		    title: '单项选择',  
		    wheels: [
		                {data:['身份证','其他证件']}
		            ],
		    position:[_index] //初始化定位
		});

		return this;
	}

	/* 个人中心 b-t动画 */
	popCamp_js.perToTop = function(num) {
		//禁止滑动
		var popMask = document.querySelector('.pop-mask');
		var popMask2 = $(".pop-mask")
		
		if(num!=1&&num!=2&&num!=0){
			popMask.addEventListener('touchmove', component.cancelEvent, false);
		}else{
			console.info($(".scouts").length);
			$.smartScroll(popMask2, '.scouts');
			$('html').addClass('noscroll');
		}
		popCamp_js.reset();
		$('.pop-mask').addClass('active');
		$('.pay-box').eq(0).addClass('fadeInUp');
		$('.pay-box').eq(0).on('click', '.common-border div', popCamp.select);
		$('.pay-box').eq(0).find('.common-btn').attr('data-num', num);

		return this;
	}

	/* 个人中心跳转 */
	popCamp_js.toReport = function(num) {
		$('.scouts div').each(function(index, list) {
			var isActive = util.containsClass(list, 'active');
			var name;

			if(isActive) {
				id = list.dataset.id;
				console.log(id);

				switch(num) {
					case '0':
						location.href = './scoutGlory.html?id=' + id;
					break;
					case '1':
						location.href = './campReported.html?id=' + id;
					break;
				}
			}
		})

		return this;
	}

	popCamp_js.toTop = function(num) {
		//禁止滑动
		var popMask = document.querySelector('.pop-mask');
		if(num!=1){
			popMask.addEventListener('touchmove', component.cancelEvent, false);
		}else{
			$('html').addClass('noscroll');
		}
		
		popCamp.reset();
		$('.pay-box').eq(0).addClass('fadeInUp');

		return this;
	}

	popCamp_js.toLeft = function(index) {
		popCamp.reset();
		$('.pay-box').eq(index).addClass('fadeOutLeft');
		$('.pay-box').eq(index + 1).addClass('fadeInRight');

		return this;
	}

	popCamp_js.toBottom = function(index) {
		//解除禁止滑动
		var popMask = document.querySelector('.pop-mask');
		popMask.removeEventListener('touchmove', component.cancelEvent, false);

		popCamp.reset();
		$('.pop-mask').removeClass('active');
		$('.pay-box').eq(index).addClass('fadeOutDown');

		return this;
	}

	/* 编辑信息验证 */
	popCamp_js.isVer = function(phoneVal, vCode, nameVal, idCard, height, fn) {
		if(phoneVal !== undefined && (phoneVal === '' || !util.isMobile(phoneVal))) {
		// if(phoneVal !== undefined && (phoneVal === '')) {
			component.validation('请输入正确的手机号码', '.phone input');
		}else if(vCode !== undefined && vCode === '') {
			component.validation('请输入验证码', '.v-code input');
		}else if(nameVal === '') {
			component.validation('请输入童军姓名', '.name input');
		}else if(($('#id_trigger').html()=='身份证')&&!util.isCertificateID(idCard) || idCard === ''){	
			component.validation('请输入正确的身份证号码', '.id-card input');
		}else if(height == '身高') {
			component.validation('请选择身高');
		}else {
			fn();
		}
	}

	/* 获取active */
	popCamp_js.getActive = function(ind, fn) {
		$('.pay-box').eq(ind).find('.common-border div').each(function(index, list) {
			var isActive = util.containsClass(list, 'active');
			if(isActive) {
				fn(list);
			}
		})
	}

})(popCamp)

/* 页面对象 */
var page = {};

(function(page_js) {

	/* 训练营页面 */
	page_js.camp = function() {
		component.carousel(1).footerComponent(true);
		
		

		$('.up-train').on('click', function() {
			$.ajax({
				url: commonUrl + '/inter/upTrain',
				type: 'post',
		 		timeout: 5000,
		 		data: {
		 			type: 1
		 		},
				success: function(data) {	
					console.log(data);
					if(data.code == 0) {
						if(data.data.train == null) {
							component.validation('暂无晋升营');
						}else {
							var id = data.data.train.trainId;
							location.href = './campDetail.html?id=' + id;
						}
					}else {
						component.validation(data.msg);
					}
				}
			})
		});
		
		if(type_url!=''){			
			if(type_url=="1"){
				$('.up-train').click();
				
			}else{
				$('.items li').each(function(){
					$(this).data('type') == type_url? $(this).addClass("active").siblings().removeClass("active"):"";
				});
				type_url = parseInt(type_url);			
				page_js.campLoad(type_url);
			}	
			
		}else{
			page_js.campLoad(3);
		}
	}

	/* 训练营tab切换 */
	page_js.tabCamp = function(me) {
        $('.tab-item').off('click');
		$('.tab-item').on('click', 'li', function() {
			var isActive = $(this).hasClass('active');
			// console.log(isActive);
			$(this).addClass('active').siblings().removeClass('active');
			
			me.noData();
			me.lock();
			me.resetload();

			if(!isActive) {
				var type = $(this).data('type');

				$('.dropload-down').remove();
				$('.camp-list').html('');

				switch(type) {
					case 3:
						page_js.campLoad(3);
					break;
					case 2:
						page_js.campLoad(2);
					break;
					case 4:
						page_js.campLoad(4);
					break;
				}
			}
		})
	}

	/* 训练营-上拉加载 */	
	page_js.campLoad = function(type) {
		var that = this;
		var page = 1;
		var dropload = $('.camp').dropload({
			// autoLoad:false,
			scrollArea:window,				
			domDown : {
            domClass   : 'dropload-down',
            domRefresh : '<div class="dropload-refresh">↑上拉加载更多</div>',
            domLoad    : '<div class="dropload-load"><span class="loading"></span>加载中...</div>',
            domNoData  : '<div class="dropload-noData">已加载全部数据</div>'
   		}, loadDownFn : function(me){
   			$.ajax({
				url: commonUrl + '/inter/trainList',
				async: false,
				type: 'post',
				data: {
					type: type,
					page: page,
					limit: 3
				},
		 		timeout: 5000,
				success: function(data) {	
					console.log(data);
					if(data.data.lowPriceList.length > 0) {
						var html = template.render('campList', data);
                        //插入数据到页面，放到最后面
                       	$(".camp-list").append(html);
                       	//跳转详情页
                       	$('.camp-list').on('click', '.bg', function() {
							var id = $(this).data('id');
							// console.log(id);
							location.href = './campDetail.html?id=' + id;
						})
						page++;

						//时间截取
                   		component.timeSlice('.camp-list .new-time');

                   		$('.time').each(function(index, list) {
                   			var length = $(list).find('span').length;
                   			var spanArr = list.querySelectorAll('span');

                   			list.removeChild(spanArr[length - 1]);
                   		})

                        // 每次数据插入，必须重置
                        me.resetload();
					}else {
						me.noData();
						me.lock();
						me.resetload();
					}

					/* tab切换 */
					page_js.tabCamp(me);
				}
			})	
		 	}
		})
		return this;
	}

	/* 训练营详情页面 */
	page_js.campDetail = function() {
		var trainId = component.GetUrlParam('id');

		var sendData = {
			trainId: trainId
		}

		/* 训练营详情接口 */
		$.ajax({
			url: commonUrl + '/inter/getTrainDetail',
			type: 'post',
	 		timeout: 5000,
	 		data: sendData,
	 		beforeSend:function(){
 				TDR.showLoader();
	 		},
	 		complete:function(){
 		        TDR.hiddenLoader();
	 		},
			success: function(data) {	
				
				if(data.code == 0) {
					template.helper('level',function(num,type){
						var str = "", arr = new Array() , result;
						var china = new Array('零','一','二','三','四','五','六','七','八','九');  
					    var english = num.split("");		    
					    for(var i=0;i<english.length;i++){  
					        arr[i] = china[english[i]];  
					    }  
						str = arr.join("");
					
						type==1? result = '('+str+'级营)':result = '('+str+'期营)';
										
						return result;
					});
					
					var html = template.render('campDetail', data);
                    //插入数据到页面，放到最后面
                                      
                   	$(".camp-detail").html(html);

                   	if(data.data.trainIntroduce != null) {
                   		$('.camp-desc').html(data.data.trainIntroduce.content);
                   	}
	                
                   	var transListStr = template.render('transLists', data);
                    //插入数据到页面，放到最后面
                   	$('.trans-list').html(transListStr);

                   	//时间截取
                   	component.timeSlice('.trans-list .time');
				}else {
					component.validation(data.msg);
				}
			}
		})

		/* 弹窗 */
		var isUser = component.getLocal('userInf');
		
		$('.sign-up').off('click');
		$('.sign-up').on('click', function() {
			$('.pay-box').off('click');
			popCamp.reset();
			$('.pop-mask').addClass('active');

			if(isUser) {
				parentId = isUser.parentId;
				page_js.isLogin(parentId);
			}else {
				page_js.unLogin();
			}
		});

		/* 关闭 */
		$('.close-pop').on('click', popCamp.closePop);

		/* 联系我们 */
		$('.advisory').on('click', component.popContact);

		return this;
	}

	/* 训练营详情报名已登录 */
	page_js.isLogin = function(parentId) {
		$('.un-login').remove();
		
		var userData = {},
			sendData = {};

		/* 选择童军接口 */
		$.ajax({
			url: commonUrl + '/inter/choosescout',
			type: 'post',
	 		timeout: 5000,
	 		data: {
	 			parentId: parentId
	 		},
			success: function(data) {	
				console.log(data);
				if(data.code == 0) {
					var html = template.render('scout', data);
					$('.pay-box').eq(0).html(html);

					/* 选择 */
					$('.pay-box').eq(0).on('click', '.common-border div', popCamp.select);
					/* 关闭 */
					$('.close-pop').on('click', popCamp.closePop);

				}else {
					component.validation(data.msg);
				}
			}
		})

		/* 开启弹窗 */
		popCamp.toTop(1);
		
		/* 选择童军确认 */
		$('.pay-box').eq(0).on('click', '.common-btn', function() {
			popCamp.getActive(0, function(list) {
				userData = {
					scoutId: list.dataset.id
				}
				console.log(userData);

				/* 选择童军后的编辑信息 */
				$.ajax({
					url: commonUrl + '/inter/scoutDo',
					type: 'post',
			 		timeout: 5000,
			 		data: {
			 			scoutId: userData.scoutId
			 		},
					success: function(data) {	
						
						if(data.code == 0) {
							var html = template.render('scoutInf', data);
							$('.pay-box').eq(1).html(html);
							
							popCamp.toLeft(0).sHeight(data.data.height).changeActive('.sex', 'span');
							popCamp.toLeft(0).sIDCard(data.data.cardType);

							/* 关闭 */
							$('.close-pop').on('click', popCamp.closePop);

							sendData['parentId'] = parentId;
							sendData['scoutId'] = userData.scoutId;

						}else {
							component.validation(data.msg);
						}
					}
				})
			})
		})

		/* 编辑信息确认 */
		$('.pay-box').eq(1).on('click', '.common-btn', function() {
			var phoneVal = $('.phone input').val(),
				vCode = $('.v-code input').val(),
				nameVal = $('.name input').val(),
				idCard = $('.id-card input').val(),
				height = $('.height-box').html(), 
				sex = popCamp.getSex('.sex span'),
				cardType = $('#id_trigger').html()=='身份证'? 1:2;

			sex = sex == '男' ? 1 : 2;

			popCamp.isVer(phoneVal, vCode, nameVal, idCard, height, function() {
				userData = {
					name: nameVal,
					sex: sex,
					idCard: idCard,
					height: height,
					scoutId: userData.scoutId,
					cardType:cardType
					
				}
				console.log(userData);


				/* 已登录报名 */
				$.ajax({
					url: commonUrl + '/inter/loginSignup',
					type: 'post',
			 		timeout: 5000,
			 		data: userData,
					success: function(data) {	
						console.log(data);
						if(data.code == 0) {
							component.successTips('童军信息更新成功');

							/* 下一步 */
							popCamp.toLeft(1);
							/* 关闭 */
							$('.close-pop').on('click', popCamp.closePop);
							$('.pay-box').eq(2).on('click', '.common-border div', popCamp.select);
						}else {
							component.validation(data.msg);
						}
					}
				})
			});
		})

		/* 选择训练营确认 */
		$('.pay-box').eq(2).on('click', '.common-btn', function() {
			popCamp.getActive(2, function(list) {
				sendData['trainId'] = list.dataset.id;
				console.log(sendData);
				
				/* 训练营详情接口 */
				$.ajax({
					url: commonUrl + '/inter/getTrainDetail',
					type: 'post',
			 		timeout: 5000,
			 		data: {
			 			trainId: sendData.trainId
			 		},
					success: function(data) {	
						console.log(data);
						if(data.code == 0) {
							var html = template.render('transPrice', data);
		                   	$(".trans-price").html(html);

		                   	$('.trans-price .price div').eq(0).addClass('active');

		                   	popCamp.toLeft(2);
							$('.pay-box').eq(3).on('click', '.common-border div', popCamp.select);
							/* 关闭 */
							$('.close-pop').on('click', popCamp.closePop);
						}else {
							component.validation(data.msg);
						}
					}
				})
			})
		})

		/* 选择价格确认 */
		$('.pay-box').eq(3).on('click', '.common-btn', function() {
			popCamp.getActive(3, function(list) {
				sendData['priceType'] = list.dataset.type;
				console.log(sendData);

				/* 生成订单 */
				page_js.generateOrders(sendData);
				// popCamp.toBottom(3);
				// location.href = 'payment.html';
			})
		})
	}

	/* 训练营详情报名未登录 */
	page_js.unLogin = function() {
		$('.is-login').remove();

		var userData = {},
			sendData = {};

		/* 开启弹窗 */
		popCamp.toTop();
		popCamp.sHeight().changeActive('.sex', 'span');
		popCamp.sIDCard();


		//发送验证码
		$('.send-code').on('click', tzj.getVCode);

		/* 编辑信息确认 */
		$('.pay-box').eq(0).on('click', '.common-btn', function() {
			var phoneVal = $('.phone input').val(),
				vCode = $('.v-code input').val(),
				nameVal = $('.name input').val(),
				idCard = $('.id-card input').val(),
				height = $('.height-box').html(), 
				sex = popCamp.getSex('.sex span'),
				cardType = $('#id_trigger').html()=='身份证'? 1:2;

			sex = sex == '男' ? 1 : 2;

			popCamp.isVer(phoneVal, vCode, nameVal, idCard, height, function() {
				userData = {
					phone: phoneVal,
					verificatioCode: vCode,
					name: nameVal,
					sex: sex,
					idCard: idCard,
					height: height,
					cardType:cardType
				}
				console.log(userData);
				/* 未报名登录接口 */
				$.ajax({
					url: commonUrl + '/inter/unLoginSignup',
					type: 'post',
			 		timeout: 5000,
			 		data: userData,
			 		beforeSend:function(){
		 				TDR.showLoader();
			 		},
			 		complete:function(){
		 		        TDR.hiddenLoader();
			 		},
					success: function(data) {	
						console.log(data);
						if(data.code == 0) {
							var parentId = data.parentDO.parentId;
							var scoutId = data.scoutDO.scoutId;
							var userInf = {
								parentId: parentId
							}
							component.setLocal('userInf', userInf);
							component.successTips('提交成功');
							popCamp.toLeft(0);
							$('.pay-box').eq(1).on('click', '.common-border div', popCamp.select);

							sendData['parentId'] = parentId;
							sendData['scoutId'] = scoutId;

						}else {
							component.validation(data.msg);
						}
					}
				})
			});
		})

		/* 选择训练营确认 */
		$('.pay-box').eq(1).on('click', '.common-btn', function() {
			popCamp.getActive(1, function(list) {
				sendData['trainId'] = list.dataset.id;
				console.log(sendData);

				/* 训练营详情接口 */
				$.ajax({
					url: commonUrl + '/inter/getTrainDetail',
					type: 'post',
			 		timeout: 5000,
			 		data: {
			 			trainId: sendData.trainId
			 		},
					success: function(data) {	
						console.log(data);
						if(data.code == 0) {
							var html = template.render('transPrice', data);
		                   	$(".trans-price").html(html);


		                   	$('.trans-price .price div').eq(0).addClass('active');
		                   	popCamp.toLeft(1);
							$('.pay-box').eq(2).on('click', '.common-border div', popCamp.select);
							/* 关闭 */
							$('.close-pop').on('click', popCamp.closePop);
						}else {
							component.validation(data.msg);
						}
					}
				})
				
			})
		})

		/* 选择价格确认 */
		$('.pay-box').eq(2).on('click', '.common-btn', function() {
			popCamp.getActive(2, function(list) {
				sendData['priceType'] = list.dataset.type;
				console.log(sendData);

				/* 生成订单 */
				page_js.generateOrders(sendData);
				// popCamp.toBottom(2);
				// location.href = 'payment.html';
			})
		})
	}

	/* 生成订单 */
	page_js.generateOrders = function(sendData) {
		var scoutId = sendData.scoutId;
		$.ajax({
			url: commonUrl + '/inter/prepaidOrder',
			type: 'post',
	 		timeout: 5000,
	 		data: sendData,
			success: function(data) {	
				console.log(data);
				if(data.code == 0) {
					var signupId = data.scoutSignup.signupId;
					page_js.wxPay(signupId, scoutId);
				}else {
					component.validation(data.msg);
				}
			}
		})
	}

	/* 报名支付 */
	page_js.wxPay = function(signupId, scoutId) {
		$.ajax({
			url: commonUrl + '/inter/creat',
			type: 'post',
	 		timeout: 5000,
	 		data: {
	 			signupId: signupId
	 		},
			success: function(data) {	
				console.log(data);
				if(data.code == 0) {
					function onBridgeReady(){
					   WeixinJSBridge.invoke(
					       'getBrandWCPayRequest', {
					           "appId": data.data.appId,     //公众号名称，由商户传入     
					           "timeStamp": data.data.timeStamp, //时间戳，自1970年以来的秒数     
					           "nonceStr": data.data.nonceStr, //随机串     
					           "package": data.data.package,     
					           "signType": data.data.signType, //微信签名方式：     
					           "paySign": data.data.paySign //微信签名 
					       },
					       function(res){     
					           if(res.err_msg == "get_brand_wcpay_request:ok" ) {
					           		component.setLocal('scoutId', scoutId);
					           		location.href = 'payment.html';
					           }     // 使用以上方式判断前端返回,微信团队郑重提示：res.err_msg将在用户支付成功后返回    ok，但并不保证它绝对可靠。 
					       }
					   ); 
					}
					if (typeof WeixinJSBridge == "undefined"){
					   if(document.addEventListener){
					       document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
					   }else if (document.attachEvent){
					       document.attachEvent('WeixinJSBridgeReady', onBridgeReady); 
					       document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
					   }
					}else{
					   onBridgeReady();
					}
				}else {
					component.validation(data.msg);
				}
			}
		})
	}

	/* 支付成功 */
	page_js.payment = function() {
		function createTime() {
			var date = new Date();  
		    var y = date.getFullYear();      
		    var m = date.getMonth() + 1;      
		    m = m < 10 ? ('0' + m) : m;      
		    var d = date.getDate();      
		    d = d < 10 ? ('0' + d) : d;      
		    var h = date.getHours();    
		    h = h < 10 ? ('0' + h) : h;    
		    var minute = date.getMinutes();    
		    var second = date.getSeconds();    
		    minute = minute < 10 ? ('0' + minute) : minute;      
		    second = second < 10 ? ('0' + second) : second;

		    return '您已于' + y + '年' + m + '月' + d + '号' + h + ':' + minute + '成功报名';
		} 

		var nowTome = document.querySelector('.now-time'); 

		nowTome.innerHTML = createTime();

		$('.pay-btn').on('click', function() {
			var scoutId = component.getLocal('scoutId');
			location.href = 'campReported.html?id=' + scoutId;
		})
	}

	/* 已报训练营页面 */
	page_js.campReported = function() {
		var scoutId = component.GetUrlParam('id');
		var that = this;
		
		$.ajax({
			url: commonUrl + '/inter/scoutSignupList',
			type: 'post',
	 		timeout: 5000,
	 		data: {
	 			scoutId: scoutId,
				page: 1,
				limit: 3
	 		},
			success: function(data) {	
				console.log(data);
				if(data.code == 0) {
					var html = template.render('reportedLists', data);
                    //插入数据到页面，放到最后面
                   	$(".camp-list").append(html);
                   	if(data.data.scoutSignupList.length > 0) {
	                   	//时间截取
	                   	component.timeSlice('.new-time');

	                   	$('.camp-list').off('click');
	                   	$('.camp-list').on('click', '.bg', function() {
                       		var trainId = $(this).data('id');
							location.href = './reportDetail.html?trainId=' + trainId + '&scoutId=' + scoutId;
						})

	                   	/* 下拉加载 */
						that.campReportedLoad(scoutId);
					}
				}else {
					component.validation(data.msg);
				}
			}
		})
	}

	/* 已报训练营上拉加载 */	
	page_js.campReportedLoad = function(scoutId) {
		var that = this;
		var page = 2;
		var dropload = $('.camp').dropload({
			// autoLoad:false,
			scrollArea:window,				
			domDown : {
            domClass   : 'dropload-down',
            domRefresh : '<div class="dropload-refresh">↑上拉加载更多</div>',
            domLoad    : '<div class="dropload-load"><span class="loading"></span>加载中...</div>',
            domNoData  : '<div class="dropload-noData">已加载全部数据</div>'
   		}, loadDownFn : function(me){
   			$.ajax({
				url: commonUrl + '/inter/scoutSignupList',
				async: false,
				type: 'post',
				data: {
					scoutId: scoutId,
					page: page,
					limit: 3
				},
		 		timeout: 5000,
				success: function(data) {	
					console.log(data);
					if(data.data.scoutSignupList.length > 0) {
						var html = template.render('reportedLists', data);
                        //插入数据到页面，放到最后面
                       	$(".camp-list").append(html);
                       	
                       	//时间截取
                       	component.timeSlice('.new-time');

                       	$('.camp-list').off('click');
                       	$('.camp-list').on('click', '.bg', function() {
                       		var trainId = $(this).data('id');
							location.href = './reportDetail.html?trainId=' + trainId + '&scoutId=' + scoutId;
						})

                        // 每次数据插入，必须重置
                        me.resetload();
	                    page++;	
					}else {
						me.noData();
						me.lock();
						me.resetload();
					}
				}
			})	
		 	}
		})
		return this;
	}

	/* 已报训练营详情 */
	page_js.reportedDetail = function() {
		var trainId = component.GetUrlParam('trainId'),
			scoutId = component.GetUrlParam('scoutId');
		/* 已报训练营详情接口 */
		$.ajax({
			url: commonUrl + '/inter/trainDetail',
			type: 'post',
	 		timeout: 5000,
	 		data: {
	 			trainId: trainId,
	 			scoutId: scoutId
	 		},
	 		beforeSend:function(){
 				TDR.showLoader();
	 		},
	 		complete:function(){
 		        TDR.hiddenLoader();
	 		},
			success: function(data) {	
				console.log(data);
				if(data.code == 0) {
					var html = template.render('reportDetail', data);
                    //插入数据到页面，放到最后面
                   	$(".camp-detail").html(html);

                   	if(data.data.trainIntroduce != null) {
                   		$('.camp-desc').html(data.data.trainIntroduce.content);
                   	}
				}else {
					component.validation(data.msg);
				}
			}
		})
	}

	/* 个人中心页面 */
	page_js.person = function() {
		
		component.footerComponent();

		var sendData = {
			parentId: component.getLocal('userInf').parentId
		};

		/* 选择童军 */
		$.ajax({
			url: commonUrl + '/inter/choosescout',
			type: 'post',
	 		timeout: 5000,
	 		data: sendData,
	 		beforeSend:function(){
 				TDR.showLoader();
	 		},
	 		complete:function(){
 		        TDR.hiddenLoader();
	 		},
			success: function(data) {	
				console.log(data);
				if(data.code == 0) {
					var html = template.render('scout', data);
					$('.person .pop-mask').html(html);

					/* 关闭 */
					$('.close-pop').on('click', popCamp.closePop);

					/* 已报训练营打开弹窗 */
					$('.reported').on('click', function() {
						if(data.data.length > 0) {
							popCamp.perToTop(1);
						}else {
							component.validation('还没有童军, 请先添加');
						}
						
					});
					
					/* 童军荣耀打开弹窗 */
					$('.glory').on('click', function() {
						if(data.data.length > 0) {
							popCamp.perToTop(0);
						}else {
							component.validation('还没有童军, 请先添加');
						}
					});
					if(popType==0){ $('.glory').click();}
					if(popType==1){ $('.reported').click();}

					/* 确定 */
					$('.common-btn').on('click', function() {
						var num = $(this).attr('data-num');
						popCamp.toBottom().toReport(num);
					});
					
				}else {
					component.validation(data.msg);
				}
				
				
			}
		})

		/* 家长信息 */
		$.ajax({
			url: commonUrl + '/inter/parentList',
			type: 'post',
	 		timeout: 5000,
	 		data: sendData,
			success: function(data) {	
				console.log(data);
				if(data.code == 0) {
					var html = template.render('avatar', data);
					$('.avatar').html(html);
				}else {
					component.validation(data.msg);
				}
			}
		})

		return this;
	}

	/* 个人资料页面 */
	page_js.infor = function() {
		var that = this,
			areasIdArr = [],
			areasIndexArr = [],
			areasNameArr = [],
			sendData,
			parentId = component.getLocal('userInf').parentId;
		

		sendData = {
			parentId: parentId
		};

		console.log(sendData);

		$.ajax({
			url: commonUrl + '/inter/parentList',
			type: 'post',
	 		timeout: 5000,
	 		data: sendData,
	 		beforeSend:function(){
 				TDR.showLoader();
	 		},
	 		complete:function(){
 		        TDR.hiddenLoader();
	 		},
			success: function(data) {	
				console.log(data);
				if(data.code == 0) {
					var html = template.render('personInf', data);
					$('.person-infor').html(html);

					/* 选择性别 */
					popCamp.changeActive('.sex', 'span');

					if(data.data.addrname == null && data.data.addrindex == null) {
						areasIdArr = ["11", "177", "2167"];
						areasIndexArr = [10, 2, 9];
					}else {
						areasIdArr = data.data.addrname.split(',');
						areasIndexArr = data.data.addrindex.split(',');
					}

					/* 地区联动 */
					$.ajax({
						url: commonUrl + '/inter/address',
						type: 'post',
						success: function(data) {
							// console.log(data.data);
							var areaArr = data.data;

							var mobileSelect1 = new MobileSelect({
							    trigger: '#addr',
							    title: '选择地区',
							    wheels: [
							    			{data: areaArr}
							    		],
							    keyMap: {
							    	id: 'id',
							    	value: 'name',
							    	childs :'children'
							    }, 
							    position: areasIndexArr,
							    callback: function(indexArr, data){
							        areasIdArr = [];
							        data.forEach(function(list, index) {
							        	areasIdArr.push(list.id);
							        })
							        $('.addr').addClass('active');
							        areasIndexArr = indexArr;
							    }
							});
						}
					})

					/* 保存按钮 */
					$('.save-btn').on('click', function() {
						page.saveInf(parentId, areasIdArr, areasIndexArr);
					});
				}else {
					component.validation(data.msg);
				}
			}
		})

		return this;
	}

	/* 个人资料保存 */
	page_js.saveInf = function(parentId, areasIdArr, areasIndexArr) {
		var parentName = $('.user-name input').val(),
			wechatId = $('.wx-number input').val(),
			address = $('.detail-addr').val(),
			sex = popCamp.getSex('.sex span'),
			cityName = $('.addr').html();
		sex = sex == '男' ? 1 : 2;

		console.log(areasIdArr);
		console.log(areasIndexArr);

		var areasIdStr = areasIdArr.join(',');
		var areasIndexStr = areasIndexArr.join(',');

		var sendData = {
			parentId: parentId,
			parentName: parentName,
			sex: sex,
			wechatId: wechatId,
			addrname: areasIdStr,
			addrindex: areasIndexStr,
			address: address,
			addrname2: cityName
		}
		console.log(sendData);
		
		$.ajax({
			url: commonUrl + '/inter/updateParent',
			type: 'post',
	 		timeout: 5000,
	 		data: sendData,
	 		beforeSend:function(){
 				TDR.showLoader();
	 		},
	 		complete:function(){
 		        TDR.hiddenLoader();
	 		},
			success: function(data) {	
				console.log(data);
				if(data.code == 0) {
					component.successTips('个人资料修改成功');
					page_js.toPerson();
				}else {
					component.validation(data.msg);
				}
			}
		})
		return this;
	}

	/* 童军荣耀 */
	page_js.scoutGlory = function() {
		var scoutId = component.GetUrlParam('id');
		var sendData = {
			scoutId: scoutId
		};
		console.log(sendData);

		$.ajax({
			url: commonUrl + '/inter/scoutGlory',
			type: 'post',
	 		timeout: 5000,
	 		data: sendData,
	 		beforeSend:function(){
				TDR.showLoader();
	 		},
	 		complete:function(){
		        TDR.hiddenLoader();
	 		},
			success: function(data) {	
				console.log(data);
				if(data.code == 0) {
					var html = template.render('gloryScout', data);
					$('.glory .scout-inf').html(html);

					var ringHTML = template.render('scoutRing', data);
					$('.glory-cont .ring-cont').html(ringHTML);

					/* carousel */
					page.crousel();
					
				}else {
					component.validation(data.msg);
				}
			}
		})
		
		/* 训练营 */
		page_js.gloryLoad(scoutId, 1);

		return this;
	}

	/* 童军荣耀轮播 */
	page_js.crousel = function() {
		var swiper = new Swiper('.swiper-ring', {
	 		autoplayDisableOnInteraction : false,
	 		speed: 1000,
	        paginationClickable: true,
	        slidesPerView: 4,
	        spaceBetween: 12,
		})
	}

	/* 童军荣耀tab切换 */
	page_js.tabGlory = function(me) {
		var scoutId = component.GetUrlParam('id');
        $('.glory-tab').off('click');
		$('.glory-tab').on('click', 'li', function() {
			var isActive = $(this).hasClass('active');
			// console.log(isActive);
			$(this).addClass('active').siblings().removeClass('active');
			
			me.noData();
			me.lock();
			me.resetload();

			if(!isActive) {
				var type = $(this).data('type');

				$('.dropload-down').remove();
				$('.camp-list').html('');

				switch(type) {
					case 1:
						page_js.gloryLoad(scoutId, 1);
					break;
					case 2:
						page_js.gloryLoad(scoutId, 2);
					break;
				}
			}
		})
	}

	/* 童军荣耀下拉加载 */
	page_js.gloryLoad = function(scoutId, type) {
		var that = this;
		var page = 1;
		var dropload = $('.camp').dropload({
			// autoLoad:false,
			scrollArea:window,				
			domDown : {
            domClass   : 'dropload-down',
            domRefresh : '<div class="dropload-refresh">↑上拉加载更多</div>',
            domLoad    : '<div class="dropload-load"><span class="loading"></span>加载中...</div>',
            domNoData  : '<div class="dropload-noData">已加载全部数据</div>'
   		}, loadDownFn : function(me){
   			$.ajax({
				url: commonUrl + '/inter/scoutSignup',
				async: false,
				type: 'post',
				data: {
					type: type,
					page: page,
					limit: 3,
					scoutId: scoutId
				},
		 		timeout: 5000,
				success: function(data) {	
					console.log(data);
					
					if(data.data.trainDetailList.length > 0) {
						var html = template.render('gloryLists', data);
                        //插入数据到页面，放到最后面
                       	$(".camp-list").append(html);

						page++;	

						//时间截取
                   		component.timeSlice('.camp-list .new-time');

						/* 成长记录 */
						$('.list .record').on('click', function() {
							var trainId = $(this).data('id');
							console.log(trainId);
							location.href = 'record.html?trainId=' + trainId + '&scoutId=' + scoutId;
						})
						
                        // 每次数据插入，必须重置
                        me.resetload();
					}else {
						me.noData();
						me.lock();
						me.resetload();
					}

					/* tab切换 */
					page_js.tabGlory(me);
				}
			})	
		 	}
		})
		return this;
	}
	
	/* 童军荣耀-成长记录 */
	page_js.record = function() {
		var trainId = component.GetUrlParam('trainId'),
			scoutId = component.GetUrlParam('scoutId');
		var sendData = {
			trainId: trainId,
			scoutId: scoutId
		}

		/* 成长记录训练营信息 */
		$.ajax({
			url: commonUrl + '/inter/signupTrainInfo',
			type: 'post',
	 		timeout: 5000,
	 		data: sendData,
	 		beforeSend:function(){
				TDR.showLoader();
	 		},
	 		complete:function(){
		        TDR.hiddenLoader();
	 		},
			success: function(data) {	
				console.log(data);
				if(data.code == 0) {
					template.helper('level',function(num,type){
						var str = "", arr = new Array() , result;
						var china = new Array('零','一','二','三','四','五','六','七','八','九');  
					    var english = num.split("");		    
					    for(var i=0;i<english.length;i++){  
					        arr[i] = china[english[i]];  
					    }  
						str = arr.join("");
						console.info(str);
						type==1? result = str+'级营':result = str+'期营';
										
						return result;
					});
					var html = template.render('recordDetail', data);
					$('.record-detail').html(html);

					//时间截取
               		// component.timeSlice('.opening-time .new-time');
				}else {
					component.validation(data.msg);
				}
			}
		})


		$.ajax({
			url: commonUrl + '/inter/compass',
			type: 'post',
	 		timeout: 5000,
	 		data: sendData,
			success: function(data) {	
				console.log(data);
				if(data.code == 0) {
					template.helper('getScore',function(score){
						var str= score ;
						if(!isNaN(score)){
							str = score+"分 / 5分"
						};
						return str ;
						
					});
					
					var html = template.render('ardar', data);
					$('.ardar').html(html);

					var canvas = document.querySelectorAll('canvas');
					console.log(canvas);
					var fArr = [],
						sArr = [],
						tFArr = [],
						tSArr = [],
						number = 0;
					if(data.data.AvgTrainAndAvgperson != null) {
						if(data.data.AvgTrainAndAvgperson.avgpersonparam1 != null) {
							tFArr = [
								data.data.AvgTrainAndAvgperson.avgpersonparam1,
								data.data.AvgTrainAndAvgperson.avgpersonparam2,
								data.data.AvgTrainAndAvgperson.avgpersonparam3,
								data.data.AvgTrainAndAvgperson.avgpersonparam4,
								data.data.AvgTrainAndAvgperson.avgpersonparam5,
								data.data.AvgTrainAndAvgperson.avgpersonparam6,
							];
						}
						if(data.data.AvgTrainAndAvgperson.avgtrainparam1 != null) {
							tSArr = [
								data.data.AvgTrainAndAvgperson.avgtrainparam1,
								data.data.AvgTrainAndAvgperson.avgtrainparam2,
								data.data.AvgTrainAndAvgperson.avgtrainparam3,
								data.data.AvgTrainAndAvgperson.avgtrainparam4,
								data.data.AvgTrainAndAvgperson.avgtrainparam5,
								data.data.AvgTrainAndAvgperson.avgtrainparam6,
							];
						}

						page_js.ardar(canvas[0], tFArr, tSArr);

						if(data.data.AvgThemeAndperson != null) {
							for(var i = 0; i < data.data.AvgThemeAndperson.length; i++) {
								if(data.data.AvgThemeAndperson[i].param1 != null) {
									fArr = [
										data.data.AvgThemeAndperson[i].param1,
										data.data.AvgThemeAndperson[i].param2,
										data.data.AvgThemeAndperson[i].param3,
										data.data.AvgThemeAndperson[i].param4,
										data.data.AvgThemeAndperson[i].param5,
										data.data.AvgThemeAndperson[i].param6,
									];
								}else {
									fArr = Array.apply(null, Array(6)).map(function(item, i) { 
					                	return 0;
					            	});
								}
								if(data.data.AvgThemeAndperson[i].avgthemeparam1 != null) {
									sArr = [
										data.data.AvgThemeAndperson[i].avgthemeparam1,
										data.data.AvgThemeAndperson[i].avgthemeparam2,
										data.data.AvgThemeAndperson[i].avgthemeparam3,
										data.data.AvgThemeAndperson[i].avgthemeparam4,
										data.data.AvgThemeAndperson[i].avgthemeparam5,
										data.data.AvgThemeAndperson[i].avgthemeparam6,
									]
								}else {
									sArr = Array.apply(null, Array(6)).map(function(item, i) { 
					                	return 0;
					            	});
								}
								if(data.data.AvgThemeAndperson[i].param1 != null) {
									number = number + 1; //检测到存在分数情况下 从canvas[1] 开始生成 图形 (0 为 训练营罗盘)
									page_js.ardar(canvas[number], fArr, sArr)
								}
								
							}
						}
						
					}else {
						if(data.data.AvgThemeAndperson != null) {
							for(var i = 0; i < data.data.AvgThemeAndperson.length; i++) {
								if(data.data.AvgThemeAndperson[i].param1 != null) {
									fArr = [
										data.data.AvgThemeAndperson[i].param1,
										data.data.AvgThemeAndperson[i].param2,
										data.data.AvgThemeAndperson[i].param3,
										data.data.AvgThemeAndperson[i].param4,
										data.data.AvgThemeAndperson[i].param5,
										data.data.AvgThemeAndperson[i].param6,
									];
								}else {
									fArr = Array.apply(null, Array(6)).map(function(item, i) { 
					                	return 0;
					            	});
								}
								if(data.data.AvgThemeAndperson[i].avgthemeparam1 != null) {
									sArr = [
										data.data.AvgThemeAndperson[i].avgthemeparam1,
										data.data.AvgThemeAndperson[i].avgthemeparam2,
										data.data.AvgThemeAndperson[i].avgthemeparam3,
										data.data.AvgThemeAndperson[i].avgthemeparam4,
										data.data.AvgThemeAndperson[i].avgthemeparam5,
										data.data.AvgThemeAndperson[i].avgthemeparam6,
									]
								}else {
									sArr = Array.apply(null, Array(6)).map(function(item, i) { //生成长度为6个0的数组
					                	return 0;
					            	});
								}
								if(data.data.AvgThemeAndperson[i].param1 != null) {
									page_js.ardar(canvas[number], fArr, sArr); 
									number = number + 1; //检测到存在分数情况下 从canvas[0] 开始生成 图形 (此时无训练营罗盘)
								}
							}
						}
					}
				}else {
					component.validation(data.msg);
				}
			}
		})
		
		return this;
	}

	/* 新增童军页面 */
	page_js.addScout = function() {
		popCamp.changeActive('.sex', 'span').changeActive('.swim', 'span').sHeight().sIDCard();

		$('.save-btn').on('click', function() {
			page.saveScout(0);
		});

		return this;
	}

	/* 童军信息页面 */
	page_js.scoutInfo = function() {
		var scoutId = component.GetUrlParam('id');

		var sendData = {
			scoutId: scoutId
		}
		console.log(sendData);

		$.ajax({
			url: commonUrl + '/inter/scoutDo',
			type: 'post',
	 		timeout: 5000,
	 		data: sendData,
	 		beforeSend:function(){
 				TDR.showLoader();
	 		},
	 		complete:function(){
 		        TDR.hiddenLoader();
	 		},
			success: function(data) {	
				console.log(data);
				if(data.code == 0) {
					var html = template.render('scoutInf', data);
					$('.person-infor').html(html);

					popCamp.changeActive('.sex', 'span').changeActive('.swim', 'span').sHeight(data.data.height).sIDCard(data.data.cardType);

					$('.save-btn').on('click', function() {
						page.saveScout(1);
					})
				}else {
					component.validation(data.msg);
				}
			}
		})

		return this;
	}	

	/* 保存&修改新增童军 */
	page_js.saveScout = function(type) {
		var userName = $('.user-name input').val(),
			idCard = $('.id-card input').val(),
			height = $('#selectHeight').html(),
			weight = $('.weight input').val(),
			drug = $('.drug input').val(),
			health = $('.health textarea').val(),
			sex = popCamp.getSex('.sex span'), 
			swim = popCamp.getSex('.swim span'), 			
			sendData,
			cardType = $('#id_trigger').html()=='身份证'? 1:2;

		sex = sex == '男' ? 1 : 2;
		swim = swim === undefined ? '' : swim == '是' ? 1 : 2;
		height = height === '身高' ? '' : height;

		if(userName === '') {
			component.validation('请输入童军姓名', '.user-name input');
		}else if(($('#id_trigger').html()=='身份证')&&!util.isCertificateID(idCard) || idCard === ''){	
			component.validation('请输入正确的身份证号码', '.id-card input');
		}else {
			sendData = {
				// parentId: component.getLocal('userInf').parentId,
				name: userName,
				sex: sex,
				idCard: idCard,
				height: height,
				weight: weight,
				swimming: swim,
				allergy: drug,
				healthy: health,
				cardType:cardType
			}
			console.log(sendData);

			switch(type) { //0: 新增童军 1:修改童军
				case 0:
					sendData['parentId'] = component.getLocal('userInf').parentId;
					$.ajax({
						url: commonUrl + '/inter/addChildren',
						type: 'post',
				 		timeout: 5000,
				 		data: sendData,
				 		beforeSend:function(){
			 				TDR.showLoader();
				 		},
				 		complete:function(){
			 		        TDR.hiddenLoader();
				 		},
						success: function(data) {	
							console.log(data);
							if(data.code == 0) {
								component.successTips('童军生成成功');
								page_js.toPerson();
							}else {
								component.validation(data.msg);
							}
						}
					})
				break;
				case 1:
					var scoutId = component.GetUrlParam('id');
					sendData['scoutId'] = scoutId;
					$.ajax({
						url: commonUrl + '/inter/updatescout',
						type: 'post',
				 		timeout: 5000,
				 		data: sendData,
				 		beforeSend:function(){
			 				TDR.showLoader();
				 		},
				 		complete:function(){
			 		        TDR.hiddenLoader();
				 		},
						success: function(data) {	
							console.log(data);
							if(data.code == 0) {
								component.successTips('童军修改成功');
								page_js.toPerson();
							}else {
								component.validation(data.msg);
							}
						}
					})
			} 
		}

		return this;
	}

	/* 公司介绍页面 */
	page_js.company = function() {

		/* 联系我们 */
		$('.contact-us').on('click', component.popContact);

		component.carousel(2);
		
		$.ajax({
			url: commonUrl + '/inter/introduce',
			type: 'post',
	 		timeout: 5000,
	 		beforeSend:function(){
 				TDR.showLoader();
	 		},
	 		complete:function(){
 		        TDR.hiddenLoader();
	 		},
			success: function(data) {	
				// console.log(data);
				if(data.code == 0) {
					$('.compny-inf').html(data.data.content);
				}else {
					component.validation(data.msg);
				}
			}
		})

		return this;
	}

	/* 跳转个人中心页 */
	page_js.toPerson = function() {
		setTimeout(function() {
			location.href = 'person.html';
		}, 1000);
	}

	/* 雷达图 */
	page_js.ardar = function(canvas, fArr, sArr) {
		function drawArdar(crx, width, height, rh) {
	        function draw(rArray, color, lineWidth, percent, isDash) {
	            if (percent === undefined) {
	                percent = 1;
	            }
	            ctx.save();
	                var pArray = [];
	                for (var i = 0, len = rArray.length; i < len; i++) {
	                    var theta = Math.PI * 2 * i / len + Math.PI / 6 - 2 * Math.PI / 3;
	                    
	                    pArray.push([rArray[i] * rh * Math.cos(theta)  * percent + height / 2 + 20, rArray[i] * rh * Math.sin(theta) * percent + height / 2 -20]);
	                }
                    
	                ctx.beginPath();
	                    ctx.moveTo(pArray[0][0], pArray[0][1]);

	                    for (var i = 1; i < len; i++) {
	                        if(isDash) {
	                            ctx.setLineDash([.4, 2]);  //虚线
	                        }
	                        ctx.lineTo(pArray[i][0], pArray[i][1]);
	                    }
	                ctx.closePath();

	                ctx.lineWidth = lineWidth;
	                ctx.strokeStyle = color;
	                ctx.stroke();
	            ctx.restore();

	            return this;
	        }

	        /* 周围文字 */
	        function drawText(textArray) {
	            ctx.save();
	                var r = 6 * rh;
	                var pArray = [];
	                for (var i = 0, len = textArray.length; i < len; i++) {
	                    var theta = Math.PI * 2 * i / len + Math.PI / 6 - 2 * Math.PI / 3;
	                    pArray.push([r * Math.cos(theta) + height / 2 + 20, r * Math.sin(theta) + height / 2 - 20]);
	                }

	                ctx.textBaseline = "middle";
	                ctx.textAlign="center";
	                ctx.font="12px Microsoft YaHei";
	                ctx.fillStyle="#bbb";
	                for (var i = 0; i < len; i++) {
	                    ctx.fillText(textArray[i], pArray[i][0], pArray[i][1]);
	                }
	            ctx.restore();

	            return this;
	        }

	        /* 点与分数 */
	        function drawDot(rArray, color,isPosition) {
	            ctx.save();
	                var pArray = [];
	                for (var i = 0, len = rArray.length; i < len; i++) {
	                    var theta = Math.PI * 2 * i / len + Math.PI / 6 - 2 * Math.PI / 3;
	                    pArray.push([rArray[i] * rh * Math.cos(theta)  + height / 2  + 20, rArray[i] * rh * Math.sin(theta) + height / 2 - 20]);
	                }
          // console.info(pArray);
	                for (var i = 0; i < len; i++) {
	                	if(rArray[i] != 0) {
   
		                    ctx.beginPath();
		                        ctx.arc(pArray[i][0], pArray[i][1], 3, 0, 2 * Math.PI);
		                        
		                        ctx.fillStyle = color;
		                        ctx.fill();
		                    ctx.closePath();

		                    
		                    ctx.beginPath();
		                        ctx.textBaseline = "hanging";
		                        ctx.font="normal 12px Microsoft YaHei";
		                        ctx.textAlign = "left";
		                        
		                        /* 分数位置 */
		                        if(isPosition) {
	                        	 	ctx.fillText(rArray[i], pArray[i][0] + 2, pArray[i][1] + 5);
	                        	 	ctx.fillStyle = '#444'; //自定义颜色 fillText与fillStyle 互换位置
		                        }else {
	                        	 	ctx.fillText(rArray[i], pArray[i][0] + 5, pArray[i][1] - 5);
	                        	 	ctx.fillStyle = '#aaa';
		                        }
		                      
		                    ctx.closePath();
	                	}
                    }
	               	
	            ctx.restore();

	            return this;
	        }

	        /* 提示 */
	        function drawTip() {
	        	ctx.font="normal 10px Microsoft YaHei";
	        	ctx.textAlign = "left";
//              console.info(w);
	        	ctx.beginPath();
	        		ctx.fillStyle = '#bbb';
	        		ctx.fillText('平均分', 80, 286);
	        		ctx.fillText('个人得分', 227, 286);
	        	ctx.closePath();
                
	        	ctx.beginPath();
	        		ctx.fillStyle = '#002f7b';
	        		ctx.fillRect(227, 270, 38, 1);
	        		ctx.arc(247, 270.5, 2, 0, 2 * Math.PI);
	        		ctx.fill();
	        	ctx.closePath();

	        	ctx.beginPath();
	        		ctx.fillStyle = '#d82731';
	        		ctx.fillRect(80, 270, 38, 1);
	        		ctx.arc(100, 270.5, 2, 0, 2 * Math.PI);
	        		ctx.fill();
	        	ctx.closePath();

	        	return this;
	        }

	        return {
	            draw: draw,
	            drawText: drawText,
	            drawDot: drawDot,
	            drawTip: drawTip
	        }
	    }
	    
	    var ctx = canvas.getContext("2d");

	    var w = canvas.width = document.querySelector('.chart').offsetWidth;
	    var h = canvas.height = 300;

	    var vw = document.body.offsetWidth;

	    if(vw < 375) {
	    	var rh = 17;
	    }else {
	    	var rh = 19;
	    }

	    var animation = new TDR.Animation(1000, TDR.Animation.linear).onUpdate(function (value) {
	        ctx.clearRect(0, 0, w, h);
	        
	        //六边形
	        for(var i = 1; i < 6; i++) {
	            var s = i;
	            var arr = Array.apply(null, Array(6)).map(function(item, i) { //生成长度为6 值相同 的数组 arr[i] * rh = 六边形间隔距离
	                return s;
	            });
//	            console.info(arr);
	            drawArdar(ctx, w, h, rh).draw(arr, "#ccc", 1);  
	        }

	        drawArdar(ctx, w, h, rh)
	            .draw(fArr, "#002f7b", 2, value)
	            .draw(sArr, "#c64554", 2, value, true)
	            .drawText(['乐于助人', '诚实守信', '忠诚服从', '勇敢快乐', '礼貌善良', '节俭卫生'])
	            .drawTip()
	    }).onComplete(function () {
	        drawArdar(ctx, w, h, rh)
	            .drawDot(fArr, "#002f7b", true)
	            .drawDot(sArr, "#c64554")
	    }).start();

	    return this;
	}

})(page);

/* 唤起输入框键盘按钮弹起 */
(function() {
	var saveBtn = $('.save-btn');
	var oHeight = $(document).height(); //屏幕当前的高度
	var isIos = /(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent); //判断iPhone|iPad|iPod|iOS

	if(!isIos && saveBtn) { 
		$(window).resize(function(){
			var nHeight = $(document).height(); //resize监听的高度
	        if(nHeight < oHeight){
	        	$('.save-btn').css("display","none");
		    }else{
		        $('.save-btn').css("display","block");
		    } 
	    });
	}
})()