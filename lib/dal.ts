import { db } from '@/db'
import { getSession } from './auth'
import { eq } from 'drizzle-orm'
import { cache } from 'react'
import { issues, users } from '@/db/schema'
import { mockDelay } from './utils'

export const getCurrentUser = async () => {
  const session = await getSession()
  if (!session) {
    return null
  }

  try {
    const result = await db
      .select()
      .from(users)
      .where(eq(users.id, session.userId))

    return result[0] || null
  } catch (e) {
    console.error(e)
    return null
  }
}

export const getUserByEmail = async (email: string) => {
  try {
    const user = await db.query.users.findFirst({
      where: eq(users.email, email),
    })

    return user
  } catch (e) {
    console.error(e)
    return null
  }
}

export const getIssues = async () => {
  try {
    const result = await db.query.issues.findMany({
      with: {
        user: true,
      },
      orderBy: (issues, { desc }) => [desc(issues.createdAt)],
    })
    return result
  } catch (e) {
    console.error('Error fetching issues', e)
    throw new Error('Failed to fetch issues')
  }
}
