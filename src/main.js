import Vue from 'vue'
import App from './App.vue'
import router from './router/index'
import store from '@/store/index'

Vue.config.productionTip = false

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