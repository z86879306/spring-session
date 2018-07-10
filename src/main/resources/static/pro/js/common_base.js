var common_base = {};
(function(common_base_js){
	var resJson ={};
	//brage
	var style = 'background-color:rgba(255,255,255,1);  color:#000; border:none;text-align:center;';
	//弹出信息方法
	common_base_js.show_msg = function(config){		
			if(config.btns == 2){
				layer.open({
					btns:config.btns,
					btn:config.btn,
					content: config.content,
					skin: config.skin,
					shadeClose:false,
					style:config.style||style,
					yes:function(){
//						config.yes_callback();
						if(typeof(config.yes) == 'function'){
			 				config.yes();
			 			}
					},
					no:function(){
						if(typeof(config.no) == 'function'){
			 				config.no();
			 			}

					}
				});

			}else if(config.btns == 1){
				layer.open({
					btns:config.btns,
					btn:config.btn,
					content:config.content,
					skin: config.skin,
					shadeClose:false,
					style:config.style||style,
					yes:function(){
						if(typeof(config.yes) == 'function'){
			 				config.yes();
			 			}
					}
				});
			}else{
				if(config.shadeClose == false){
					if(config.time == null || typeof(config.time) == "undefined"){
						config.time = 5;
					}
					
					layer.open({
						content:config.content,
						style: style,
						shadeClose:false
					});
					

				}else{
					if(config.time == null || typeof(config.time) == "undefined"){
						config.time = 5;
					}
					
					layer.open({
						content:config.content,
						style: style,
						time: config.time
					});					
				}				
			}		
	}
	//
	common_base_js.show_load = function(){
		layer.open({
			type:2,
			shadeClose:false,
//			content:'正在努力上传...'
		});
	}
   //关闭弹出窗口方法
	common_base_js.closeAll  = function(){
		
			layer.closeAll();
		
	}
	 //统一请求数据方法
	 common_base_js.request = function(config){
//	 	alert('乐乐，快去调用3参')
	 	$.ajax({
	 		url:config.url,
	 		type:config.type||'post',
	 		data:config.data||{},
	 		dataType:config.dataType||'json',
	 		beforeSend:function(){
	 			if(typeof(config.beforeSend) == 'function'){
	 				config.beforeSend();
	 			}
	 		},
	 		success:function(result){
	 			if(typeof(config.success) == 'function'){
	 				config.success(result);
	 			}
	 		},
	 		error:function(error){
	 			if(typeof(config.error) == 'function'){
	 				config.error(error);
	 			}

	 		}

	 	});
	 }
	 common_base_js.requestToken = function(config){
//	 	alert('3参已开启，乐乐真棒。');
		
		common_base_js.getToken(function(resJson){		
				if(JSON.stringify(config.data)=='{}'){
					var jsonTmpl = JSON.parse(resJson);
				}else{
					var jsonTmpl = eval('('+(JSON.stringify(config.data)+resJson).replace(/}{/,',')+')');
				}
			 	$.ajax({
			 		url:config.url,
			 		type:config.type||'post',
		            data:jsonTmpl||{},
			 		dataType:config.dataType||'json',
			 		beforeSend:function(){
			 			if(typeof(config.beforeSend) == 'function'){
			 				config.beforeSend();
			 			}
			 		},
			 		success:function(result){
			 			if(typeof(config.success) == 'function'){
			 				config.success(result);
			 				
			 			}
			 		},
			 		error:function(error){
			 			if(typeof(config.error) == 'function'){
			 				config.error(error);
			 			}
		
			 		}
			 	});
		});
	 	
	 }
	 common_base_js.requestLogin = function(config){
		common_base_js.getTokenLogin(function(){
			var jsonTmpl = eval('('+(JSON.stringify(config.data)+resJson).replace(/}{/,',')+')');
		 	$.ajax({
		 		url:config.url,
		 		type:config.type||'post',
	            data:jsonTmpl||{},
		 		dataType:config.dataType||'json',
		 		beforeSend:function(){
		 			if(typeof(config.beforeSend) == 'function'){
		 				config.beforeSend();
		 			}
		 		},
		 		success:function(result){
		 			if(typeof(config.success) == 'function'){
		 				config.success(result);
		 			}
		 		},
		 		error:function(error){
		 			if(typeof(config.error) == 'function'){
		 				config.error(error);
		 			}
	
		 		}
		 	});
		});
	 	
	 }
	common_base_js.dropLoad = function(config){
	 	var that =this;
	 	 	
	 	var dropload=config.obj.dropload({
				autoLoad:config.autoLoad||true,
				scrollArea:config.scrollArea||window,
				threshold:config.threshold||100,			
				domDown : {
	            domClass   : 'dropload-down',
	            domRefresh : '<div class="dropload-refresh">↑上拉加载更多</div>',
	            domLoad    : '<div class="dropload-load"><span class="loading"></span>加载中...</div>',
	            domNoData  : '<div class="dropload-noData">已加载全部数据</div>'
	        },
	        loadDownFn : function(me){		
	        	if(typeof(config.loadDownFn) == 'function'){	        		
	        		config.loadDownFn(me);	        		        			 				
	 			}	        	
	        },
//	        loadUpFn: function(me){				
//	        	if(typeof(config.loadUpFn) == 'function'){
//	 				config.loadUpFn(me);
//	 			}else{
//	 				return false ;
//	 			}
//	        }

	        })
	 	 }
	
	common_base_js.dropLoad_lock = function(obj){
			obj.lock();			
        };
	common_base_js.dropLoad_unlock = function(obj){
			obj.unlock();
	    };
	common_base_js.dropLoad_reset = function(obj){
			obj.resetload();			
	    };
	common_base_js.dropLoad_noData = function(obj){
			obj.noData();
	    };
	//轮播
	common_base_js.swiper=function(config){
		var _obj=config.obj||'mySwiper';
	 	var cont=config.cont||'.swiper-container';//容器
	 	var autoplay=config.autoplay||0;//自动播放时间，单位毫秒
	 	var direction=config.direction||'horizontal';//方向
	 	var speed=config.speed||300;//速度
	 	var pagination=config.pagination||'null';//分页
	 	var loop=config.loop||false;//环路
	 	var slidesPerView=config.slidesPerView||1;
	 	
//	 	console.log(config);
	 	
	 	_obj=new Swiper(cont,{
	 		autoplay:autoplay,
	 		speed:speed,
	 		direction:direction,
	 		pagination:pagination,
	 		loop:loop,
	 		slidesPerView:slidesPerView,
	 		onInit:function(swiper){
	 			if(typeof(config.onInit) == 'function'){	        		
	        		config.onInit(swiper);	        		        			 				
	 			}	
	 		}
	 	})
	 	
	} 
	common_base_js.swpSlideTo = function(swiper,index){
		swiper.slideTo(index,1000,false);
    };
    common_base_js.swpSlideIndex = function(config){
    	var cont=config.cont||'.swiper-container';//容器
//		console.log($(cont).find('.active').index());
		return $(cont).find('.active').index();
//		$(swiper.slides)
    };
	//快速导航关闭
	common_base_js.fastNavClose=function(){
		$(function(){
			$('.fixedNav').hide();
		})
	}
    common_base_js.to_url = function(url){
 		url = 'index.php?s=/Webchat/' + url;
 		window.location.href = url;
 	}
    common_base_js.isiPhone=function(){
    	var b_version=navigator.appVersion,
	    iPhone = "iPhone";
	 
		function isContains(b_version, iPhone) {
		    return new RegExp(iPhone).test(b_version);
		}
		return (isContains(b_version, iPhone));
    }
    common_base_js.toDownload=function(){
//     	var u = navigator.userAgent; 
// 		var ua = navigator.userAgent.toLowerCase(); 
// 		var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端 
// 		var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端 
// 		  if(isiOS){
// 		  	console.log('ios');
// //		    window.location.href='https://itunes.apple.com/cn/app/应用名'
// 		  }else if(isAndroid){
// 		  	console.log('isAndroid');
// //		    window.location.href='http://a.app.qq.com/o/simple.jsp?pkgname=应用名'
// 		  }
		window.location.href="/index.php?s=/Home/Index/down";
    }
    
    common_base_js.brageInit=function(){
    	function setupWebViewJavascriptBridge(callback) {
		    if (window.WebViewJavascriptBridge) {
		        callback(WebViewJavascriptBridge)
		    } else {
		        document.addEventListener(
		            'WebViewJavascriptBridgeReady'
		            , function() {
		                callback(WebViewJavascriptBridge)
		            },
		            false
		        );
		    }
		
		    if (window.WVJBCallbacks) { return window.WVJBCallbacks.push(callback); }
		    window.WVJBCallbacks = [callback];
		    var WVJBIframe = document.createElement('iframe');
		    WVJBIframe.style.display = 'none';
		    WVJBIframe.src = 'wvjbscheme://__BRIDGE_LOADED__';
		    document.documentElement.appendChild(WVJBIframe);
		    setTimeout(function() { document.documentElement.removeChild(WVJBIframe) }, 0)
		}
    }
    //安卓通信
    common_base_js.isLogin=function(data,callback){
	    setupWebViewJavascriptBridge(function(bridge) {
			bridge.callHandler('isLogin',data,function(resp){
				if(resp=='没有登录'){
					if(data=='redirect'){ 
						common_base.showLogin();
					}else{
						
					}
				}
	    		callback(resp);
		     });
		});
    }
    common_base_js.androidInit=function(){
    	var isiPhone = common_base.isiPhone();	
    	setupWebViewJavascriptBridge(function(bridge) {
    		if(!isiPhone){
				bridge.init(function(message, responseCallback) {			  
				   var data = {
					   'Javascript Responds': 'Wee!'
				   };			  
				   responseCallback(data);
			   });
			}
		});
    }
    common_base_js.showLogin=function(){
	    setupWebViewJavascriptBridge(function(bridge) {
			bridge.callHandler('showLogin','0',function(resp){
		     });
		});
    }
    //setTitle-type
	//1、橙色
	//2、绿色
	//3、灰色
	//4、灰色，右边有 rightBarButtonItem
	//5、个人中心
	//6、首页
	common_base_js.setTitle=function(data){
	
    	setupWebViewJavascriptBridge(function(bridge) {
			bridge.callHandler('setTitle',data,function(resp){
	    		alert(resp);
		     });
		});
    }
    common_base_js.saveLogin=function(data,callback){
       	setupWebViewJavascriptBridge(function(bridge) {
			bridge.callHandler('saveLogin',data,function(resp){
//	    		alert(resp);
	    		callback();
		     });
		     
		});
    }
    common_base_js.getToken=function(callback){
		setupWebViewJavascriptBridge(function(bridge) {
				bridge.callHandler('getToken','00000',function(resp){
		    		resJson= resp;
//		    		alert('3参已开启，乐乐真棒。');
		    		callback(resp);
			    });
		    
		     
		});
    }
    common_base_js.getTokenLogin=function(callback){
		setupWebViewJavascriptBridge(function(bridge) {
			bridge.callHandler('getToken2','loginin',function(resp){
				resJson= resp;
	    		callback();
		     });
		     
		});
    }
    
    common_base_js.toLogin=function(){
		setupWebViewJavascriptBridge(function(bridge) {
			bridge.callHandler('toLogin','00000',function(resp){
	    		alert(resp);
		     });
		});
    }
    common_base_js.footBarCtr=function(data){
		setupWebViewJavascriptBridge(function(bridge) {
			bridge.callHandler('footBarCtr',data,function(resp){
	    		alert(resp);
		     });
		});
    }
    //获取地理位置
//	common_base_js.getGPS=function(flag,callback){
//	     var _flag=flag||true;
//	     alert('flag:'+_flag)
//	     if(_flag){
//	     	common_base_js.getGPS1(callback)
//	     }else{
//	     	common_base_js.getGPS2(callback)
//	     }
//	     
//  }
	//设置地理位置
//	common_base_js.setGPS=function(data){
//	     window.WebViewJavascriptBridge.callHandler('setGPS',data, function(responseData) {
//			alert(responseData);
//		});
//  }
	//获取相册图片
    common_base_js.getPicUrl=function(id){
		setupWebViewJavascriptBridge(function(bridge) {
			bridge.callHandler('getPicUrl',id,function(resp){
//	    		alert(resp);
		    });
		     
		    bridge.registerHandler("shopImage",function(data,responseCallback){
//		    	alert(data);
		    	var strJson=eval("("+data+")");
		    	var _src=strJson.datas;
		    	var _id=strJson.id;
		    	$('#'+_id).find('img').attr('src',_src);
		    	$('#'+_id).addClass('uploaded');
		    	$('#'+_id).find('img').load(function(){
		    		common_base.closeAll();
		    	})
//		    	alert($('#'+_id));

                responseCallback("button js callback");
            });
            bridge.registerHandler("starUpLoadImage",function(data,responseCallback){
            	common_base.show_load();
//          	alert(data);
            })
		});
    }
    //注销-click
    common_base_js.logout=function(){
    	setupWebViewJavascriptBridge(function(bridge) {
			bridge.callHandler('logout','',function(resp){
//	    		alert(resp);
//	    		localStorage.clear();
		     });
		});
    }
    //消息推送开关 open 开 close 关
    common_base_js.appPush=function(data){
		setupWebViewJavascriptBridge(function(bridge) {
			bridge.callHandler('appPush',data,function(resp){
	    		alert(resp);
		     });
		});
    }
    //test
    common_base_js.showLog=function(data){
    	var id=localStorage.getItem('id');
    	var phone=localStorage.getItem('phone');
    	var name=localStorage.getItem('name');
    	alert('id:'+id+',phone:'+phone+',name:'+name)
    }
    
    
    
    
})(common_base);
//common_base.bridgeInit();
//common_base.androidInit();