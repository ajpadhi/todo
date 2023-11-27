import React from 'react'
import { Props } from './Home.types'
import { Button } from '@vkumov/react-cui-2.0'
import { Link } from 'react-router-dom'

export const Home: React.FC<Props> = () => {
  return (
    <div className='section'>
      <div className='panel absolute-center'>
        <h1>Hello! 👋</h1>
        <p>This is a Full Stack App</p>
        <Link to='/Todos'>
          <Button size='large'>Get Started</Button>
        </Link>
      </div>
    </div>
  )
}
