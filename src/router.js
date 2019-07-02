import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('./views/monitoring.vue')
    },
    {
      path: '/monitoring',
      name: 'monitoring',
      component: () => import('./views/monitoring.vue')
    },
    {
      path: '/datastatistics',
      name: "dataStatistics",
      component: () => import('./views/dataStatistics.vue')
    },
    {
      path: '/trajectory',
      name: "trajectory",
      component: () => import('./views/trajectory.vue')
    },
    {
      path: '/caution',
      name: "caution",
      component: () => import('./views/caution.vue')
    } 
  ]
})
