import { NodePgDatabase } from 'drizzle-orm/node-postgres'
import { databaseSchema } from '../schemas'

export interface IDatabaseService {
  query: NodePgDatabase<typeof databaseSchema>
}
