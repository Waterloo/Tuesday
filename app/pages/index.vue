<script setup lang="ts">

const { data: projects, refresh: refreshProjects } = await useFetch<Project[]>('/api/projects')
const refreshProjectsSidebar = inject<() => Promise<void>>('refreshProjects')

const showCreateProject = ref(false)

async function handleProjectCreated() {
    showCreateProject.value = false
    await refreshProjects()
    if (refreshProjectsSidebar) await refreshProjectsSidebar()
}

async function handleDeleteProject(id: string) {
    if (!confirm('Delete this project and all its data?')) return

    await $fetch(`/api/projects/${id}`, { method: 'DELETE' })
    await refreshProjects()
    if (refreshProjectsSidebar) await refreshProjectsSidebar()
}
</script>

<template>
    <div class="home">
        <header class="home-header">
            <div>
                <h1 class="home-title heading-display">Good {{ new Date().getHours() < 12 ? 'morning' : new
                    Date().getHours() < 17 ? 'afternoon' : 'evening' }}</h1>
                        <p class="home-subtitle">Manage your projects and let AI agents handle the rest.</p>
            </div>
            <button class="btn btn-primary btn-lg" @click="showCreateProject = true">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                    stroke-linecap="round" stroke-linejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                New Project
            </button>
        </header>

        <section v-if="projects && projects.length > 0" class="projects-grid stagger-children">
            <ProjectCard v-for="project in projects" :key="project.id" :project="project"
                @delete="handleDeleteProject" />
        </section>

        <section v-else class="home-empty animate-fade-in">
            <div class="home-empty-content">
                <div class="home-empty-icon">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-tertiary)"
                        stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                    </svg>
                </div>
                <h3>No projects yet</h3>
                <p>Create your first project to get started.</p>
                <button class="btn btn-primary" @click="showCreateProject = true">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                        stroke-linecap="round" stroke-linejoin="round">
                        <line x1="12" y1="5" x2="12" y2="19" />
                        <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                    Create Project
                </button>
            </div>
        </section>

        <CreateProjectModal v-if="showCreateProject" @close="showCreateProject = false"
            @created="handleProjectCreated" />
    </div>
</template>

<style scoped>
.home {
    padding: var(--space-8) var(--space-10);
    max-width: 960px;
}

.home-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    margin-bottom: var(--space-8);
}

.home-title {
    font-size: 32px;
    margin-bottom: var(--space-1);
}

.home-subtitle {
    color: var(--color-text-secondary);
    font-size: 14px;
}

.projects-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
    gap: var(--space-5);
}

.home-empty {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 400px;
}

.home-empty-content {
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--space-3);
}

.home-empty-icon {
    margin-bottom: var(--space-2);
    opacity: 0.5;
}

.home-empty-content h3 {
    font-size: 18px;
    font-weight: 600;
}

.home-empty-content p {
    color: var(--color-text-secondary);
    font-size: 14px;
    margin-bottom: var(--space-2);
}
</style>
