import * as p from '@clack/prompts'
import type { AgentType } from '../constants.js'
import { AGENT_TYPES } from '../constants.js'
import { getAdapter } from '../adapters/index.js'
import {
  loadSkillSource,
  getAvailableSkills,
  writeSkillFiles,
  loadConfig,
  saveConfig,
} from '../utils/index.js'
import { createFingerprint } from '../fingerprint/index.js'

interface AddOptions {
  all?: boolean
  agent?: string
}

export async function addCommand(skillId: string | undefined, options: AddOptions): Promise<void> {
  p.intro('nano-peaces add')

  const projectRoot = process.cwd()
  const config = loadConfig(projectRoot)
  const availableSkills = getAvailableSkills()

  // Resolve agent type from config or flag
  let agentType: AgentType
  if (options.agent && AGENT_TYPES.includes(options.agent as AgentType)) {
    agentType = options.agent as AgentType
  } else if (config) {
    agentType = config.agent
  } else {
    p.log.error('No config found. Run `nano-peaces init` first, or pass --agent.')
    process.exit(1)
  }

  const adapter = getAdapter(agentType)

  // Determine which skills to add
  let skillIds: string[]

  if (options.all) {
    // Add all skills recommended by fingerprint, or all available
    const fingerprint = createFingerprint(projectRoot)
    skillIds =
      fingerprint.recommendedSkills.length > 0
        ? fingerprint.recommendedSkills.filter((id) => availableSkills.some((s) => s.id === id))
        : availableSkills.map((s) => s.id)
  } else if (skillId) {
    // Validate the skill exists
    if (!availableSkills.some((s) => s.id === skillId)) {
      p.log.error(`Skill "${skillId}" not found.`)
      p.log.info(`Available: ${availableSkills.map((s) => s.id).join(', ')}`)
      process.exit(1)
    }
    skillIds = [skillId]
  } else {
    // Interactive selection
    const selected = await p.multiselect({
      message: 'Which skills do you want to add?',
      options: availableSkills.map((s) => ({
        value: s.id,
        label: s.id,
        hint: s.description || '',
      })),
      required: true,
    })

    if (p.isCancel(selected)) {
      p.cancel('Cancelled.')
      process.exit(0)
    }

    skillIds = selected as string[]
  }

  // Install skills
  const s = p.spinner()
  s.start('Adding skills...')

  for (const id of skillIds) {
    try {
      const source = loadSkillSource(id)
      const outputs = adapter.transform(source)
      writeSkillFiles(outputs, projectRoot)
    } catch (err) {
      s.stop(`Failed to add skill: ${id}`)
      p.log.error(err instanceof Error ? err.message : String(err))
      process.exit(1)
    }
  }

  s.stop(`Added ${skillIds.length} skill(s): ${skillIds.join(', ')}`)

  // Update config
  if (config) {
    const updatedSkills = [...new Set([...config.skills, ...skillIds])]
    saveConfig({ ...config, skills: updatedSkills }, projectRoot)
  }

  p.outro('Done!')
}
