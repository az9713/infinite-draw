import { nanoid } from 'nanoid'
import { db, type Project } from '@/db'

export async function listProjects(): Promise<Project[]> {
  return db.projects.orderBy('updatedAt').reverse().toArray()
}

export async function createProject(name = 'Untitled canvas'): Promise<Project> {
  const now = Date.now()
  const project: Project = {
    id: nanoid(10),
    name,
    createdAt: now,
    updatedAt: now,
    snapshot: null,
    thumbnail: null,
  }
  await db.projects.add(project)
  return project
}

export async function getProject(id: string): Promise<Project | undefined> {
  return db.projects.get(id)
}

export async function renameProject(id: string, name: string): Promise<void> {
  await db.projects.update(id, { name, updatedAt: Date.now() })
}

export async function deleteProject(id: string): Promise<void> {
  await db.projects.delete(id)
}

/**
 * Persist a project's state.
 *
 * `thumbnail === null` means "leave the existing thumbnail alone" (use this for
 * cheap snapshot-only saves); pass a string to update it.
 */
export async function saveSnapshot(
  id: string,
  snapshot: unknown,
  thumbnail: string | null,
): Promise<void> {
  const patch: Partial<Project> = { snapshot, updatedAt: Date.now() }
  if (thumbnail !== null) patch.thumbnail = thumbnail
  await db.projects.update(id, patch)
}
