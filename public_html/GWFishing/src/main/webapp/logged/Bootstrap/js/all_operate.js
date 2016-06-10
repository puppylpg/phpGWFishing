$(function(){
	var cur_index = 0;
	//如果有时间参数，展开详情 是展开状态
	var detail_status = getUrlParam('start_time');
	if(detail_status){
		$('#show_hide').html('隐藏详情');
		$('#detail_img').attr('src','/Bootstrap/images/icon_shangla.png');
		$("#charge_list").show();
		$('.pagination').show();
	}else{
		$('#show_hide').html('展开详情');
		$('#detail_img').attr('src','/Bootstrap/images/icon_xiala.png');
		$("#charge_list").hide();
		$('.pagination').hide();
	}
	var gd_ctm = $(".y_gd_list li").length;
	var gd_contain_ctm = 6;

	height('y_side_l','y_content');

	$(window).resize(function(){
		height('y_side_l','y_content');
	});
	$(".y_gd_next").click(function(){
		if (cur_index + gd_contain_ctm < gd_ctm)
		{
			cur_index++;
			$('.y_gd_list').stop().animate({left: '-=94px'}, 200);
		}
	});
	$(".y_gd_pre").click(function(){
		if (cur_index > 0)
		{
			cur_index--;
			$('.y_gd_list').stop().animate({left: '+=94px'}, 200);
		}
	});

	//支付宝转账
	$("#btn_box_zfb").click(function(){
		Boxy.tip('此功能尚未开通',function(){},{iserror: true});
	});
	//冲流量、充值、一卡通转账（目前只保留充流量卡）
	$('.box_btn_bind').click(function(){
		var box = Boxy.ask($("#changesuc").html(), ['确认', '取消'], function(r){
			if (r == '确认') {
				money_success(box.getContent());
			}else{
			}
		},{
			titleicon: 'icon-icon_currency',
			title: '流量卡',
			modal: true,
			closeable: true,
			bottom: [{
				id: 'chongll_radio',
				title: '流量卡充流量'
			}]
		});

		var that = box.getContent();
		$("#chongll_radio").on('click', function(){
			$("#panel_ykt", that).hide();
			$("#panel_cls", that).show();
			that.attr('data-type', 'type-llk');
			box.setTitle('流量卡充流量');
			box.getContent().find(".chonginput").attr('placeholder', '请输入流量卡号').attr("data-type", 'chongll');
			box.getContent().find(".cord_bg").removeClass("d");
			$(".boxy_title_i").addClass('icon-droplet').removeClass('icon-icon_creditcard').removeClass('icon-icon_currency');
		});
		/*
		$("#chongzhi_radio").on('click', function(){
			$("#panel_ykt", that).hide();
			$("#panel_cls", that).show();
			that.attr('data-type', 'type-czk');
			box.setTitle('充值卡充网费');
			box.getContent().find(".chonginput").attr('placeholder', '请输入充值卡号').attr("data-type", 'chongzhi');
			$(".boxy_title_i").removeClass('icon-droplet').removeClass('icon-icon_creditcard').addClass('icon-icon_currency');
			box.getContent().find(".cord_bg").addClass("d");
		});

		$("#zhuanzhang_radio").on('click', function(){
			$("#panel_ykt", that).show();
			$("#panel_cls", that).hide();
			that.attr('data-type', 'type-ykt');
			box.setTitle('一卡通转网费');
			$(".boxy_title_i").addClass('icon-icon_creditcard').removeClass('icon-droplet').removeClass('icon-icon_currency');
		});
		*/
		box.getContent().find("#money_slide").slider({
			range: "min",
			value: 0,
			min:1,
			max: 100,
			slide: function(event, ui){
				box.getContent().find('#moneycount').text(ui.value);
			}
		});

		box.getContent().find('#moneycount').text(box.getContent().find("#money_slide").slider('value'));
		var btnid = $(this).attr('id');
		if (btnid == 'btn_box_llk')
			$("#chongll_radio").trigger('click');
		else if (btnid == 'btn_box_czk')
			$("#chongzhi_radio").trigger('click');
		else
			$("#zhuanzhang_radio").trigger('click');
	});

	//消费保护
	$('#btn_box_protect_ll').click(function(){
		var box = Boxy.ask($("#llprotect").html(), ['确认', '取消'], function(r){
			if (r == '确认') {
				spending_protect(box.getContent());
			}else{
			}
		},{
			titleicon: 'icon-icon_lock_alt',
			title: '消费保护',
			modal: true,
			closeable: true
		});

		box.getContent().find("#liuliang_slide").slider({
			range: "min",
			value: $("input[name='Iext2']").val(),
			min:0,
			//max: $("#balance_info").html(),
			max: 100,
			slide: function(event, ui){
				box.getContent().find('#liuliangcount').text(ui.value+'元');
			}
		});

		//是否启用
		var bt = box.getContent().find(".answers");
		bt.prepend("<p class='pull-left x_foot_left'><input style='margin-top:-2px' type='checkbox' id='sfqy_llbh'>启用</p>");
		var is_open_iext2_val = $("input[name='is_open_iext2']").val();
		if(is_open_iext2_val == 1) {
			bt.find("#sfqy_llbh").attr("checked", true);
		}
		bt.find("#sfqy_llbh").click(function(){
			if ($(this).attr('checked')){
				//取消选中
				console.log(1);
			}else{
				//选中
				console.log(2);
			}
		});
		box.getContent().find('#liuliangcount').text(box.getContent().find("#liuliang_slide").slider('value')+'元');
	});

	//左侧单个ip地址下线（可选择性的注销）
	$(".unonline").click(function(){
		var box = Boxy.ask($('#downbox').html(), ['确认', '取消'], function(r){
			if (r == '确认')
			{
				logout_one_or_more_ip(box.getContent());
			}else{
			}
		},{
			titleicon: 'icon-circle-arrow-down',
			title: $("input[name='show_new_info']").val(),
			modal: true,
			closeable: true,
		});
	});

	//右上角注销单个或多个设备
	$("#yclose").click(function(){
		var show_info_type = $("input[name='show_info_type']").val();
		var error_type = $("input[name='error_type']").val();
		var is_ok = 0;
		var show_msg_info = "";
		if(show_info_type == 1 && error_type !="online_num_error") {
			show_msg_info = '<p>您确认注销当前设备吗？</p>';
		} else if(show_info_type == 2 || error_type =="online_num_error"){
			show_msg_info = $('#downbox').html();
		}
		var box = Boxy.ask(show_msg_info, ['确认', '取消'], function(r){
			if (r == '确认') {
				//是否取消自动登录
				if(document.getElementById("quxiaozidonglogin").checked){
					is_ok = 1;
				}
				logout_one_or_more_ip(box.getContent(),is_ok);
			}else{
			}
		},{
			titleicon: 'icon-switch',
			title: '注销',
			modal: true,
			closeable: true,
			bottom: [{
				id: 'quxiaozidonglogin',
				title: '取消自动登录'
			}]
		});
		//取消自动登录
		var old = null; //用来保存原来的对象
		$("#quxiaozidonglogin").each(function(){//循环绑定事件
			if(this.checked){
				old = this; //如果当前对象选中，保存该对象
			}
			this.onclick = function(){
				if(this == old){//如果点击的对象原来是选中的，取消选中
					this.checked = false;
					old = null;
				} else{
					old = this;
				}
			}
		});
	});

	//日历
	$.fn.datetimepicker.dates['en'] = {
		days: ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六", "星期日"],
		daysShort: ["周日", "周一", "周二", "周三", "周四", "周五", "周六", "周日"],
		daysMin:  ["日", "一", "二", "三", "四", "五", "六", "日"],
		months: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
		monthsShort: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
		today: "今日",
		suffix: [],
		meridiem: ["上午", "下午"]
	};

	//开始日期
	$(".begintime").datetimepicker({
		format: 'yyyy-mm-dd hh:ii'
	});

	//结束日期
	$(".endtime").datetimepicker({
		format: 'yyyy-mm-dd hh:ii'
	});

	//日期
	$("#querytime").click(function(){
		var begintime = $(".begintime").val();
		var endtime = $(".endtime").val();

		if (begintime.length > 0 && endtime.length > 0){
			//todo
		}
	});

	//最大在线人数修改
	$("#btn_box_user_max_onlinenum").click(function(){
		var html = $("#user_max_online_num").html();
		var box = Boxy.ask(html, ['确认', '取消'], function(r){
			if (r == '确认')
			{
				max_online_num_success(box.getContent());
			}else{
			}
		},{
			titleicon: '',
			title: '修改同时在线设备数',
			modal: true,
			closeable: true,
		});
	});

	//购买套餐
	$("#btn_box_buy").click(function(){
		var html = $("#user_buy").html();
		var box = Boxy.ask(html, ['确认', '取消'], function(r){
			if (r == '确认')
			{
				user_buy_success(box.getContent());
			}else{
			}
		},{
			titleicon: '',
			title: '购买流量',
			modal: true,
			closeable: true,
		});
	});

	//修改导航栏
	$("#btn_box_choice_top").click(function(){
		var html = $("#choice_top").html();
		var box = Boxy.ask(html, ['确认', '取消'], function(r){
			if (r == '确认'){
				choice_top_success(box.getContent());
			}else{
			}
		},{
			titleicon: '',
			title: '修改导航栏',
			modal: true,
			closeable: true,
		});
	});

	//修改密码
	$("#btn_box_update_pass").click(function(){
		var html = $("#user_update_pass").html();
		var box = Boxy.ask(html, ['确认', '取消'], function(r){
			if (r == '确认')
			{
				user_update_pass_success(box.getContent());
			}else{
			}
		},{
			titleicon: '',
			title: '修改密码',
			modal: true,
			closeable: true,
		});
	});
});

