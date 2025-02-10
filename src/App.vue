<script setup>
import { computed, onBeforeMount } from 'vue'
import { RouterView } from 'vue-router'
import Navabar from './components/Navabar.vue'
import router from './router'
import { initData } from './mocks'
import { useAuth } from './stores/userStore'

const isLogin = computed(() => {
  return router.currentRoute.value.path === '/login'
})

const showNavabar = computed(() => {
  const path = router.currentRoute.value.path
  return path !== '/register' && path !== '/login'
})

const userStore = useAuth()
console.log('user:', userStore)
initData()

onBeforeMount(() => {
  if (!isLogin.value) {
    router.push('/login')
  }
})
</script>

<template>
  <template v-if="showNavabar">
    <Navabar />
  </template>
  <RouterView />
</template>

<style scoped>
/* Ajoutez des styles supplémentaires si nécessaire */
</style>
