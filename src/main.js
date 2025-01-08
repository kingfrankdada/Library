import Vue from 'vue'
import App from './App.vue'
import router from './router/index'
import store from '@/store/index'
import VueLazyload from 'vue-lazyload';
import 'remixicon/fonts/remixicon.css'
import 'swiper/css/swiper.min.css';
import 'swiper/css/swiper.css';
import VueAwesomeSwiper from 'vue-awesome-swiper';

Vue.use(VueAwesomeSwiper);

Vue.config.productionTip = false

Vue.use(VueLazyload, {
  error: require('@/assets/img/error.png'),
  loading: require('@/assets/img/loading.gif'),
  preLoad: 1,
  attempt: 1
});

Vue.filter('formatDate', function (value) {
  if (!value) return '';
  return value.split('T')[0];
});

Vue.directive('focus', {
  inserted(el) {
    el.focus()
  }
})

new Vue({
  render: h => h(App),
  router,
  store
}).$mount('#app')