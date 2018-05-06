<template>
    <ul class="m_rcm f_z4 f_bd u_shadow" :style="{top:top,left:left}">
        <li @click="chat">消息</li>
        <li>邀请加入会议室</li>
        <li class="dividing"></li>
        <li @click="change_name">改名</li>
        <li @click="unshield" v-if="subscription=='to'">取消屏蔽</li>
        <li @click="shield" v-else>屏蔽</li>
        <li @click="remove">删除</li>
        <li class="f_posr">移动到
            <i class="iconfont icon-you"></i>
            <ul class="sub_mun f_bd">
                <li @click="new_group">新建群组</li>
                <li class="dividing dividing2"></li>
                <template v-for="g in Groups" >
                  <li @click="change_group(g.name)">{{g.name}}</li>
                </template>
            </ul>
        </li>
        <!--<li @click="unshield">重新请求确认</li>-->
        <li class="dividing"></li>
        <li>历史纪录</li>
        <li>用户信息</li>
    </ul>
</template>

<script>
export default {
  name: 'menu',
  props:[
  	'subscription',
  	'jid',
  	'top',
    'left',
    'Groups'
  ],
  data () {
    return {

    }
  },
  methods:{
      chat:function(){
        debugger;
        this.$store.commit('setChattingUser',this.jid);
      },
      change_name:function () {
          var name = prompt('name');
          this.$store.commit('change_name',{jid:this.jid,name:name});
      },
      change_group:function(g_name){
        this.$store.commit('change_group',{jid:this.jid,group:g_name});
      },
      new_group:function () {
          var g = prompt('group');
          this.change_group.call(this,g)
      },
      remove:function () {
          if(confirm('确定删除'+this.jid)){
              this.$store.dispatch('remove_user',this.jid).then(() => {
                  // ...
              });
          }
      },
      shield:function () {
        if(confirm('确定屏蔽'+this.jid)){
          this.$store.dispatch('shield_user',this.jid).then(() => {
            // ...
          });
        }
      },
      unshield:function () {
        if(confirm('取消屏蔽'+this.jid)){
          this.$store.dispatch('unshield_user',this.jid).then(() => {
            // ...
          });
        }
      },
      addFriend:function () {
        this.$store.dispatch('add_friend',this.jid)
      }
  }
}
</script>

