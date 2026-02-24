<script setup lang="ts">
const props = defineProps<{
    pipeline: Pipeline
    tasks: Task[]
    allTasks: Task[]
}>()

const emit = defineEmits<{
    addTask: [pipelineId: string]
    selectTask: [task: Task]
    deletePipeline: [pipelineId: string]
    pipelineUpdated: []
    movePipeline: [pipelineId: string, direction: 'up' | 'down']
}>()

const collapsed = ref(false)
const newTaskTitle = ref('')
const isAdding = ref(false)

// Inline rename state
const isEditingName = ref(false)
const editName = ref('')
const nameInputRef = ref<HTMLInputElement | null>(null)

const rootTasks = computed(() =>
    props.tasks.filter(t => !t.parentId)
)

function getSubtaskCount(taskId: string): number {
    return props.allTasks.filter(t => t.parentId === taskId).length
}

// --- Inline rename ---
function startEditName() {
    editName.value = props.pipeline.name
    isEditingName.value = true
    nextTick(() => {
        nameInputRef.value?.focus()
        nameInputRef.value?.select()
    })
}

async function saveName() {
    const trimmed = editName.value.trim()
    if (!trimmed || trimmed === props.pipeline.name) {
        isEditingName.value = false
        return
    }

    await $fetch(`/api/pipelines/${props.pipeline.id}`, {
        method: 'PUT',
        body: { name: trimmed },
    })
    isEditingName.value = false
    emit('pipelineUpdated')
}

function cancelEditName() {
    isEditingName.value = false
}

// --- Add task ---
async function handleAddTask() {
    if (!newTaskTitle.value.trim()) return

    await $fetch('/api/tasks', {
        method: 'POST',
        body: {
            projectId: props.pipeline.projectId,
            pipelineId: props.pipeline.id,
            title: newTaskTitle.value.trim(),
        },
    })

    newTaskTitle.value = ''
    isAdding.value = false
    emit('addTask', props.pipeline.id)
}

function cancelAdd() {
    newTaskTitle.value = ''
    isAdding.value = false
}
</script>

<template>
    <div class="pipeline-group animate-slide-up">
        <!-- Group Header -->
        <div class="group-header" @click="collapsed = !collapsed">
            <div class="group-header-left">
                <button class="group-collapse-btn" :class="{ collapsed }">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M7 10l5 5 5-5z" />
                    </svg>
                </button>
                <span class="group-color-bar" :style="{ background: pipeline.color }" />

                <!-- Editable name -->
                <input v-if="isEditingName" ref="nameInputRef" v-model="editName" class="group-title-input"
                    :style="{ color: pipeline.color }" @click.stop @keyup.enter="saveName"
                    @keyup.escape="cancelEditName" @blur="saveName" />
                <h3 v-else class="group-title" :style="{ color: pipeline.color }" @dblclick.stop="startEditName">
                    {{ pipeline.name }}
                </h3>

                <span class="group-count">{{ rootTasks.length }} items</span>
            </div>
            <div class="group-header-actions" @click.stop>
                <!-- Move up -->
                <button class="btn-icon" title="Move up" @click="emit('movePipeline', pipeline.id, 'up')">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                        stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="18 15 12 9 6 15" />
                    </svg>
                </button>
                <!-- Move down -->
                <button class="btn-icon" title="Move down" @click="emit('movePipeline', pipeline.id, 'down')">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                        stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="6 9 12 15 18 9" />
                    </svg>
                </button>
                <button class="btn-icon" title="Add task" @click="isAdding = true; collapsed = false">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                        stroke-linecap="round" stroke-linejoin="round">
                        <line x1="12" y1="5" x2="12" y2="19" />
                        <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                </button>
                <button class="btn-icon btn-danger" title="Delete pipeline"
                    @click="emit('deletePipeline', pipeline.id)">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                        stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                    </svg>
                </button>
            </div>
        </div>

        <!-- Table Content -->
        <div v-show="!collapsed" class="group-body">
            <!-- Table Header Row -->
            <div class="table-header">
                <div class="col-color" />
                <div class="col-name">Item</div>
                <div class="col-assignee">Assignee</div>
                <div class="col-priority">Priority</div>
                <div class="col-status">Pipeline</div>
            </div>

            <!-- Task Rows -->
            <TaskRow v-for="task in rootTasks" :key="task.id" :task="task" :subtask-count="getSubtaskCount(task.id)"
                :pipeline-name="pipeline.name" :pipeline-color="pipeline.color" @click="emit('selectTask', task)" />

            <!-- Empty State -->
            <div v-if="rootTasks.length === 0 && !isAdding" class="empty-state">
                No items
            </div>

            <!-- Add task inline -->
            <div v-if="isAdding" class="add-task-row">
                <div class="col-color">
                    <span class="row-color-bar" :style="{ background: pipeline.color }" />
                </div>
                <div class="col-name" style="flex: 1;">
                    <input v-model="newTaskTitle" class="inline-input" placeholder="+ Add item..." autofocus
                        @keyup.enter="handleAddTask" @keyup.escape="cancelAdd" @blur="cancelAdd" />
                </div>
                <div class="add-task-actions">
                    <button class="btn btn-primary btn-sm" @mousedown.prevent="handleAddTask">Add</button>
                    <button class="btn btn-ghost btn-sm" @mousedown.prevent="cancelAdd">Cancel</button>
                </div>
            </div>

            <!-- Add item button -->
            <button v-if="!isAdding" class="add-item-btn" @click="isAdding = true">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                    stroke-linecap="round" stroke-linejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                <span>Add Item</span>
            </button>
        </div>
    </div>
