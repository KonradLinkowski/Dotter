export function createSVG(pixels, columns = 50, lego = false) {
  const ratio = columns / pixels.width
  const rows = Math.floor(pixels.height * ratio)
  const dots = getDots(pixels, columns, rows, ratio)
  const create = lego ? createLego : createCircle
  return {
    width: columns * 0.5 * 100,
    height: rows * 0.5 * 100,
    svg: wrapSVG(columns, rows, dots.map(create).join('\n'))
  }
}

function getDots(pixels, columns, rows, ratio) {
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
      dots.push({ x, y, color: avg })
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
  const defs = `
    <defs>
      <filter height="200%" width="200%" y="-50%" x="-50%" id="blur">
        <feGaussianBlur stdDeviation="0.2" in="SourceGraphic"/>
      </filter>
    </defs>
  `
  return `<svg class="dotter" viewBox="-0.5 -0.5 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
    ${defs}  
    ${data}
  </svg>`
}

function createCircle({ x, y, color }) {
  const rgba = getRGBA(color)
  return `<circle cx="${x}" cy="${y}" r="${0.45}" fill="${rgba}" />`
}

function createLego({ x, y, color }) {
  const rgba = getRGBA(color)
  return `
    <g transform="translate(${x - 0.5}, ${y - 0.5})">
      <rect height="1" width="1" x="0" y="0" stroke-width="0.01" stroke="#000" fill="${rgba}" />
      <circle r="0.4" cx="0.5" cy="0.6" fill="#000" filter="url(#blur)" />
      <circle r="0.4" cx="0.5" cy="0.5" stroke-width="0.01" stroke="#000" fill="${rgba}" />
    </g>
  `
}

function getRGBA({ r, g, b, a }) {
  return `rgba(${Math.floor(r)}, ${Math.floor(g)}, ${Math.floor(b)}, ${Math.floor(a)})`
}
