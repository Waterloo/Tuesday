import { z } from 'zod'
import { db, schema } from '~~/server/db'
import { eq } from 'drizzle-orm'
import { now } from '~~/server/utils/helpers'

export default defineMcpTool({
    name: 'update_project',
    description: 'Update a project\'s name, description, or color.',
    inputSchema: {
        projectId: z.string().describe('The ID of the project to update'),
        name: z.string().optional().describe('New name for the project'),
        description: z.string().optional().describe('New description'),
        color: z.string().optional().describe('New hex color'),
    },
    handler: async ({ projectId, name, description, color }) => {
        const updated = await updateProject(projectId, {
            name,
            description,
            color,
        })

        if (!updated) {
            throw new Error('Project not found')
        }

        return {
            content: [{ type: 'text', text: JSON.stringify(updated, null, 2) }],
        }
    },
})
