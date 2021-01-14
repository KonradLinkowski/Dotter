export function createSVG(pixels, ratio = 1) {
  const columns = Math.floor(pixels.width * ratio)
  const rows = Math.floor(pixels.height * ratio)
  const jump = 1 / ratio
  const dots = getDots(pixels, columns, rows, jump)
  return wrapSVG(columns - 1, rows - 1, dots.map(createCircle).join('\n'))
}

function getDots(pixels, columns, rows, jump) {
  const dots = []
  for (let y = 0; y < rows; y += 1) {
    for (let x = 0; x < columns; x += 1) {
      dots.push({ x, y, color: pixels.get(x * jump, y * jump) })
    }
  }
  return dots
}

function wrapSVG(width, height, data) {
  return `<svg class="dotter" viewBox="0.5 0.5 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">${data}</svg>`
}

function createCircle({ x, y, color }) {
  const rgba = getRGBA(color)
  return `<circle cx="${x}" cy="${y}" r="${0.45}" fill="${rgba}" />`
}

function getRGBA({ r, g, b, a }) {
  return `rgba(${r}, ${g}, ${b}, ${a})`
}
