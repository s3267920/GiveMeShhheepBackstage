<template>
  <div id="app">
    <Home/>
    <div id="nav">
      <router-link to="/">首頁Home</router-link>|
      <router-link to="/order">訂單Orders</router-link>|
      <router-link to="/product">產品Product</router-link>
    </div>
  </div>
</template>
<script>
import Home from './components/homeComponents/Index.vue';

export default {
  name: 'app',
  data() {
    return {};
  },
  components: {
    Home,
  },
};
</script>
