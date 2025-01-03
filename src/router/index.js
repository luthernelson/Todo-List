import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/userStore'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/task/TaskRegister.vue'),
      meta: { dontRequiresAuth: true },
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/connexion/TaskLogin.vue'),
      meta: { dontRequiresAuth: true },
    },
  ],
})
// Navigation guard for protected routes
router.beforeEach((to, from, next) => {
  const store = useUserStore()
  if (!to.meta.dontRequiresAuth && !store.isLoggedIn) {
    // Redirect to login if not logged in
    next('/login')
  } else {
    next() // Proceed to the route
  }
})

export default router
