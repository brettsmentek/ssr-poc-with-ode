import React from 'react'
import { hydrate } from 'react-dom'
import Loadable from 'react-loadable'
import { BrowserRouter } from 'react-router-dom'
import App from './App'

const root = document.getElementById('root')

export default () => {
  render(App)
}

if (module.hot) {
  module.hot.accept(`./App`, () => {
    const NewApp = require(`./App`).default
    render(NewApp)
  })
}

function render(Root) {
  Loadable.preloadReady().then(() => {
    hydrate(
      <BrowserRouter>
        <Root />
      </BrowserRouter>,
      root
    )
  })
}
// hack to force make// hack to force make// hack to force make// hack to force make// hack to force make// hack to force make// hack to force make// hack to force make// hack to force make// hack to force make// hack to force make// hack to force make