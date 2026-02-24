import { z } from 'zod'
import { db, schema } from '~~/server/db'
import { generateId, now } from '~~/server/utils/helpers'

export default defineMcpTool({
    name: 'create_project',
    description: 'Create a new project. Automatically creates 3 default pipelines: "To Do", "In Progress", and "Done".',
    inputSchema: {
        name: z.string().describe('Name of the project'),
        description: z.string().optional().describe('Description of the project'),
        color: z.string().optional().describe('Hex color for the project, e.g. "#6C63FF"'),
    },
    handler: async ({ name, description, color }) => {
        const timestamp = now()
        const project = {
            id: generateId(),
            name,
            description: description || '',
            color: color || '#6C63FF',
            createdAt: timestamp,
            updatedAt: timestamp,
        }

        await db.insert(schema.projects).values(project)

        const defaultPipelines = [
            { id: generateId(), projectId: project.id, name: 'To Do', color: '#94A3B8', order: 0 },
            { id: generateId(), projectId: project.id, name: 'In Progress', color: '#3B82F6', order: 1 },
            { id: generateId(), projectId: project.id, name: 'Done', color: '#22C55E', order: 2 },
        ]

        for (const pipeline of defaultPipelines) {
            await db.insert(schema.pipelines).values(pipeline)
        }

        return {
            content: [{ type: 'text', text: JSON.stringify({ ...project, pipelines: defaultPipelines }, null, 2) }],
        }
    },
})
