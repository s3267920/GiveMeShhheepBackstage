import Vue from 'vue';
import Router from 'vue-router';
import Home from './components/homeComponents/Home.vue';
import Orders from './components/ordersComponents/Orders.vue';
import Product from './components/productComponents/Product.vue';
import LogIn from './components/LogIn.vue';
import SignUp from './components/SignUp.vue';

Vue.use(Router);

const router = new Router({
  // mode: 'history',
  routes: [{
    path: '/login',
    name: 'login',
    component: LogIn,
    meta: {
      title: '登入 LogIn',
    },
  },
  {
    path: '/signUp',
    name: 'signUp',
    component: SignUp,
    meta: {
      title: '註冊 SignUp',
    },
  },
  {
    path: '/backstage',
    name: 'home',
    component: Home,
    meta: {
      title: '後台首頁 Home',
    },
  },
  {
    path: '/backstage/orders',
    name: 'orders',
    component: Orders,
    meta: {
      title: '訂單管理 Orders',
    },
  },
  {
    path: '/backstage/product',
    name: 'product',
    component: Product,
    meta: {
      title: '產品管理 Product',
    },
  },
  {
    path: '/*',
    redirect: '/backstage',
  },
  ],
});
router.beforeEach((to, from, next) => {
  document.title = to.meta.title;
  next();
});
export default router;
