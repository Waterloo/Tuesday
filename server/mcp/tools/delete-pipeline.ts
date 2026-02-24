import { z } from 'zod'
import { db, schema } from '~~/server/db'
import { eq } from 'drizzle-orm'

export default defineMcpTool({
    name: 'delete_pipeline',
    description: 'Delete a pipeline and all tasks within it. This action is irreversible.',
    inputSchema: {
        pipelineId: z.string().describe('The ID of the pipeline to delete'),
    },
    handler: async ({ pipelineId }) => {
        const success = await deletePipeline(pipelineId)

        if (!success) {
            throw new Error('Pipeline not found')
        }

        return {
            content: [{ type: 'text', text: `Pipeline "${pipelineId}" and all its tasks deleted successfully.` }],
        }
    },
})
