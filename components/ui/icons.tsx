import { 
  RiGithubLine, 
  RiLoader2Line, 
  RiMailLine,
  RiCheckLine,
  RiErrorWarningLine
} from '@remixicon/react'

export const Icons = {
  spinner: RiLoader2Line,
  gitHub: RiGithubLine,
  google: RiMailLine,
  check: RiCheckLine,
  alertCircle: RiErrorWarningLine,
}

export type Icon = keyof typeof Icons
