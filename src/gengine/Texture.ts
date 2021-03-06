import Color from '@/gengine/types/Color'
import { getClipRect } from '@/gengine/utils/ImageUtil'
import { clipBitmap, removeBackgroundColor } from '@/gengine/utils/BitmapUtil'
import { v4 as uuid } from 'uuid'

/**
 * 加载状态
 * UNLOADED - 未加载
 * PENDING - 加载中
 * LOADED - 加载完成
 */
export enum LoadStatus {
  UNLOADED = 0,
  PENDING = 1,
  LOADED = 2
}

/**
 * 纹理类型
 * BITMAP - 以 ImageBitmap 作为纹理来源
 * CANVAS - 以 HTMLCanvasElement 作为纹理来源（可编辑）
 * 前者速度更快，后者可以对纹理进行编辑
 */
export enum TextureType {
  BITMAP,
  CANVAS
}

export default class Texture {
  public path = ''
  public loadStatus: LoadStatus = LoadStatus.PENDING
  public type = TextureType.BITMAP

  #bitmap: ImageBitmap | null = null
  #canvas: HTMLCanvasElement | null = null

  get width() {
    if (this.type === TextureType.CANVAS) {
      return this.#canvas?.width || 0
    } else {
      return this.#bitmap?.width || 0
    }
  }

  get height() {
    if (this.type === TextureType.CANVAS) {
      return this.#canvas?.height || 0
    } else {
      return this.#bitmap?.height || 0
    }
  }

  getCanvas() {
    if (this.type === TextureType.BITMAP) {
      this.#canvas = document.createElement('canvas')!
      const imageBitmap = this.#bitmap!
      this.#canvas!.width = imageBitmap.width
      this.#canvas!.height = imageBitmap.height
      const ctx = this.#canvas.getContext('2d')
      if (ctx) {
        ctx.drawImage(imageBitmap, 0, 0)
      }
      this.type = TextureType.CANVAS
      imageBitmap.close()
      this.#bitmap = null
    }
    return this.#canvas!
  }

  /**
   * 获取位图信息
   * 返回值类型可能为 canvas 或 ImageBitmap
   */
  getImageData(): HTMLCanvasElement | ImageBitmap | null {
    if (this.type === TextureType.CANVAS) {
      return this.#canvas
    } else {
      return this.#bitmap
    }
  }

  static createEmpty(width = 32, height = 32, color = Color.BLACK) {
    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    const context = canvas.getContext('2d')!
    context.fillStyle = color.toString()
    context.fillRect(0, 0, width, height)

    const texture = new Texture()
    // 新建的纹理默认路径是 native-uuid
    texture.path = `native-${uuid()}`
    texture.type = TextureType.CANVAS
    texture.#canvas = canvas
    texture.loadStatus = LoadStatus.LOADED
    return texture
  }

  /**
   * 从位图创建
   *
   * @param bitmap 位图对象
   * @param filename 位图对应的文件名
   * @param isRemoveBackgroundColor 是否移除背景颜色
   * @param isClip 是否进行裁剪
   */
  static async createByBitmap(bitmap: ImageBitmap, filename: string,
                              isRemoveBackgroundColor = false, isClip = false): Promise<Texture> {
    let newCanvas: HTMLCanvasElement | null = null
    if (isRemoveBackgroundColor) {
      newCanvas = removeBackgroundColor(bitmap)
      bitmap.close()
    }
    if (isClip) {
      if (!newCanvas) {
        newCanvas = clipBitmap(bitmap)
      } else {
        const clipRect = getClipRect(newCanvas)
        const ctx = newCanvas.getContext('2d')!

        const w = clipRect.width
        const h = clipRect.height

        const imageData = ctx.getImageData(clipRect.x, clipRect.y, w, h)
        newCanvas.width = w
        newCanvas.height = h
        ctx.putImageData(imageData, 0, 0)
        bitmap.close()
      }
    }

    const texture = new Texture()
    texture.path = filename
    if (newCanvas) {
      texture.type = TextureType.CANVAS
      texture.#canvas = newCanvas
    } else {
      texture.type = TextureType.BITMAP
      texture.#bitmap = bitmap
    }
    texture.loadStatus = LoadStatus.LOADED
    return texture
  }

  /**
   * 从文件中创建
   *
   * @param file 用户选择的文件
   * @param isRemoveBackgroundColor 是否移除背景颜色
   * @param isClip 是否进行裁剪
   */
  static async createByFile(file: File,
                            isRemoveBackgroundColor = false,
                            isClip = false): Promise<Texture> {
    // createImageBitmap方法可以直接从文件对象中生成 ImageBitmap
    const bitmap = await createImageBitmap(file)
    return Texture.createByBitmap(bitmap, file.name, isRemoveBackgroundColor, isClip)
  }

  /**
   * 根据网络路径加载
   * @param path 纹理所在的网络路径
   */
  static createByPath(path: string): Promise<Texture> {
    return new Promise<Texture>((resolve, reject) => {
      const image = new Image()
      image.src = path

      const texture = new Texture()
      texture.path = path
      texture.loadStatus = LoadStatus.PENDING

      image.addEventListener('load', async () => {
        texture.loadStatus = LoadStatus.LOADED
        texture.#bitmap = await createImageBitmap(image)
        return resolve(texture)
      })
      image.addEventListener('error', (e) => {
        texture.loadStatus = LoadStatus.UNLOADED
        return reject(e)
      })
    })
  }
}
