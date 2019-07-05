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
 

const loading = function(){
  return this.$loading({
  lock: true,
  text: 'Loading',
  spinner: 'el-icon-loading',
  background: 'rgba(0, 0, 0, 0.7)'
});
}
document.title = "云到厂端管理系统"
Vue.prototype.loading = loading;

Vue.config.productionTip = false
Vue.use(BaiduMap,{
  ak: "qssM8z8ZGzmUH8YCiGsCuHabdkI0fuk4"
})

import './assets/public.less'
// import './assets/coordinate.js'
// 'http://39.105.172.118:81/';
//'http://192.168.1.149:81/';
Axios.defaults.baseURL = "http://39.105.172.118:81/";
Axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
Vue.prototype.ajax = Axios;


new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
