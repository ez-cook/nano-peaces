import { describe, it, expect } from 'vitest'
import { AntigravityAdapter } from '../src/adapters/antigravity.js'
import { ClaudeCodeAdapter } from '../src/adapters/claude-code.js'
import { CursorAdapter } from '../src/adapters/cursor.js'
import { GenericAdapter } from '../src/adapters/generic.js'
import { getAdapter } from '../src/adapters/registry.js'
import type { SkillSource } from '../src/types/index.js'

const mockSource: SkillSource = {
  id: 'shadcn-ui',
  skillMd: [
    '---',
    'name: shadcn-ui',
    'version: 1.0.0',
    'description: Expert knowledge for shadcn/ui',
    'tags: [ui, react]',
    '---',
    '',
    '# shadcn/ui Skill',
    '',
    'Some content here.',
  ].join('\n'),
  chunks: new Map([
    ['chunks/installation.md', '# Installation\n\nInstall guide here.'],
    ['chunks/components/button.md', '# Button\n\nButton guide here.'],
  ]),
  registry: {
    id: 'shadcn-ui',
    description: 'Expert shadcn/ui knowledge',
    signals: {
      dependencies: ['radix-ui', 'tailwindcss'],
      filePatterns: ['**/components/ui/**'],
      keywords: ['shadcn'],
      taskIntent: ['create component'],
    },
    priority: 1,
    skillPath: 'shadcn-ui/SKILL.md',
  },
}

describe('AntigravityAdapter', () => {
  const adapter = new AntigravityAdapter()

  it('has correct name', () => {
    expect(adapter.name).toBe('antigravity')
  })

  it('outputs to .agent/skills', () => {
    expect(adapter.getOutputDir('/project')).toBe('.agent/skills')
  })

  it('transforms to correct file structure', () => {
    const outputs = adapter.transform(mockSource)

    const paths = outputs.map((o) => o.path)

    // SKILL.md
    expect(paths).toContain('.agent/skills/shadcn-ui/SKILL.md')
    // Chunks preserved
    expect(paths).toContain('.agent/skills/shadcn-ui/chunks/installation.md')
    expect(paths).toContain('.agent/skills/shadcn-ui/chunks/components/button.md')
    // Registry
    expect(paths).toContain('.agent/skills/registry.json')
  })

  it('preserves SKILL.md content', () => {
    const outputs = adapter.transform(mockSource)
    const skillFile = outputs.find((o) => o.path.endsWith('SKILL.md'))

    expect(skillFile?.content).toContain('# shadcn/ui Skill')
    expect(skillFile?.content).toContain('name: shadcn-ui')
  })

  it('generates valid registry.json', () => {
    const outputs = adapter.transform(mockSource)
    const registry = outputs.find((o) => o.path.endsWith('registry.json'))

    const parsed = JSON.parse(registry!.content)
    expect(parsed.version).toBe('0.1.0')
    expect(parsed.skills).toHaveLength(1)
    expect(parsed.skills[0].id).toBe('shadcn-ui')
  })
})

describe('ClaudeCodeAdapter', () => {
  const adapter = new ClaudeCodeAdapter()

  it('outputs to CLAUDE.md', () => {
    const outputs = adapter.transform(mockSource)
    expect(outputs).toHaveLength(1)
    expect(outputs[0].path).toBe('CLAUDE.md')
  })

  it('inlines all chunks into single file', () => {
    const outputs = adapter.transform(mockSource)
    const content = outputs[0].content

    expect(content).toContain('# shadcn/ui Skill')
    expect(content).toContain('# Installation')
    expect(content).toContain('# Button')
  })

  it('strips frontmatter', () => {
    const outputs = adapter.transform(mockSource)
    const content = outputs[0].content

    expect(content).not.toContain('tags: [ui, react]')
  })
})

describe('CursorAdapter', () => {
  const adapter = new CursorAdapter()

  it('outputs to .cursor/rules/*.mdc', () => {
    const outputs = adapter.transform(mockSource)
    expect(outputs[0].path).toBe('.cursor/rules/shadcn-ui.mdc')
  })

  it('has MDC frontmatter', () => {
    const outputs = adapter.transform(mockSource)
    const content = outputs[0].content

    expect(content).toMatch(/^---/)
    expect(content).toContain('description:')
    expect(content).toContain('globs:')
    expect(content).toContain('alwaysApply: false')
  })
})

describe('GenericAdapter', () => {
  const adapter = new GenericAdapter()

  it('outputs to .ai/skills/', () => {
    expect(adapter.getOutputDir('/project')).toBe('.ai/skills')
  })

  it('transforms like Antigravity but in .ai/ dir', () => {
    const outputs = adapter.transform(mockSource)
    const paths = outputs.map((o) => o.path)

    expect(paths).toContain('.ai/skills/shadcn-ui/SKILL.md')
    expect(paths).toContain('.ai/skills/shadcn-ui/chunks/installation.md')
    expect(paths).toContain('.ai/skills/registry.json')
  })
})

describe('getAdapter', () => {
  it('returns correct adapter for each agent type', () => {
    expect(getAdapter('antigravity')).toBeInstanceOf(AntigravityAdapter)
    expect(getAdapter('claude-code')).toBeInstanceOf(ClaudeCodeAdapter)
    expect(getAdapter('cursor')).toBeInstanceOf(CursorAdapter)
    expect(getAdapter('generic')).toBeInstanceOf(GenericAdapter)
  })

  it('throws for unknown agent type', () => {
    // @ts-expect-error testing invalid input
    expect(() => getAdapter('unknown-agent')).toThrow()
  })
})
