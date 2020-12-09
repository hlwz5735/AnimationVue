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

  async putSubTexture(newTexture: Texture): Promise<Rect> {
    const region = this.findRegion(newTexture.width, newTexture.height, this.rootRegion)
    if (region) {
      if (this.splitRegion(newTexture.width, newTexture.height, region) && this.texture) {
        const canvas = this.texture.getCanvas()
        const ctx = canvas.getContext('2d')!
        ctx.drawImage(newTexture.getImageData(), region.area.x, region.area.y)
        return Rect.new(region.area.x, region.area.y, newTexture.width, newTexture.height)
      }
    }
    throw new Error('查找精灵分区失败！')
  }

  splitRegion(width: number, height: number, region: Region): Region {
    region.isEmpty = false

    region.bottomRegion = new Region()
    region.bottomRegion.area = Rect.new(region.x, region.y + height,
      region.width, region.height - height)

    region.rightRegion = new Region()
    region.rightRegion.area = Rect.new(region.x + width, region.y,
      region.width - width, height)

    return region
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
