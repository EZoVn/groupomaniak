import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import PostView from '@/views/PostView.vue'

const routes = [
  { path: '/', name: 'HomeView', component: HomeView },
  { path: '/Post', name: 'PostView', component: PostView },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router;