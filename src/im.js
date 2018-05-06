/**
 * Created by 仁焜 on 2017/5/13.
 *
 *
 *
 *  代表客户端自己， user表示联系人
 */


function log(msg) {
    console.log(msg)
}

/**
 * 获取Element的innerText
 * @param ele 目标节点
 * @param tagName 目标节点的子节点名称，如果没有值 就会获取目标节点的text
 */
function getEleText(ele,tagName) {
  if(tagName){
      var nodes = ele.getElementsByTagName(tagName);
  }
  if(nodes.length>0){
    return nodes[0].innerHTML;
  }
  return '';
}

/**
 *
 * @param options
 * @constructor
 */
function IM() {
    this.BOSH_SERVICE = null;
    this.jid = null;
    this.pass = null;
    this.oneself = null;
    this.users = [];
  
    this.system_msg = [];//系统消息
    this.onChatListener = [];
}

IM.prototype.init = function (options) {
    this.connection = new Strophe.Connection(options.BOSH_SERVICE);
    this.connection.addProtocolErrorHandler("HTTP", "900", ()=>{});
    this.connection.rawInput = this.rawInput;
    this.connection.rawOutput = this.rawOutput;
    return this;
};

IM.prototype.connect = function (options,callback) {
    this.jid = options.jid;
    this.pass = options.pass;
    this.connection.connect(this.jid, this.pass, (status)=>{
        if (status === Strophe.Status.CONNECTING) {
            log('Strophe is connecting.');
        } else if (status === Strophe.Status.CONNFAIL) {
            log('Strophe failed to connect.');
        } else if (status === Strophe.Status.DISCONNECTING) {
            log('Strophe is disconnecting.');
        } else if (status === Strophe.Status.DISCONNECTED) {
            log('Strophe is disconnected.');
        } else if (status === Strophe.Status.CONNECTED) {
            log('Strophe is connected.');
            this.connection.addHandler(this.onMessage.bind(this), null, 'message', null, null,  null);
            this.connection.addHandler(this.onPresence.bind(this), null, 'presence', null, null,  null);
            this.connection.addHandler(this.onIQ.bind(this), null, 'iq', null, null,  null);
          
            const oneself = new User({jid:this.jid,pass:this.pass,available:'available'});//创建用户自己
            this.oneself = oneself;
            if(callback)callback(oneself);
        }else {
            log("connect err");
        }
    });
};

/**
 * 发送离线出席信息
 */
IM.prototype.offline = function () {
  this.connection.send($pres({type : 'unavailable'}).tree());
};
/**
 * 发送出席信息
 */
IM.prototype.inline = function () {
    this.update_status.call(this);
};
IM.prototype.update_status = function () {
    var a = $pres()
        .cnode(Strophe.xmlElement('status', '' , this.oneself.status)).up()
        .cnode(Strophe.xmlElement('show', '' , this.oneself.show)).up()
        .cnode(Strophe.xmlElement('priority', '' , this.oneself.priority)).up()
        .tree();
      
    this.connection.send(a);
};



IM.prototype.sendMessage = function (msg,to) {
    var to_jid = to.jid || to;
    var reply = $msg({to: to_jid, from: this.jid , type: 'chat'}).cnode(Strophe.xmlElement('body', '' ,msg));
    this.connection.send(reply.tree());
};

/**
 * 一对一信息交换
 * @param msg
 * @returns {boolean}
 */
IM.prototype.onMessage = function (msg) {
  console.log('onMessage---', msg);
  const type = msg.getAttribute('type');
  if(type === 'chat'){
      this.onChat.call(this, msg);
  }
  // we must return true to keep the handler alive.
  // returning false would remove it after it finishes.
  return true;
};
/**
 * 接收到message, type==chat
 * @param msg
 *
 * 一个合法的JID包括节点名,域名资源名，其格式为：jid=[node'@']domain['/'resource]
 */
IM.prototype.onChat = function (msg) {
  const to_jid = msg.getAttribute('to').split('/')[0];
  const from_jid = msg.getAttribute('from').split('/')[0];
  let user = this.getUserByJid(from_jid);
  const elems = msg.getElementsByTagName('body');
  if (elems.length > 0) {
    const body = elems[0];
    const message = new Message({
      type: 1,
      content: Strophe.getText(body),
      time: new Date().toLocaleString(),
      from: from_jid,
      to:to_jid
    });
    this.onChatListener.forEach((item)=>{
      item(message);
    });
  }
};

/**
 * 出席信息
 * @param msg
 * @returns {boolean}
 */
