<template>
  <div id="app">
    <chat></chat>
  </div>
</template>

<script>
import Hello from './components/Hello'
import chat from './module/chat'

export default {
  name: 'app',
  components: {
    chat,
    Hello
  }
}
</script>


