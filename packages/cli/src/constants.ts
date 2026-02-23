export const VERSION = '0.1.0'

export const CONFIG_DIR = '.nano-peaces'
export const CONFIG_FILE = 'config.json'
export const CONTEXT_FILE = 'context.json'

export const AGENT_TYPES = ['antigravity', 'claude-code', 'cursor', 'generic'] as const
export type AgentType = (typeof AGENT_TYPES)[number]
