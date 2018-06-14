import * as Path from 'path'
import { Command } from 'commander'
import * as Actions from './actions'

export function run (args) {
  const cmd = init()

  if (args.length > 2) {
    cmd.parse(args)
  } else {
    cmd.help()
  }
}

function requireRc (fileName = 'flockrc') {
  return require(Path.resolve(fileName))
}

function init () {
  let cmd = new Command()
  const pkg = require('../package.json')

  cmd.version(pkg.version, '-v, --version')

  cmd
    .command('create')
    .description('Create a database migration')
    .option('-r, --require <moduleId>', 'Module ID of a module to require before migrating')
    .option('--rc', 'The rc file to load (default flockrc.js)')
    .action((cmd) => {
      if (cmd.require) require(cmd.require)
      const { migrationDir } = requireRc(cmd.rc)
      const opts = { migrationDir }
      Actions.create(opts).catch(error => {
        console.error(error)
        process.exit(1)
      })
    })

  cmd
    .command('migrate [migrationId]')
    .description('Run all migrations, or up to a specific migration')
    .option('-l, --list', 'Display list of migrations to pick from')
    .option('-r, --require <moduleId>', 'Module ID of a module to require before migrating')
    .option('--rc', 'The rc file to load (default flockrc.js)')
    .action((migrationId, cmd) => {
      if (cmd.require) require(cmd.require)
      const { migrator } = requireRc(cmd.rc)
      const opts = {
        showList: !!cmd.list,
        migrationId,
        migrator
      }
      Actions.migrate(opts).catch(error => {
        console.error(error)
        process.exit(1)
      })
    })

  cmd
    .command('rollback [migrationId]')
    .description('Rollback the last ran migration, all migrations, or down to a specific migration')
    .option('-l, --list', 'Display list of migrations to pick from')
    .option('-r, --require <moduleId>', 'Module ID of a module to require before rolling back')
    .option('-c, --config', 'The config file to load (default .flockrc.json)')
    .usage('rollback [migrationId | @all]')
    .action((migrationId, cmd) => {
      if (cmd.require) require(cmd.require)
      const { migrator } = requireRc(cmd.rc)
      const opts = {
        showList: !!cmd.list,
        migrationId,
        migrator
      }
      Actions.rollback(opts).catch(error => {
        console.error(error)
        process.exit(1)
      })
    })

  cmd
    .command('upgrade')
    .description('Upgrade a flock project using a .yo-rc.json file to use a .flockrc.json file')
    .option('-c, --config', 'The config file to write to (default .flockrc.json)')
    .action((cmd) => {
      actions.upgrade({ cfgFileName: cmd.config }).catch(error => {
        console.error(error)
        process.exit(1)
      })
    })

  cmd
    .command('*')
    .action(() => cmd.help())

  return cmd
}
