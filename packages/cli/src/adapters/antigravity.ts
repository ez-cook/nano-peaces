import path from 'node:path'
import type { SkillAdapter, SkillSource, SkillOutput } from '../types/index.js'

/**
 * Antigravity adapter — writes skills to .agent/skills/ format
 *
 * Output structure:
 *   .agent/skills/registry.json
 *   .agent/skills/{skill-id}/SKILL.md
 *   .agent/skills/{skill-id}/chunks/{...}
 */
export class AntigravityAdapter implements SkillAdapter {
  name = 'antigravity' as const

  getOutputDir(_projectRoot: string): string {
    return '.agent/skills'
  }

  transform(source: SkillSource): SkillOutput[] {
    const outputs: SkillOutput[] = []
    const baseDir = path.join('.agent', 'skills', source.id)

    // 1. SKILL.md — main skill file with frontmatter
    outputs.push({
      path: path.join(baseDir, 'SKILL.md'),
      content: source.skillMd,
    })

    // 2. Chunks — each as a separate file preserving directory structure
    for (const [chunkPath, chunkContent] of source.chunks) {
      outputs.push({
        path: path.join(baseDir, chunkPath),
        content: chunkContent,
      })
    }

    // 3. Registry entry — so the agent can discover skills
    const registryOutput: SkillOutput = {
      path: path.join('.agent', 'skills', 'registry.json'),
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
    }
    outputs.push(registryOutput)

    return outputs
  }

  getInstructions(): string {
    return [
      '✓ Skills installed to .agent/skills/',
      '',
      'Antigravity will automatically detect and load these skills.',
      'The agent reads registry.json first, then loads SKILL.md on match.',
      'Deep chunks are loaded on-demand based on the Context Router table.',
    ].join('\n')
  }
}
