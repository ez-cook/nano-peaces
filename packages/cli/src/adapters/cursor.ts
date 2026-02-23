import type { SkillAdapter, SkillSource, SkillOutput } from '../types/index.js'

/**
 * Cursor adapter — writes skills as .cursor/rules/*.mdc files
 * Inlines all chunks (Cursor loads per-rule, not per-chunk)
 * Uses MDC format with glob-based activation
 *
 * TODO: Full implementation in Phase 2
 */
export class CursorAdapter implements SkillAdapter {
  name = 'cursor' as const

  getOutputDir(_projectRoot: string): string {
    return '.cursor/rules'
  }

  transform(source: SkillSource): SkillOutput[] {
    const sections: string[] = []

    // MDC frontmatter
    sections.push('---')
    sections.push(`description: ${source.registry.description || source.id + ' skill'}`)
    sections.push(`globs: ${JSON.stringify(source.registry.signals.filePatterns || ['**/*.tsx'])}`)
    sections.push('alwaysApply: false')
    sections.push('---\n')

    sections.push(stripFrontmatter(source.skillMd))

    // Inline all chunks
    for (const [, chunkContent] of source.chunks) {
      sections.push(`\n---\n`)
      sections.push(chunkContent)
    }

    return [
      {
        path: `.cursor/rules/${source.id}.mdc`,
        content: sections.join('\n'),
      },
    ]
  }

  getInstructions(): string {
    return [
      '✓ Skills installed to .cursor/rules/',
      '',
      'Cursor will load rules automatically based on glob patterns.',
      'Rules activate when you work on matching files.',
    ].join('\n')
  }
}

function stripFrontmatter(md: string): string {
  const match = md.match(/^---\n[\s\S]*?\n---\n(.*)$/s)
  return match ? match[1].trim() : md
}
