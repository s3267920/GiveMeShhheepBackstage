<template>
  <div id="app">
    <Headers></Headers>
    <router-view></router-view>
  </div>
</template>
<script>
import Headers from './Headers';
import router from './router.js';

export default {
  name: 'app',
  components: { Headers },
  data() {
    return {};
  },
};
</script>
