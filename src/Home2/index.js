import React from 'react'
import loadable from 'react-loadable'

const LoadableComponent = loadable({
  loader: () => import(/* webpackChunkName: "Home2" */ `./Home2`),
  loading: () => <div>Loading...</div>,
})

export default () => <LoadableComponent />
