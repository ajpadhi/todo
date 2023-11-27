import React from 'react'
import { HashRouter, Routes, Route } from 'react-router-dom'
import { Sidebar } from './Components/Sidebar/Sidebar'
import { useTheme } from './hooks/useTheme'
import { settingsContext } from './contexts/settingsContext'
import { Header } from './Components/Header/Header'
import pkg from '../package.json'
import './App.css'
import { Home } from './Components/Home/Home'
import { Settings } from './Components/Settings/Settings'
import { Todos } from './Components/Todos/Todos'

export const App: React.FC = () => {
  const [theme, toggleTheme] = useTheme()

  return (
    <HashRouter basename='/'>
      <settingsContext.Provider
        value={{
          theme,
        }}
      >
        <Sidebar />
        <Header
          title={pkg.metadata.title}
          version={pkg.version}
          toggleTheme={toggleTheme}
          apiDocLink='/api'
          changelogLink={`${pkg.metadata.repository}/-/blob/main/CHANGELOG.md`}
          issueLink={`${pkg.metadata.repository}/issues`}
        />
        <div className='content'>
          <div className='container-fluid'>
            <div id='main-content' data-testid='main-content'>
              <Routes>
                <Route path='/'>
                  <Route index element={<Home />} />
                  <Route path='Settings' element={<Settings />}></Route>
                  <Route path='Todos' element={<Todos />}></Route>
                </Route>
              </Routes>
            </div>
          </div>
        </div>
      </settingsContext.Provider>
    </HashRouter>
  )
}
