<template>
  <transition name="fade">
    <div class="m_sign f_bg_white">
        <h2>登录</h2>
        <input v-model="jid" type="text" class="u_inp input f_w300" value="" placeholder="admin@im.example">
        <input v-model="pass" type="password" class="u_inp input f_w300" value="" placeholder="123456">
        <div class="f_mt10"></div>
        <button @click="login" class="j_login u_btn btn_primary f_w300 f_mt10 f_fs14">登录</button>
        <p class="f_tal">没有账号,<i class="f_blue f_csp u_btn btn_link">现在注册</i></p>
    </div>
  </transition>
</template>

<script>
  import isLoading from 'is-loading';
  export default {
    name: 'login',
    data() {
      return {
          jid:'',
          pass:''
      }
    },
    computed:{
        state:function () {
            return this.$store.state;
        }
    },
    methods: {
        login:function () {
            const log_btn = document.querySelector('.j_login');
            const options = {
              'type': 'switch',        // switch | replace | full-overlay | overlay
              'text': '登录...',      // Text to display in the loader
              'disableSource': true,   // true | false
              'disableList': [log_btn]
            };
            const loader = isLoading(log_btn, options);
            loader.loading();
            var store =  this.$store;
            var state = store.state;
            var im = state.im;

            im.connect({jid : this.jid,pass : this.pass},function (oneself) {

                state.oneself = oneself;
                //获取联系人列表
                im.getRoster(function (users) {
                    console.dir(users);
                    state.users = users;
                });

                //读取show status
                state.oneself.status = '好好学习 天天上上';

                store.commit('change_available');

                loader.remove();
            });
            im.addChatListener((message)=>{
                store.commit('addMessage',message);
            });
        }
    }
  }
</script>

