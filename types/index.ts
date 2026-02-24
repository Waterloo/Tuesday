export interface Project {
    id: string
    name: string
    description: string
    color: string
    createdAt: string
    updatedAt: string
}

export interface Pipeline {
    id: string
    projectId: string
    name: string
    color: string
    order: number
}

export interface Task {
    id: string
    projectId: string
    pipelineId: string
    parentId: string | null
    title: string
    description: string
    priority: 'low' | 'medium' | 'high' | 'urgent'
    assignee: string
    createdAt: string
    updatedAt: string
}

export interface ProjectWithDetails extends Project {
    pipelines: Pipeline[]
    tasks: Task[]
}

export interface TaskWithSubtasks extends Task {
    subtasks: Task[]
}
