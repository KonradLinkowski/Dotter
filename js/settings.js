const defaults = {
  columns: 50,
  lego: false,
  legoColors: false
}

let currentValues = {
  ...defaults
}

const $columns = document.querySelector('#columns')
const $columnsText = document.querySelector('#columns-text')

const $lego = document.querySelector('#lego')
const $legoColors = document.querySelector('#lego-colors')

const $downloadPNG = document.querySelector('#download-png')
const $downloadSVG = document.querySelector('#download-svg')

$columns.addEventListener('input', () => $columnsText.textContent = $columns.value)

$columns.value = defaults.columns
$columnsText.textContent = $columns.value

$lego.checked = defaults.lego
$lego.parentNode.classList.toggle('checked', $lego.checked)

$legoColors.checked = defaults.legoColors
$legoColors.parentNode.classList.toggle('checked', $legoColors.checked)

export const events = {
  COLUMNS_CHANGE: Symbol('columns change'),
  COLUMNS_INPUT: Symbol('columns input'),
  LEGO_CHANGE: Symbol('lego change'),
  LEGO_COLORS_CHANGE: Symbol('lego colors change'),
  FILE_UPLOAD: Symbol('file upload'),
  DOWNLOAD_SVG: Symbol('download svg'),
  DOWNLOAD_PNG: Symbol('download png')
}

export function setRange(max, min = 1) {
  $columns.max = Math.min(max, 256)
  $columns.min = min
  $columns.value = defaults.columns
  $columnsText.textContent = defaults.columns
}

export function listen(event, callback) {
  const map = {
    [events.COLUMNS_CHANGE]: () => {
      $columns.addEventListener('change', () => {
        const value = +$columns.value
        currentValues.columns = value
        callback(value)
      })
    },
    [events.COLUMNS_INPUT]: () => {
      $columns.addEventListener('input', () => {
        const value = +$columns.value
        currentValues.columns = value
        callback(value)
      })
    },
    [events.LEGO_CHANGE]: () => {
      $lego.addEventListener('change', () => {
        const value = $lego.checked
        currentValues.lego = value
        $lego.parentNode.classList.toggle('checked', value)
        callback(value)
      })
    },
    [events.LEGO_COLORS_CHANGE]: () => {
      $legoColors.addEventListener('change', () => {
        const value = $legoColors.checked
        currentValues.legoColors = value
        $legoColors.parentNode.classList.toggle('checked', value)
        callback(value)
      })
    },
    [events.FILE_UPLOAD]: () => addFileListeners(callback),
    [events.DOWNLOAD_PNG]: () => $downloadPNG.addEventListener('click', () => callback()),
    [events.DOWNLOAD_SVG]: () => $downloadSVG.addEventListener('click', () => callback())
  }
  map[event]()
}

export function getCurrentValues() {
  return {
    ...currentValues
  }
}

function addFileListeners(callback) {
  const $dropArea = document.querySelector('#dropzone');

  ["dragenter", "dragover", "dragleave", "drop"].forEach((eventName) => {
    $dropArea.addEventListener(eventName, preventDefaults, false)
    document.body.addEventListener(eventName, preventDefaults, false)
  });
  ["dragenter", "dragover"].forEach((eventName) => {
    $dropArea.addEventListener(eventName, highlight, false)
  });
  ["dragleave", "drop"].forEach((eventName) => {
    $dropArea.addEventListener(eventName, unhighlight, false)
  });
  
  $dropArea.addEventListener("drop", handleDrop, false)
  $dropArea.addEventListener("input", handleChange, false)
  
  function preventDefaults(e) {
    e.preventDefault()
    e.stopPropagation()
  }

  function highlight() {
    $dropArea.classList.add("highlight")
  }
  
  function unhighlight() {
    $dropArea.classList.remove("highlight")
  }
  
  function handleChange({ target }) {
    handleFiles(target.files)
  }
  
  function handleDrop({ dataTransfer }) {
    handleFiles(dataTransfer.files)
  }
  
  function handleFiles(file) {
    if (file.length === 0) {
      console.error('No file provided')
      return
    }
    const reader = new FileReader()
    reader.addEventListener('loadend', () => callback(reader.result))
    reader.readAsDataURL(file[0])
  }
}
  