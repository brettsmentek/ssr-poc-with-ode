import { EventEmitter } from 'events'
import { parse } from 'url'
const fs = require('fs')
const path = require('path')
const DynamicEntryPlugin = require('webpack/lib/DynamicEntryPlugin')

function normalizePage(page) {
  return page.replace(/\/index$/, '/')
}

function sendJson(res, payload) {
  res.setHeader('Content-Type', 'application/json')
  res.status = 200
  res.end(JSON.stringify(payload))
}

const ADDED = Symbol(`ADDED`)
const BUILDING = Symbol(`BUILDING`)
const BUILT = Symbol(`BUILT`)

class CustomPlugin {
  constructor() {
    this.page = null
    this.entries = {}
  }

  middleware(compiler) {
    return (req, res, next) => {
      if (!/^\/on-demand-entries-ping/.test(req.url)) return next()

      const { query } = parse(req.url, true)
      const page = normalizePage(query.page)

      const entryInfo = this.entries[page]

      if (page === `/` && page !== this.page) {
        this.page = `/`
        this.entries = {}
        this.entries[`/`] = BUILDING

        fs.appendFileSync(
          path.resolve(__dirname, './src/main.js'),
          '// hack to force make'
        )

        return next()
      }

      if (page === `/2` && page !== this.page) {
        this.page = `/2`
        this.entries = {}
        this.entries[`/2`] = BUILDING

        fs.appendFileSync(
          path.resolve(__dirname, './src/main.js'),
          '// hack to force make'
        )

        return next()
      }

      // If there's no entry.
      // Then it seems like an weird issue.
      if (!entryInfo) {
        const message = `Client pings, but there's no entry for page: ${page}`
        console.error(message)
        sendJson(res, { invalid: true })
        return
      }

      sendJson(res, { success: true })

      // We don't need to maintain active state of anything other than BUILT entries
      if (entryInfo.status !== BUILT) return

      // If there's an entryInfo
      lastAccessPages.pop()
      lastAccessPages.unshift(page)
      entryInfo.lastActiveTime = Date.now()
    }
  }

  apply(compiler) {
    // emit is asynchronous hook, tapping into it using tapAsync, you can use tapPromise/tap(synchronous) as well
    compiler.hooks.emit.tapAsync('FileListPlugin', (compilation, callback) => {
      // Create a header string for the generated file:
      var filelist = 'In this build:\n\n'

      // Loop through all compiled assets,
      // adding a new line item for each filename.
      for (var filename in compilation.assets) {
        filelist += '- ' + filename + '\n'
      }

      // Insert this list into the webpack build as a new file asset:
      compilation.assets['filelist.md'] = {
        source: function() {
          return filelist
        },
        size: function() {
          return filelist.length
        },
      }

      callback()
    })

    compiler.hooks.make.tapPromise('DynamicEntryPlugin', compilation => {
      return new Promise((resolve, reject) => {
        let dep = null

        if (this.entries['/'] === BUILDING) {
          fs.writeFileSync(
            path.resolve(__dirname, './src/routes.js'),
            `
            import Home from './Home'

            const Routes = [
              {
                path: '/',
                component: Home,
              },
            ]
            export default Routes
          `
          )

          this.entries['/'] = ADDED

          dep = DynamicEntryPlugin.createDependency(
            path.resolve(__dirname, './src/main.js'),
            'main'
          )
        }

        if (this.entries['/2'] === BUILDING) {
          fs.writeFileSync(
            path.resolve(__dirname, './src/routes.js'),
            `
            import Home2 from './Home2'

            const Routes = [
              {
                path: '/2',
                component: Home2,
              },
            ]
            export default Routes
          `
          )
          this.entries['/2'] = ADDED

          dep = DynamicEntryPlugin.createDependency(
            path.resolve(__dirname, './src/main.js'),
            'main'
          )
        }

        if (dep === null) {
          resolve()
        }

        compilation.addEntry(this.context, dep, 'main', err => {
          if (err) return reject(err)

          resolve()
        })
      })
    })
  }
}

module.exports = CustomPlugin
