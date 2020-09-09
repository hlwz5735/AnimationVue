import { clipBitmap, removeBackgroundColor } from '@/gengine/utils/BitmapUtil'

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

  static async createFromFile(file: File, isRemoveBackgroundColor = false,
                              isClip = false): Promise<Texture> {
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
