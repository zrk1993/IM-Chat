var BOSH_SERVICE = 'http://desktop-6hkv22t:7070/http-bind/';
var connection = null;
var toJid=null;
var fromJid=null;

Strophe.log = function (level, msg) {
	//$('#log').append('<div></div>').append(document.createTextNode(msg));
};

function rawInput(data){
	log('RECV: ' + data);
}

function rawOutput(data){
	log('SENT: ' + data);
}


function log(msg){
	//$('#log').append('<div></div>').append(document.createTextNode(msg));
}

function onConnect(status){
	if (status == Strophe.Status.CONNECTING) {
		log('Strophe is connecting.');
	} else if (status == Strophe.Status.CONNFAIL) {
		log('Strophe failed to connect.');
		$('#connect').get(0).value = 'connect';
	} else if (status == Strophe.Status.DISCONNECTING) {
		log('Strophe is disconnecting.');
	} else if (status == Strophe.Status.DISCONNECTED) {
		log('Strophe is disconnected.');
		$('#connect').get(0).value = 'connect';
	} else if (status == Strophe.Status.CONNECTED) {
		log('Strophe is connected.');

		connection.addHandler(onMessage, null, 'message', null, null,  null);
		//此处应获取好友列表
		connection.send($pres().tree());
	}
}

/**
 * 收到消息时的回调
 */
function onMessage(msg) {
	to = msg.getAttribute('from');
	var from = msg.getAttribute('from');
	var type = msg.getAttribute('type');
	var elems = msg.getElementsByTagName('body');
	if (type == "chat" && elems.length > 0) {
		var body = elems[0];
		appendToHis(new Date().toLocaleTimeString() + '  ' + from + ' say: ' + Strophe.getText(body));
	}

	// we must return true to keep the handler alive.
	// returning false would remove it after it finishes.
	return true;
}

/**
 * 将消息增加到聊天记录
 */
function appendToHis(msg){
	$('#his').append('<div>' + msg + '</div>');
	$('#his').attr("scrollTop", $('#his').attr("scrollHeight"));
}

/**
 * 判断某人是否在线
 * true 为在线，false 离线
 */
function isOnline(jid, callback){
	var online_user_query = $iq({from: fromJid, to: jid, id: 'last12', type: 'get'}).c('query', {xmlns: 'jabber:iq:last'});
	connection.sendIQ(online_user_query.tree(), function(result){
		var elems = result.getElementsByTagName('query');
		var sec = elems[0].getAttribute('seconds');
		callback(sec>0 ? false : true);
	});
}

/**
 * 获取好友列表
 */
function rosterGet(){
	var roster_get = $iq({from: fromJid, id: '', type: 'get'}).c('query', {xmlns: 'jabber:iq:roster'});
	connection.sendIQ(roster_get.tree(), function(result){
		var elems = result.getElementsByTagName('query');
		Strophe.forEachChild(elems[0], 'item', function(item){

		});
	});
}

/**
 * 添加好友
 */
function rosterAdd(fromJid, toJid, group){
	var roster_add = $iq({from: fromJid, id: 'test1', type: 'set'}).c('query', {xmlns: 'jabber:iq:roster'}).c('item', {jid: toJid, name: 'zero'}).c('group', {}, group);
	connection.sendIQ(roster_add.tree(), function(result){
		var type = result.getAttribute('type');
		console.log(result);
		if('result' === type){
			//好友添加成功
			console.log("好友添加成功");
		}
	});
}

/**
 * 好友组间转移
 */
function rosterMove(toJid, oriGroup, destGroup){
	var roster_move = $iq({from: fromJid, id: '', type: 'set'}).c('query', {xmlns: 'jabber:iq:roster'}).c('item', {jid: toJid, name: ''}).c('group', {}, oriGroup).up().c('group', {}, destGroup);
}

/**
 * 移除好友
 */
function rosterRemove(toJid){
	var roster_remove = $iq({from: fromJid, id: '', type: 'set'}).c('query', {xmlns: 'jabber:iq:roster'}).c('item', {jid: toJid, subscription: 'remove'});
	//这时服务端发送type=unsubscribe
}

/**
 * 修改好友信息
 */
function rosterModify(toJid, roster){
	var roster_modify = $iq({from: fromJid, id: '', type: 'set'}).c('query', {xmlns: 'jabber:iq:roster'}).c('item', {jid: toJid, name: rosterName});
}

function subscribe(toJid){
	var subscribe = $pres({to: toJid, id: '', type: 'subscribe'});
}

$(document).ready(function(){
	connection = new Strophe.Connection(BOSH_SERVICE);

	connection.rawInput = rawInput;
	connection.rawOutput = rawOutput;

	//Strophe.log = function (level, msg) { log('LOG: ' + msg); };

	$('#connect').bind('click', function (){
		var button = $('#connect').get(0);
		if(button.value == 'connect'){
			button.value = 'disconnect';

			fromJid = $('#jid').val();
			toJid = $('#tojid').val();
			log(fromJid);
			log(toJid);
			connection.connect($('#jid').get(0).value, $('#pass').get(0).value, onConnect);
		}else{
			button.value = 'connect';
			connection.disconnect();
		}
	});

	$('#send').bind('click', function () {
		msg=$('#msg').val();
		toJid = $('#tojid').val();
		rosterAdd(fromJid, toJid, msg);
		var reply = $msg({to: toJid, from: fromJid , type: 'chat'}).cnode(Strophe.xmlElement('body', '' ,msg));
		connection.send(reply.tree());
		appendToHis(new Date().toLocaleTimeString() + "  Me:  "  + msg);
		$('#msg').val('');

	});

	$('#msg').keypress(function(e){
		if(e.which==13){
			$('#send').click();
		}
	});
});
