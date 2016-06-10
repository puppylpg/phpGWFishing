	window.onload=function(){
		if(document.getElementById("message")){
			if(typeof(message_data) != "undefined"){
				message_data.con = message_data.con.replace(/\\\"/ig, "");
				document.getElementById("message").innerHTML = message_data.con;
			}
			if(typeof(bulletin_data) != "undefined"){
				bulletin_data = bulletin_data.replace(/\\\"/ig, "");
				document.getElementById("message").innerHTML = bulletin_data;
			}
		}
 	    var host_url=getHost();
		var host_url = window.location.host;
 	   // var services=document.getElementById("goto_services");
		//if(services){
 			//services.href='http://'+host_url+':8800/';
		//}
		if(document.getElementById("goto_reg")){
			document.getElementById("goto_reg").href ='http://'+host_url+':8800/index.php?action=userregister';
		}
		
		//网关模式
		var cook=getCookie("srun_login");
		if(cook!=null)
		{
			var arr=cook.split("|");
			if(document.form1){
				document.form1.uname.value=arr[0];
				document.form1.pass.value=arr[1];
			}
			if(arr[1] != "")
			{
				document.form1.save_me.checked=true;
			}
		}
		
		//ipoe认证方式
		var u=document.location.search.substring(1);	
		var is_online=1;
		if(u!="")//解析URL
		{
			var arr1 = u.split("&");
			var i=0;
			for(i=0; i<arr1.length; i++)
			{
				if(arr1[i] == "")
					continue;
				var arr2 = arr1[i].split("=");
				if(arr2[0] == "wlanacname")
				{
					document.form1.wlanacname.value=arr2[1];
				}
				else if(arr2[0] == "wlanuserip" || arr2[0] == "ip")
				{
					document.form1.user_ip.value=arr2[1];
				}
				else if(arr2[0] == "ssid")
				{
					document.form1.ssid.value=arr2[1];
				}
				else if(arr2[0] == "vlan")
				{
					document.form1.vlan.value=arr2[1];
				}
				else if(arr2[0] == "portal_ip")
				{
					document.form1.nas_ip.value=arr2[1];
				}
				else if(arr2[0] == "client_id" || arr2[0] == "mac")
				{
					document.form1.mac.value=arr2[1];
				}
				else if(arr2[0] == "wbaredirect" || arr2[0] == "userurl" || arr2[0] == "URL" || arr2[0] == "url")
				{
					document.form1.wbaredirect.value=arr2[1];
					jump_to = arr2[1];
				}		
				else if(arr2[0] == "is_debug")
				{
					document.form1.is_debug.value=arr2[1];
				}
				else if(arr2[0] == "ac_type")
				{
					document.form1.ac_type.value=arr2[1];
				}
				else if(arr2[0] == "rad_type")
				{
					document.form1.rad_type.value=arr2[1];
				}
				else if(arr2[0] == "local_auth")
				{
					document.form1.local_auth.value=arr2[1];
				}
				else if(arr2[0] == "ac_id")
				{
					document.form1.ac_id.value=arr2[1];
				}		
			}
		}
		var num = getCookie("password_error_num");
		if(num != null && num >5){
             document.getElementById("show_checkcode").style.display = 'block';
		}
 	}


     function postData(theAction,theMethod,theData)
     {
       var thePost = (window.XMLHttpRequest)? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
       switch(theMethod)
       	{
       		case "post":
       			thePost.open("POST",theAction,false);
       			thePost.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
       			thePost.send(theData);
       			break;
       		case "get":
       			thePost.open("GET",theAction+"?"+theData,false);
       			thePost.send("");
       			break;
       		default:
       			return "";
       	}
      	return thePost.responseText;
      }
      
     function jump_to(url1)
     {
      	if(url1 != "")
      	{
      		window.location.href=url1;
      	}
      	else
      	{
      		var u = location.search+"";
      		if(u.length>5)
      		{
				u = u.substring(5) ;
				if(u.substr(0,7)=='http://'){
					u = u +"#"+Math.round(Math.random()*10000);
				}else{
					u = 'http://'+u +"#"+Math.round(Math.random()*10000);
				}
      			window.location.href=u;	
      		}
      	}
     }
      
      function do_login()
      {
	      	var uname=(document.form1.uname.value).toLowerCase();
	      	var pass=document.form1.pass.value;
			var num = 0;
	      	if(uname == '请输入用户名' || uname == '用户名'){
	      		uname = '';
	      	}
	      	if(pass == '请输入密码' || pass == '密码'){
	      		pass = '';
	      	}
	      	if(uname=="")
	      	{
	      		alert("请填写用户名");
	      		document.form1.uname.focus();
	      		return;
	      	}
	      	if(pass=="")
	      	{
	      		alert("请填写密码");
	      		document.form1.pass.focus();
	      		return;
	      	}
			if( document.getElementById("show_checkcode").style.display == 'block'){
				var checkcode = document.form1.chekcode.value;
				if(checkcode == ""){
					alert("请输入校验码");
					document.form1.chekcode.focus();
					return;
				} else{
					 $.post("change_user_balance.php", {action:"check_checkcode", checkcode : checkcode},function(data){
	        			if(data == 0){
							alert("输入验证码不正确");
							document.form1.chekcode.focus();
							return false;
						}else{
					      	//密码md5加密传送
					      	var pass1=hex_md5(pass);
					      	var pass2=pass1.substr(8,16);
					      	
					      	var drop = (document.form1.drop.value == 1) ? 1 : 0;
					      	var data="username="+uname+"&password="+pass2+"&drop="+drop+"&type=1&n=100";
					      	
					      	var con=postData("/cgi-bin/do_login", "post", data);
					      	//alert(con); 
					      	var p=/^[\d]+$/;
					      	if(p.test(con))
					      	{
					      		document.form1.uid.value=con;
					      		if(document.form1.save_me.checked) //写COOKIE
					      		{
					      			setCookie("srun_login",uname+"|"+pass);
					      		}
					      		else
					      		{
					      			delCookie("srun_login");
					      		}
								window.location.replace("/index.php");
					      		/*if(location.search != "")
					      		{				
									
					      			//window.open("login.html"+location.search+","+con+","+uname,"user_login","width=428,height=296"); 	
					      		}
					      		else
					      		{				
									window.location.replace("/index.php");
					      			//window.open("login.html?"+location.search+","+con+","+uname,"user_login","width=428,height=296");
					      		}*/
					      		setTimeout("jump_to('')", 1000);	
					      		return;
					      	}else{
								if (con == "status_error" || con == "online_num_error" || con == "flux_error" || con == "minutes_error") {
									var result = postData("../change_user_balance.php", "post", "action=get_user_data&username="+uname);
									window.location.replace("../index.php?error="+con);
									return;
								}
							}
							var info = login_info(con);
							if(info != ''){
								var num = "";
								if(con == 'password_error'){
									num = getCookie("password_error_num") ? getCookie("password_error_num") : 0;
									num++;
									setCookie("password_error_num",num);
								}
								if(num !="" && num > 5){
									document.getElementById("show_checkcode").style.display = 'block';
								}
								alert(info);
							}else{
								alert("找不到认证服务器");
							}
						
						}
					 });
				}
			}else{
		      	//密码md5加密传送
		      	var pass1=hex_md5(pass);
		      	var pass2=pass1.substr(8,16);
		      	
		      	var drop = (document.form1.drop.value == 1) ? 1 : 0;
		      	var data="username="+uname+"&password="+pass2+"&drop="+drop+"&type=1&n=100";
		      	var con=postData("/cgi-bin/do_login", "post", data);
		      	//alert(con); 
		      	var p=/^[\d]+$/;
		      	if(p.test(con))
		      	{
		      		document.form1.uid.value=con;
		      		if(document.form1.save_me.checked) //写COOKIE
		      		{
		      			setCookie("srun_login",uname+"|"+pass);
		      		}
		      		else
		      		{
		      			delCookie("srun_login");
		      		}
					window.location.replace("/index.php");
		      		/*if(location.search != "")
		      		{				
		      			//window.open("login.html"+location.search+","+con+","+uname,"user_login","width=428,height=296"); 	
		      		}
		      		else
		      		{				
						window.location.replace("/index.php");
		      			//window.open("login.html?"+location.search+","+con+","+uname,"user_login","width=428,height=296");
		      		}*/
		      		setTimeout("jump_to('')", 1000);	
		      		return;
		      	}else{
					if (con == "status_error" || con == "online_num_error" || con == "flux_error" || con == "minutes_error") {
						var result = postData("../change_user_balance.php", "post", "action=get_user_data&username="+uname);
						window.location.replace("../index.php?error="+con);
						return;
					}
				}
				var info = login_info(con);
				if(info != ''){
					var num = "";
					if(con == 'password_error'){
						num = getCookie("password_error_num") ? getCookie("password_error_num") : 0;
						num++;
						setCookie("password_error_num",num);
					}
					if(num !="" && num > 5){
						document.getElementById("show_checkcode").style.display = 'block';
					}
					alert(info);
				}else{
					alert("找不到认证服务器");
				}
			}
      }
     function login_info(key){
		var arr = new Array();
		arr['user_tab_error'] = '认证程序未启动';
		arr['username_error'] = '用户名错误,请重新输入';
		arr['non_auth_error'] = '您无须认证，可直接上网';
		arr['password_error'] = '用户名和密码不匹配，请检查后重新输入';
		arr['status_error'] = '用户已欠费，请尽快充值。';
		arr['available_error'] = '用户已禁用,请联系系统管理员';
		arr['ip_exist_error'] = '您的IP尚未下线，请等待2分钟再试。';
		arr['usernum_error'] = '用户数已达上限';
		arr['online_num_error'] = '该帐号的登录人数已超过限额\n如果怀疑帐号被盗用，请联系系统管理员。';
		arr['mode_error'] = '系统已禁止WEB方式登录，请使用客户端';
		arr['time_policy_error'] = '当前时段不允许连接';
		arr['flux_error'] = '您的流量已超支';
		arr['minutes_error'] = '您的时长已超支';
		arr['ip_error'] = '您的IP地址不合法';
		arr['mac_error'] = '您的MAC地址不合法';
		arr['sync_error'] = '您的资料已修改，正在等待同步，请2分钟后再试。';
		return arr[key];
	 }
     function force_logout()
     {
      	
      	var uname=document.form1.uname.value;
      	var pass=document.form1.pass.value;
      	if(uname == '请输入用户名'){
      		uname = '';
      	}
      	if(pass == '请输入密码'){
      		pass = '';
      	}
      	if(uname && pass && !confirm("如果您的用户名有多个用户在线上，这些用户都将被强制下线，是否继续？"))
      		return; 	
      	
      	var con="";
      	if(uname == "")
      	{
      		con=postData("/cgi-bin/do_logout", "get", "");
      	}
      	else
      	{
      		var drop=(document.form1.drop.checked==true)?1:0;
      		var data="username="+uname+"&password="+pass+"&drop="+drop+"&type=1&n=1";
      		con=postData("/cgi-bin/force_logout", "post", data);
      	}
      	//alert(con);
      	switch(con)
      	{
      		case "user_tab_error":
      			alert("认证程序未启动");
      			break;
      			
      		case "username_error":
      			alert("用户名错误，请重新输入");
      			document.form1.uname.focus();
      			break;
      			
      		case "password_error":
      			alert("用户名和密码不匹配，请重新输入");
      			document.form1.pass.focus();
      			break;
      			
      		case "logout_ok":
      			alert("注销成功，请等1分钟后登录。");
      			break;
      			
      		case "logout_error":
      			alert("您不在线上");
      			break;
      			
      		default:
      			alert(con);
      			break;		
      	} 	
     }
      
     function get_uid()
     {
      	return document.form1.uid.value;
     }

     function get_uname()
     {
     	return document.form1.uname.value;
     }

     function setCookie(name,value)
     {
         var Days = 360; 
         var exp  = new Date(); 
         exp.setTime(exp.getTime() + Days*24*60*60*1000);
         document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString();
     }

     function getCookie(name)      
     {
         var arr = document.cookie.match(new RegExp("(^| )"+name+"=([^;]*)(;|$)"));
         if(arr != null) 
          	return unescape(arr[2]); 
          return null;
     }

     function delCookie(name)//删除cookie
     {
         var exp = new Date();
         exp.setTime(exp.getTime() - 1);
         var cval=getCookie(name);
         if(cval!=null) 
         	document.cookie= name + "="+cval+";expires="+exp.toGMTString();
     }

     function getHost(url){
	     var host = "null";
	     if (typeof url == "undefined" ||
	     null == url) 
	         url = window.location.href;
	     var regex = /.*\:\/\/([^\/]*).*/;
	     var match = url.match(regex);
	     if (typeof match != "undefined" &&
	     null != match) 
	         host = match[1];
	     return host;
	 }
	
	//srun_portal
	function do_force_logout()
	{
		if(document.form1.uname.value=="")
		{
			alert("请填写您的帐号");
			frm.uname.focus();
			return false;
		}

		if(document.form1.pass.value=="")
		{
			alert("请填写您的密码");
			frm.pass.focus();
			return false;
		}
		document.form2.uname.value=document.form1.uname.value;
		document.form2.pass.value=document.form1.pass.value;
		document.form2.submit();
	}
	function do_chk(frm)
	{
		if(frm.uname.value=="")
		{
			alert("请填写您的帐号");
			frm.uname.focus();
			return false;
		}
		
		if(frm.pass.value=="")
		{
			alert("请填写您的密码");
			frm.pass.focus();
			return false;
		}
		delCookie("srun_login");
		if(frm.save_me.checked) //写COOKIE
		{
			setCookie("srun_login",frm.uname.value+"|"+frm.pass.value+"|"+frm.user_ip.value+"|"+frm.mac.value+"|"+frm.nas_ip.value+"|"+frm.ac_id.value);
		}
		else
		{
			setCookie("srun_login",frm.uname.value+"||"+frm.user_ip.value+"|"+frm.mac.value+"|"+frm.nas_ip.value+"|"+frm.ac_id.value);
		}
		
		var d = "action=login&username="+frm.uname.value+"&password="+frm.pass.value+"&ac_id="+frm.ac_id.value+"&type=1&wbaredirect="+frm.wbaredirect.value+"&mac="+frm.mac.value+"&user_ip="+frm.user_ip.value;
					
		var res = postData("/cgi-bin/srun_portal","post", d);
		
		var p = /help.html/;
		var p1 = /login_ok/;
		if(p.test(res) || p1.test(res))
		{
			window.open("srun_portal_succeed.html", "","width=345,height=310,left=0,top=0,resizable=1");
			setTimeout("jump_to1('')", 1000);
		}
		else
		{
			alert(res);
		}
		
		return false;
	}

	function jump_to1(url1)
	{
		if(url1 != "")
		{
			window.location.href=url1;
		}
		else
		{
			var u = Request('url');
			if(u!=''){
				u = u.indexOf('http')>-1?u:'http://'+u;
				u = u.indexOf('?')>-1?u+"&"+Math.round(Math.random()*10000):u+"#"+Math.round(Math.random()*10000); 	
				//alert(u);	
				window.location.href=u;	
			}
		}
	}
	 function Request(argname){
		var url = document.location.href;
		var arrStr = url.substring(url.indexOf("?")+1).split("&");
		for(var i =0;i<arrStr.length;i++){
		var loc = arrStr[i].indexOf(argname+"=");
			if(loc!=-1){
				return arrStr[i].replace(argname+"=",'').replace("?",'');
				break;
			}
		}
		return '';
	}
function judge_login(){
	//var host_url = getHost();
	var host_url = "10.111.1.67";
	var uname = $("input[name='uname']").val();
	var pass = $("input[name='pass']").val();
	if(uname != ''){
		$.ajax({  
			 type: "get",  
			 url: "http://"+host_url+":8800/index.php?action=login&ts=login&username="+uname+"&password="+pass+"&type=cookie_login",  
			 dataType: "jsonp",  
			 success: function (val) {
				var data = val.code;
				if(data == '101'){
					window.location.replace("http://"+host_url+":8800/index.php") ;
					return true;
				}else{
					window.location.replace("http://"+host_url+":8800") ;
				}
			 }
		 });
	}else{
		window.location.replace("http://"+host_url+":8800") ;
	}
}
function newgdcode(obj, url){
obj.src = url + '?nowtime=' + new Date().getTime();
//后面传递一个随机参数，否则在IE7和火狐下，不刷新图片
}
