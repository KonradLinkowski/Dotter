import { listen, events } from './settings.js'
import { loadPixels } from './image.js'
import { createSVG } from './dotter.js'

(async () => {
  const $main = document.querySelector('#main')
  let ratio = null
  let pixels = await loadPixels('images/mona-lisa-small.jpg')

  listen(events.FILE_UPLOAD, async blob => {
    pixels = await loadPixels(blob)
    recalculate()
  })
  
  listen(events.RATIO_CHANGE, value => {
    ratio = value
    recalculate()
  })

  function recalculate() {
    const svg = createSVG(pixels, ratio)
    $main.innerHTML = svg
  }
})()
