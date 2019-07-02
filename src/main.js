import Vue from 'vue'
import App from './App.vue'
import router from './router'
import BaiduMap from "vue-baidu-map"
import Axios from 'axios';
import store from './store'
import publicFn from "../public/publicFn"
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import qs from 'qs'

Vue.use(ElementUI);
Vue.prototype.qs = qs;
Vue.prototype.PF = publicFn;
 



Vue.config.productionTip = false
Vue.use(BaiduMap,{
  ak: "qssM8z8ZGzmUH8YCiGsCuHabdkI0fuk4"
})

import './assets/public.less'
// import './assets/coordinate.js'
Axios.defaults.baseURL = 'http://192.168.1.149:81/';
Axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
Vue.prototype.ajax = Axios;


new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
