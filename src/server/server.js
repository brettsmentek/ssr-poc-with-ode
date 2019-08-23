import path from 'path'
import React from 'react'
import express from 'express'
import Loadable from 'react-loadable'
import { ServerStyleSheet, StyleSheetManager } from 'styled-components'
import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router-dom'
import { matchRoutes } from 'react-router-config'
import { getBundles } from 'react-loadable/webpack'
import Routes from '../routes'
import App from '../App/App'

const server = express()

server
  .disable(`x-powered-by`)
  .use(express.static(`dist`))
  .get(`/*`, async (req, res) => {
    const matchingRoutes = matchRoutes(Routes, req.url)
    const assets = require(`../../dist/assets.json`)
    const loadableStats = require(`../../dist/react-loadable.json`)
    const sheet = new ServerStyleSheet()
    const modules = []

    let promises = []

    matchingRoutes.forEach(route => {
      if (route.loadData) {
        promises.push(route.loadData())
      }
    })

    const data = await Promise.all(promises)

    const context = { data }

    await Loadable.preloadAll()

    const markup = renderToString(
      <Loadable.Capture report={moduleName => modules.push(moduleName)}>
        <StaticRouter context={context} location={req.url}>
          <StyleSheetManager sheet={sheet.instance}>
            <App />
          </StyleSheetManager>
        </StaticRouter>
      </Loadable.Capture>
    )

    console.log('modules', modules)

    const bundles = getBundles(loadableStats, modules)

    const chunks = bundles
      .filter(({ file }) => !file.endsWith(`.map`))
      .map(({ file }) => {
        const chunkName = path.basename(file).replace(/\..*$/, ``)

        if (chunkName === `bundle`) {
          return ``
        }

        return assets[chunkName].js
      })
    const jsFiles = [assets.client.js, ...chunks]

    const js = jsFiles
      .filter(path => path.endsWith(`.js`))
      .map(path => `<script onload="window.LOAD()" src="${path}"></script>`)

    const loader = `
      <script>
        let scripts = ${js.length};
        window.LOAD = function() {
          scripts --;

          if (scripts === 0) {
            window.MAIN();
          }
        }
      </script>`

    js.unshift(loader)

    const html = `
      <!doctype html>
      <html lang="">
        <head>
            <meta http-equiv="X-UA-Compatible" content="IE=edge" />
              <meta charset="utf-8" />
              <title>Welcome to Razzle</title>
              <meta name="viewport" content="width=device-width, initial-scale=1">
          </head>
          <body>
            <div id="app">${markup}</div>
            ${js.join(`\n`)}
          </body>
        </html>
    `

    if (context.url) {
      res.redirect(context.url)
    }
    if (context.status === 404) {
      res.status(404).send(html)
    } else {
      res.status(200).send(html)
    }
  })

export default server

// .get('/*', async (req, res) => {
//   try {
//     const html = await render({
//       req,
//       routes,
//     })
//     res.send(html)
//   } catch (error) {
//     res.json(error)
//   }
// })
