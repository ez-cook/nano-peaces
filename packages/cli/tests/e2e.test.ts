import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import fs from 'node:fs'
import path from 'node:path'
import os from 'node:os'
import { loadSkillSource, getAvailableSkills, loadRegistry } from '../src/utils/skills.js'
import {
  writeSkillFiles,
  saveConfig,
  loadConfig,
  saveContext,
  updateGitignore,
} from '../src/utils/files.js'
import { getAdapter } from '../src/adapters/registry.js'
import { createFingerprint } from '../src/fingerprint/detect.js'
import type { NanoPeacesConfig } from '../src/types/config.js'

let tmpDir: string

beforeEach(() => {
  tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'nano-peaces-e2e-'))
  // Create a minimal Next.js + shadcn project
  fs.writeFileSync(
    path.join(tmpDir, 'package.json'),
    JSON.stringify({
      name: 'test-app',
      dependencies: {
        next: '15.0.0',
        react: '19.0.0',
        'react-dom': '19.0.0',
        tailwindcss: '4.0.0',
        'react-hook-form': '7.0.0',
      },
    }),
  )
  fs.writeFileSync(path.join(tmpDir, 'tsconfig.json'), '{}')
  fs.mkdirSync(path.join(tmpDir, 'components', 'ui'), { recursive: true })
  fs.writeFileSync(path.join(tmpDir, 'components.json'), JSON.stringify({ style: 'new-york' }))
})

afterEach(() => {
  fs.rmSync(tmpDir, { recursive: true, force: true })
})

describe('E2E: Full init flow', () => {
  it('loads registry and finds skills', () => {
    const registry = loadRegistry()
    expect(registry.version).toBe('0.1.0')
    expect(registry.skills.length).toBeGreaterThan(0)
    expect(registry.skills[0].id).toBe('shadcn-ui')
  })

  it('loads skill source with SKILL.md and chunks', () => {
    const source = loadSkillSource('shadcn-ui')
    expect(source.id).toBe('shadcn-ui')
    expect(source.skillMd).toContain('shadcn/ui')
    expect(source.chunks.size).toBeGreaterThan(0)
    // Verify chunks include both top-level and nested files
    const chunkKeys = [...source.chunks.keys()]
    expect(chunkKeys.some((k) => k.includes('installation'))).toBe(true)
    expect(chunkKeys.some((k) => k.includes('button'))).toBe(true)
    expect(chunkKeys.some((k) => k.includes('form'))).toBe(true)
    expect(chunkKeys.some((k) => k.includes('anti-patterns'))).toBe(true)
  })

  it('getAvailableSkills returns registry entries', () => {
    const skills = getAvailableSkills()
    expect(skills.length).toBeGreaterThan(0)
    expect(skills[0]).toHaveProperty('id')
    expect(skills[0]).toHaveProperty('signals')
    expect(skills[0]).toHaveProperty('skillPath')
  })

  it('fingerprints a Next.js + shadcn project', () => {
    const fp = createFingerprint(tmpDir)
    expect(fp.framework).toBe('nextjs')
    expect(fp.language).toBe('typescript')
    expect(fp.styling).toBe('tailwind')
    expect(fp.uiLibraries).toContain('shadcn')
    expect(fp.recommendedSkills).toContain('shadcn-ui')
  })
})

describe('E2E: Antigravity adapter flow', () => {
  it('transforms skill source into output files', () => {
    const source = loadSkillSource('shadcn-ui')
    const adapter = getAdapter('antigravity')
    const outputs = adapter.transform(source)

    expect(outputs.length).toBeGreaterThan(0)
    // Should have SKILL.md, registry.json, and chunk files
    const paths = outputs.map((o) => o.path)
    expect(paths.some((p) => p.includes('SKILL.md'))).toBe(true)
    expect(paths.some((p) => p.includes('registry.json'))).toBe(true)
  })

  it('writes files to disk in correct structure', () => {
    const source = loadSkillSource('shadcn-ui')
    const adapter = getAdapter('antigravity')
    const outputs = adapter.transform(source)
    writeSkillFiles(outputs, tmpDir)

    // Verify files exist
    const skillDir = path.join(tmpDir, '.agent', 'skills', 'shadcn-ui')
    expect(fs.existsSync(skillDir)).toBe(true)
    expect(fs.existsSync(path.join(skillDir, 'SKILL.md'))).toBe(true)
    // registry.json is at .agent/skills/ root, not per-skill
    expect(fs.existsSync(path.join(tmpDir, '.agent', 'skills', 'registry.json'))).toBe(true)
    // Verify chunks subdirectory exists
    expect(fs.existsSync(path.join(skillDir, 'chunks'))).toBe(true)
  })
})

