export function createSVG(pixels, ratio = 1) {
  const columns = Math.floor(pixels.width * ratio)
  const rows = Math.floor(pixels.height * ratio)
  const dots = getDots(pixels, columns, rows, ratio)
  return {
    width: columns * 0.5 * 100,
    height: rows * 0.5 * 100,
    svg: wrapSVG(columns, rows, dots.map(createCircle).join('\n'))
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
  return `<svg class="dotter" viewBox="-0.5 -0.5 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">${data}</svg>`
}

function createCircle({ x, y, color }) {
  const rgba = getRGBA(color)
  return `<circle cx="${x}" cy="${y}" r="${0.45}" fill="${rgba}" />`
}

function getRGBA({ r, g, b, a }) {
  return `rgba(${Math.floor(r)}, ${Math.floor(g)}, ${Math.floor(b)}, ${Math.floor(a)})`
}
