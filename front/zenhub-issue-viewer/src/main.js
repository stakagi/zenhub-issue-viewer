import 'babel-polyfill';

import Vue from 'vue';
import VueRouter from 'vue-router';
import App from './App.vue';
import vuetify from './plugins/vuetify';
import './plugins/vue-router';

import Setup from './components/Setup.vue';
import Issues from './components/Issues.vue';

Vue.config.productionTip = false

const routes = [
  { path: '/', component: Setup },
  { path: '/issues', component: Issues }
];

new Vue({
  vuetify,
  router: new VueRouter({ mode: 'history', routes }),
  render: h => h(App)
}).$mount('#app')
