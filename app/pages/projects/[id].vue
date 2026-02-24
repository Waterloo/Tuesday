<script setup lang="ts">

const route = useRoute()
const projectId = route.params.id as string
const refreshProjectsSidebar = inject<() => Promise<void>>('refreshProjects')

const { data: project, refresh: refreshProject } = await useFetch<ProjectWithDetails>(`/api/projects/${projectId}`)

const selectedTask = ref<Task | null>(null)
const showCreatePipeline = ref(false)

function getTasksForPipeline(pipelineId: string): Task[] {
    return (project.value?.tasks || []).filter(t => t.pipelineId === pipelineId)
}

async function handleRefresh() {
    await refreshProject()
}

async function handleTaskUpdated() {
    selectedTask.value = null
    await refreshProject()
}

async function handleTaskDeleted() {
    selectedTask.value = null
    await refreshProject()
}

async function handlePipelineCreated() {
    showCreatePipeline.value = false
    await refreshProject()
}

async function handleDeletePipeline(pipelineId: string) {
    if (!confirm('Delete this pipeline and all its tasks?')) return
    await $fetch(`/api/pipelines/${pipelineId}`, { method: 'DELETE' })
    await refreshProject()
}

async function handleMovePipeline(pipelineId: string, direction: 'up' | 'down') {
    const pipelines = project.value?.pipelines || []
    const sorted = [...pipelines].sort((a, b) => a.order - b.order)
    const idx = sorted.findIndex(p => p.id === pipelineId)
    if (idx < 0) return

    const swapIdx = direction === 'up' ? idx - 1 : idx + 1
    if (swapIdx < 0 || swapIdx >= sorted.length) return

    const current = sorted[idx]
    const neighbor = sorted[swapIdx]

    await Promise.all([
        $fetch(`/api/pipelines/${current.id}`, { method: 'PUT', body: { order: neighbor.order } }),
        $fetch(`/api/pipelines/${neighbor.id}`, { method: 'PUT', body: { order: current.order } }),
    ])
    await refreshProject()
}

const { onMessage } = useWebSocket()

onMounted(() => {
    const unsub = onMessage((payload) => {
        if (payload.projectId === projectId) {
            refreshProject()
        }
    })

    onUnmounted(() => {
        unsub()
    })
})
</script>

<template>
    <div v-if="project" class="board">
        <!-- Board Header -->
        <header class="board-header">
            <div class="board-header-left">
                <span class="board-dot" :style="{ background: project.color }" />
                <h1 class="board-title">{{ project.name }}</h1>
            </div>
            <div class="board-header-actions">
                <button class="btn btn-primary btn-sm" @click="showCreatePipeline = true">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                        stroke-linecap="round" stroke-linejoin="round">
                        <line x1="12" y1="5" x2="12" y2="19" />
                        <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                    New Phase
                </button>
            </div>
        </header>

        <!-- Pipeline Groups (vertical stacked) -->
        <div class="board-groups stagger-children">
            <PipelineGroup v-for="pipeline in project.pipelines" :key="pipeline.id" :pipeline="pipeline"
                :tasks="getTasksForPipeline(pipeline.id)" :all-tasks="project.tasks || []" @add-task="handleRefresh"
                @select-task="selectedTask = $event" @delete-pipeline="handleDeletePipeline"
                @pipeline-updated="handleRefresh" @move-pipeline="handleMovePipeline" />

            <!-- Add new group button -->
            <button class="add-group-btn" @click="showCreatePipeline = true">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                    stroke-linecap="round" stroke-linejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                <span>Add New Phase</span>
            </button>
        </div>

        <!-- Task Modal -->
        <TaskModal v-if="selectedTask" :task="selectedTask" :pipelines="project.pipelines || []"
            :all-tasks="project.tasks || []" @close="selectedTask = null" @updated="handleTaskUpdated"
            @deleted="handleTaskDeleted" />

        <!-- Create Pipeline Modal -->
        <CreatePipelineModal v-if="showCreatePipeline" :project-id="projectId" @close="showCreatePipeline = false"
            @created="handlePipelineCreated" />
    </div>

    <div v-else class="board-loading">
        <p>Loading project...</p>
    </div>
</template>

<style scoped>
.board {
    display: flex;
    flex-direction: column;
    height: 100vh;
    overflow: hidden;
}

.board-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--space-4) var(--space-6);
    border-bottom: 1px solid var(--color-border);
    background: var(--color-surface);
    flex-shrink: 0;
}

.board-header-left {
    display: flex;
    align-items: center;
    gap: var(--space-3);
}

.board-dot {
    width: 12px;
    height: 12px;
    border-radius: var(--radius-full);
}

.board-title {
    font-size: 18px;
    font-weight: 600;
}

.board-header-actions {
    display: flex;
    gap: var(--space-2);
}

/* --- Vertical stacked groups --- */
.board-groups {
    flex: 1;
    overflow-y: auto;
    padding: var(--space-5) var(--space-6);
    display: flex;
    flex-direction: column;
    gap: var(--space-5);
}

.add-group-btn {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    padding: var(--space-3) var(--space-4);
    color: var(--color-text-tertiary);
    font-size: 14px;
    font-weight: 500;
    border: 2px dashed var(--color-border);
    border-radius: var(--radius-lg);
    transition: all var(--transition-fast);
    justify-content: center;
}

.add-group-btn:hover {
    border-color: var(--color-primary);
    color: var(--color-primary);
    background: var(--color-primary-soft);
}

.board-loading {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100vh;
    color: var(--color-text-tertiary);
}
</style>
