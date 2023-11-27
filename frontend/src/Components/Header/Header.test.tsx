import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { Header } from './Header'

test('Checks Header Render', () => {
  render(
    <Header
      title='Test header'
      version='0.0.0'
      toggleTheme={() => {}}
      apiDocLink='https://apidoc'
      issueLink='https://issuelink'
    />
  )
  const linkElement = screen.getByTitle('API')
  expect(linkElement).toBeInTheDocument()
})

test('Checks Theme Toggle', () => {
  let darkTheme = false
  function toggleTheme() {
    darkTheme = !darkTheme
  }

  render(
    <Header
      title='Test header'
      version='0.0.0'
      toggleTheme={() => toggleTheme()}
      apiDocLink='https://apidoc'
      issueLink='https://issuelink'
    />
  )
  fireEvent.click(screen.getByTitle('Toggle Theme'))
  expect(darkTheme).toBe(true)
})
