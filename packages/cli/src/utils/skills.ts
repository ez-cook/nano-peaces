import fs from 'node:fs'
import path from 'node:path'
import type { SkillSource, SkillRegistry, RegistryEntry } from '../types/index.js'

/**
 * Resolve the path to the skills directory.
 * In development: packages/skills/ relative to CLI source
 * When published: bundled alongside CLI dist
 */
function getSkillsDir(): string {
  // Walk up from this file to find packages/skills
  let dir = path.dirname(new URL(import.meta.url).pathname)
  // Walk up until we find packages/skills or hit root
  for (let i = 0; i < 10; i++) {
    const candidate = path.join(dir, 'packages', 'skills')
    if (fs.existsSync(candidate)) return candidate

    // Also check if skills is a sibling (in dist layout)
    const sibling = path.join(dir, 'skills')
    if (fs.existsSync(sibling)) return sibling

    dir = path.dirname(dir)
  }
  throw new Error('Could not locate skills directory. Is nano-peaces installed correctly?')
}

/**
 * Load the skill registry (Layer 1)
 */
export function loadRegistry(): SkillRegistry {
  const skillsDir = getSkillsDir()
  const registryPath = path.join(skillsDir, 'registry.json')

  if (!fs.existsSync(registryPath)) {
    throw new Error(`Registry not found at ${registryPath}`)
  }

  return JSON.parse(fs.readFileSync(registryPath, 'utf-8'))
}

/**
 * Load a complete skill source (Layer 2 + Layer 3)
 */
export function loadSkillSource(skillId: string): SkillSource {
  const skillsDir = getSkillsDir()
  const registry = loadRegistry()

  const entry = registry.skills.find((s) => s.id === skillId)
  if (!entry) {
    throw new Error(`Skill "${skillId}" not found in registry.`)
  }

  // Load SKILL.md (Layer 2)
  const skillMdPath = path.join(skillsDir, entry.skillPath)
  if (!fs.existsSync(skillMdPath)) {
    throw new Error(`SKILL.md not found at ${skillMdPath}`)
  }
  const skillMd = fs.readFileSync(skillMdPath, 'utf-8')

  // Load chunks (Layer 3)
  const chunks = new Map<string, string>()
  const skillDir = path.join(skillsDir, skillId)
  const chunksDir = path.join(skillDir, 'chunks')

  if (fs.existsSync(chunksDir)) {
    loadChunksRecursive(chunksDir, 'chunks', chunks)
  }

  return {
    id: skillId,
    skillMd,
    chunks,
    registry: entry,
  }
}

function loadChunksRecursive(dir: string, relativePath: string, chunks: Map<string, string>): void {
  const entries = fs.readdirSync(dir, { withFileTypes: true })

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)
    const relPath = path.join(relativePath, entry.name)

    if (entry.isDirectory()) {
      loadChunksRecursive(fullPath, relPath, chunks)
    } else if (entry.name.endsWith('.md')) {
      chunks.set(relPath, fs.readFileSync(fullPath, 'utf-8'))
    }
  }
}

/**
 * Get list of available skill IDs
 */
export function getAvailableSkills(): RegistryEntry[] {
  const registry = loadRegistry()
  return registry.skills
}
