import type { SkillAdapter, SkillSource, SkillOutput } from '../types/index.js'

/**
 * Claude Code adapter — appends skills to CLAUDE.md or .claude/ directory
 * Inlines all chunks into a single flat document (Claude prefers single context)
 *
 * TODO: Full implementation in Phase 2
 */
export class ClaudeCodeAdapter implements SkillAdapter {
  name = 'claude-code' as const

  getOutputDir(_projectRoot: string): string {
    return '.'
  }

  transform(source: SkillSource): SkillOutput[] {
    // Claude Code: inline everything into single file, no frontmatter
    const sections: string[] = []

    sections.push(`## UI Skills: ${source.id}\n`)
    sections.push(stripFrontmatter(source.skillMd))

    // Inline all chunks
    for (const [chunkPath, chunkContent] of source.chunks) {
      sections.push(`\n---\n\n<!-- ${chunkPath} -->\n`)
      sections.push(chunkContent)
    }

    return [
      {
        path: 'CLAUDE.md',
        content: sections.join('\n'),
      },
    ]
  }

  getInstructions(): string {
    return [
      '✓ Skills appended to CLAUDE.md',
      '',
      'Claude Code reads CLAUDE.md automatically on every interaction.',
      'All skill content has been inlined into a single document.',
    ].join('\n')
  }
}

function stripFrontmatter(md: string): string {
  const match = md.match(/^---\n[\s\S]*?\n---\n(.*)$/s)
  return match ? match[1].trim() : md
}