function height(x,y,z){
	gd_contain_ctm = Math.floor($(".y_gd").width() / 124);

	$('.'+x).attr('style','height:auto;');
	$('.'+y).attr('style','height:auto;');
	$('.'+z).attr('style','height:auto;');
	var a = $('.'+x).height();
	var b = $('.'+y).height();
	var c = $('.'+z).height();
	var max
	max = a>b?a:b;
	max = max>c?max:c;
	if (max < $(window).height() - 210) max = $(window).height() - 210;
	$('.'+x).height(max);
	$('.'+y).height(max);
	$('.'+z).height(max);
}

//冲流量、充值、一卡通转账
function money_success(that){
	if (that.attr('data-type') == 'type-ykt'){
		var card_money = that.find("#money_slide").slider('value');
		var uname=$("input[name='user_login_name']").val();
		var balance = $("#balance_info").html();
		var err_msg = '';
		if(card_money == 0) {
			err_msg = '一卡通转账金额不可为0';
			//如果是转账，相关处理
			Boxy.tip(err_msg,function(){},{iserror: true});
			return;
		} else {
			$.post('change_user_balance.php', 'action=change_saving_user_balance&uname='+uname+'&card_money='+card_money, function(data){
				//alert(data);return false;
				if(data == 'illegal'){
					err_msg = '一卡通转账金额不合法';
				} else if(data == 'unknown'){
					err_msg = '发生未知错误';
				} else if(data == 'failed') {
					err_msg = '一卡通转账失败';
				} else if(data == 'success'){
					err_msg = '圈存成功';
					Boxy.tip(err_msg);
					setTimeout(function(){
						$("#balance_info").html((Number(balance) + Number(card_money)).toFixed(2));
					}, 2000);
					return false;
				}else {
					err_msg = data;
				}
				//如果是转账，相关处理
				Boxy.tip(err_msg,function(){},{iserror: true});
				return;
			});
		}
	} else {
		var datainput = that.find('input.chonginput');
		var datainputpwd = that.find('input.cardinput');
		var uname=$("input[name='user_login_name']").val();
		var card_type;
		//充流量
		if (datainput.data('type') == 'chongzhi')
		{
			 card_type = 1;
		} else if (datainput.data('type') == 'chongll'){
			 card_type = 2;
		}
		var ka_card_num = datainput.val();
		var ka_passwd = datainputpwd.val();
		if (ka_card_num=='' || ka_passwd=='') {
			err_msg = '请输入卡号及密码';
			Boxy.tip(err_msg,function(){},{iserror: true});
			return;
		}
		$.post('change_user_balance.php','ka_card_num='+ka_card_num+'&action=recharge_user_balance&user_login_name='+uname+'&card_type='+card_type+'&ka_passwd='+ka_passwd,function(info){
			if(info == 102){
				err_msg = "充值卡/流量卡不存在";
			}else if(info == 103){
				err_msg = "充值卡/流量卡已使用";
			}else if(info == 104){
				err_msg = "充值卡/流量卡已过期";
			}else if(info == 105){
				err_msg = "无计费组存在";
			}else if(info == 101){
				err_msg = "充值失败，请重试";
			}else if(info == 106){
				err_msg = '充值卡/流量卡密码错误';
			}else{
				var arr = info.split('|');
				if(card_type == 1){
					//充值成功的弹出层
					$("#balance_info").html(arr[1]);
					$("#success_info").html(arr[0]);
					$('#czsuc_box').show();
					setTimeout(function(){
						$('#czsuc_box').fadeOut(2000);
						window.location.replace(change_url());
					}, 4000);
				}else{
					$("#flux_info").html(arr[1]);
					$("#success_info_flux").html(arr[0]);
					$('#czsuc_box_flux').show();
					setTimeout(function(){
					$('#czsuc_box_flux').fadeOut(2000);
					unonlie_me();
					}, 4000);
				}
				return false;
			}
			Boxy.tip(err_msg,function(){},{iserror: true});
			return;
		});
	}
}

