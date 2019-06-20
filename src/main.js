import Vue from 'vue'
import App from './App.vue'
import router from './router'
import BaiduMap from "vue-baidu-map"
import Axios from 'axios';

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

Vue.use(ElementUI);

Vue.config.productionTip = false
Vue.use(BaiduMap,{
  ak: "qssM8z8ZGzmUH8YCiGsCuHabdkI0fuk4"
})

import './assets/public.less'
// import './assets/coordinate.js'
Axios.defaults.baseURL = 'http://192.168.1.149:81/';
Vue.prototype.ajax = Axios;


new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
