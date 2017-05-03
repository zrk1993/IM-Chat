<template>
    <div class="g_chat_view f_bd f_bg_f3 f_posr">
        <div class="m_topbar f_clr f_bg_main">
            <div class="m_avatar f_left">
                <img class="f_w100 f_bdr50" :src="oneself.user_avatar" alt="">
            </div>
            <div class="username f_white">
                <span>xiao xiao</span>
            </div>
        </div>
        <div class="g_main">
            <!-- 好友列表 -->
            <div class="g_users">
                <ul class="f_wrap">
                    <template v-for="user in users">
                        <li :user_id="user.user_id" @click="change_chatting_user(user.user_id)" :class="{z_chatting:(user.user_id==chatting_user_id)}" class="m_user f_posr f_clr">
                            <div class="avatar">
                                <img class=" f_w100 f_bdr50" :src="user.user_avatar" alt="">
                            </div>
                            <div class="info f_pr5">
                                <div class="username f_fs14">{{user.user_name}}</div>
                                <div class="contactinfo f_clr f_fs12 f_hui_s">
                                    <!-- 最后一次聊天信息 -->
                                    <div class="lastmsg f_left ">{{user.lastmsg}}</div>
                                    <!-- 未读消息数目 -->
                                    <div v-show="user.msg_prompt>0" class="u_msg_prompt f_right">{{user.msg_prompt}}</div>
                                </div>
                            </div>
                        </li>
                    </template>
                </ul>
            </div>
            <!-- 聊天窗口 -->
            <div class="g_chat f_bg_white">
                <template v-for="user in users">
                    <div v-show="user.user_id==chatting_user_id" class="f_posr">
                        <div class="m_chat_record f_bdb">
                            <ul>
                                <template v-for="msg in user.msgs">
                                    <!-- 自己消息 -->
                                    <li v-if="msg.user_id==oneself.user_id" class="m_chat_msg m_chat_mine">
                                        <div class="m_chat_user">
                                            <img :src="msg.user_avatar">
                                        </div>
                                        <div class="m_chat_text">
                                            <div class="f_hui_s"><i class="f_mr5">{{msg.time}}</i>{{msg.user_name}}</div>
                                            <div v-html="msg.content" class="u_msg_content content"></div>
                                        </div>
                                    </li>
                                    <!-- 好友消息 -->
                                    <li v-else class="m_chat_msg m_chat_user">
                                        <div class="m_chat_user">
                                            <img :src="msg.user_avatar">
                                        </div>
                                        <div class="m_chat_text">
                                            <div class="f_hui_s">{{msg.user_name}}<i class="f_ml5">{{msg.time}}</i></div>
                                            <div v-html="msg.content" class="u_msg_content content"></div>
                                        </div>
                                    </li>
                                </template>
                            </ul>
                        </div>
                        <div class="m_chat_tool">
                            <ul class="f_clr">
                                <li class="tool_item"><img class="f_w100" src="https://unsplash.it/25/25/?random" alt=""></li>
                                <li class="tool_item"><img class="f_w100" src="https://unsplash.it/25/25/?random" alt=""></li>
                                <li class="tool_item"><img class="f_w100" src="https://unsplash.it/25/25/?random" alt=""></li>
                            </ul>
                        </div>
                        <div class="f_p10">
                            <textarea v-model="user.inputting_content" class="u_chat_textarea" cols="30" rows="3"></textarea>
                        </div>
                        <div class="m_chat_bottom f_clr">
                            <div class="f_right">
                                <a @click="send_msg(user.user_id)" class="u_btn chat_send" href="javascript:;">send</a>
                            </div>
                        </div>
                    </div>
                </template>
            </div>
        </div>
    </div>
</template>
<script>
var users = [];
var i = 0;
while (i < 6) {
    i++;
    users.push(new User(i));
}

//创建一个user
function User(i) {
    this.user_id = new Date().getTime() + i;
    this.user_name = '张三';
    this.user_avatar = 'https://unsplash.it/40/40/?random';
    this.msgs = [];
    this.lastmsg = '你们好的 啊';
    this.msg_prompt = '3';
    this.inputting_content = ""; //正在输入的文本

    var j = 0;
    while (j < 6) {
        j++;
        this.msgs.push(new Msg(this.user_id));
    }
}

function Msg(id) {
    this.type = 1;
    this.content = "aadsa";
    this.time = '2017-04-30 18:38:10';
    this.user_avatar = 'https://unsplash.it/40/41/?random';
    this.user_name = '嘻嘻嘻';
    this.user_id = id;
}

var oneself = {
    user_id: users[2].user_id,
    user_avatar: 'https://unsplash.it/42/42/?random',
    user_name: '人看看'
};

export default {
    name: 'app',
    data() {
        return {
            chatting_user_id: users[2].user_id,
            users: users,
            oneself: oneself
        }
    },
    methods: {
        change_chatting_user: function(user_id) {
            this.chatting_user_id = user_id;
        },
        get_user_by_id: function(user_id) {
            for (var i = 0; i < this.users.length; i++) {
                if (this.users[i].user_id == user_id) {
                    return this.users[i];
                }
            }
            return null;
        },
        //将对应user的 inputting_content 发送出去
        send_msg: function(user_id) {
            var chat_user = this.get_user_by_id(user_id); //聊天对象
            if (!chat_user.inputting_content) {
                return false;
            }
            var msg = {
                type: 1,
                content: chat_user.inputting_content,
                time: new Date().toLocaleString(),
                user_avatar: this.oneself.user_avatar,
                user_name: this.oneself.user_name,
                user_id: this.oneself.user_id,
            };
            chat_user.msgs.push(msg);
            chat_user.inputting_content = '';
        }
    }
}
</script>
