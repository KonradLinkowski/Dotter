import { createSVG } from "./dotter.js"
import { Pixels } from "./image.js"

onmessage = ({ data: { imageData, columns, lego, legoColors }}) => {
  const pixels = new Pixels(imageData)
  const svg = createSVG(pixels, columns, lego, legoColors)
  postMessage(svg)
}
