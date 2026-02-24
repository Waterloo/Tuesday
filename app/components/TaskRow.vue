<script setup lang="ts">

const props = defineProps<{
    task: Task
    subtaskCount: number
    pipelineName: string
    pipelineColor: string
}>()

const priorityLabels: Record<string, string> = {
    low: 'Low',
    medium: 'Medium',
    high: 'High',
    urgent: 'Urgent',
}

const priorityColors: Record<string, string> = {
    low: '#579BFC',
    medium: '#FDAB3D',
    high: '#E44258',
    urgent: '#BB3354',
}

function getInitials(name: string): string {
    return name
        .split(' ')
        .map(w => w[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
}
</script>

<template>
    <div class="task-row" tabindex="0">
        <!-- Color bar -->
        <div class="col-color">
            <span class="row-color-bar" :style="{ background: pipelineColor }" />
        </div>

        <!-- Name column -->
        <div class="col-name">
            <span class="task-name truncate">{{ task.title }}</span>
            <span v-if="subtaskCount > 0" class="subtask-indicator" :title="`${subtaskCount} subtask(s)`">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                    stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="9 11 12 14 22 4" />
                    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                </svg>
                {{ subtaskCount }}
            </span>
        </div>

        <!-- Assignee column -->
        <div class="col-assignee">
            <span v-if="task.assignee" class="assignee-pill">
                <span class="assignee-avatar">{{ getInitials(task.assignee) }}</span>
                <span class="assignee-name truncate">{{ task.assignee }}</span>
            </span>
            <span v-else class="assignee-empty">—</span>
        </div>

        <!-- Priority column -->
        <div class="col-priority">
            <span class="priority-pill"
                :style="{ background: priorityColors[task.priority] || '#9699A6', color: '#fff' }">
                {{ priorityLabels[task.priority] }}
            </span>
        </div>



        <!-- Status column -->
        <div class="col-status">
            <span class="status-pill" :style="{ background: pipelineColor + '22', color: pipelineColor }">
                {{ pipelineName }}
            </span>
        </div>
    </div>
</template>

<style scoped>
.task-row {
    display: flex;
    align-items: center;
    padding: var(--space-2) var(--space-4);
    border-bottom: 1px solid var(--color-border-light);
    cursor: pointer;
    transition: background var(--transition-fast);
    min-height: 42px;
}

.task-row:hover {
    background: var(--color-bg-secondary);
}

.task-row:focus-visible {
    outline: 2px solid var(--color-primary);
    outline-offset: -2px;
}

.col-color {
    width: 8px;
    margin-right: var(--space-3);
    flex-shrink: 0;
}

.row-color-bar {
    display: block;
    width: 4px;
    height: 24px;
    border-radius: 2px;
}

.col-name {
    flex: 1;
    min-width: 0;
    display: flex;
    align-items: center;
    gap: var(--space-2);
}

.task-name {
    font-size: 14px;
    font-weight: 500;
    color: var(--color-text);
}

.subtask-indicator {
    display: inline-flex;
    align-items: center;
    gap: 3px;
    font-size: 11px;
    color: var(--color-text-tertiary);
    flex-shrink: 0;
}

.col-assignee {
    width: 180px;
    text-align: left;
    flex-shrink: 0;
}

.assignee-pill {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    max-width: 100%;
}

.assignee-avatar {
    width: 24px;
    height: 24px;
    border-radius: var(--radius-full);
    background: var(--color-primary);
    color: #fff;
    font-size: 10px;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}

.assignee-name {
    font-size: 13px;
    color: var(--color-text-secondary);
    max-width: 130px;
}

.assignee-empty {
    font-size: 13px;
    color: var(--color-text-tertiary);
}

.col-priority {
    width: 100px;
    text-align: center;
    flex-shrink: 0;
}

.priority-pill {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 3px 12px;
    border-radius: var(--radius-full);
    font-size: 12px;
    font-weight: 600;
    min-width: 72px;
}



.col-status {
    width: 130px;
    text-align: center;
    flex-shrink: 0;
}

.status-pill {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 3px 12px;
    border-radius: var(--radius-full);
    font-size: 12px;
    font-weight: 600;
    min-width: 90px;
}
</style>
