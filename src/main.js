import Vue from 'vue';
import App from './App.vue'; // eslint-disable-line 
import router from './router'; // eslint-disable-line 
import store from './store'; // eslint-disable-line 
import {
  sync,
} from 'vuex-router-sync';
// vue-fontawesome

import {
  library,
} from '@fortawesome/fontawesome-svg-core';
import {
  faUser,
  faBuilding,
  faCheck,
  faPlusCircle,
  faMinusCircle,
  faCloudUploadAlt,
  faKey,
  faEnvelope as fasEnvelope,
  faBirthdayCake,
} from '@fortawesome/free-solid-svg-icons';
import {
  FontAwesomeIcon,
} from '@fortawesome/vue-fontawesome';
import {
  faUserCircle,
  faTimesCircle,
  faEdit,
  faEnvelope as farEnvelope,
} from '@fortawesome/free-regular-svg-icons';
import {
  faGoogle,
  faFacebook,
  faAmazon,
  faGithub,
  faGithubAlt,
} from '@fortawesome/free-brands-svg-icons';
// firebase

import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/firebase-storage';

const solid = [faUser,
  faBuilding,
  faCheck,
  faPlusCircle,
  faMinusCircle,
  faCloudUploadAlt,
  fasEnvelope,
  faKey,
  faBirthdayCake,
];
const brands = [faGoogle, faFacebook, faAmazon, faGithub, faGithubAlt];
const regular = [faUserCircle,
  faTimesCircle,
  faEdit, farEnvelope,
];
library.add(solid);
library.add(regular);
library.add(brands);
sync(store, router);


Vue.component('font-awesome-icon', FontAwesomeIcon);
Vue.use(firebase);
Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');
