import React from 'react'
import { HashRouter } from 'react-router-dom'
import { render, screen } from '@testing-library/react'
import { Home } from './Home'

test('Checks Home Render', () => {
  render(
    <HashRouter>
      <Home />
    </HashRouter>
  )
  const descriptionElement = screen.getByText('Get Started')
  expect(descriptionElement).toBeInTheDocument()
})
