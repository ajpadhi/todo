import React from 'react'
import { render, screen } from '@testing-library/react'
import { App } from './App'

test('Checks home page', () => {
  render(<App />)
  const mainElement = screen.getByTestId('main-content')
  expect(mainElement).toBeInTheDocument()
})
