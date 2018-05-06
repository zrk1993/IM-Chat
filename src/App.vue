<template>
  <div id="app" class="f_mt20">
    <chat></chat>
    <panel v-if="!!this.$store.state.oneself"></panel>
    <login v-else></login>
  </div>
</template>

<script>
import chat from './module/chat';
import panel from './module/panel';
import login from './module/login';

import './assets/css/base.css';
import './assets/css/im.css';

export default {
  name: 'app',
  components: {
    chat,
    panel,
    login
  }
}
</script>


