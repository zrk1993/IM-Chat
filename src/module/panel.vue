<template>
    <div id="panel" class="g_panel">
        <div class="m_setwin f_z3 f_tar" v-drag="'panel'">
          <a class="item iconfont icon-guanbi"></a>
        </div>
        <div class="m_panel_head">
            <div class="info">
                <div class="user f_fs16">
                    <span class="name">{{oneself.name}}</span>
                    <div class="f_inline-block f_posr f_fs14">
                        <i @click="sel_available" :class="user_status_style" class="status iconfont icon-zaixian f_csp"></i>
                        <ul v-if="changing_available" class="m_status_sel f_bg_white f_z3 f_p10">
                          <li @click="change_available('available')" :class="{'z_sel':oneself_available}" class="status_item f_mb5"><i class="sel_status iconfont icon-xuanze f_mr5 f_fs12"></i><i class="iconfont icon-zaixian f_green f_mx5"></i><span>在线</span></li>
                          <li @click="change_available('unavailable')" :class="{'z_sel':!oneself_available}" class="status_item"><i class="sel_status iconfont icon-xuanze f_mr5 f_fs12"></i><i class="iconfont icon-lixian f_red f_mx5"></i><span>离线</span></li>
                        </ul>
                    </div>
                </div>
                <input  class="remark f_fs12 f_hui_c" type="text" v-model="oneself_status" @blur="change_status">
            </div>
            <ul class="m_tab f_mt5">
              <li @click="change_tab('0')" :class="{z_active:cur_tab==0}" class="item iconfont icon-lianxiren1" ></li>
              <li @click="change_tab('1')" :class="{z_active:cur_tab==1}" class="item iconfont icon-qunzu"></li>
              <li @click="change_tab('2')" :class="{z_active:cur_tab==2}" class="item iconfont icon-xiaoxi"></li>
            </ul>
        </div>
        <div class="m_panel_content">
            <div v-show="cur_tab==0">
                <template v-for="group in groups">
                  <div style="position: relative;height: 35px;">
                    <h5 v-shake="ii(group)" @click="toggle_group(group.name)" class="m_group_head f_fwn u_user_select"><i :class="{'icon-you':!group.open,'icon-xia':group.open}" class="iconfont f_hui_s"></i><span class="f_mx5">{{group.name}}</span><span class="number f_hui_s">(<span>{{group.list.length}}</span>)</span></h5>
                  </div>
                  <ul class="m_user_list" v-show="group.open">
                    <template v-for="user in group.list">
                      <li  @click="chat(user.jid)" @contextmenu="show_menu(user.jid,user.subscription,$event)" class="m_user2" >
                        <div class="user_avatar">
                          <img :class="{u_gray:!user.available}" class="f_posr" v-shake="user.msg_prompt" :a="user.msg_prompt" :src="user.avatar" :avatar="user.avatar" alt="">
                        </div>
                        <div class="info">
                          <span class="user_name f_ellipsis f_fs14">{{user.name}}</span>
                          <p class="desc f_ellipsis f_fs12 f_hui_s">{{user.status}}</p>
                        </div>
                        <div class="show f_pt10">
                          <em class="f_fs10 f_hui_s f_fwl">{{user.show}}{{user.subscription}}</em>
                        </div>
                      </li>
                    </template>
                  </ul>
                </template>
            </div>
            <right-menu v-if="right_click_menu" :top="right_click_menu_top" :left="right_click_menu_left" :jid="right_click_menu_jid" :groups="Groups" :subscription="right_click_menu_subscription"></right-menu>
            <ul v-show="cur_tab==1" class="m_group_list">
22222
            </ul>
            <ul v-show="cur_tab==2" class="m_history_list">
