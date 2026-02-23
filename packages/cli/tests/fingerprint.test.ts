import { describe, it, expect, afterEach } from 'vitest'
import fs from 'node:fs'
import path from 'node:path'
import os from 'node:os'
import { createFingerprint } from '../src/fingerprint/detect.js'

function createTempProject(files: Record<string, string>): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'nano-peaces-test-'))
  for (const [filePath, content] of Object.entries(files)) {
    const fullPath = path.join(dir, filePath)
    fs.mkdirSync(path.dirname(fullPath), { recursive: true })
    fs.writeFileSync(fullPath, content, 'utf-8')
  }
  return dir
}

describe('createFingerprint', () => {
  let tempDir: string

  afterEach(() => {
    if (tempDir) fs.rmSync(tempDir, { recursive: true, force: true })
  })

  it('detects Next.js + shadcn + TypeScript project', () => {
    tempDir = createTempProject({
      'package.json': JSON.stringify({
        dependencies: {
          next: '^15.0.0',
          react: '^19.0.0',
          'radix-ui': '^1.0.0',
          tailwindcss: '^4.0.0',
          'react-hook-form': '^7.0.0',
        },
      }),
      'tsconfig.json': '{}',
      'components.json': '{}',
      'app/page.tsx': '',
    })

    const fp = createFingerprint(tempDir)

    expect(fp.framework).toBe('nextjs')
    expect(fp.uiLibraries).toContain('shadcn')
    expect(fp.styling).toBe('tailwind')
    expect(fp.language).toBe('typescript')
    expect(fp.router).toBe('app-router')
    expect(fp.formLibrary).toBe('react-hook-form')
    expect(fp.recommendedSkills).toContain('shadcn-ui')
  })

  it('detects Vite + Carbon project', () => {
    tempDir = createTempProject({
      'package.json': JSON.stringify({
        dependencies: {
          react: '^19.0.0',
          '@carbon/react': '^1.0.0',
          sass: '^1.0.0',
        },
        devDependencies: {
          vite: '^6.0.0',
        },
      }),
    })

    const fp = createFingerprint(tempDir)

    expect(fp.framework).toBe('vite')
    expect(fp.uiLibraries).toContain('carbon')
    expect(fp.styling).toBe('sass')
    expect(fp.language).toBe('javascript')
    expect(fp.recommendedSkills).toContain('carbon-design')
  })

  it('detects shadcn via components.json even without radix dep', () => {
    tempDir = createTempProject({
      'package.json': JSON.stringify({
        dependencies: {
          next: '^15.0.0',
          tailwindcss: '^4.0.0',
        },
      }),
      'components.json': '{}',
      'tsconfig.json': '{}',
    })

    const fp = createFingerprint(tempDir)

    expect(fp.uiLibraries).toContain('shadcn')
    expect(fp.recommendedSkills).toContain('shadcn-ui')
  })

  it('handles empty project gracefully', () => {
    tempDir = createTempProject({})

    const fp = createFingerprint(tempDir)

    expect(fp.framework).toBe('unknown')
    expect(fp.uiLibraries).toEqual([])
    expect(fp.styling).toBe('unknown')
    expect(fp.language).toBe('javascript')
    expect(fp.recommendedSkills).toEqual([])
  })

  it('detects state management + multiple UI libs', () => {
    tempDir = createTempProject({
      'package.json': JSON.stringify({
        dependencies: {
          next: '^15.0.0',
          'radix-ui': '^1.0.0',
          tailwindcss: '^4.0.0',
          '@carbon/react': '^1.0.0',
          zustand: '^5.0.0',
          jotai: '^2.0.0',
        },
      }),
      'components.json': '{}',
      'tsconfig.json': '{}',
    })

    const fp = createFingerprint(tempDir)

    expect(fp.uiLibraries).toContain('shadcn')
    expect(fp.uiLibraries).toContain('carbon')
    expect(fp.stateManagement).toContain('zustand')
    expect(fp.stateManagement).toContain('jotai')
    expect(fp.recommendedSkills).toContain('ui-selector')
  })
})
