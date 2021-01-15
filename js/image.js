export class Pixels {
  constructor(imageData) {
    this.data = imageData.data
    this.width = imageData.width
    this.height = imageData.height
  }

  get(x, y) {
    const index = (Math.floor(y) * this.width + Math.floor(x)) * 4
    return {
      r: this.data[index],
      g: this.data[index + 1],
      b: this.data[index + 2],
      a: this.data[index + 3]
    }
  }
}

export function loadImageData(src) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const image = new Image()
      image.onload = () => {
        const canvas = document.createElement('canvas')
        canvas.width = image.width
        canvas.height = image.height
        const ctx = canvas.getContext('2d')
        ctx.drawImage(image, 0, 0)
        const data = ctx.getImageData(0, 0, canvas.width, canvas.height)
        resolve(data)
      }
      image.onerror = () => reject(`Failed to load the image ${src}`)
      image.src = src
    })
  })
}
