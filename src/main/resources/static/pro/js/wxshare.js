var wxshare = {};
(function(obj){
	obj.init = function(){
//		this.refreshUrl();
		this.loadData();
		this.bindEvent();
	}

	
	obj.loadData = function(){
		var trainId = component.GetUrlParam('id');
		$.ajax({
				url: commonUrl + '/inter/share',
				data:{trainId:trainId},
				type:"post",
				success:function(res){
					var data =res.data;
					var desc = data.desc;
					if(desc==null){desc = data.title;};
                	var shareData={
					"title":data.title,
					"desc":desc,
					"link":data.link,
					"imgUrl":data.imgUrl,
					"pkg":{
						"appId": data.pkg.appid,
						"timestamp":data.pkg.timestamp,
						"nonceStr": data.pkg.nonceStr,
						"signature": data.pkg.signature
					}
				}
				wechat.init(shareData);               	
               },
                error:function(){               	
                }
        });
		
	}


	obj.refreshUrl = function(data_url){
		var url = "",that= this;		
		function getQueryString(name) {//根据字段看网址是否拼接&字符串
          var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
          var r = window.location.search.substr(1).match(reg);
          if (r != null)
              return unescape(r[2]);
          return null;
        }
        var from = getQueryString('from');
        var appinstall = getQueryString('appinstall');
        var sec = getQueryString('sec');
        var timekey = getQueryString('timekey');
      
        if(from || appinstall || sec || timekey){//假如拼接上了        	
        	url = that.funcUrlDel('from'); 	
         	url = url.substring(0, url.indexOf('&'));
//          window.location.href = url;
        }
	}	
	
	//删除url指定参数名并返回新的url
	obj.funcUrlDel = function(name){
		var loca = window.location;
        var baseUrl = loca.origin + loca.pathname + "?";
        var query = loca.search.substr(1);
        if (query.indexOf(name) > -1) {
            var obj = {};
            var arr = query.split("&");

            for (var i = 0; i < arr.length; i++) {
                arr[i] = arr[i].split("=");
                obj[arr[i][0]] = arr[i][1];
            };

            delete obj[name];
            var url = baseUrl + JSON.stringify(obj).replace(/[\"\{\}]/g, "").replace(/\:/g, "=").replace(/\,/g, "&");
            return url;
        };

	}
	
	
	
	obj.bindEvent = function(){
		$(".detil-footer .detil_share").on("click",function(){
			$(".shakeMask").show();
		});
		$('.shakeMask').click(function(){
				$(this).hide()
			});
	}
	
	
})(wxshare);