describe('E2E: Claude Code adapter flow', () => {
  it('generates single CLAUDE.md file', () => {
    const source = loadSkillSource('shadcn-ui')
    const adapter = getAdapter('claude-code')
    const outputs = adapter.transform(source)

    expect(outputs.length).toBe(1)
    expect(outputs[0].path).toBe('CLAUDE.md')
    // Should contain inlined chunks
    expect(outputs[0].content).toContain('shadcn/ui')
    expect(outputs[0].content).toContain('Button')
  })

  it('writes CLAUDE.md to project root', () => {
    const source = loadSkillSource('shadcn-ui')
    const adapter = getAdapter('claude-code')
    const outputs = adapter.transform(source)
    writeSkillFiles(outputs, tmpDir)

    const claudeMd = path.join(tmpDir, 'CLAUDE.md')
    expect(fs.existsSync(claudeMd)).toBe(true)
    const content = fs.readFileSync(claudeMd, 'utf-8')
    expect(content.length).toBeGreaterThan(500)
  })
})

describe('E2E: Cursor adapter flow', () => {
  it('generates MDC format file', () => {
    const source = loadSkillSource('shadcn-ui')
    const adapter = getAdapter('cursor')
    const outputs = adapter.transform(source)

    expect(outputs.length).toBe(1)
    expect(outputs[0].path).toContain('.cursor/rules/')
    expect(outputs[0].path).toMatch(/\.mdc$/)
  })

  it('writes .mdc file to .cursor/rules/', () => {
    const source = loadSkillSource('shadcn-ui')
    const adapter = getAdapter('cursor')
    const outputs = adapter.transform(source)
    writeSkillFiles(outputs, tmpDir)

    const mdcPath = path.join(tmpDir, '.cursor', 'rules', 'shadcn-ui.mdc')
    expect(fs.existsSync(mdcPath)).toBe(true)
    const content = fs.readFileSync(mdcPath, 'utf-8')
    expect(content).toContain('globs:')
  })
})

describe('E2E: Config management', () => {
  it('saves and loads config', () => {
    const config: NanoPeacesConfig = {
      agent: 'antigravity',
      skills: ['shadcn-ui'],
      version: '0.1.0',
      autoUpdate: false,
    }

    saveConfig(config, tmpDir)
    const loaded = loadConfig(tmpDir)
    expect(loaded).toEqual(config)
  })

  it('saves context (fingerprint)', () => {
    const fp = createFingerprint(tmpDir)
    saveContext(fp, tmpDir)

    const contextPath = path.join(tmpDir, '.nano-peaces', 'context.json')
    expect(fs.existsSync(contextPath)).toBe(true)
    const saved = JSON.parse(fs.readFileSync(contextPath, 'utf-8'))
    expect(saved.framework).toBe('nextjs')
  })

  it('updates .gitignore', () => {
    updateGitignore(tmpDir, '.agent/skills')

    const gitignore = path.join(tmpDir, '.gitignore')
    expect(fs.existsSync(gitignore)).toBe(true)
    const content = fs.readFileSync(gitignore, 'utf-8')
    expect(content).toContain('.nano-peaces')
  })

  it('does not duplicate .gitignore entries', () => {
    updateGitignore(tmpDir, '.agent/skills')
    updateGitignore(tmpDir, '.agent/skills')

    const content = fs.readFileSync(path.join(tmpDir, '.gitignore'), 'utf-8')
    const count = (content.match(/\.nano-peaces/g) || []).length
    expect(count).toBe(1)
  })
})

describe('E2E: Full pipeline', () => {
  it('complete flow: fingerprint → adapte → write → config', () => {
    // 1. Fingerprint
    const fp = createFingerprint(tmpDir)
    expect(fp.recommendedSkills).toContain('shadcn-ui')

    // 2. Load skill
    const source = loadSkillSource('shadcn-ui')

    // 3. Transform with adapter
    const adapter = getAdapter('antigravity')
    const outputs = adapter.transform(source)

    // 4. Write files
    writeSkillFiles(outputs, tmpDir)

    // 5. Save config
    saveConfig(
      { agent: 'antigravity', skills: ['shadcn-ui'], version: '0.1.0', autoUpdate: false },
      tmpDir,
    )

    // 6. Save context
    saveContext(fp, tmpDir)

    // 7. Update gitignore
    updateGitignore(tmpDir, adapter.getOutputDir(tmpDir))

    // Verify everything exists
    expect(fs.existsSync(path.join(tmpDir, '.agent', 'skills', 'shadcn-ui', 'SKILL.md'))).toBe(true)
    expect(fs.existsSync(path.join(tmpDir, '.nano-peaces', 'config.json'))).toBe(true)
    expect(fs.existsSync(path.join(tmpDir, '.nano-peaces', 'context.json'))).toBe(true)
    expect(fs.existsSync(path.join(tmpDir, '.gitignore'))).toBe(true)

    // Verify config contents
    const config = loadConfig(tmpDir)
    expect(config?.agent).toBe('antigravity')
    expect(config?.skills).toEqual(['shadcn-ui'])
  })
})
