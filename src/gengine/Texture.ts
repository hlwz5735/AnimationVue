import { clipBitmap, removeBackgroundColor } from '@/gengine/utils/BitmapUtil'
import Color from '@/gengine/types/Color'

enum LoadStatus {
  UNLOADED = 0,
  PENDING = 1,
  LOADED = 2
}

export default class Texture {
  public loadStatus: LoadStatus = LoadStatus.PENDING;
  public bitmap: ImageBitmap = null!;
  public path: string = ''

  isLoaded() {
    return this.loadStatus === LoadStatus.LOADED
  }

  static async createEmpty(width: number = 32, height: number = 32, color: Color = Color.BLACK) {
    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    const context = canvas.getContext('2d')!
    context.fillStyle = color.toString()
    context.fillRect(0, 0, width, height)

    return Texture.create(await createImageBitmap(canvas), `native-${width}-${height}-${color.toString()}`)
  }

  static async createFromFile(file: File, isRemoveBackgroundColor = false,
                              isClip = false): Promise<Texture> {
    // createImageBitmap方法可以直接从文件对象中生成 ImageBitmap
    const bitmap = await createImageBitmap(file)
    return Texture.create(bitmap, file.name, isRemoveBackgroundColor, isClip)
  }

  static async create(bitmap: ImageBitmap, filename: string,
                      isRemoveBackgroundColor = false, isClip = false): Promise<Texture> {
    if (isRemoveBackgroundColor) {
      const result = await removeBackgroundColor(bitmap)
      bitmap.close()
      bitmap = result
    }
    if (isClip) {
      const result = await clipBitmap(bitmap)
      bitmap.close()
      bitmap = result
    }
    return new Promise<Texture>((resolve, reject) => {
      const texture = new Texture()
      texture.path = filename
      texture.bitmap = bitmap
      texture.loadStatus = LoadStatus.LOADED
      return resolve(texture)
    })
  }

  static load(path: string): Promise<Texture> {
    return new Promise<Texture>((resolve, reject) => {
      const image = new Image()
      image.src = path

      const texture = new Texture()
      texture.path = path
      texture.loadStatus = LoadStatus.PENDING

      image.addEventListener('load', async () => {
        texture.loadStatus = LoadStatus.LOADED
        texture.bitmap = await createImageBitmap(image)
        return resolve(texture)
      })
      image.addEventListener('error', (e) => {
        texture.loadStatus = LoadStatus.UNLOADED
        return reject(e)
      })
    })
  }
}