//消费保护
function spending_protect(that){
	if(that) {
		var iext2 = that.find("#liuliang_slide").slider('value');
		var uname = $("input[name='user_login_name']").val();
		var err_msg = '';
		var is_open_iext2 = 1;
		if(!$("#sfqy_llbh").attr('checked')){
			is_open_iext2 = 0;
		}
		$.post('change_user_balance.php', 'action=change_user_iext2&uname='+uname+'&iext2='+iext2+'&is_open_iext2='+is_open_iext2,
			function(data){
				if(data==101){
					//操作提示
					Boxy.tip("操作成功！");
					setTimeout(function(){
						window.location.replace(change_url());
					}, 2000);
					return false;
				}else{
					err_msg = '修改消费保护失败，请重新操作';
				}
				Boxy.tip(err_msg,function(){},{iserror: true});
				return;
		});
	}
}

//充流量卡，需要下线再认证方可生效
function unonlie_me(){
	var error_type = $("input[name='error_type']").val();
	var user_login_name = $("input[name='user_login_name']").val();
	var key = $("input[name='key']").val();
	var mac_ip=$("input[name='user_ip']").val();
	var host = "http://"+getHost();
	if(error_type == ""){//先下线
		$.post('change_user_balance.php', 'action=unonline_user_mac&user_login_name='+user_login_name+'&mac_ip='+mac_ip+'&type=1'+'&k='+key, function(data){
			if(data >0){
				Boxy.tip("已成功充入流量卡，需再次认证才可生效");
				setTimeout(function(){
					window.location.href = host;
				}, 3000);
			}else{
				Boxy.tip("下线失败",function(){},{iserror: true});
				return;
			}
		});
	} else {
		window.location.replace(change_url());
	}
}

