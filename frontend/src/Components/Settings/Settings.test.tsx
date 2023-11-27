import React from 'react'
import { render, screen } from '@testing-library/react'
import { Settings } from './Settings'

test('Checks Settings Render', () => {
  render(<Settings />)
  const descriptionElement = screen.getByText('Example settings page')
  expect(descriptionElement).toBeInTheDocument()
})
