import fs from 'node:fs'
import path from 'node:path'
import type { SkillOutput, NanoPeacesConfig, ProjectFingerprint } from '../types/index.js'
import { CONFIG_DIR, CONFIG_FILE, CONTEXT_FILE } from '../constants.js'

/**
 * Write skill output files to the project
 */
export function writeSkillFiles(outputs: SkillOutput[], projectRoot: string): void {
  for (const output of outputs) {
    const fullPath = path.join(projectRoot, output.path)
    fs.mkdirSync(path.dirname(fullPath), { recursive: true })
    fs.writeFileSync(fullPath, output.content, 'utf-8')
  }
}

/**
 * Save nano-peaces config to .nano-peaces/config.json
 */
export function saveConfig(config: NanoPeacesConfig, projectRoot: string): void {
  const configDir = path.join(projectRoot, CONFIG_DIR)
  fs.mkdirSync(configDir, { recursive: true })
  fs.writeFileSync(path.join(configDir, CONFIG_FILE), JSON.stringify(config, null, 2), 'utf-8')
}

/**
 * Load nano-peaces config from .nano-peaces/config.json
 */
export function loadConfig(projectRoot: string): NanoPeacesConfig | null {
  const configPath = path.join(projectRoot, CONFIG_DIR, CONFIG_FILE)
  if (!fs.existsSync(configPath)) return null
  return JSON.parse(fs.readFileSync(configPath, 'utf-8'))
}

/**
 * Save project fingerprint to .nano-peaces/context.json
 */
export function saveContext(fingerprint: ProjectFingerprint, projectRoot: string): void {
  const configDir = path.join(projectRoot, CONFIG_DIR)
  fs.mkdirSync(configDir, { recursive: true })
  fs.writeFileSync(
    path.join(configDir, CONTEXT_FILE),
    JSON.stringify(fingerprint, null, 2),
    'utf-8',
  )
}

/**
 * Ensure .gitignore includes nano-peaces paths
 */
export function updateGitignore(projectRoot: string, _agentDir: string): void {
  const gitignorePath = path.join(projectRoot, '.gitignore')

  const entriesToAdd = [CONFIG_DIR]
  // Don't gitignore agent skill files — they should be committed
  // so team members get the same AI skills

  let content = ''
  if (fs.existsSync(gitignorePath)) {
    content = fs.readFileSync(gitignorePath, 'utf-8')
  }

  const linesToAdd: string[] = []
  for (const entry of entriesToAdd) {
    if (!content.includes(entry)) {
      linesToAdd.push(entry)
    }
  }

  if (linesToAdd.length > 0) {
    const section = `\n# nano-peaces config\n${linesToAdd.join('\n')}\n`
    fs.writeFileSync(gitignorePath, content.trimEnd() + '\n' + section, 'utf-8')
  }
}
