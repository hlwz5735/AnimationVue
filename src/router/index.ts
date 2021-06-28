import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: '主框架',
    component: () => import(/* webpackChunkName: "main" */ '@/views/index.vue'),
    children: [
      {
        path: '/animation-list',
        name: '动画列表页',
        component: () => import(/* webpackChunkName: "main" */ '@/views/animation-list/index.vue')
      },
      {
        path: '/texture-list',
        name: '纹理列表页',
        component: () => import(/* webpackChunkName: "main" */ '@/views/texture-list/index.vue')
      }
    ]
  },
  {
    path: '/sprite-import-demo',
    name: '精灵图导入测试',
    component: () => import(/* webpackChunkName: "main" */ '@/views/sprite-import/sprite-import-demo.vue')
  }
]

const router = new VueRouter({
  routes
})

export default router
