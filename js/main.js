import { listen, events } from './settings.js'
import { loadPixels } from './image.js'
import { createSVG } from './dotter.js'

(async () => {
  const $main = document.querySelector('#main')
  const pixels = await loadPixels('images/mona-lisa-small.jpg')
  
  listen(events.RATIO_CHANGE, ratio => {
    const svg = createSVG(pixels, ratio)
    $main.innerHTML = svg
  })
})()
