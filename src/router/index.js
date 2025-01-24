import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/userStore'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/task/TaskRegister.vue'),
      meta: { requiresAuth: false },
    },
    {
      path: '/community',
      name: 'community',
      component: () => import('@/views/community/Community.vue'),
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/connexion/TaskLogin.vue'),
      meta: { requiresAuth: false },
    },
  ],
})
// Navigation guard for protected routes
router.beforeEach((to, from, next) => {
  const store = useUserStore()
  console.log('to.meta.requiresAuth', to.meta.requiresAuth)
  console.log('store.isLoggedIn', store.isLoggedIn)
  if (to.meta.requiresAuth && !store.isLoggedIn) {
    // Redirect to login if not logged in
    next('/login')
  } else {
    next() // Proceed to the route
  }
})

export default router
