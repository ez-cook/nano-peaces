import * as p from '@clack/prompts'
import type { AgentType } from '../constants.js'
import { AGENT_TYPES, VERSION } from '../constants.js'
import { createFingerprint } from '../fingerprint/index.js'
import { getAdapter } from '../adapters/index.js'
import {
  loadSkillSource,
  getAvailableSkills,
  writeSkillFiles,
  saveConfig,
  saveContext,
  updateGitignore,
} from '../utils/index.js'

interface InitOptions {
  agent?: string
  yes?: boolean
}

export async function initCommand(options: InitOptions): Promise<void> {
  p.intro('nano-peaces init')

  const projectRoot = process.cwd()

  // 1. Fingerprint the project
  const s = p.spinner()
  s.start('Scanning project...')
  const fingerprint = createFingerprint(projectRoot)
  s.stop('Project scanned')

  // 2. Display detection results
  const detectedParts: string[] = []
  if (fingerprint.framework !== 'unknown') detectedParts.push(fingerprint.framework)
  if (fingerprint.language === 'typescript') detectedParts.push('TypeScript')
  if (fingerprint.styling !== 'unknown') detectedParts.push(fingerprint.styling)
  for (const lib of fingerprint.uiLibraries) detectedParts.push(lib)

  if (detectedParts.length > 0) {
    p.log.info(`Detected: ${detectedParts.join(' + ')}`)
  } else {
    p.log.warn('Could not detect project stack. Skills will still work.')
  }

  // 3. Resolve agent type
  let agentType: AgentType

  if (options.agent && AGENT_TYPES.includes(options.agent as AgentType)) {
    agentType = options.agent as AgentType
  } else if (options.yes) {
    agentType = 'antigravity'
    p.log.info(`Agent: ${agentType} (default)`)
  } else {
    const selected = await p.select({
      message: 'Which AI agent are you using?',
      options: [
        { value: 'antigravity', label: 'Antigravity', hint: '.agent/skills/' },
        { value: 'claude-code', label: 'Claude Code', hint: 'CLAUDE.md' },
        { value: 'cursor', label: 'Cursor', hint: '.cursor/rules/' },
        { value: 'generic', label: 'Generic', hint: '.ai/skills/' },
      ],
    })

    if (p.isCancel(selected)) {
      p.cancel('Init cancelled.')
      process.exit(0)
    }

    agentType = selected as AgentType
  }

  // 4. Select skills to install
  const availableSkills = getAvailableSkills()
  let selectedSkillIds: string[]

  if (options.yes) {
    // Auto-select recommended skills, or all available
    selectedSkillIds =
      fingerprint.recommendedSkills.length > 0
        ? fingerprint.recommendedSkills.filter((id) => availableSkills.some((s) => s.id === id))
        : availableSkills.map((s) => s.id)
    p.log.info(`Skills: ${selectedSkillIds.join(', ')}`)
  } else {
    const skillOptions = availableSkills.map((skill) => ({
      value: skill.id,
      label: skill.id,
      hint: skill.description || '',
    }))

    if (skillOptions.length === 0) {
      p.log.error('No skills available. This might be an installation issue.')
      process.exit(1)
    }

    if (skillOptions.length === 1) {
      selectedSkillIds = [skillOptions[0].value]
      p.log.info(`Skill: ${selectedSkillIds[0]}`)
    } else {
      const selected = await p.multiselect({
        message: 'Which skills do you want to install?',
        options: skillOptions,
        initialValues: fingerprint.recommendedSkills.filter((id) =>
          availableSkills.some((s) => s.id === id),
        ),
        required: true,
      })

      if (p.isCancel(selected)) {
        p.cancel('Init cancelled.')
        process.exit(0)
      }

      selectedSkillIds = selected as string[]
    }
  }

  // 5. Install skills via adapter
  const adapter = getAdapter(agentType)

  s.start('Installing skills...')

  for (const skillId of selectedSkillIds) {
    try {
      const source = loadSkillSource(skillId)
      const outputs = adapter.transform(source)
      writeSkillFiles(outputs, projectRoot)
    } catch (err) {
      s.stop(`Failed to install skill: ${skillId}`)
      p.log.error(err instanceof Error ? err.message : String(err))
      process.exit(1)
    }
  }

  s.stop(`Installed ${selectedSkillIds.length} skill(s)`)

  // 6. Save config + context
  saveConfig(
    {
      agent: agentType,
      skills: selectedSkillIds,
      version: VERSION,
      autoUpdate: false,
    },
    projectRoot,
  )

  saveContext(fingerprint, projectRoot)

  // 7. Update .gitignore
  updateGitignore(projectRoot, adapter.getOutputDir(projectRoot))

  // 8. Done
  p.log.message(adapter.getInstructions())
  p.outro('Done! Your AI agent now has UI superpowers.')
}
