import { z } from 'zod'
import { db, schema } from '~~/server/db'

export default defineMcpTool({
    name: 'list_projects',
    description: 'List all projects in Tuesday. Returns an array of projects with their id, name, description, color, and timestamps.',
    inputSchema: {},
    handler: async () => {
        const projects = await db.select().from(schema.projects).orderBy(schema.projects.createdAt)
        return {
            content: [{ type: 'text', text: JSON.stringify(projects, null, 2) }],
        }
    },
})
