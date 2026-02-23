import type { AgentType } from '../constants.js'

/**
 * Registry entry from registry.json (Layer 1)
 * Ultra-lightweight — agent reads this first to decide which skills to load
 */
export interface RegistryEntry {
  id: string
  signals: {
    dependencies: string[]
    filePatterns: string[]
    keywords: string[]
    taskIntent: string[]
  }
  priority: number
  skillPath: string
  description?: string
}

export interface SkillRegistry {
  version: string
  skills: RegistryEntry[]
}

/**
 * Parsed skill source — all content needed for an adapter to transform
 */
export interface SkillSource {
  id: string
  skillMd: string
  chunks: Map<string, string>
  registry: RegistryEntry
}

/**
 * Output file produced by an adapter
 */
export interface SkillOutput {
  path: string
  content: string
}

/**
 * Adapter interface — transforms skill content to agent-specific format
 */
export interface SkillAdapter {
  name: AgentType
  getOutputDir(projectRoot: string): string
  transform(source: SkillSource): SkillOutput[]
  getInstructions(): string
}
