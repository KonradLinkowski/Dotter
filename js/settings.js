const defaults = {
  ratio: 0.2
}

const $ratio = document.querySelector('#ratio')
const $ratioText = document.querySelector('#ratio-text')

const $downloadPNG = document.querySelector('#download-png')
const $downloadSVG = document.querySelector('#download-svg')

$ratio.addEventListener('input', () => $ratioText.textContent = $ratio.value)

$ratio.value = defaults.ratio
$ratioText.textContent = $ratio.value

export const events = {
  RATIO_CHANGE: Symbol('ratio change'),
  RATIO_INPUT: Symbol('ratio input'),
  FILE_UPLOAD: Symbol('file upload'),
  DOWNLOAD_SVG: Symbol('download svg'),
  DOWNLOAD_PNG: Symbol('download png')
}

export function listen(event, callback) {
  const map = {
    [events.RATIO_CHANGE]: () => {
      callback($ratio.value)
      $ratio.addEventListener('change', () => callback($ratio.value))
    },
    [events.RATIO_INPUT]: () => {
      callback($ratio.value)
      $ratio.addEventListener('input', () => callback($ratio.value))
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
  