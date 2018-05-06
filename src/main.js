// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import directives from './directives'
import store from './store.js';

import IM  from "./im.js";

import Dialog from './Dialog';

Vue.use(store);

Vue.config.productionTip = false;

Object.keys(directives).forEach(key => {
  Vue.directive(key, directives[key]);
});


Vue.prototype.Dialog = Dialog;

const vm = new Vue({
  el: '#app',
  store,
  template: '<App/>',
  components: { App },
  beforeCreate: function(){
      var BOSH_SERVICE = 'http://172.93.36.83:7070/http-bind/';
      this.$store.state.im = new IM().init({BOSH_SERVICE:BOSH_SERVICE});
  },
  created: function () {

  }
});



window.vm=vm;


//获取花名册 ， 消息监听 ， 发消息 ，


