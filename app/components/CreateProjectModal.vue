<script setup lang="ts">
const emit = defineEmits<{
    close: []
    created: []
}>()

const name = ref('')
const description = ref('')
const color = ref('#27ae60')
const isSubmitting = ref(false)

const colors = [
    '#27ae60', '#00C875', '#E44258', '#579BFC', '#FDAB3D', '#A25DDC',
]

async function handleSubmit() {
    if (!name.value.trim() || isSubmitting.value) return
    isSubmitting.value = true

    try {
        await $fetch('/api/projects', {
            method: 'POST',
            body: {
                name: name.value.trim(),
                description: description.value.trim(),
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
        <div class="modal-content">
            <div class="modal-header">
                <h2>New Project</h2>
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
                        <label class="label">Project Name</label>
                        <input v-model="name" class="input" placeholder="Enter project name..." autofocus />
                    </div>
                    <div>
                        <label class="label">Description</label>
                        <textarea v-model="description" class="textarea" placeholder="What's this project about?"
                            rows="3" />
                    </div>
                    <div>
                        <label class="label">Color</label>
                        <div style="display: flex; gap: 8px; margin-top: 4px;">
                            <button v-for="c in colors" :key="c" type="button" class="color-swatch"
                                :class="{ active: color === c }" :style="{ background: c }" @click="color = c" />
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" @click="emit('close')">Cancel</button>
                    <button type="submit" class="btn btn-primary" :disabled="!name.trim() || isSubmitting">
                        {{ isSubmitting ? 'Creating...' : 'Create Project' }}
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>

<style scoped>
.color-swatch {
    width: 28px;
    height: 28px;
    border-radius: var(--radius-full);
    border: 3px solid transparent;
    cursor: pointer;
    transition: all var(--transition-fast);
}

.color-swatch:hover {
    transform: scale(1.15);
}

.color-swatch.active {
    border-color: var(--color-text);
    box-shadow: 0 0 0 2px var(--color-surface);
}
</style>
