import Vue from 'vue';
import Router from 'vue-router';
import Home from './components/homeComponents/Home.vue';
import Orders from './components/ordersComponents/Orders.vue';
import Product from './components/productComponents/Product.vue';

Vue.use(Router);

export default new Router({
  routes: [{
    path: '/',
    name: 'home',
    component: Home,
  },
  {
    path: '/orders',
    name: 'orders',
    component: Orders,
  },
  {
    path: '/product',
    name: 'product',
    component: Product,
  },
  {
    path: '/*',
    redirect: '/',
  },
  ],
});
