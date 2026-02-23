import { Command } from 'commander'
import { VERSION } from './constants.js'
import { initCommand } from './commands/init.js'
import { addCommand } from './commands/add.js'
import { listCommand } from './commands/list.js'
import { updateCommand } from './commands/update.js'

const program = new Command()

program.name('nano-peaces').description('The missing UI skills pack for AI agents').version(VERSION)

program
  .command('init')
  .description('Initialize nano-peaces in your project')
  .option('-a, --agent <type>', 'AI agent type (antigravity|claude-code|cursor|generic)')
  .option('-y, --yes', 'Skip prompts, use defaults')
  .action(initCommand)

program
  .command('add [skill-id]')
  .description('Add a UI skill to your project')
  .option('--all', 'Add all recommended skills')
  .option('-a, --agent <type>', 'AI agent type (antigravity|claude-code|cursor|generic)')
  .action(addCommand)

program.command('list').description('List available UI skills').action(listCommand)

program.command('update').description('Update installed skills to latest').action(updateCommand)
program.parse()