//注销在线ip(一个或多个可选)
function logout_one_or_more_ip(that, is_ok){
	var show_info_type = $("input[name='show_info_type']").val();
	var error_type = $("input[name='error_type']").val();
	var key = $("input[name='key']").val();
	var gxlist = that.find("input[type=checkbox]:checked");
	var host = "http://"+getHost();
	var user_login_name = $("input[name='user_login_name']").val();
	var maciplist = [];
	for (var i = 0; i<gxlist.length; i++)
	{
		maciplist.push($(gxlist[i]).data('mac-ip'));
	}
	if(maciplist.length == 0){
		Boxy.tip("请选择要下线的设备",function(){},{iserror: true});
		return false;
	}
	var param = 'action=unonline_user_mac&user_login_name='+user_login_name+'&error_type='+error_type+'&mac_ip='+maciplist+'&type=2'+'&k='+key;
	if(is_ok != undefined){
		param +='&is_ok='+is_ok;
	}
	$.post('change_user_balance.php', param, function(data){
		if(data >0){
			if(error_type != "" && error_type == "online_num_error"){
				Boxy.tip("操作成功！再次认证即可上网");
			}else{
				Boxy.tip("操作成功！");
			}
			setTimeout(function(){
				/*if(is_ok == undefined || (is_ok != undefined && is_ok == 0)){
					window.location.href = host+"/logout.html?go=2";
				} else {
					window.location.href = host;
				}*/
				window.location.href = host;
			}, 2000);
		}else{
			Boxy.tip("下线失败",function(){},{iserror: true});
			return false;
		}
	});
}

