import fs from 'node:fs'
import path from 'node:path'
import type { ProjectFingerprint } from '../types/index.js'

interface PackageJson {
  dependencies?: Record<string, string>
  devDependencies?: Record<string, string>
}

function readPackageJson(projectRoot: string): PackageJson | null {
  const pkgPath = path.join(projectRoot, 'package.json')
  if (!fs.existsSync(pkgPath)) return null
  return JSON.parse(fs.readFileSync(pkgPath, 'utf-8'))
}

function getAllDeps(pkg: PackageJson): string[] {
  return [...Object.keys(pkg.dependencies || {}), ...Object.keys(pkg.devDependencies || {})]
}

function hasDep(deps: string[], name: string): boolean {
  return deps.some((d) => d === name || d.startsWith(name.replace('*', '')))
}

function hasAnyDep(deps: string[], names: string[]): boolean {
  return names.some((name) => hasDep(deps, name))
}

function fileExists(projectRoot: string, ...parts: string[]): boolean {
  return fs.existsSync(path.join(projectRoot, ...parts))
}

// --- Detectors ---

function detectFramework(deps: string[]): ProjectFingerprint['framework'] {
  if (hasDep(deps, 'next')) return 'nextjs'
  if (hasDep(deps, 'astro')) return 'astro'
  if (hasDep(deps, '@remix-run/react') || hasDep(deps, '@remix-run/node')) return 'remix'
  if (hasDep(deps, 'vite')) return 'vite'
  if (hasDep(deps, 'react-scripts')) return 'cra'
  return 'unknown'
}

function detectUILibraries(deps: string[], projectRoot: string): string[] {
  const libs: string[] = []

  // shadcn detection — multi-signal
  const hasShadcnSignals =
    hasAnyDep(deps, ['radix-ui', '@radix-ui/react-slot', '@radix-ui/react-dialog']) &&
    hasDep(deps, 'tailwindcss')
  const hasComponentsJson = fileExists(projectRoot, 'components.json')

  if (hasComponentsJson || hasShadcnSignals) {
    libs.push('shadcn')
  }

  if (hasDep(deps, '@carbon/react')) libs.push('carbon')
  if (hasDep(deps, '@mantine/core')) libs.push('mantine')
  if (hasDep(deps, '@headlessui/react')) libs.push('headless-ui')
  if (hasDep(deps, 'daisyui')) libs.push('daisyui')
  if (hasDep(deps, '@ark-ui/react')) libs.push('ark-ui')

  return libs
}

function detectStyling(deps: string[]): ProjectFingerprint['styling'] {
  if (hasDep(deps, 'tailwindcss')) return 'tailwind'
  if (hasDep(deps, 'styled-components') || hasDep(deps, '@emotion/styled'))
    return 'styled-components'
  if (hasDep(deps, 'sass') || hasDep(deps, 'node-sass')) return 'sass'
  return 'unknown'
}

function detectLanguage(projectRoot: string): ProjectFingerprint['language'] {
  if (fileExists(projectRoot, 'tsconfig.json')) return 'typescript'
  return 'javascript'
}

function detectRouter(deps: string[], projectRoot: string): ProjectFingerprint['router'] {
  // Next.js specific
  if (hasDep(deps, 'next')) {
    if (fileExists(projectRoot, 'app') || fileExists(projectRoot, 'src', 'app')) return 'app-router'
    if (fileExists(projectRoot, 'pages') || fileExists(projectRoot, 'src', 'pages'))
      return 'pages-router'
    return 'app-router' // default for modern Next.js
  }
  if (hasDep(deps, '@tanstack/react-router')) return 'tanstack-router'
  if (hasDep(deps, 'react-router') || hasDep(deps, 'react-router-dom')) return 'react-router'
  return 'unknown'
}

function detectStateManagement(deps: string[]): string[] {
  const state: string[] = []
  if (hasDep(deps, 'zustand')) state.push('zustand')
  if (hasDep(deps, 'jotai')) state.push('jotai')
  if (hasDep(deps, '@reduxjs/toolkit') || hasDep(deps, 'redux')) state.push('redux')
  if (hasDep(deps, 'recoil')) state.push('recoil')
  if (hasDep(deps, 'valtio')) state.push('valtio')
  return state
}

function detectFormLibrary(deps: string[]): string | null {
  if (hasDep(deps, 'react-hook-form')) return 'react-hook-form'
  if (hasDep(deps, 'formik')) return 'formik'
  return null
}

function recommendSkills(fingerprint: Omit<ProjectFingerprint, 'recommendedSkills'>): string[] {
  const skills: string[] = []

  if (fingerprint.uiLibraries.includes('shadcn')) {
    skills.push('shadcn-ui')
  }
  if (fingerprint.uiLibraries.includes('carbon')) {
    skills.push('carbon-design')
  }

  // If multiple UI libs detected, suggest selector skill
  if (fingerprint.uiLibraries.length > 1) {
    skills.push('ui-selector')
  }

  return skills
}

// --- Main ---

export function createFingerprint(projectRoot: string): ProjectFingerprint {
  const pkg = readPackageJson(projectRoot)

  if (!pkg) {
    return {
      framework: 'unknown',
      uiLibraries: [],
      styling: 'unknown',
      language: detectLanguage(projectRoot),
      router: 'unknown',
      stateManagement: [],
      formLibrary: null,
      recommendedSkills: [],
    }
  }

  const deps = getAllDeps(pkg)

  const base = {
    framework: detectFramework(deps),
    uiLibraries: detectUILibraries(deps, projectRoot),
    styling: detectStyling(deps),
    language: detectLanguage(projectRoot),
    router: detectRouter(deps, projectRoot),
    stateManagement: detectStateManagement(deps),
    formLibrary: detectFormLibrary(deps),
  }

  return {
    ...base,
    recommendedSkills: recommendSkills(base),
  }
}
