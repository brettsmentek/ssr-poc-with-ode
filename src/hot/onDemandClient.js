export default () => {
  const h1 = document.getElementsByTagName(`h1`)[0]
  const colors = [`#2c695e`, `#296dd5`, `#000`, `#b399ee`]

  let curs = 0

  const getColor = () => {
    let color

    if (curs < colors.length) {
      color = colors[curs]
      curs += 1
    } else {
      curs = 0
      color = colors[curs]
    }
    return color
  }

  setInterval(() => {
    h1.style.color = getColor()
    console.log(`ping`)
  }, 1000)
}
