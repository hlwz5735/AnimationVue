import Texture from '@/gengine/Texture'
import Rect from '@/gengine/types/Rect'

class Region {
  area: Rect
  isEmpty = true
  rightRegion: Region | null = null
  bottomRegion: Region | null = null

  get x() {
    return this.area.x
  }

  get y() {
    return this.area.y
  }

  get width() {
    return this.area.width
  }

  get height() {
    return this.area.height
  }

  constructor(x = 0, y = 0, w = 0, h = 0) {
    this.area = Rect.new(x, y, w, h)
  }
}

export default class TexturePacker {
  private readonly texture: Texture
  private rootRegion = new Region()

  constructor(texture: Texture) {
    this.texture = texture
    this.rootRegion.area.width = texture.width
    this.rootRegion.area.height = texture.height
  }

  async putSubTexture(texture: Texture): Promise<Rect> {
    const region = this.findRegion(texture.width, texture.height, this.rootRegion)
    if (region) {
      const newRegion = this.splitRegion(texture.width, texture.height, region)
      if (newRegion && this.texture) {
        const canvas = this.texture.getCanvas()
        const ctx = canvas.getContext('2d')
        if (ctx) {
          ctx.drawImage(texture.bitmap, newRegion.area.x, newRegion.area.y)
          await this.texture.updateBitmap()
          return newRegion.area
        }
      }
    }
    throw new Error('查找精灵分区失败！')
  }

  splitRegion(width: number, height: number, rootRegion: Region): Region {
    rootRegion.isEmpty = false

    rootRegion.bottomRegion = new Region()
    rootRegion.bottomRegion.area = Rect.new(rootRegion.x, rootRegion.y + height,
      rootRegion.width, rootRegion.height - height)

    rootRegion.rightRegion = new Region()
    rootRegion.rightRegion.area = Rect.new(rootRegion.x + width, rootRegion.y,
      rootRegion.width - width, height)

    return rootRegion
  }

  private findRegion(width: number, height: number, region: Region): Region | null {
    if (!region.isEmpty) {
      return this.findRegion(width, height, region.rightRegion!) ||
        this.findRegion(width, height, region.bottomRegion!)
    } else if ((width <= region.area.width) && (height <= region.area.height)) {
      return region
    } else {
      return null
    }
  }
}