33333
            </ul>
        </div>
        <ul class="m_panel_tool">
            <li @click="operations=!operations" class="tool f_posr">
              <i class="iconfont icon-sanhengxian"></i>
              <operations v-if="operations" class="f_posa"></operations>
            </li>
            <li @click="message_box=!message_box" class="tool f_posr">
              <i class="iconfont icon-laba"></i>
              <span class="u_badge f_posa" v-if="noread_sys_msg>0" v-flashing="noread_sys_msg" >{{noread_sys_msg}}</span>
            </li>
            <li @click="addFriend=!addFriend" class="tool"><i class="iconfont icon-jiahao"></i></li>
            <li @click="message_box=!message_box" class="tool"><i class="iconfont icon-pifu"></i></li>
            <li @click="message_box=!message_box" class="tool"><i class="iconfont icon-xinxi"></i></li>
        </ul>

        <modal title="消息盒子" v-if="message_box" @close="message_box=false" style="width: 600px;" >
          <msg-box></msg-box>
        </modal>

        <modal title="添加好友" v-if="addFriend" @close="addFriend=false" style="width: 600px;" >
          <add-friend></add-friend>
        </modal>
    </div>
</template>

<script>
import RightClickMenu from '../components/RightClickMenu.vue'
import operations from '../components/operations.vue'
import msgbox from '../components/msgbox.vue'
import modal from '../components/modal.vue'
import addFriend from '../components/addFriend.vue'


import {$} from  '../utils';

export default {
    name: 'panel',
    data() {
        return {
            changing_available:false,
            cur_tab:0,
            Groups:[],
            oneself_status:'',

            right_click_menu:false,//是否显示右键菜单
            right_click_menu_top:0,
            right_click_menu_left:0,
            right_click_menu_jid:null,
            right_click_menu_subscription:null,

            message_box:false,
            operations:false,
            addFriend:false
        }
    },
    watch:{
        message_box:function () {
            this.$store.state.oneself.system_msg.forEach(function(item){
                item.read = true;
            });
        }
    },
    components:{
    	  'right-menu' : RightClickMenu,
        'modal': modal,
        'msg-box':msgbox,
        'operations':operations,
        'addFriend.vue':addFriend
    },
    computed:{
        user_status_style:function () {
          return  {'f_green':this.$store.state.oneself.available == 'available','f_red':this.$store.state.oneself.available != 'available'}
        },
        oneself_available:function(){
            return this.$store.state.oneself.available == 'available';
        },
        noread_sys_msg:function(){
          let num = 0;
           this.$store.state.oneself.system_msg.forEach(function(item){
          	  if(!item.read){num++}
          });
          return num;
        },
        groups:function(){
            var Groups = this.Groups;
            Groups.splice(0,Groups.length);
            this.$store.state.users.forEach(function (user) {
                if(user.group){
                    var group = getGroupByName(Groups, user.group);
                    if(group){
                      group.list.push(user);
                    }else {
                      Groups.push({name:user.group,open:false,list:[user]});
                    }
                }
            });

            function getGroupByName(Groups,name) {
                return Groups.find(function (g) {
                  return g.name == name;
                })
            }
            return Groups;
        },
        oneself:function () {
          return this.$store.state.oneself;
        }
    },
    methods: {
        sel_available:function(){
          this.changing_available = !this.changing_available;
        },
        change_available:function (available) {
          this.changing_available = false;
          this.$store.commit('change_available', available);
        },
        change_tab:function(tab){
          this.cur_tab = tab;
        },
        chat:function(jid){
          this.$store.commit('setChattingUser',jid);
        },
        toggle_group:function (group_name) {

            var g = this.groups.find(function (g) {
                return g.name == group_name;
            });
            if(g){g.open = !g.open;}
        },
        change_status:function () {
            this.$store.state.oneself.status = this.oneself_status;
            this.$store.state.im.update_status();
        },
        show_menu:function (jid,subscription,event) {
            if(event.button == 2){
                this.right_click_menu = true;
                this.right_click_menu_top = event.clientY + 'px';
                this.right_click_menu_left = event.clientX + 'px';
                this.right_click_menu_jid = jid;
                this.right_click_menu_subscription = subscription;
                event.preventDefault();
                window.event.returnValue=false;
                return false
            }
        },
        ii:function (group) {
            var u = group.list.find(function (user) {
                return user.msg_prompt > 0;
            });

            return !!u;

        }
    },
    created:function() {
    	  this.oneself_status = this.$store.state.oneself.status;
        $(document).bind('click',()=>{
            this.right_click_menu =false;//隐藏右键菜单
        });
    }
}
</script>
