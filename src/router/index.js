import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/userStore'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/Dashboard.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/projects',
      name: 'projects',
      component: () => import('@/views/projects/ProjectList.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/projects/:id',
      name: 'project-detail',
      component: () => import('@/views/projects/ProjectDetail.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/company',
      name: 'company-management',
      component: () => import('@/views/company/CompanyManagement.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/tasks',
      name: 'tasks',
      component: () => import('@/views/task/TaskRegister.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/community',
      name: 'community',
      component: () => import('@/views/community/Community.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/community/:id',
      name: 'CommunityChat',
      component: () => import('@/components/Community.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('@/views/connexion/SimpleRegister.vue'),
      meta: { requiresAuth: false },
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/connexion/ModernAuth.vue'),
      meta: { requiresAuth: false },
    },
    {
      path: '/onboarding',
      name: 'onboarding',
      component: () => import('@/views/Onboarding.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/admin',
      name: 'admin',
      component: () => import('@/views/admin/AdminDashboard.vue'),
      meta: { requiresAuth: true, requiresAdmin: true },
    },
    {
      path: '/settings',
      name: 'settings',
      component: () => import('@/views/settings/SettingsPage.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/budget',
      name: 'budget',
      component: () => import('@/views/BudgetPage.vue'),
      meta: { requiresAuth: true },
    },
  ],
})
router.beforeEach((to, from, next) => {
  const authStore = useUserStore()

  console.log('Router guard - to:', to.path, 'isLoggedIn:', authStore.isLoggedIn)

  // Vérifier si la route nécessite une authentification
  if (to.meta.requiresAuth && !authStore.isLoggedIn) {
    console.log('Redirection vers login car non authentifié')
    // Rediriger vers la page de login
    next({ path: '/login', query: { redirect: to.fullPath } })
  } else if (to.meta.requiresAdmin) {
    // Vérifier si l'utilisateur est admin
    if (!authStore.user || authStore.user.role !== 'admin') {
      console.log('Redirection vers home car pas admin')
      next({ path: '/' })
    } else {
      next()
    }
  } else {
    // Enregistrer la dernière route visitée si ce n'est pas login ou landing
    if (to.path !== '/login' && to.path !== '/register' && to.path !== '/') {
      authStore.lastRoute = to.fullPath
    }
    console.log('Navigation autorisée vers:', to.path)
    next()
  }
})
export default router
