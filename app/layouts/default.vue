<script setup lang="ts">

const route = useRoute()
const { data: projects, refresh: refreshProjects } = await useFetch<Project[]>('/api/projects')

const showCreateProject = ref(false)

async function handleProjectCreated() {
  showCreateProject.value = false
  await refreshProjects()
}

// Provide refresh function to child components
provide('refreshProjects', refreshProjects)
provide('projects', projects)
</script>

<template>
  <div class="layout">
    <AppSidebar :projects="projects || []" :active-project-id="(route.params.id as string) || ''"
      @create="showCreateProject = true" />
    <main class="layout-main">
      <slot />
    </main>
    <CreateProjectModal v-if="showCreateProject" @close="showCreateProject = false" @created="handleProjectCreated" />
  </div>
</template>

<style scoped>
.layout {
  display: flex;
  height: 100vh;
  overflow: hidden;
}

.layout-main {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
}
</style>
