import { listen, events } from './settings.js'
import { loadPixels } from './image.js'
import { createSVG } from './dotter.js'

(async () => {
  const $main = document.querySelector('#main')
  let ratio = null
  let svg = null
  let pixels = await loadPixels('images/mona-lisa-small.jpg')

  listen(events.FILE_UPLOAD, async blob => {
    pixels = await loadPixels(blob)
    recalculate()
  })
  
  listen(events.RATIO_CHANGE, value => {
    ratio = value
    recalculate()
  })

  listen(events.DOWNLOAD_SVG, downloadSVG)
  listen(events.DOWNLOAD_PNG, downloadPNG)

  function recalculate() {
    svg = createSVG(pixels, ratio)
    $main.innerHTML = svg.svg
  }

  function downloadPNG() {
    const blob = new Blob([svg.svg], { type:'image/svg+xml;charset=utf-8' })
    const $img = new Image()
    $img.onload = () => {
      const $canvas = document.createElement('canvas')
      $canvas.width = svg.width
      $canvas.height = svg.height
      $canvas.getContext('2d').drawImage($img, 0, 0)
      const url = $canvas.toDataURL()
      const $link = document.createElement('a')
      $link.download = "dots.png";
      $link.href = url
      $link.click()
      $link.remove()
    }
    $img.onerror = console.error
    $img.src = URL.createObjectURL(blob)
  }

  function downloadSVG() {
    const blob = new Blob([svg.svg])
    const $link = document.createElement('a')
    $link.download = "dots.svg";
    $link.href = URL.createObjectURL(blob)
    $link.click()
    $link.remove()
  }
})()
