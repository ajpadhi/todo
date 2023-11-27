import React from 'react'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import { Todos } from './Todos'
import { Todo } from './Todos.types'
import { rest } from 'msw'
import { setupServer } from 'msw/node'

let TODOS: Todo[] = []

const server = setupServer(
  rest.get('http://localhost:8000/v1/todos', (req, res, ctx) => {
    return res(ctx.json(TODOS))
  }),
  rest.post('http://localhost:8000/v1/todos', (req, res, ctx) => {
    TODOS = [
      {
        title: 'New Test Todo',
        description: 'tester',
        completed: false,
        id: '6377ca3f021684da955ad28f',
        owner: 'tester',
        created_date: '2022-11-18T18:09:03.162000',
        updated_date: '2022-11-18T18:09:03.162000',
      },
    ]
    return res(ctx.json({ status: 'CREATED' }))
  })
)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

test('Checks Todos Render', async () => {
  render(<Todos />)
  await waitFor(() => screen.findByText('No Todos Found'))
  const descriptionElement = screen.getByText('No Todos Found')
  expect(descriptionElement).toBeInTheDocument()
})

test('Check Create Todos', async () => {
  render(<Todos />)
  await waitFor(() => screen.findByText('No Todos Found'))
  fireEvent.click(screen.getByText('Create Some!'))
  await waitFor(() => screen.findByText('New Test Todo'))
  const todoElement = screen.getByText('New Test Todo')
  expect(todoElement).toBeInTheDocument()
})