//修改最大在线人数
function max_online_num_success(that){
	var num_input = that.find("input[name='user_max_online_num']");
	var key = that.find("input[name='key']").val();
	var num = num_input.val();
	var uname = $("input[name='user_login_name']").val();
	var err_msg = "";
	if( num == '' || isNaN(num)||num<=0||!(/^\d+$/.test(num)) ){
		Boxy.tip('请输入正确的数值,只允许输入整数！',function(){},{iserror: true});
		return false;
	}
	if(num > 5) {
		Boxy.tip('最大在线人数设置不可超过5人！',function(){},{iserror: true});
		return false;
	} else if(num == 0){
		Boxy.tip('最大在线人数设置不可设为0！',function(){},{iserror: true});
		return false;
	}
	$.post('change_user_balance.php',
		   'action=update_user_max_online_num&user_login_name='+uname+'&user_max_online_num='+num+'&k='+key,
		   function(info){
		if(info == 102){
			err_msg = "用户不存在";
		}else if(info == 101){
			err_msg = "设置失败，请重试";
		}else if(info == 100){
			Boxy.tip("操作成功！");
			setTimeout(function(){
				window.location.replace(change_url());
			}, 2000);
			return false;
		}else{
			//alert("info="+info);
			err_msg = "未知错误";
		}
		if(err_msg != "")
			Boxy.tip(err_msg,function(){},{iserror: true});
		return;
	});
}

//购买套餐
function user_buy_success(that){
	var buy_id_obj = that.find("select[name='buy_id']");
	var user_pass_check = that.find("input[name='user_pass_check']").val();
	var uname = $("input[name='user_login_name']").val();
    var drop=($("input[name='drop']").val())==1?1:0;
	var buy_id = buy_id_obj.val();
	var check_repate = that.find("input[name='check_repate']").val();
	var err_msg = "";
    var host = "http://"+getHost();
	if(buy_id == 0){
		Boxy.tip("请选择要购买的流量包！",function(){},{iserror: true});
		return false;
	}
	if(user_pass_check == "")
	{
		Boxy.tip("请输入您的登陆密码！",function(){},{iserror: true});
		return false;
	}
	//发送购买请求
	$.post('change_user_balance.php','action=buy&user_login_name='+uname+'&buy_id='+buy_id+'&user_pass_check='+user_pass_check+'&check_repate='+check_repate,function(info){
		//alert(info);
		if(info==107){
			err_msg = '系统正在对您的帐户进行结算，请1小时后再购买流量';
		}else if(info == 106){
			err_msg = "请勿重复提交请求！";
		}else if(info == 105){
			err_msg = "您输入的登录密码不正确";
		}else if(info == 104){
			err_msg = "购买失败，请重试";
		}else if(info == 103){
			err_msg = "余额不足购买套餐包";
		}else if(info == 102){
			err_msg = "用户不存在";
		}else if(info == 101){
			err_msg = "购买的套餐包不存在";
		}else if(info == 100){
			Boxy.tip("操作成功！");
			setTimeout(function(){
                var Request = new Object();
                Request = GetRequest();
                var error;
                error = Request['error'];
				var uname = $("input[name='user_login_name']").val();
                if(error=='flux_error'){
                    //判断购买流量和欠的流量的值
					getFluxVlaue(uname);
                }else{
                    window.location.replace(change_url());
                }

			}, 2000);
			return false;
		} else{
			err_msg = "未知错误，请联系系统管理员";
		}
		if(err_msg != "")
			Boxy.tip(err_msg,function(){},{iserror: true});
		return;
	});
}
function getFluxVlaue(uname){
	$.post('change_user_balance.php','action=compare_flux&user_login_name='+uname,function(data){
		if(data==200){
			alert('账户剩余流量不足，请继续购买套餐。');
			window.location.replace(change_url());
		}else if(data==201){
			//本次购买成功之后，购买的流量大于欠的流量，则提示重新登陆
			alert('账户剩余流量充足，请重新登录后使用。');
			window.location.href="./index.php";
		}else{
			alert('系统异常请联系系统管理员。');
		}
		
	});
}

