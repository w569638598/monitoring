import Vue from 'vue'
import Router from 'vue-router'
import configFile from '../public/publicFn'
Vue.use(Router)

const router = new Router({
  routes: [{
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
      component: () => import('./views/warning/index.vue'),
      children: [{
          path: 'statistics',
          component: () => import('./views/warning/statistics.vue')
        },
        {
          path: 'blackout',
          component: () => import('./views/warning/blackout.vue')
        },
        {
          path: 'deviate',
          component: () => import('./views/warning/deviate.vue')
        },
        {
          path: 'GPSBug',
          component: () => import('./views/warning/GPSBug.vue')
        },
        {
          path: 'set',
          component: () => import('./views/warning/set.vue')
        },
        {
          path: 'temperatureH',
          component: () => import('./views/warning/temperatureH.vue')
        },
        {
          path: 'timeout',
          component: () => import('./views/warning/timeout.vue')
        },
        {
          path: 'warning',
          component: () => import('./views/warning/warning.vue')
        }
      ]
    }
  ]
})



const getVenderId = function (cname) {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');
  for (var i = 0; i < ca.length; i++) {
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

if (process.env.NODE_ENV === "production") {
  router.beforeEach((to, from, next) => {
    var venderId = getVenderId("venderLoginId");
    if (!venderId) {
      alert("您还没有登陆");
      window.location.href = "http://www.yunmei168.com/venderBigScreen/systemLogin#"
      next(false);
      return
    }
    next() // 必须使用 next ,执行效果依赖 next 方法的调用参数
  })
}
//configFile.API_URL + "venderBigScreen/systemLogin#"
//"http://www.yunmei168.com/venderBigScreen/systemLogin#"

export default router