import { useState, useEffect, useRef } from 'react'

const STORE_KEY = 'cuiTheme'
const THEME_TOKEN = 'data-theme'

/**
 * Allow the dynamic updating of the app theme persisted in localStorage
 */
export function useTheme(): [string, () => void] {
  const [value, setValue] = useState(localStorage.getItem(STORE_KEY) || 'dark')
  const bodyRef = useRef<HTMLElement | null>(
    document.getElementById('app-body')
  )

  useEffect(() => {
    const body = bodyRef.current

    if (body) {
      if (value === 'light' && body.hasAttribute(THEME_TOKEN)) {
        body.removeAttribute(THEME_TOKEN)
        setValue('light')
        localStorage.setItem(STORE_KEY, 'light')
      } else if (value === 'dark' && !body.hasAttribute(THEME_TOKEN)) {
        body.setAttribute(THEME_TOKEN, 'dark')
        setValue('dark')
        localStorage.setItem(STORE_KEY, 'dark')
      }
    }
  }, [value])

  return [
    value,
    () => setValue(current => (current === 'light' ? 'dark' : 'light')),
  ]
}
