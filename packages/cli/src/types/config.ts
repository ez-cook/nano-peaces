import type { AgentType } from '../constants.js'

/**
 * Persisted config at .nano-peaces/config.json
 */
export interface NanoPeacesConfig {
  agent: AgentType
  skills: string[]
  version: string
  autoUpdate: boolean
}

/**
 * Project analysis result — detected from package.json, tsconfig, config files
 */
export interface ProjectFingerprint {
  framework: 'nextjs' | 'vite' | 'remix' | 'astro' | 'cra' | 'unknown'
  uiLibraries: string[]
  styling: 'tailwind' | 'css-modules' | 'styled-components' | 'sass' | 'unknown'
  language: 'typescript' | 'javascript'
  router: 'app-router' | 'pages-router' | 'react-router' | 'tanstack-router' | 'unknown'
  stateManagement: string[]
  formLibrary: string | null
  recommendedSkills: string[]
}
