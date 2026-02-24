import { db, schema } from '~~/server/db'
import { eq } from 'drizzle-orm'

export default defineEventHandler(async () => {
    const allProjects = await db.select().from(schema.projects).orderBy(schema.projects.createdAt)
    return allProjects
})
