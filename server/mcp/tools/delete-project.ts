import { z } from 'zod'
import { db, schema } from '~~/server/db'
import { eq } from 'drizzle-orm'

export default defineMcpTool({
    name: 'delete_project',
    description: 'Delete a project and all its pipelines and tasks. This action is irreversible.',
    inputSchema: {
        projectId: z.string().describe('The ID of the project to delete'),
    },
    handler: async ({ projectId }) => {
        const success = await deleteProject(projectId)

        if (!success) {
            throw new Error('Project not found')
        }

        return {
            content: [{ type: 'text', text: `Project "${projectId}" and all associated data deleted successfully.` }],
        }
    },
})
