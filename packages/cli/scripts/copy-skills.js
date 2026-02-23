/* eslint-disable no-undef, no-console */
// Copy skills directory into CLI package for npm publishing
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const cliRoot = path.resolve(__dirname, '..')
const skillsSrc = path.resolve(cliRoot, '..', 'skills')
const skillsDest = path.join(cliRoot, 'skills')

// Remove old copy if exists
if (fs.existsSync(skillsDest)) {
  fs.rmSync(skillsDest, { recursive: true })
}

// Copy recursively
function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true })
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name)
    const destPath = path.join(dest, entry.name)
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath)
    } else {
      fs.copyFileSync(srcPath, destPath)
    }
  }
}

if (fs.existsSync(skillsSrc)) {
  copyDir(skillsSrc, skillsDest)
  const fileCount = countFiles(skillsDest)
  console.log(`Copied ${fileCount} skill files to packages/cli/skills/`)
} else {
  console.warn('Warning: packages/skills/ not found, skipping copy')
}

function countFiles(dir) {
  let count = 0
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) count += countFiles(path.join(dir, entry.name))
    else count++
  }
  return count
}
