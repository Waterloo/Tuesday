import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'

export const projects = sqliteTable('projects', {
    id: text('id').primaryKey(),
    name: text('name').notNull(),
    description: text('description').notNull().default(''),
    color: text('color').notNull().default('#27ae60'),
    createdAt: text('created_at').notNull(),
    updatedAt: text('updated_at').notNull(),
})

export const pipelines = sqliteTable('pipelines', {
    id: text('id').primaryKey(),
    projectId: text('project_id').notNull().references(() => projects.id, { onDelete: 'cascade' }),
    name: text('name').notNull(),
    color: text('color').notNull().default('#E2E8F0'),
    order: integer('order').notNull().default(0),
})

export const tasks = sqliteTable('tasks', {
    id: text('id').primaryKey(),
    projectId: text('project_id').notNull().references(() => projects.id, { onDelete: 'cascade' }),
    pipelineId: text('pipeline_id').notNull().references(() => pipelines.id, { onDelete: 'cascade' }),
    parentId: text('parent_id'),
    title: text('title').notNull(),
    description: text('description').notNull().default(''),
    priority: text('priority', { enum: ['low', 'medium', 'high', 'urgent'] }).notNull().default('medium'),
    assignee: text('assignee').notNull().default(''),
    createdAt: text('created_at').notNull(),
    updatedAt: text('updated_at').notNull(),
})
