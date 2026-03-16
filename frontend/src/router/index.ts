import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/tournament/:id', name: 'tournament', component: () => import('../views/Tournament.vue') },
    { path: '/', name: 'home', component: () => import('../views/Home.vue') },
  ],
})

export default router
