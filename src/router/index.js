import { createRouter, createWebHashHistory } from 'vue-router'
// import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    // {
    //   path: '/',
    //   name: 'home',
    //   component: HomeView
    // },   \
    {
      path: '/',
      name: 'home',
      // component: () => import('../views/LoginView.vue'),
      component: LoginView
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView
    },
    {
      path: '/todolist',
      name: 'todolist',
      component: () => import('../views/TodolistView.vue')
    },
    {
      path: '/signup',
      name: 'signup',
      component: () => import('../views/SignupView.vue')
    },
    // { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFoundView },
  ]
})

export default router
