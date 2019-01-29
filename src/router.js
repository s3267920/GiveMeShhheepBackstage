import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
  routes: [{
    path: '/',
    // eslint-disable-next-line comma-dangle
    name: 'home'
    // component:
  },
  {
    path: '/order',
    // eslint-disable-next-line comma-dangle
    name: 'order'
    // component: Home,
  },
  {
    path: '/product',
    name: 'product',
  },
  {
    path: '*',
    redirect: '/',
  },
  ],
});
