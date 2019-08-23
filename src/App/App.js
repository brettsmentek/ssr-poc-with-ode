import React from 'react'
import { Switch, NavLink } from 'react-router-dom'
import { renderRoutes } from 'react-router-config'

import Routes from '../routes'
import './App.css'

const App = props => (
  <>
    <ul>
      <li>
        <NavLink to="/">Home</NavLink>
      </li>
      <li>
        <NavLink to="/2">Home2</NavLink>
      </li>
    </ul>
    <Switch>{renderRoutes(Routes)}</Switch>
  </>
)

export default App
