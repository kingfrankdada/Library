import Vue from 'vue'
import App from './App.vue'
import router from './router/index'
import store from '@/store/index'
import VueLazyload from 'vue-lazyload';

Vue.config.productionTip = false


// 注册 VueLazyload
Vue.use(VueLazyload, {
  error: require('@/assets/img/error.png'),
  loading: require('@/assets/img/loading.gif'),
  preLoad: 1,
  attempt: 1
});

console.log(require('@/assets/img/loading.gif'));
console.log(VueLazyload);

Vue.filter('formatDate', function (value) {
  if (!value) return '';
  return value.split('T')[0]; // 将日期部分提取出来
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