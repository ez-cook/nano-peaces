import * as p from '@clack/prompts'
import { getAvailableSkills, loadConfig } from '../utils/index.js'

export async function listCommand(): Promise<void> {
  p.intro('nano-peaces list')

  const projectRoot = process.cwd()
  const config = loadConfig(projectRoot)
  const installedSkills = config?.skills ?? []
  const availableSkills = getAvailableSkills()

  if (availableSkills.length === 0) {
    p.log.warn('No skills available in registry.')
    p.outro('Check your installation.')
    return
  }

  p.log.info('Available skills:\n')

  for (const skill of availableSkills) {
    const isInstalled = installedSkills.includes(skill.id)
    const status = isInstalled ? '●' : '○'
    const tag = isInstalled ? ' (installed)' : ''
    const desc = skill.description ? `  ${skill.description}` : ''
    p.log.message(`  ${status}  ${skill.id}${tag}${desc}`)
  }

  p.log.message('')

  if (installedSkills.length > 0) {
    p.log.info(
      `${installedSkills.length} installed, ${availableSkills.length - installedSkills.length} available`,
    )
  }

  p.outro('Use `nano-peaces add <skill>` to install a skill.')
}
