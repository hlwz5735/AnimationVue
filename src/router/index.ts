import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: '主框架',
    component: () => import(/* webpackChunkName: "main" */ '../views/index.vue')
  }
]

const router = new VueRouter({
  routes
})

export default router
