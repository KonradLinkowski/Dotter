const defaults = {
  ratio: 0.2
}

const $ratio = document.querySelector('#ratio')
const $ratioText = document.querySelector('#ratio-text')

$ratio.addEventListener('input', () => $ratioText.textContent = $ratio.value)

$ratio.value = defaults.ratio
$ratioText.textContent = $ratio.value

export const events = {
  RATIO_CHANGE: Symbol('ratio change'),
  RATIO_INPUT: Symbol('ratio input')
}

export function setRatio(value) {
  $ratio.value = value
  $ratioText.textContent = value
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
    }
  }
  map[event]()
}
