import React from 'react'
import { hot } from 'react-hot-loader/root'
import { setConfig } from 'react-hot-loader'
import { NavLink } from 'react-router-dom'
import { renderRoutes } from 'react-router-config'
import Routes from './routes'

setConfig({ logLevel: 'debug' })

const App = ({ route }) => {
  console.log(`route`, route)

  return (
    <>
      <ul>
        <li>
          <NavLink to="/">Home</NavLink>
        </li>
        <li>
          <NavLink to="/2">Home2</NavLink>
        </li>
      </ul>
      {renderRoutes(Routes)}
    </>
  )
}

export default hot(App)
