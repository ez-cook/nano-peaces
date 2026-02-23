import path from 'node:path'
import type { SkillAdapter, SkillSource, SkillOutput } from '../types/index.js'

/**
 * Generic adapter — writes to .ai/skills/ directory
 * Standard markdown format, chunks as separate files
 * Fallback for agents without specific adapter
 */
export class GenericAdapter implements SkillAdapter {
  name = 'generic' as const

  getOutputDir(_projectRoot: string): string {
    return '.ai/skills'
  }

  transform(source: SkillSource): SkillOutput[] {
    const outputs: SkillOutput[] = []
    const baseDir = path.join('.ai', 'skills', source.id)

    outputs.push({
      path: path.join(baseDir, 'SKILL.md'),
      content: source.skillMd,
    })

    for (const [chunkPath, chunkContent] of source.chunks) {
      outputs.push({
        path: path.join(baseDir, chunkPath),
        content: chunkContent,
      })
    }

    outputs.push({
      path: path.join('.ai', 'skills', 'registry.json'),
      content: JSON.stringify(
        {
          version: '0.1.0',
          skills: [
            {
              id: source.registry.id,
              description: source.registry.description,
              skillPath: `${source.id}/SKILL.md`,
              signals: source.registry.signals,
              priority: source.registry.priority,
            },
          ],
        },
        null,
        2,
      ),
    })

    return outputs
  }

  getInstructions(): string {
    return [
      '✓ Skills installed to .ai/skills/',
      '',
      'Point your AI agent to .ai/skills/registry.json to discover skills.',
      'Chunks are loaded on-demand based on the Context Router in SKILL.md.',
    ].join('\n')
  }
}
