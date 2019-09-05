import React from 'react'
import { hot } from 'react-hot-loader/root'
import { setConfig } from 'react-hot-loader'
import { NavLink } from 'react-router-dom'
import { renderRoutes } from 'react-router-config'
import Routes from './routes'
import fetch from 'unfetch'

setConfig({ logLevel: 'debug' })

const App = ({ route }) => {
  console.log(`route`, route)

  const pinger = () => {
    setInterval(async () => {
      try {
        const url = `http://localhost:8080/on-demand-entries-ping?page=${window.location.pathname}`
        const res = await fetch(url)
        const payload = await res.json()
        if (payload.invalid) {
          location.reload()
        }
      } catch (err) {
        if (err.message && err.message.includes(`window`)) {
          return
        }
        console.error(`Error with on-demand-entries-ping: ${err.message}`)
      }
    }, 1000)
  }

  pinger()

  if (route === null) {
    return (
      <>
        <h1>Waiting...</h1>
      </>
    )
  }

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
      {Routes.length && renderRoutes(Routes)}
    </>
  )
}

export default hot(App)