function GetRequest() {
    var url = location.search; //获取url中"?"符后的字串
    var theRequest = new Object();
    if (url.indexOf("?") != -1) {
        var str = url.substr(1);
        strs = str.split("&");
        for(var i = 0; i < strs.length; i ++) {
            theRequest[strs[i].split("=")[0]]=unescape(strs[i].split("=")[1]);
        }
    }
    return theRequest;
}
//更多自服务登陆
function judge_login(t){
	//var host_url = getHost();
	var host_url = "10.111.1.67";
	var uname = $("input[name='user_login_name']").val();
	var pass = $("input[name='user_password_val']").val();
	var transferurl="";
	if(uname != ''){
		$.ajax({
			 type: "get",
			 url: "http://"+host_url+":8800/index.php?action=login&ts=login&username="+uname+"&password="+pass+"&type=save_cookie_login",
			 dataType: "jsonp",
			 success: function (val) {
				var data = val.code;

				if(data == '101'){
					if(t == 1){
						transferurl = "http://"+host_url+":8800/index.php?action=trouble&ts=add";
						//window.open("http://"+host_url+":8800/index.php?action=trouble&ts=add","北航计费自服务平台","fullscreen=yes,scrollbars=yes,location=yes") ;
					}else {
						transferurl = "http://"+host_url+":8800/index.php";
						//window.open("http://"+host_url+":8800/index.php") ;
					}
					//return true;
				}else{
					transferurl = "http://"+host_url+":8800/index.php";
					//window.location.replace("http://"+host_url+":8800") ;
				}
				window.open(transferurl,"北航计费自服务平台",'width='+(window.screen.availWidth-10)+',height='+(window.screen.availHeight-30)+ ',top=0,left=0,toolbar=no,menubar=no,scrollbars=no, resizable=no,location=no, status=no') ;
			 }
		 });
	}else{
		transferurl = "http://"+host_url+":8800/index.php";
		window.location.replace(transferurl) ;
	}
}

//故障报修
function trobule(){
	judge_login(1);
}

//修改导航栏
function choice_top_success(that){
	var uname = $("input[name='user_login_name']").val();
	var choice= that.find("input[type=checkbox]:checked");
	var err_msg = "";
	var maciplist = [];
	for (var i = 0; i<choice.length; i++) {
		maciplist.push($(choice[i]).data('mac-id'));
	}
	if(maciplist.length == 0){
		Boxy.tip("请选择导航栏",function(){},{iserror: true});
		return false;
	}
	//保存用户修改的导航栏系信息
	$.post('change_user_balance.php','action=update_top&user_login_name='+uname+'&choice='+maciplist,function(info){
		if(info == -2){
			err_msg = "用户不存在！";
		}else if(info == -1){
			err_msg = "参数不合法！";
		}else if(info > 0){
			Boxy.tip("操作成功！共选择 "+info+" 个导航");
			setTimeout(function(){
				window.location.replace(change_url());
			}, 2000);
		}else if(info == 0){
			err_msg = "操作失败，请重试！";
		}else{
			err_msg = "未知错误";
		}
		if(err_msg != "")
			Boxy.tip(err_msg,function(){},{iserror: true});
		return;
	});
}

