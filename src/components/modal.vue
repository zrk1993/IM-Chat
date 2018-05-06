<template>
  <div class="m_modal f_bgc-a f_z4" id="modal">
    <div class="title" style="cursor: move;">{{title}}</div>
    <div class="content f_bgc-a">
        <slot></slot>
    </div>
    <div class="m_setwin f_z3 f_tar" v-drag="'modal'">
        <span class="wrap">
            <a @click="" class="item iconfont icon-zuixiaohua"></a>
            <a @click="close" class="item iconfont icon-guanbi"></a>
        </span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'modal',
  data () {
      return {

      }
  },
  methods:{
    close:function () {
        this.$emit('close')
    }
  }
  ,
  props:{
      title:{
          default: ()=>{'消息盒子'}
      }
  },
  mounted:function () {
      //居中
      this.$el.style['top'] = this.$el.offsetTop - this.$el.offsetHeight/2 -60 + 'px';
      this.$el.style['left'] =  this.$el.offsetLeft  - this.$el.offsetWidth/2 + 'px';
  }
}
</script>

