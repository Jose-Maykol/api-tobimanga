import { NodePgDatabase } from 'drizzle-orm/node-postgres'

import { databaseSchema } from '../schemas'

export interface IDatabaseService {
  client: NodePgDatabase<typeof databaseSchema>
}
