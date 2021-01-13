import { loadPixels } from './image.js'
import { createSVG } from './dotter.js'

(async () => {
  const pixels = await loadPixels('images/mona-lisa-small.jpg')
  const svg = createSVG(pixels, 0.2)
  document.body.innerHTML = svg
})()
