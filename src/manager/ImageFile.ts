export class ImageFile {
  name: string;
  bitmap: ImageBitmap;

  constructor (name: string, bitmap: ImageBitmap) {
    this.name = name
    this.bitmap = bitmap
  }

  async getImageElement (): Promise<HTMLImageElement> {
    const tempCanvas = document.createElement('canvas')
    tempCanvas.width = this.bitmap.width
    tempCanvas.height = this.bitmap.height

    const context = tempCanvas.getContext('2d')!
    context.drawImage(this.bitmap, 0, 0)

    const image = new Image(tempCanvas.width, tempCanvas.height)
    image.src = tempCanvas.toDataURL()

    return new Promise<HTMLImageElement>((resolve, reject) => {
      image.onload = () => resolve(image)
      image.onerror = (e) => reject(e)
    })
  }
}
