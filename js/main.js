import { listen, events, setRange, defaults } from './settings.js'
import { loadImageData } from './image.js'

(async () => {
  const $spinner = document.querySelector('#spinner')
  const $main = document.querySelector('#main')
  let imageData = null
  let columns = null
  let lego = null;
  let legoColors = null;
  let svgData = null

  const worker = new Worker('./js/worker.js', { type: 'module' })

  worker.onmessage = ({ data }) => {
    svgData = data
    $main.innerHTML = data.svg
    $spinner.hidden = true
  }

  await loadNewImage('images/mona-lisa-small.jpg', false)  

  listen(events.FILE_UPLOAD, async blob => {
    columns = defaults.columns
    setRange(imageData.width)
    loadNewImage(blob)
  })
  
  listen(events.COLUMNS_CHANGE, value => {
    columns = value
    recalculate(imageData, columns, lego, legoColors)
  })

  listen(events.LEGO_CHANGE, value => {
    lego = value
    recalculate(imageData, columns, lego, legoColors)
  })

  listen(events.LEGO_COLORS_CHANGE, value => {
    legoColors = value
    recalculate(imageData, columns, lego, legoColors)
  })

  listen(events.DOWNLOAD_SVG, downloadSVG)
  listen(events.DOWNLOAD_PNG, downloadPNG)

  async function loadNewImage(url, recalc = true) {
    $spinner.hidden = false
    imageData = await loadImageData(url)
    setRange(imageData.width)
    if (recalc) {
      recalculate(imageData, columns, lego, legoColors)
    }
  }

  function recalculate(imageData, columns, lego, legoColors) {
    $spinner.hidden = false
    worker.postMessage({
      imageData,
      columns,
      lego,
      legoColors
    })
  }

  function downloadPNG() {
    const blob = new Blob([svgData.svg], { type:'image/svg+xml;charset=utf-8' })
    const $img = new Image()
    $img.onload = () => {
      const $canvas = document.createElement('canvas')
      $canvas.width = svgData.width
      $canvas.height = svgData.height
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
    const blob = new Blob([svgData.svg])
    const $link = document.createElement('a')
    $link.download = "dots.svg";
    $link.href = URL.createObjectURL(blob)
    $link.click()
    $link.remove()
  }
})()
