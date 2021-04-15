import Vue from 'vue';
import { dateFilter } from 'vue-date-fns';

import App from './App.vue';
import vuetify from './plugins/vuetify';
import router from './router';
import store from './store';
import './config/axios';

Vue.filter('date', dateFilter);

Vue.config.productionTip = false;

new Vue({
  vuetify,
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
