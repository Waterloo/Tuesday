<script setup lang="ts">
const { connect } = useWebSocket()

onMounted(() => {
  connect()
})
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
