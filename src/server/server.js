import React from 'react'
import express from 'express'
import Loadable from 'react-loadable'
import { ServerStyleSheet, StyleSheetManager } from 'styled-components'
import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router-dom'
import { matchRoutes } from 'react-router-config'
import { getBundles } from 'react-loadable/webpack'
import Routes from '../routes'
import App from '../App'

const server = express()

let prevRoutes = null

server
  .disable(`x-powered-by`)
  .use(express.static(`dist`))
  .get(`/*`, async (req, res) => {
    let matchingRoutes = matchRoutes(Routes, req.url)
    const assets = require(`../../dist/assets.json`)
    const stats = require(`../../dist/react-loadable.json`)
    const sheet = new ServerStyleSheet()
    const modules = []

    let promises = []

    if (matchingRoutes.length) {
      console.log('writing prevRoutes', matchingRoutes)
      prevRoutes = matchingRoutes
    }

    if (!matchingRoutes.length) {
      matchingRoutes = prevRoutes
    }

    matchingRoutes.forEach(route => {
      if (route.loadData) {
        promises.push(route.loadData())
      }
    })

    const data = await Promise.all(promises)

    const context = { data }

    const markup = renderToString(
      <Loadable.Capture report={moduleName => modules.push(moduleName)}>
        <StaticRouter context={context} location={req.url}>
          <StyleSheetManager sheet={sheet.instance}>
            <App route={matchingRoutes[0].route.component} />
          </StyleSheetManager>
        </StaticRouter>
      </Loadable.Capture>
    )

    if (context.url) {
      res.redirect(context.url)
    } else {
      const bundles = getBundles(stats, modules)
      const chunks = bundles
        .filter(bundle => bundle.file.endsWith('.js'))
        .filter(bundle => !bundle.file.includes(`bundle`))

      const styles = bundles.filter(bundle => bundle.file.endsWith('.css'))

      res.status(200).send(
        `
        <!doctype html>
        <html lang="">
          <head>
            <meta http-equiv="X-UA-Compatible" content="IE=edge" />
            <meta charSet='utf-8' />
            <meta name="viewport" content="width=device-width, initial-scale=1">
            ${styles
              .map(style => {
                return `<link href="${style.file}" rel="stylesheet"/>`
              })
              .join('\n')}
          </head>
          <body>
            <div id="root">${markup}</div>
            ${
              process.env.NODE_ENV === 'production'
                ? `<script src="${assets.main.js}"></script>`
                : `<script src="${assets.main.js}" crossorigin></script>`
            }
            ${`${JSON.stringify(assets)}`}
            ${chunks
              .map(chunk =>
                process.env.NODE_ENV === 'production'
                  ? `<script src="${chunk.publicPath}"></script>`
                  : `<script src="${chunk.publicPath}"></script>`
              )
              .join('\n')}
            <script>window.MAIN();</script>
          </body>
        </html>
        `
      )
    }
  })

export default server
