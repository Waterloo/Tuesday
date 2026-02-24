<script setup lang="ts">

const props = defineProps<{
    project: Project
}>()

const emit = defineEmits<{
    delete: [id: string]
}>()

const colorMap: Record<string, string> = {
    '#27ae60': 'linear-gradient(135deg, #27ae60 0%, #2ecc71 100%)',
    '#00C875': 'linear-gradient(135deg, #00C875 0%, #00E088 100%)',
    '#E44258': 'linear-gradient(135deg, #E44258 0%, #FF6B7F 100%)',
    '#579BFC': 'linear-gradient(135deg, #579BFC 0%, #7BB3FF 100%)',
    '#FDAB3D': 'linear-gradient(135deg, #FDAB3D 0%, #FFC266 100%)',
    '#A25DDC': 'linear-gradient(135deg, #A25DDC 0%, #BB80E8 100%)',
}
</script>

<template>
    <NuxtLink :to="`/projects/${project.id}`" class="project-card animate-slide-up">
        <div class="project-card-banner" :style="{ background: colorMap[project.color] || project.color }" />
        <div class="project-card-body">
            <h3 class="project-card-title truncate">{{ project.name }}</h3>
            <p v-if="project.description" class="project-card-desc truncate">{{ project.description }}</p>
            <p v-else class="project-card-desc project-card-desc--empty">No description</p>
        </div>
        <div class="project-card-footer">
            <span class="project-card-date">{{ new Date(project.createdAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric'
            }) }}</span>
            <button class="btn-icon btn-danger" title="Delete project" @click.prevent.stop="emit('delete', project.id)">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                    stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                </svg>
            </button>
        </div>
    </NuxtLink>
</template>

<style scoped>
.project-card {
    background: var(--color-surface);
    border-radius: var(--radius-lg);
    border: 1px solid var(--color-border);
    overflow: hidden;
    transition: all var(--transition-base);
    cursor: pointer;
    display: flex;
    flex-direction: column;
}

.project-card:hover {
    border-color: var(--color-primary);
    box-shadow: var(--shadow-md);
    transform: translateY(-2px);
}

.project-card-banner {
    height: 6px;
    width: 100%;
}

.project-card-body {
    padding: var(--space-5);
    flex: 1;
}

.project-card-title {
    font-size: 15px;
    font-weight: 600;
    margin-bottom: var(--space-1);
}

.project-card-desc {
    font-size: 13px;
    color: var(--color-text-secondary);
}

.project-card-desc--empty {
    color: var(--color-text-tertiary);
    font-style: italic;
}

.project-card-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--space-3) var(--space-5);
    border-top: 1px solid var(--color-border-light);
}

.project-card-date {
    font-size: 12px;
    color: var(--color-text-tertiary);
}
</style>
