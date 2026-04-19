import Dexie, { type Table } from 'dexie'

export interface Project {
  id: string
  name: string
  createdAt: number
  updatedAt: number
  /** Serialized tldraw store snapshot. `null` for a brand-new project. */
  snapshot: unknown | null
  /** PNG data URL for the project card thumbnail. */
  thumbnail: string | null
}

class InfiniteDrawDB extends Dexie {
  projects!: Table<Project, string>

  constructor() {
    super('infinite-draw')
    this.version(1).stores({
      projects: 'id, updatedAt, createdAt, name',
    })
  }
}

export const db = new InfiniteDrawDB()
