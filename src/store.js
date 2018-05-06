import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);


/**
 *  根据id找user
 * @param state {vuex}
 * @param user_id
 * @returns {*}
 */
function getUserByID(state, jid) {
    var user = state.users.find(function (item) {
        return item.jid === jid || jid.indexOf(item.jid) !== -1;
    });
    if(!user){
      console.error("找不到对应user");
    }
    return user;
}
/**
 * 获取所有正在聊天的user{user.isChat==true} 注意：chat和chatting 状态区别
 * @param state
 */
function getChatUser(state) {
    return state.users.filter(function(item){
        return item.isChat;
    });
}

const store = new Vuex.Store({
  state: {
      im:null,
      users:[],
      chatting_user:null,
      oneself: null,
      show_chat_win:true,//是否显示聊天界面，
  },
  getters: {
      doneTodos: state => {

      }
  },
  mutations: {
    /**
     * 设置当前聊天对象
     * @param state
     * @param user {user_id 或者 user对象}
     */
      setChattingUser:function (state,user) {
          if(typeof user == "object"){
              state.chatting_user = user;
          }else {
              state.chatting_user = getUserByID(state,user);
          }
          state.chatting_user.isChat = true;
          state.chatting_user.msg_prompt =0;//清除未读消息
          state.show_chat_win = true;
      },
    /**
     * 关闭聊天窗口。
     * 如果user为空，则关闭所有打开的聊天框，如果是user_id或者user对象则只关闭该人的聊天窗口
     * @param state
     * @param user
     */
      close_chat:function(state,user){
          if(user){
              if(typeof user == "object"){
                user.isChat = false;
              }else {
                getUserByID(state,user).isChat = false;
              }
          }else {
              state.users.forEach(function (item, index) {
                item.isChat = false;
              });
             state.chatting_user = null;
          }

          var chatUser = getChatUser(state);
          if(chatUser.length > 0){
            state.chatting_user = chatUser[0];
          }
      },
    /**
     * 添加消息
     * @param message
     */
      addMessage:function (state,message) {
          var chat_user = getUserByID(state,message.from);
          if(chat_user){
              chat_user.msgs.push(message);
              //如果消息对象不是正在聊天，，则增加未读消息
              if(!state.show_chat_win || !state.chatting_user|| state.chatting_user.jid != message.from){
                  chat_user.msg_prompt ++;
              }
              chat_user.last_msg = message.content;
          }
      },
      /**
       * 最小化聊天窗口
       * @param state
       */
      hide_chat:function (state) {
          state.show_chat_win = false;
      },
    /**
     * 在线 离线
     * @param state
     * @param available
     */
      change_available:function (state, available) {
          if(available == 'unavailable'){
              state.im.offline();
          }else {
              state.im.inline();
          }
          state.oneself.available = available || 'available';
      },
      change_name:function (state, payload) {
          state.im.change_name(payload.jid,payload.name);
      },
      change_group:function (state, payload) {
        state.im.change_group(payload.jid,payload.group);
      },
      aggreAddFriend:function (state,jid) {
          state.im.aggreAddFriend(jid);
      }
  },
  actions: {
      connect:function () {

      },
      remove_user:function ({ commit, state },jid) {
          return new Promise((resolve, reject) => {
              state.im.remove_user(jid,function () {
                  resolve();
                  debugger;
              })
          });
      },
      add_friend:function({ commit, state },jid){
          state.im.addFriend(jid);
      },
      shield_user:function ({ commit, state },jid) {
          state.im.shield_user(jid);
      },
      unshield_user:function ({ commit, state },jid) {
        state.im.unshield_user(jid);
      }
  }
});

export default store
