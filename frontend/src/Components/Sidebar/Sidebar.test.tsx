import React from 'react'
import { HashRouter, Routes, Route } from 'react-router-dom'
import { render, screen, fireEvent } from '@testing-library/react'
import { Sidebar } from './Sidebar'

test('Checks Sidebar Render', () => {
  render(
    <HashRouter>
      <Sidebar />
    </HashRouter>
  )
  const sidebarElement = screen.getByText('Todos')
  expect(sidebarElement).toBeInTheDocument()
})

test('Checks Sidebar Click', () => {
  render(
    <HashRouter>
      <Sidebar />
      <Routes>
        <Route path='/'>
          <Route index element={<div>index</div>} />
          <Route path='Todos' element={<div>todo tester</div>}></Route>
        </Route>
      </Routes>
    </HashRouter>
  )
  fireEvent.click(screen.getByText('Todos'))
  const todoElement = screen.getByText('todo tester')
  expect(todoElement).toBeInTheDocument()
})
