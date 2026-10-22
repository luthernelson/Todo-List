<script setup>
import { computed } from 'vue'
import { RouterView } from 'vue-router'
import Layout from './components/Layout.vue'
import Notifications from './components/Notifications.vue'
import Toast from './components/ui/Toast.vue'
import { useToastStore } from './stores/toastStore'
import { useUserStore } from './stores/userStore'
import router from './router'
import { initData } from './mocks'

const toastStore = useToastStore()
const userStore = useUserStore()

const showLayout = computed(() => {
  const path = router.currentRoute.value.path
  return path !== '/register' && path !== '/login' && path !== '/onboarding'
})

initData()
</script>

<template>
  <!-- Onboarding Page (première connexion) -->
  <Onboarding v-if="showOnboardingPage" />

  <!-- Main App -->
  <template v-else>
    <template v-if="showLayout">
      <Layout>
        <RouterView />
      </Layout>
    </template>
    <template v-else>
      <RouterView />
    </template>
  </template>

  <Notifications />
  <!-- Toast Notifications -->
  <div class="toast-container">
    <Toast
      v-for="toast in toastStore.toasts"
      :key="toast.id"
      :message="toast.message"
      :type="toast.type"
      :duration="toast.duration"
      @close="toastStore.removeToast(toast.id)"
    />
  </div>
</template>

<style>
/* Global styles for dark mode */
:root {
  --bg-primary: #f9fafb;
  --bg-secondary: white;
  --text-primary: #1f2937;
  --text-secondary: #6b7280;
  --border-color: #e5e7eb;
}

.dark {
  --bg-primary: #1f2937;
  --bg-secondary: #374151;
  --text-primary: white;
  --text-secondary: #d1d5db;
  --border-color: #6b7280;
}

body {
  margin: 0;
  padding: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  background: var(--bg-primary);
  color: var(--text-primary);
  transition: background 0.3s ease, color 0.3s ease;
}

.toast-container {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
</style>