//删除top
function delete_top(top_id){
	var uname = $("input[name='user_login_name']").val();
	var err_msg = "";
	if(top_id != "" && uname !=""){
		if(confirm("你真的要删除该导航菜单吗？")){
			//删除导航条
			$.post('change_user_balance.php','action=delete_top&user_login_name='+uname+'&top_id='+top_id,function(info){
				if(info == 102){
					err_msg = "用户不存在";
				}else if(info == 101){
					err_msg = "删除失败，请重试";
				}else if(info == 100){
					Boxy.tip("操作成功！");
					setTimeout(function(){
						window.location.replace(change_url());
					}, 2000);
				}else{
					err_msg = "未知错误";
				}
				if(err_msg != "")
					Boxy.tip(err_msg,function(){},{iserror: true});
				return;
			});
		}else{
			return false;
		}
	}else{
		Boxy.tip("参数不合法！",function(){},{iserror: true});
		return false;
	}
}
//点击量记录
function top_click(top_id){
	var uname = $("input[name='user_login_name']").val();
	var err_msg = "";
	if(top_id != "" && uname !=""){
		//点击导航条
		$.post('change_user_balance.php','action=top_click&user_login_name='+uname+'&top_id='+top_id,function(info){
			if(info == 102){
				err_msg = "用户不存在";
			}else if(info == 101){
				err_msg = "操作失败，请重试";
			}else if(info == 100){
				Boxy.tip("操作成功！");
				setTimeout(function(){
					window.location.replace(change_url());
				}, 2000);
			}else{
				err_msg = "未知错误";
			}
			if(err_msg != "")
				Boxy.tip(err_msg,function(){},{iserror: true});
			return;
		});
	}else{
		Boxy.tip("参数不合法！",function(){},{iserror: true});
		return false;
	}
}

//修改密码
function user_update_pass_success(that){
	var user_password =  that.find("input[name='user_password']").val();
	var user_new_password = that.find("input[name='user_new_password']").val();
	var user_new_password_confirm = that.find("input[name='user_new_password_confirm']").val();
	var pass_code = that.find("input[name='pass_code']").val();
	var uname = $("input[name='user_login_name']").val();
	var p1 = /^[a-zA-Z0-9]{6,16}$/;
	var err_msg = "";
	if(user_password == ""){
		Boxy.tip('请输入现在的密码！',function(){},{iserror: true});
		return false;
	}
	if(user_new_password == "" || !p1.test(user_new_password)){
		Boxy.tip('新密码应为6-16位英文字母或数字！',function(){},{iserror: true});
		return false;
	}
	if(user_new_password_confirm != user_new_password){
		Boxy.tip('重复新密码与新密码不一致！',function(){},{iserror: true});
		return false;
	}
	if(pass_code == ""){
		Boxy.tip('请输入验证码！',function(){},{iserror: true});
		return false;
	}
	//发送修改密码请求
	$.post('change_user_balance.php','action=update_user_password&user_login_name='+uname+'&user_password='+user_password+'&user_new_password='+user_new_password+'&pass_code='+pass_code,function(info){
		if(info == 104){
			err_msg = "用户不存在";
		}else if(info == 103){
			err_msg = "输入的现在密码不正确";
		}else if(info == 102){
			err_msg = "输入的验证码不正确";
		}else if(info == 101){
			err_msg = "修改密码失败，请重试";
		}else if(info == 100){
			Boxy.tip("操作成功！");
			return false;
		}else{
			err_msg = "未知错误";
		}
		if(err_msg != "")
			Boxy.tip(err_msg,function(){},{iserror: true});
		return;
	});
}

//获取当前url的ip地址
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

//js去除锚点
 function change_url(){
	var url = location.href;
	if (url.indexOf("#") > 0) {
	  url = url.substring(0, url.indexOf("#"));
	}
	return url;
 }
 //展开详情 add by chenlao 20150207
 function show_charge_list(){
	if($('#detail_img').attr('src')=='/Bootstrap/images/icon_xiala.png'){
		$('#show_hide').html('隐藏详情');
		$('#detail_img').attr('src','/Bootstrap/images/icon_shangla.png');
	}else{
		$('#show_hide').html('展开详情');
		$('#detail_img').attr('src','/Bootstrap/images/icon_xiala.png');
	}
	$("#charge_list").toggle();
	$('.pagination').toggle();
		height('y_side_l','y_content');
 }
 //获取url参数
function getUrlParam(name){
	var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
	var r = window.location.search.substr(1).match(reg);  //匹配目标参数
	if (r!=null) return unescape(r[2]); return null; //返回参数值
}
//刷新验证码
function newgdcode(obj, url){
	obj.src = url + '?nowtime=' + new Date().getTime();
	//后面传递一个随机参数，否则在IE7和火狐下，不刷新图片
}