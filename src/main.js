import Vue from 'vue';
import App from './App.vue'; // eslint-disable-line 
import router from './router'; // eslint-disable-line 
import store from './store'; // eslint-disable-line 

import {
  sync,
} from 'vuex-router-sync';
import {
  library,
} from '@fortawesome/fontawesome-svg-core';
import {
  faUser,
  faBuilding,
  faCheck,
} from '@fortawesome/free-solid-svg-icons';
import {
  FontAwesomeIcon,
} from '@fortawesome/vue-fontawesome';
import {
  faUserCircle,
  faTimesCircle,
  faEdit,

} from '@fortawesome/free-regular-svg-icons';


library.add(faUserCircle, faTimesCircle, faUser, faBuilding, faEdit, faCheck);
sync(store, router);
Vue.component('font-awesome-icon', FontAwesomeIcon);


Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');
