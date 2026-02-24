<script setup lang="ts">

const props = defineProps<{
    task: Task
    pipelines: Pipeline[]
    allTasks: Task[]
}>()

const emit = defineEmits<{
    close: []
    updated: []
    deleted: [id: string]
}>()

const title = ref(props.task.title)
const description = ref(props.task.description)
const priority = ref(props.task.priority)
const assignee = ref(props.task.assignee || '')
const selectedPipelineId = ref(props.task.pipelineId)
const isSubmitting = ref(false)
const showAddSubtask = ref(false)
const newSubtaskTitle = ref('')

const subtasks = computed(() =>
    props.allTasks.filter(t => t.parentId === props.task.id)
)

const currentPipeline = computed(() =>
    props.pipelines.find(p => p.id === props.task.pipelineId)
)

const hasChanges = computed(() =>
    title.value !== props.task.title ||
    description.value !== props.task.description ||
    priority.value !== props.task.priority ||
    assignee.value !== (props.task.assignee || '') ||
    selectedPipelineId.value !== props.task.pipelineId
)

async function handleSave() {
    if (!title.value.trim() || isSubmitting.value) return
    isSubmitting.value = true

    try {
        await $fetch(`/api/tasks/${props.task.id}`, {
            method: 'PUT',
            body: {
                title: title.value.trim(),
                description: description.value.trim(),
                priority: priority.value,
                assignee: assignee.value.trim(),
                pipelineId: selectedPipelineId.value,
            },
        })
        emit('updated')
    } catch (e) {
        console.error(e)
    } finally {
        isSubmitting.value = false
    }
}

async function handleDelete() {
    if (!confirm('Delete this task and all its subtasks?')) return
    await $fetch(`/api/tasks/${props.task.id}`, { method: 'DELETE' })
    emit('deleted', props.task.id)
}

async function handleAddSubtask() {
    if (!newSubtaskTitle.value.trim()) return

    await $fetch('/api/tasks', {
        method: 'POST',
        body: {
            projectId: props.task.projectId,
            pipelineId: props.task.pipelineId,
            parentId: props.task.id,
            title: newSubtaskTitle.value.trim(),
        },
    })

    newSubtaskTitle.value = ''
    showAddSubtask.value = false
    emit('updated')
}

async function handleDeleteSubtask(subtaskId: string) {
    await $fetch(`/api/tasks/${subtaskId}`, { method: 'DELETE' })
    emit('updated')
}
</script>

<template>
    <div class="modal-overlay" @click.self="emit('close')">
        <div class="modal-content" style="max-width: 640px;">
            <div class="modal-header">
                <div style="display: flex; align-items: center; gap: var(--space-3);">
                    <h2>Task Details</h2>
                    <span v-if="currentPipeline" class="badge"
                        :style="{ background: currentPipeline.color + '22', color: currentPipeline.color }">
                        {{ currentPipeline.name }}
                    </span>
                </div>
                <div style="display: flex; gap: var(--space-1);">
                    <button class="btn-icon btn-danger" title="Delete task" @click="handleDelete">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                            stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <polyline points="3 6 5 6 21 6" />
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                        </svg>
                    </button>
                    <button class="btn-icon" @click="emit('close')">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                            stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>
                </div>
            </div>

            <div class="modal-body" style="display: flex; flex-direction: column; gap: var(--space-5);">
                <!-- Title -->
                <div>
                    <label class="label">Title</label>
                    <input v-model="title" class="input" placeholder="Task title..." />
                </div>

                <!-- Description -->
                <div>
                    <label class="label">Description</label>
                    <textarea v-model="description" class="textarea" placeholder="Describe this task..." rows="3" />
                </div>

                <!-- Row: Priority + Assignee + Pipeline -->
                <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: var(--space-4);">
                    <div>
                        <label class="label">Priority</label>
                        <select v-model="priority" class="select">
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                            <option value="urgent">Urgent</option>
                        </select>
                    </div>
                    <div>
                        <label class="label">Assignee</label>
                        <input v-model="assignee" class="input" placeholder="Name..." />
                    </div>
                    <div>
                        <label class="label">Pipeline</label>
                        <select v-model="selectedPipelineId" class="select">
                            <option v-for="p in pipelines" :key="p.id" :value="p.id">{{ p.name }}</option>
                        </select>
                    </div>
                </div>

                <!-- Subtasks -->
                <div>
                    <div
                        style="display: flex; align-items: center; justify-content: space-between; margin-bottom: var(--space-3);">
                        <label class="label" style="margin-bottom: 0;">Subtasks ({{ subtasks.length }})</label>
                        <button class="btn btn-ghost btn-sm" @click="showAddSubtask = !showAddSubtask">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <line x1="12" y1="5" x2="12" y2="19" />
                                <line x1="5" y1="12" x2="19" y2="12" />
                            </svg>
                            Add Subtask
                        </button>
                    </div>

                    <div v-if="showAddSubtask"
                        style="display: flex; gap: var(--space-2); margin-bottom: var(--space-3);">
                        <input v-model="newSubtaskTitle" class="input" placeholder="Subtask title..." autofocus
                            @keyup.enter="handleAddSubtask" @keyup.escape="showAddSubtask = false" />
                        <button class="btn btn-primary btn-sm" @click="handleAddSubtask">Add</button>
                    </div>

                    <div v-if="subtasks.length > 0" class="subtask-list">
                        <div v-for="sub in subtasks" :key="sub.id" class="subtask-item">
                            <span class="subtask-title truncate">{{ sub.title }}</span>
                            <div class="subtask-meta">
                                <span class="badge" :class="`badge-${sub.priority}`" style="font-size: 10px;">
                                    {{ sub.priority }}
                                </span>
                                <button class="btn-icon btn-danger" style="width: 24px; height: 24px;"
                                    @click="handleDeleteSubtask(sub.id)">
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                        stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                        <line x1="18" y1="6" x2="6" y2="18" />
                                        <line x1="6" y1="6" x2="18" y2="18" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                    <p v-else style="font-size: 13px; color: var(--color-text-tertiary);">No subtasks yet</p>
                </div>
            </div>

            <div class="modal-footer">
                <span style="font-size: 12px; color: var(--color-text-tertiary); margin-right: auto;">
                    ID: {{ task.id }}
                </span>
                <button class="btn btn-secondary" @click="emit('close')">Cancel</button>
                <button class="btn btn-primary" :disabled="!title.trim() || !hasChanges || isSubmitting"
                    @click="handleSave">
                    {{ isSubmitting ? 'Saving...' : 'Save Changes' }}
                </button>
            </div>
        </div>
    </div>
</template>

<style scoped>
.subtask-list {
    display: flex;
    flex-direction: column;
    border: 1px solid var(--color-border-light);
    border-radius: var(--radius-md);
    overflow: hidden;
}

.subtask-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--space-3);
    border-bottom: 1px solid var(--color-border-light);
    transition: background var(--transition-fast);
}

.subtask-item:last-child {
    border-bottom: none;
}

.subtask-item:hover {
    background: var(--color-bg-secondary);
}

.subtask-title {
    font-size: 13px;
    flex: 1;
    min-width: 0;
}

.subtask-meta {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    flex-shrink: 0;
}
</style>