IM.prototype.onPresence = function (msg) {
    console.log(msg);
  
    
    var type = msg.getAttribute('type');
    var from = msg.getAttribute('from');
    var to = msg.getAttribute('to');
    
    var show =  getEleText(msg,'show');
    var priority = getEleText(msg,'priority');
    var status = getEleText(msg,'status');
    
    if(type == 'subscribe' && to == this.oneself.jid){
        //好友请求
        var sysmsg = {
            type:'subscribe',
            jid:from,
            read:false,//是否已读，
            content:'申请添加您为好友'
        };
        this.oneself.system_msg.unshift(sysmsg);
    }else if(type == 'unsubscribe' && to == this.oneself.jid){
      var sysmsg = {
        type:'unsubscribe',
        jid:from,
        read:false,//是否已读,
        content:'将您从他的联系人列表里删除'
      };
      this.oneself.system_msg.push(sysmsg);
    } else if(from === to || from.indexOf(this.oneself.jid) !== -1 ){
        this.oneself.show = show;
        this.oneself.priority = priority;
        this.oneself.status = status;
    }else {
        var user = this.getUserByJid.call(this,from);
        if(user){
          user.show = show;
          user.priority = priority;
          user.status = status;
      
          if(type === 'error'){
            user.available = false;
          }else if(type === 'unavailable'){
            user.available = false;
          }else {
            user.available = true;
          }
        }else {
        }
    }
    return true;
};

IM.prototype.onIQ = function (msg) {
  const type = msg.getAttribute('type');
  const to = msg.getAttribute('to');
  const im = this;
  
  console.log(msg);
  if(type == 'set' && to.indexOf(this.oneself.jid) !== -1){
      const elems = msg.getElementsByTagName('query');
      Strophe.forEachChild(elems[0], 'item', function(item){
          const jid = item.getAttribute('jid');
          const name = item.getAttribute('name');
          const group = getEleText(item, 'group');
          const subscription = item.getAttribute('subscription');

          var user = im.getUserByJid.call(im,jid);
          if(user){
              user.name = name || jid.split('@')[0];
              user.group = group || '未分组';
              if(subscription==='from'){
                  console.log(user.name+'订阅了我的出席信息')
              }else if(subscription==='to'){
                  console.log('我订阅了'+user.name+'的出席信息');
              }else if(subscription==='both'){
              
              }else{
              
              }
              user.subscription = subscription || 'none';
          }else{
              user = new User({
                jid:jid,
                name : name,
                group : group,
                subscription : subscription,
              });
              im.addUser(user);
          }
      });
  }
  
  return true;
};

/**
 * 出席信息探测
 * @param jid
 * @returns {*}
 */
IM.prototype.probe = function (to) {
  this.connection.send($pres({from:this.jid, to:this.jid, type : 'probe'}).tree());
};

/**
 * 根据jid 获取 user， 该user是指im对象上的user数组
 * @param jid
 */
IM.prototype.getUserByJid = function (jid) {
    return  this.users.find(function (user) {
        return jid.indexOf(user.jid) !== -1;
    })
};

/**
 * 获取花名册
 * @param callback
 */
IM.prototype.getRoster = function (callback){
    const users = this.users;
    const fromJid = this.jid;
    const im = this;
    const roster_get = $iq({from: fromJid, id: '', type: 'get'}).c('query', {xmlns: 'jabber:iq:roster'});
    this.connection.sendIQ(roster_get.tree(), function(result){
        const elems = result.getElementsByTagName('query');
        Strophe.forEachChild(elems[0], 'item', function(item){
            var user = new User(
                {
                    jid:item.getAttribute('jid'),
                    subscription:item.getAttribute('subscription'),
                    group:getEleText(item,'group'),
                    name:item.getAttribute('name'),
                }
            );
            im.addUser(user);
        });
        if(callback)callback(users);
    });
};

IM.prototype.addUser = function(user){
    var oldUser = this.getUserByJid.call(this, user.jid);
    if(!oldUser){
        this.users.push(user);
    }else {
        oldUser=user;
    }
}

/**
 * 名册设置
 * 修改联系人的备注
 * @param newName
 */
IM.prototype.change_name = function (jid,name) {
  this.roster_set.call(this,jid,name,null)
};
/**
 * 修改联系人的分组
 * @param newName
 */
IM.prototype.change_group = function (jid,group) {
    this.roster_set.call(this,jid,null,group)
};
/**
 * 名册设置 roster set
 * @param newName
 */
IM.prototype.roster_set = function (jid,name,group) {
    const user = this.getUserByJid.call(this, jid);
    name = name||user.name;
    group = group||user.group;
    
    const iq = $iq({from:this.oneself.jid, type:'set'})
      .c('query', {xmlns: 'jabber:iq:roster'})
      .c('item',{jid:user.jid, name:name })
      .c('group','',group)
      .tree();
    this.connection.sendIQ(iq,function (result) {
        console.log('设置成功');
    });
};

/**
 * 添加好友
 * @param jid
 */
