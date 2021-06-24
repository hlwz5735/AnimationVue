import Texture from '@/gengine/Texture'
import Rect from '@/gengine/types/Rect'
import TextureFilledException from '@/gengine/exceptions/TextureFilledException'

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

  /**
   * 放入子纹理
   * @param newTexture 纹理对象
   */
  public putSubTexture(newTexture: Texture): Rect {
    const region = this.findRegion(newTexture.width, newTexture.height, this.rootRegion)
    if (region) {
      if (this.splitRegion(newTexture.width, newTexture.height, region) && this.texture) {
        const canvas = this.texture.getCanvas()
        const ctx = canvas.getContext('2d')!
        ctx.drawImage(newTexture.getImageData(), region.area.x, region.area.y)
        return Rect.new(region.area.x, region.area.y, newTexture.width, newTexture.height)
      }
    }
    throw new TextureFilledException('查找精灵分区失败！')
  }

  /**
   * 分割区块
   * @param width
   * @param height
   * @param region
   */
  public splitRegion(width: number, height: number, region: Region): Region {
    region.isEmpty = false

    region.bottomRegion = new Region()
    region.bottomRegion.area = Rect.new(region.x, region.y + height,
      region.width, region.height - height)

    region.rightRegion = new Region()
    region.rightRegion.area = Rect.new(region.x + width, region.y,
      region.width - width, height)

    return region
  }

  /**
   * 大小调整
   * @param factor 缩放因数
   */
  public resize(factor: number) {
    const canvas = this.texture.getCanvas()
    const ctx = canvas.getContext('2d')!
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    canvas.width *= factor
    canvas.height *= factor
    ctx.putImageData(imageData, 0, 0)
    this.rootRegion.area.width = canvas.width
    this.rootRegion.area.height = canvas.height

    const find = (region: Region) => {
      if (region.rightRegion) {
        find(region.rightRegion)
      }
      if (region.bottomRegion) {
        find(region.bottomRegion)
      }
      if (region.isEmpty) {
        if (region.x === 0) {
          region.area.width = this.rootRegion.width
          region.area.height = this.rootRegion.height - region.y
        } else {
          region.area.width = this.rootRegion.width - region.x
        }
      }
    }
    find(this.rootRegion)
  }

  public debugPrint() {
    const canvas = document.createElement('canvas')
    canvas.width = this.rootRegion.width
    canvas.height = this.rootRegion.height
    const ctx = canvas.getContext('2d')!
    ctx.strokeStyle = '#ff0000dd'
    ctx.fillStyle = '#ff000055'
    const deep = (region: Region) => {
      ctx.save()
      if (region.isEmpty && (region.width !== 0 || region.height !== 0)) {
        ctx.strokeStyle = '#00ff00dd'
        ctx.fillStyle = '#00ff0055'
        ctx.fillRect(region.x, region.y, region.width, region.height)
        ctx.strokeRect(region.x, region.y, region.width, region.height)
      }
      ctx.restore()
      if (region.rightRegion) {
        deep(region.rightRegion)
      }
      if (region.bottomRegion) {
        deep(region.bottomRegion)
      }
    }
    deep(this.rootRegion)
    return canvas
  }

  /**
   * 查找能放下指定尺寸图像的的区块，会递归调用
   * @param width 图像宽度
   * @param height 图像高度
   * @param region 要查询的区块
   * @private
   */
  private findRegion(width: number, height: number, region: Region): Region | null {
    // 如果当前区块本身已放入了图片，则先查找区块右方，再查找区块下方的区块
    if (!region.isEmpty) {
      return this.findRegion(width, height, region.rightRegion!) ||
        this.findRegion(width, height, region.bottomRegion!)
    } else if ((width <= region.area.width) && (height <= region.area.height)) {
      // 如果当前区块为空且可以放下图片，则返回当前区块
      return region
    } else {
      // 否则返回空（即本区块本身没有足够的空间）
      return null
    }
  }
}
