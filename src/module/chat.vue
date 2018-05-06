<template>
    <div v-if="chat_users.length>0 && $store.state.show_chat_win" id="chat_win" class="g_chat_view">
        <!-- 好友列表 -->
        <ul v-show="chat_users.length>1" class="g_users f_wrap">
            <template v-for="user in chat_users">
                <li :jid="user.jid" @click="$store.commit('setChattingUser',user.jid);" :class="{z_chatting:(user.jid==chatting_user.jid)}" class="m_user f_posr f_clr">
                    <div class="avatar">
                        <img :class="{u_gray:!user.available}" class="f_w100 f_bdr50" :src="user.avatar" alt="">
                    </div>
                    <div class="info f_pr5">
                        <div class="username f_ellipsis f_fs14">{{user.name}}</div>
                        <div class="contactinfo f_clr f_fs10 f_hui_s f_fwl">
                            <!-- 最后一次聊天信息 -->
                            <div class="lastmsg f_left ">{{user.last_msg}}</div>
                            <!-- 未读消息数目 -->
                            <div v-show="user.msg_prompt>0" class="u_msg_prompt f_right">{{user.msg_prompt}}</div>
                        </div>
                    </div>
                </li>
            </template>
        </ul>
        <!-- 聊天窗口 -->
        <div class="g_chat f_bg_white f_posr">
            <div class="m_setwin f_z3 f_tar" v-drag="'chat_win'">
                <a @click="$store.commit('hide_chat')" class="item iconfont icon-zuixiaohua"></a>
                <a @click="$store.commit('close_chat')" class="item iconfont icon-guanbi"></a>
            </div>
            <template v-for="user in chat_users">
                <div v-show="user.jid==chatting_user.jid" class="f_posr">
                    <div class="m_chat_head">
                        <img :class="{u_gray:!user.available}" class="user_avatar f_left f_mr10" :src="user.avatar" alt="">
                        <span class="user_name">{{user.name}}</span>
                    </div>
                    <ul class="m_chat_record f_bdb" v-chat-scroll>
                        <template v-for="msg in user.msgs">
                            <!-- 自己消息 -->
                            <li v-if="msg.from == oneself.jid" class="m_chat_msg m_chat_mine">
                                <div class="m_chat_user">
                                    <img :src="oneself.avatar">
                                </div>
                                <div class="m_chat_text">
                                    <div class="f_hui_s"><i class="f_mr5">{{msg.time}}</i>{{oneself.name}}</div>
                                    <div v-html="msg.content" class="u_msg_content content"></div>
                                </div>
                            </li>
                            <!-- 好友消息 -->
                            <li v-else class="m_chat_msg m_chat_user">
                                <div class="m_chat_user">
                                    <img :src="user.avatar">
                                </div>
                                <div class="m_chat_text">
                                    <div class="f_hui_s">{{user.name}}<i class="f_ml5">{{msg.time}}</i></div>
                                    <div v-html="msg.content" class="u_msg_content content"></div>
                                </div>
                            </li>
                        </template>
                    </ul>
                    <div class="m_chat_tool">
                        <ul class="f_clr">
                            <li class="tool_item"><a style="font-size: 20px" class="f_w100 iconfont icon-weixiao"></a></li>
                            <li class="tool_item"><a style="font-size: 20px" class="f_w100 iconfont icon-tupian"></a></li>
                            <li class="tool_item"><a style="font-size: 20px" class="f_w100 iconfont icon-file"></a></li>
                        </ul>
                    </div>
                    <div class="f_p10">
                        <textarea v-model="user.inputting_content" @keyup.enter="send_msg(user.jid)" class="u_chat_textarea" cols="30" rows="3"></textarea>
                    </div>
                    <div class="m_chat_bottom f_clr">
                        <div class="f_right">
                            <a @click="$store.commit('close_chat',user.jid)" class="u_btn btn_primary btn_sm f_mr5 chat_send" href="javascript:;">close</a>
                            <a @click="send_msg(user.jid)" class="u_btn btn_primary btn_sm chat_send" href="javascript:;">send</a>
                        </div>
                    </div>
                </div>
            </template>
        </div>
    </div>
</template>
<script>
export default {
    name: 'chat',
    data() {
        return {
        }
    },
    computed:{
        oneself:function(){
            return this.$store.state.oneself;
        },
        chat_users:function(){
            return this.$store.state.users.filter(function(user){
                return user.isChat;
            });
        },
        chatting_user:function () {
          return this.$store.state.chatting_user;
        },
        is_show_win:function () {
            return this.users.length>0 && this.$store.state.show_chat_win;
        }
    },
    methods: {
        get_user_by_id: function(jid) {
            for (var i = 0; i < this.$store.state.users.length; i++) {
                if (this.$store.state.users[i].jid == jid) {
                    return this.$store.state.users[i];
                }
            }
            return null;
        },
        //将对应user的 inputting_content 发送出去
        send_msg: function(jid) {
            const im = this.$store.state.im;
            const chat_user = this.get_user_by_id(jid); //聊天对象
            if (!chat_user.inputting_content) {
                return false;
            }
            const msg = {
                type: 1,
                content: chat_user.inputting_content,
                time: new Date().toLocaleString(),
                from: this.$store.state.oneself.jid,
                to: chat_user.jid
            };
            chat_user.msgs.push(msg);
            chat_user.inputting_content = '';
            im.sendMessage(msg.content, chat_user);
        }
    }
}
</script>
