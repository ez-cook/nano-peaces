import type { AgentType } from '../constants.js'
import type { SkillAdapter } from '../types/index.js'
import { AntigravityAdapter } from './antigravity.js'
import { ClaudeCodeAdapter } from './claude-code.js'
import { CursorAdapter } from './cursor.js'
import { GenericAdapter } from './generic.js'

const adapters: Record<AgentType, () => SkillAdapter> = {
  antigravity: () => new AntigravityAdapter(),
  'claude-code': () => new ClaudeCodeAdapter(),
  cursor: () => new CursorAdapter(),
  generic: () => new GenericAdapter(),
}

export function getAdapter(agentType: AgentType): SkillAdapter {
  const factory = adapters[agentType]
  if (!factory) {
    throw new Error(`Unknown agent type: ${agentType}`)
  }
  return factory()
}
