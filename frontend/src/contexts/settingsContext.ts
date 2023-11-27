import { createContext } from 'react'

interface SettingsContext {
  theme: string
}

export const settingsContext = createContext<SettingsContext>({
  theme: 'dark',
})
