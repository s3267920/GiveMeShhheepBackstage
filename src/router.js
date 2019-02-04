import Vue from 'vue';
import Router from 'vue-router';
import Home from './components/homeComponents/Home.vue';
import Orders from './components/ordersComponents/Orders.vue';
import Product from './components/productComponents/Product.vue';
import LogIn from './components/LogIn.vue';
import Register from './components/Register.vue';

Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [{
    path: '/backstage',
    name: 'home',
    component: Home,
  },
  {
    path: '/login',
    name: 'login',
    components: LogIn,
  },
  {
    path: '/register',
    name: 'register',
    components: Register,
  },
  {
    path: '/backstage/orders',
    name: 'orders',
    component: Orders,
  },
  {
    path: '/backstage/product',
    name: 'product',
    component: Product,
  },
  {
    path: '/*',
    redirect: '/backstage',
  },
  ],
});