</template>

<style scoped>
.pipeline-group {
    background: var(--color-surface);
    border-radius: var(--radius-lg);
    border: 1px solid var(--color-border);
    /* overflow: hidden;  <-- Removed to let content expand if needed (e.g. shadows, dropdowns) */
    display: flex;
    flex-direction: column;
    flex-shrink: 0;
    /* <-- Added to prevent squashing in flex containers */
}

.group-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--space-3) var(--space-4);
    cursor: pointer;
    user-select: none;
    transition: background var(--transition-fast);
}

.group-header:hover {
    background: var(--color-bg-secondary);
}

.group-header-left {
    display: flex;
    align-items: center;
    gap: var(--space-2);
}

.group-collapse-btn {
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--color-text-tertiary);
    transition: transform var(--transition-fast);
    flex-shrink: 0;
}

.group-collapse-btn.collapsed {
    transform: rotate(-90deg);
}

.group-color-bar {
    width: 4px;
    height: 22px;
    border-radius: 2px;
    flex-shrink: 0;
}

.group-title {
    font-size: 15px;
    font-weight: 600;
    cursor: text;
}

.group-title-input {
    font-size: 15px;
    font-weight: 600;
    background: var(--color-surface);
    border: 1px solid var(--color-primary);
    border-radius: var(--radius-md);
    padding: 2px 8px;
    outline: none;
    box-shadow: 0 0 0 3px var(--color-primary-light);
    min-width: 120px;
}

.group-count {
    font-size: 12px;
    color: var(--color-text-tertiary);
    font-weight: 400;
    margin-left: var(--space-1);
}

.group-header-actions {
    display: flex;
    gap: 2px;
    opacity: 0;
    transition: opacity var(--transition-fast);
}

.pipeline-group:hover .group-header-actions {
    opacity: 1;
}

/* --- Table layout --- */
.group-body {
    border-top: 1px solid var(--color-border-light);
}

.table-header {
    display: flex;
    align-items: center;
    padding: var(--space-2) var(--space-4);
    background: var(--color-bg-secondary);
    border-bottom: 1px solid var(--color-border-light);
    font-size: 12px;
    font-weight: 600;
    color: var(--color-text-tertiary);
    text-transform: uppercase;
    letter-spacing: 0.04em;
}

.col-color {
    width: 8px;
    margin-right: var(--space-3);
    flex-shrink: 0;
}

.col-name {
    flex: 1;
    min-width: 0;
}

.col-assignee {
    width: 180px;
    text-align: left;
    flex-shrink: 0;
}

.col-priority {
    width: 100px;
    text-align: center;
    flex-shrink: 0;
}



.col-status {
    width: 130px;
    text-align: center;
    flex-shrink: 0;
}

/* --- Add task inline --- */
.add-task-row {
    display: flex;
    align-items: center;
    padding: var(--space-2) var(--space-4);
    border-bottom: 1px solid var(--color-border-light);
    gap: var(--space-2);
}

.row-color-bar {
    display: block;
    width: 4px;
    height: 24px;
    border-radius: 2px;
}

.inline-input {
    width: 100%;
    height: 32px;
    padding: 0 var(--space-2);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    background: var(--color-surface);
    font-size: 13px;
}

.inline-input:focus {
    border-color: var(--color-primary);
    box-shadow: 0 0 0 3px var(--color-primary-light);
}

.add-task-actions {
    display: flex;
    gap: var(--space-2);
    flex-shrink: 0;
}

.add-item-btn {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    padding: var(--space-2) var(--space-4);
    color: var(--color-text-tertiary);
    font-size: 13px;
    font-weight: 500;
    transition: all var(--transition-fast);
    width: 100%;
}

.add-item-btn:hover {
    color: var(--color-primary);
    background: var(--color-primary-soft);
}

.empty-state {
    padding: var(--space-4);
    text-align: center;
    color: var(--color-text-tertiary);
    font-size: 13px;
    font-style: italic;
    background: var(--color-bg-secondary);
}
</style>
