<script setup lang="ts">
const emit = defineEmits<{
    close: []
    created: []
}>()

const props = defineProps<{
    projectId: string
}>()

const name = ref('')
const color = ref('#E2E8F0')

const colors = [
    '#94A3B8', '#3B82F6', '#22C55E', '#FDAB3D', '#E44258', '#A25DDC', '#66CCFF', '#FFCB00',
]

const isSubmitting = ref(false)

async function handleSubmit() {
    if (!name.value.trim() || isSubmitting.value) return
    isSubmitting.value = true

    try {
        await $fetch('/api/pipelines', {
            method: 'POST',
            body: {
                projectId: props.projectId,
                name: name.value.trim(),
                color: color.value,
            },
        })
        emit('created')
    } catch (e) {
        console.error(e)
    } finally {
        isSubmitting.value = false
    }
}
</script>

<template>
    <div class="modal-overlay" @click.self="emit('close')">
        <div class="modal-content" style="max-width: 420px;">
            <div class="modal-header">
                <h2>New Pipeline</h2>
                <button class="btn-icon" @click="emit('close')">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                        stroke-linecap="round" stroke-linejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                </button>
            </div>
            <form @submit.prevent="handleSubmit">
                <div class="modal-body" style="display: flex; flex-direction: column; gap: var(--space-4);">
                    <div>
                        <label class="label">Pipeline Name</label>
                        <input v-model="name" class="input" placeholder="e.g. Review, QA, Deployed..." autofocus />
                    </div>
                    <div>
                        <label class="label">Color</label>
                        <div style="display: flex; gap: 8px; margin-top: 4px; flex-wrap: wrap;">
                            <button v-for="c in colors" :key="c" type="button" class="color-dot"
                                :class="{ active: color === c }" :style="{ background: c }" @click="color = c" />
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" @click="emit('close')">Cancel</button>
                    <button type="submit" class="btn btn-primary" :disabled="!name.trim() || isSubmitting">
                        {{ isSubmitting ? 'Creating...' : 'Add Pipeline' }}
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>

<style scoped>
.color-dot {
    width: 24px;
    height: 24px;
    border-radius: var(--radius-full);
    border: 3px solid transparent;
    cursor: pointer;
    transition: all var(--transition-fast);
}

.color-dot:hover {
    transform: scale(1.2);
}

.color-dot.active {
    border-color: var(--color-text);
    box-shadow: 0 0 0 2px var(--color-surface);
}
</style>
