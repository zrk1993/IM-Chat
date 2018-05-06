<template>
  <div class="f_m15">
      <ul class="m_msgbox ">
          <template v-for="message in system_msg">
            <li class="friend" v-if="message.type == 'subscribe'">
                <a href="" target="_blank"> <img src="https://unsplash.it/50/50?random" class="avatar"> </a>
                <p class="user f_pt5"> <a href="" target="_blank">{{message.jid}}</a><span class="f_ml5 f_hui_s">刚刚</span> </p>
                <p class="content f_mt5"> {{message.content}} <span class="f_ml5 f_hui_s">附言: 有问题要问</span> </p>
                <p class="msgbox_btn f_fs12 f_hui_c">
                    <button class="u_btn btn_primary f_mr5" @click="agree(message)">同意</button>
                    <button class="u_btn" data-type="refuse">拒绝</button>
                </p>
            </li>

            <li class="system" v-else-if="message.type == 'unsubscribe'">
              <p class="user f_pt5"><em class="f_red">系统&nbsp;:</em> <a href="" target="_blank">{{message.jid}}</a>{{message.content}}<span class="f_ml5 f_hui_s">刚刚</span> </p>
            </li>
            <li v-else style="display: none"></li>
          </template>
      </ul>
      <div class="more f_tac f_mt20">暂无更多新消息</div>
  </div>
</template>

<script>
export default {
  name: 'msgbox',
  data () {
    return {
    }
  },
  computed:{
    system_msg:function () {
      return this.$store.state.oneself.system_msg;
    }
  },
  methods:{
      agree:function (message) {
          this.$store.commit('aggreAddFriend',message.jid);
          message.read = true;
      },
      refuse:function (jid) {

      }
  },
  created:function () {
  }
}
</script>
