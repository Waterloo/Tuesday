<script setup lang="ts">

const props = defineProps<{
    projects: Project[]
    activeProjectId: string
}>()

const emit = defineEmits<{
    create: []
}>()
</script>

<template>
    <aside class="sidebar">
        <div class="sidebar-header">
            <div class="sidebar-logo">
                <div class="logo-icon">T</div>
                <span class="logo-text heading-display">Tuesday</span>
            </div>
        </div>

        <div class="sidebar-section">
            <div class="sidebar-section-header">
                <span class="sidebar-section-title">Projects</span>
                <button class="btn-icon" title="New Project" @click="emit('create')">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                        stroke-linecap="round" stroke-linejoin="round">
                        <line x1="12" y1="5" x2="12" y2="19" />
                        <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                </button>
            </div>

            <nav class="sidebar-nav">
                <NuxtLink v-for="project in projects" :key="project.id" :to="`/projects/${project.id}`"
                    class="sidebar-item" :class="{ active: activeProjectId === project.id }">
                    <span class="sidebar-item-dot" :style="{ background: project.color }" />
                    <span class="sidebar-item-label truncate">{{ project.name }}</span>
                </NuxtLink>

                <div v-if="projects.length === 0" class="sidebar-empty">
                    <p>No projects yet</p>
                </div>
            </nav>
        </div>

        <div class="sidebar-footer">
            <NuxtLink to="/" class="sidebar-item" :class="{ active: activeProjectId === '' }">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                    stroke-linecap="round" stroke-linejoin="round">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                    <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
                <span class="sidebar-item-label">Home</span>
            </NuxtLink>
        </div>
    </aside>
</template>

<style scoped>
.sidebar {
    width: var(--sidebar-width);
    min-width: var(--sidebar-width);
    height: 100vh;
    background: var(--color-surface);
    border-right: 1px solid var(--color-border);
    display: flex;
    flex-direction: column;
    overflow: hidden;
}

.sidebar-header {
    padding: var(--space-4) var(--space-5);
    border-bottom: 1px solid var(--color-border-light);
}

.sidebar-logo {
    display: flex;
    align-items: center;
    gap: var(--space-3);
}

.logo-icon {
    width: 32px;
    height: 32px;
    background: var(--color-primary);
    color: var(--color-text-inverse);
    border-radius: var(--radius-md);
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: var(--font-display);
    font-size: 20px;
    font-weight: 400;
}

.logo-text {
    font-size: 20px;
    color: var(--color-text);
}

.sidebar-section {
    flex: 1;
    overflow-y: auto;
    padding: var(--space-3) 0;
}

.sidebar-section-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--space-2) var(--space-5);
    margin-bottom: var(--space-1);
}

.sidebar-section-title {
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--color-text-tertiary);
}

.sidebar-nav {
    display: flex;
    flex-direction: column;
    gap: 1px;
}

.sidebar-item {
    display: flex;
    align-items: center;
    gap: var(--space-3);
    padding: var(--space-2) var(--space-5);
    margin: 0 var(--space-2);
    border-radius: var(--radius-md);
    font-size: 13px;
    font-weight: 500;
    color: var(--color-text-secondary);
    transition: all var(--transition-fast);
    cursor: pointer;
}

.sidebar-item:hover {
    background: var(--color-bg-secondary);
    color: var(--color-text);
}

.sidebar-item.active {
    background: var(--color-primary-soft);
    color: var(--color-primary);
}

.sidebar-item-dot {
    width: 8px;
    height: 8px;
    border-radius: var(--radius-full);
    flex-shrink: 0;
}

.sidebar-item-label {
    flex: 1;
    min-width: 0;
}

.sidebar-empty {
    padding: var(--space-4) var(--space-5);
    text-align: center;
    color: var(--color-text-tertiary);
    font-size: 13px;
}

.sidebar-footer {
    border-top: 1px solid var(--color-border-light);
    padding: var(--space-3) 0;
}
</style>
