import { z } from 'zod'
import { db, schema } from '~~/server/db'
import { eq } from 'drizzle-orm'
import { generateId } from '~~/server/utils/helpers'

export default defineMcpTool({
    name: 'create_pipeline',
    description: 'Add a new pipeline (column) to a project. Pipelines represent workflow stages like "To Do", "In Progress", "Review", "Done".',
    inputSchema: {
        projectId: z.string().describe('The ID of the project to add the pipeline to'),
        name: z.string().describe('Name of the pipeline'),
        color: z.string().optional().describe('Hex color for the pipeline border, e.g. "#3B82F6"'),
    },
    handler: async ({ projectId, name, color }) => {
        const pipeline = await createPipeline({
            projectId,
            name,
            color,
        })

        return {
            content: [{ type: 'text', text: JSON.stringify(pipeline, null, 2) }],
        }
    },
})
