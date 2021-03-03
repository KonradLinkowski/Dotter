export const defaults = {
  columns: 50,
  lego: false
}

const $columns = document.querySelector('#columns')
const $columnsText = document.querySelector('#columns-text')

const $lego = document.querySelector('#lego')

const $downloadPNG = document.querySelector('#download-png')
const $downloadSVG = document.querySelector('#download-svg')

$columns.addEventListener('input', () => $columnsText.textContent = $columns.value)

$columns.value = defaults.columns
$columnsText.textContent = $columns.value

export const events = {
  COLUMNS_CHANGE: Symbol('columns change'),
  COLUMNS_INPUT: Symbol('columns input'),
  LEGO_CHANGE: Symbol('lego change'),
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
      callback(+$columns.value)
      $columns.addEventListener('change', () => callback(+$columns.value))
    },
    [events.COLUMNS_INPUT]: () => {
      callback(+$columns.value)
      $columns.addEventListener('input', () => callback(+$columns.value))
    },
    [events.LEGO_CHANGE]: () => {
      callback($lego.checked)
      $lego.addEventListener('change', () => {
        $lego.parentNode.classList.toggle('checked', $lego.checked)
        callback($lego.checked)
      })
    },
    [events.FILE_UPLOAD]: () => addFileListeners(callback),
    [events.DOWNLOAD_PNG]: () => $downloadPNG.addEventListener('click', () => callback()),
    [events.DOWNLOAD_SVG]: () => $downloadSVG.addEventListener('click', () => callback())
  }
  map[event]()
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
  