import * as p from '@clack/prompts'

export async function updateCommand(): Promise<void> {
  p.intro('nano-peaces update')
  p.log.warn('Update command coming in v0.2.0')
  p.outro('Stay tuned!')
}
