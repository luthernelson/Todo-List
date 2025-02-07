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
      path: '/community/:id',
      name: 'CommunityChat',
      component: () => import('@/components/Community.vue'),
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/connexion/TaskLogin.vue'),
      meta: { requiresAuth: false },
    },
  ],
})
// Middleware pour les routes protégées
router.beforeEach((to, from, next) => {
  const userStore = useUserStore()

  // Vérifier si la route nécessite une authentification
  if (to.meta.requiresAuth && !userStore.isLoggedIn) {
    // Rediriger vers la page de login avec un paramètre de redirection
    next({ path: '/login', query: { redirect: to.fullPath } })
  } else {
    // Enregistrer la dernière route visitée uniquement si l'utilisateur est connecté
    if (userStore.isLoggedIn) {
      userStore.setLastRoute(to.path)
    }
    next()
  }
})
export default router
