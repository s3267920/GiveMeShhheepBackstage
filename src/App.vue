<template>
  <div id="app">
    <Headers></Headers>
    <router-view></router-view>
  </div>
</template>
<script>
import Headers from './Headers'
export default {
  name: 'app',
  components: { Headers },
  data() {
    return {}
  }
}
</script>
