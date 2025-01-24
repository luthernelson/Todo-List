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
  <template v-if="!isLogin"> <Navabar /> <RouterView /> </template>
  <template v-else> <RouterView /> </template>
</template>

<style scoped>
/* Ajoutez des styles supplémentaires si nécessaire */
</style>
