import fetch from 'unfetch'

export default () => {
  setInterval(async () => {
    // h1.style.color = getColor()
    console.log(`ping`)
    try {
      const url = `on-demand-entries-ping?page=${window.location.pathname}`
      const res = await fetch(url)
      const payload = await res.json()
      if (payload.invalid) {
        location.reload()
      }
    } catch (err) {
      console.error(`Error with on-demand-entries-ping: ${err.message}`)
    }
  }, 1000)
}
