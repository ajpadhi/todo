import React from 'react'
import { Link, useLocation } from 'react-router-dom'

const ENTRIES = [
  {
    key: 'Home',
    icon: 'icon-home',
  },
  {
    key: 'Todos',
    icon: 'icon-compliance',
  },
  {
    key: 'Settings',
    icon: 'icon-cog',
  },
]
const VALID_KEYS = ENTRIES.map(x => x.key)

export const Sidebar: React.FC = () => {
  const location = useLocation()
  const activePath = location.pathname.split('/')[1]
  const activeItem = VALID_KEYS.includes(activePath) ? activePath : 'Home'

  return (
    <nav
      className='sidebar sidebar--mini sidebar--tertiary'
      role='navigation'
      style={{ marginTop: 50 }}
    >
      <ul id='rootSidebar'>
        {ENTRIES.map(e => (
          <li
            key={e.key}
            className={`sidebar__item ${
              activeItem === e.key ? 'sidebar__item--selected' : ''
            }`}
          >
            <Link to={`/${e.key !== 'Home' ? e.key : ''}`}>
              <span className={e.icon} />
              <span>{e.key}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}
