import React from 'react'
import Loadable from 'react-loadable'
import { renderToString } from 'react-dom/server'
import { ServerStyleSheet, StyleSheetManager } from 'styled-components'
import { renderRoutes } from 'react-router-config'

export default async function({ req, routes }) {
  //   console.log(req)

  const sheet = new ServerStyleSheet()
  const modules = []
  const Component = (
    <Loadable.Capture report={moduleName => modules.push(moduleName)}>
      <StyleSheetManager sheet={sheet.instance}>
        {renderRoutes(routes)}
      </StyleSheetManager>
    </Loadable.Capture>
  )

  try {
    const html = renderToString(Component)
    const styles = sheet.getStyleTags()

    return {
      html,
      modules,
      styles,
    }
  } catch (err) {
    console.error(err)

    throw err
  } finally {
    // https://www.styled-components.com/docs/advanced#server-side-rendering
    sheet.seal()
  }
}
