import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('./views/monitoring.vue'),
    },
    {
      path: '/monitoring',
      name: 'monitoring',
      component: () => import('./views/monitoring.vue'),
    },
    {
      path: '/datastatistics',
      name: "dataStatistics",
      component: () => import('./views/dataStatistics.vue'),
    },
    {
      path: '/trajectory',
      name: "trajectory",
      component: () => import('./views/trajectory.vue'),
    },
    {
      path: '/warning',
      name: "warning",
      component: () => import('./views/warning.vue'),
      // children: [
      //   {
      //     path: "*",
      //     component: () => import('')
      //   }
      // ]
    },
    {
      path: '/warning/:type', component: () => import('./views/warning.vue'),
      children: [
        // 当 /user/:id 匹配成功，
        // UserHome 会被渲染在 User 的 <router-view> 中
        { path: '', component: () => import('./views/warning.vue') },

        // ...其他子路由
      ]
    }
  ]
})



const getVenderId = function (cname) {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');
  for(var i = 0; i <ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') {
          c = c.substring(1);
       }
       if (c.indexOf(name) == 0) {
          return c.substring(name.length, c.length);
       }
   }
  return false;
}



// 全局路由守卫
// router.beforeEach((to, from, next) => {
//   var venderId = getVenderId("venderLoginId");
//   if(!venderId){
//     alert("您还没有登陆");
//     window.location.href = "http://192.168.1.149:8888/venderBigScreen/systemLogin#"
//     next(false);
//     return
//   }
//   next() // 必须使用 next ,执行效果依赖 next 方法的调用参数
// })



export default router
