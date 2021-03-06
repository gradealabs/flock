import { EventEmitter } from 'events'
import { MigrationState, Migrator, Seed } from '../index'
import { spy } from './spy'

export class MockMigrator extends EventEmitter implements Migrator {
  migrationState: MigrationState[]

  constructor (migrationState: MigrationState[] = []) {
    super()
    this.migrationState = migrationState.slice()
    this.migrate = spy(() => Promise.resolve({ schemaHasChanged: false }))
    this.rollback = spy(() => Promise.resolve())
    this.seed = spy(() => Promise.resolve())
    // Silence all events
    this.emit = (...args: any[]) => { return false }
  }

  getMigrationState () {
    return Promise.resolve(this.migrationState)
  }

  migrate (migrationId?: string) {
    return Promise.resolve({ schemaHasChanged: false })
  }

  seed () {
    return Promise.resolve()
  }

  rollback (migrationId?: string) {
    return Promise.resolve()
  }
}