IM.prototype.addFriend = function (jid) {
    var iq =$iq({type:'set'}).c('query',{xmlns: 'jabber:iq:roster'}).c('item',{jid:jid });
    this.connection.sendIQ(iq);
};

IM.prototype.aggreAddFriend = function (jid,cb) {
    this.connection.send($pres({to:jid,type:"subscribed"}));
    this.connection.send($pres({to:jid,type:"subscribe"}));
    
    const iq = $iq({type:"set"}).c('query',{xmlns:"jabber:iq:roster"}).c('item',{jid:"rk1@im.example"});
    this.connection.sendIQ(iq,function (result) {
        console.log('同意添加成功');
    });
};

/**
 * 删除联系人
 * @param jid
 */
IM.prototype.remove_user = function (jid, cb) {
  var user = this.getUserByJid.call(this,jid);
  if(user){
    var iq =$iq({type:'set'}).c('query',{xmlns: 'jabber:iq:roster'}).c('item',{subscription:"remove",jid:jid });
    this.connection.sendIQ(iq,function (result) {
        console.log('删除成功');
        cb(user)
    });
  }else {
    cb(null)
  }
};
/**
 * 屏蔽联系人，取消订阅
 * @param jid
 */
IM.prototype.shield_user = function (jid) {
    var user = this.getUserByJid.call(this,jid);
    if(user){
        this.connection.send($pres({type:'unavailable',to:jid}));
        this.connection.send($pres({type:'unsubscribed',to:jid}));
    }
};
/**
 * 取消屏蔽联系人，订阅
 * @param jid
 */
IM.prototype.unshield_user = function (jid) {
  var user = this.getUserByJid.call(this,jid);
  if(user){
    this.connection.send($pres({type:'subscribed',to:jid}));
  }
};

//<iq type="get" id="sd55" to="rk1@im.example"><vCard xmlns="vcard-temp"/></iq> 获取个人资料

IM.prototype.rawInput = function (data) {
    //console.dir(data);
};
IM.prototype.rawOutput = function (data) {
    //console.dir(data);
};

IM.prototype.addChatListener = function (fn) {
    this.onChatListener.push(fn);
};

/**
 * 联系人
 * @param options
 * @constructor
 */


function User(options) {
    this.jid = options.jid;
    this.subscription = options.subscription;
    this.avatar = options.avatar || 'https://unsplash.it/'+(35+Math.random()*10)+'/'+(35+Math.random()*10)+'/?random';
    this.describe = options.describe || '我们为您';
    this.last_msg = options.last_msg|| '我能';
    this.last_logintime = "";
    this.msg_prompt = 0;
    this.inputting_content = "";
    this.isChat = false;
    this.msgs = [];
    
    //
    this.available = options.available || false;//在线//离线
    this.show = options.show || 'chat';//一个特定资源的特定的可用性子状态.away -- 该实体或资源临时离开.  chat -- 该实体或资源活跃并想聊天.    dnd -- 该实体或资源忙(dnd = "Do Not Disturb"，免打扰).  xa -- 该实体或资源要离开相当长时间(xa = "eXtended Away"，长时间离开).
    this.status = options.status || '';
    this.priority = options.priority || 0; //可选的<priority/>元素包含定义该资源优先级的非自然人可读的XML字符数据
    
    //
    this.pass = options.pass || '';//当是用户自己时，会有密码
  
  
    /**
     * 对于客户端来说，当添加或更新一个名册条目的时候，包含'name'属性是可选的.
     */
    this.name = options.name || options.jid.split('@')[0];
    
    /***
     none:
     该用户没有订阅一该联系人的出席信息, 并且联系人也没有订阅该用户的出席信息; 这是缺省值, 所以如果没有subscription属性，那么该状态被理解为"none"
     to:
     该用户订阅了该联系人的出席信息, 但是联系人没有订阅用户的出席信息
     from:
     该联系人订阅了该用户的出席信息, 但是该用户没有订阅联系人的出席信息
     both:
     该用户和该联系人互相订阅了对方的出席信息(也称为"相互订阅")
     */
    this.subscription = options.subscription || 'none';
    
    /**
     * 在添加或更新一个名册条目的时候包含<group/>元素是可选的. 如果一个roster set不包含<group/>元素, 那么该条目被理解为不属于任何组.
     */
    this.group = options.group || '未分组';
    /**
     * 元素的'ask'属性值为"subscribe"被用于发布订阅子状态
     */
    this.ask = options.ask || '';
    
    this.system_msg = [];//系统消息
  
}

function getRandomAvatar() {

}

/**
 * 消息
 * @param options
 * @constructor
 */
function Message(options) {
    this.type = 1;
    this.content = options.content;
    this.time = options.time || new Date().toLocaleTimeString();
    this.from = options.from;
    this.to = options.to;
}
export default IM;
