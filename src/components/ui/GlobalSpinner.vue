<template>
  <loading
    :active="isLoading"
    :can-cancel="false"
    :is-full-page="true"
    :lock-scroll="true"
    loader="dots"
    color="#293848"
    background-color="rgba(255, 255, 255, 0.8)"
  />
</template>

<script setup>
import Loading from 'vue3-loading-overlay'
import 'vue3-loading-overlay/dist/vue3-loading-overlay.css'

defineProps({
  isLoading: {
    type: Boolean,
    default: false,
  },
})
</script>