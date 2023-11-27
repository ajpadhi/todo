/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react'
import { Props } from './Header.types'

export const Header: React.FC<Props> = ({
  title,
  version,
  toggleTheme,
  apiDocLink,
  changelogLink,
  issueLink,
}) => {
  return (
    <nav className='header' role='navigation'>
      <div className='container-fluid'>
        <div className='header-panels'>
          <div className='header-panel hidden-md-down'>
            <a className='header__logo' href='/#/'>
              <span className='icon-cisco' />
            </a>
            <h1 className='header__title' title={version}>
              {title}
            </h1>
          </div>
          <div className='header-panel hidden-lg-up'>
            <h1 className='header__title' id='header-title'>
              {title}
            </h1>
          </div>
          <div className='header-panel header-panel--right'>
            <a
              onClick={() => toggleTheme()}
              className='header-item'
              title='Toggle Theme'
            >
              <span className='icon-lightbulb icon-size-20' />
            </a>
            <a
              href={changelogLink}
              target='_blank'
              rel='noreferrer'
              className='header-item'
              title='Release Notes'
            >
              <span className='icon-features icon-size-20' />
            </a>
            <a
              href={issueLink}
              target='_blank'
              rel='noreferrer'
              className='header-item'
              title='Issue/Feature Request'
            >
              <span className='icon-bug icon-size-20' />
            </a>
            <a
              href={apiDocLink}
              target='_blank'
              rel='noreferrer'
              className='header-item'
              title='API'
            >
              <span className='icon-cloud icon-size-20' />
            </a>
          </div>
        </div>
      </div>
    </nav>
  )
}
