import React, { useEffect, useState } from 'react'
import { Props, Todo } from './Todos.types'
import { Spinner, Alert, Button } from '@vkumov/react-cui-2.0'
import { apiClient } from '../../utils/apiClients'
import { AxiosError } from 'axios'

export const Todos: React.FC<Props> = () => {
  const [todos, setTodos] = useState<Todo[]>([])
  const [status, setStatus] = useState<string | undefined>()

  useEffect(() => {
    /**
     * Get Todos
     */
    async function getTodos() {
      try {
        setStatus('loading')
        const results = await apiClient.get('/v1/todos')
        const todoData: Todo[] = results.data
        setTodos(todoData)
        setStatus('success')
      } catch (e: unknown) {
        const error = e as AxiosError
        console.error(error)
        setStatus('error')
      }
    }

    if (!status || status === 'refresh') {
      getTodos()
    }
  }, [status])

  /**
   * Create Todos
   */
  async function createTodos() {
    try {
      setStatus('loading')
      const examples = [
        { title: 'Groceries 🛒', description: 'Buy some groceries' },
        { title: 'Trash 🗑️', description: 'Take out the trash' },
        {
          title: 'Create Todos 📝',
          description: 'Create some todos to test out',
          completed: true,
        },
      ]
      for (const payload of examples) {
        await apiClient.post('/v1/todos', payload)
      }
      setStatus('refresh')
    } catch (e: unknown) {
      const error = e as AxiosError
      console.error(error)
      setStatus('error')
    }
  }

  return (
    <div className='section'>
      <div className='panel'>
        <h1>Todo API Example</h1>
        {status === 'loading' && (
          <div className='panel'>
            <Spinner size='large' />
          </div>
        )}
        {status === 'error' && <Alert type='warning'>Failed to Load!</Alert>}
        {status === 'success' && (
          <div>
            {todos.length === 0 && (
              <Alert type='info'>
                <span className='base-margin-right'>No Todos Found</span>{' '}
                <Button color='success' onClick={() => createTodos()}>
                  Create Some!
                </Button>
              </Alert>
            )}
            {todos.map(todo => (
              <div
                className='panel panel--bordered half-margin-top'
                key={todo.id}
              >
                <span
                  className='text-monospace'
                  title={todo.description}
                  style={
                    todo.completed ? { textDecoration: 'line-through' } : {}
                  }
                >
                  {todo.title}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
