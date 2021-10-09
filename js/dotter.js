import { getClosest } from './colors.js';

export function createSVG(pixels, columns = 50, lego = false, legoColors = false) {
  const ratio = columns / pixels.width
  const rows = Math.floor(pixels.height * ratio)
  const dots = getDots(pixels, columns, rows, ratio, legoColors)
  const create = lego ? createLego : createCircle
  return {
    width: columns * 0.5 * 100,
    height: rows * 0.5 * 100,
    svg: wrapSVG(columns, rows, dots.map(create))
  }
}

function getDots(pixels, columns, rows, ratio, legoColors) {
  const jump = 1 / ratio
  const dots = []
  for (let y = 0; y < rows; y += 1) {
    for (let x = 0; x < columns; x += 1) {
      const side = Math.floor(jump)
      const avg = calcAverage(
        Math.floor(x * jump),
        Math.floor(y * jump),
        side,
        side
      )
      dots.push({ x, y, color: legoColors ? getClosest(avg) : avg })
    }
  }
  return dots

  function calcAverage(x, y, width, height) {
    let sum = { r: 0, g: 0, b: 0, a: 0 }
    for (let i = x; i < x + width; i += 1) {
      for (let j = y; j < y + height; j += 1) {
        const color = pixels.get(i, j)
        sum.r += color.r
        sum.g += color.g
        sum.b += color.b
        sum.a += color.a
      }
    }
    const area = width * height
    return {
      r: sum.r / area,
      g: sum.g / area,
      b: sum.b / area,
      a: sum.a / area
    }
  }
}

function wrapSVG(width, height, data) {
  const $svg = createElement('svg')
  $svg.setAttribute('class', 'dotter')
  $svg.setAttribute('viewBox', `-0.5 -0.5 ${width} ${height}`)
  $svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg')

  const $defs = createElement('defs')
  $svg.appendChild($defs)

  const $filter = createElement('filter')
  $filter.setAttribute('height', '200%')
  $filter.setAttribute('width', '200%')
  $filter.setAttribute('x', '-50%')
  $filter.setAttribute('y', '-50%')
  $filter.setAttribute('id', 'blur')
  $defs.appendChild($filter)
  
  const $feGaussianBlur = createElement('feGaussianBlur')
  $feGaussianBlur.setAttribute('stdDeviation', '0.2')
  $feGaussianBlur.setAttribute('in', 'SourceGraphic')
  $filter.appendChild($feGaussianBlur)

  data.forEach(d => {
    $svg.appendChild(d)
  })

  return $svg
}

function createCircle({ x, y, color }) {
  const rgba = getRGBA(color)
  const $circle = createElement('circle')
  $circle.setAttribute('cx', x)
  $circle.setAttribute('cy', y)
  $circle.setAttribute('r', '0.45')
  $circle.setAttribute('fill', rgba)
  return $circle
}

function createLego({ x, y, color }) {
  const rgba = getRGBA(color)
  const black = getBlackAlpha(color.a)
  const $g = createElement('g')
  $g.transform = `translate(${x - 0.5}, ${y - 0.5})`

  const $rect = createElement('rect')
  $rect.height = 1
  $rect.width = 1
  $rect.x = 0
  $rect.y = 0
  $rect.strokeWidth = 0.01
  $rect.stroke = black
  $rect.fill = rgba
  $g.appendChild($rect)

  const $shadow = createElement('circle')
  $shadow.r = 0.4
  $shadow.cx = 0.5
  $shadow.cy = 0.6
  $shadow.fill = black
  $shadow.filter = 'url(#blur)'
  $rect.appendChild($shadow)

  const $circle = createElement('circle')
  $circle.r = 0.4
  $circle.cx = 0.5
  $circle.cy = 0.5
  $circle.strokeWidth = 0.01
  $circle.stroke = black
  $circle.fill = rgba
  $rect.appendChild($circle)

  return $g
}

function getRGBA({ r, g, b, a }) {
  return `rgba(${Math.floor(r)}, ${Math.floor(g)}, ${Math.floor(b)}, ${a != undefined ? Math.floor(a) : 1})`
}

function getBlackAlpha(a) {
  return `rgba(0, 0, 0, ${a})`
}

function createElement(name) {
  return document.createElementNS('http://www.w3.org/2000/svg', name)
}
