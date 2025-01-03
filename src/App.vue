<script setup>
import { computed, onBeforeMount } from 'vue'
import { RouterView } from 'vue-router'
import Navabar from './components/Navabar.vue'
import router from './router'
import { initData } from './mocks'

const isLogin = computed(() => {
  return router.currentRoute.value.path === '/login'
})
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
