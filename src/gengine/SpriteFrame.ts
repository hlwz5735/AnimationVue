import Texture from '@/gengine/Texture'
import Rect from '@/gengine/types/Rect'
import Size from '@/gengine/types/Size'
import Vec2 from '@/gengine/types/Vec2'
import TexturePool from '@/gengine/TexturePool'

export default class SpriteFrame {
  public name: string
  public texture: Texture
  public sourceRect: Rect
  public originSize: Size
  public offset: Vec2 = Vec2.ZERO()
  public rotated = false

  private constructor(name: string, texture: Texture, sourceRect: Rect, originSize: Size) {
    this.name = name
    this.texture = texture
    this.sourceRect = sourceRect
    this.originSize = originSize
  }

  static createFromTexturePool(name: string, textureName: string, source: Rect | null = null, rotated = false,
                               originSize: Size | null = null, offset: Vec2 | null = null): SpriteFrame {
    const texture = TexturePool.get(textureName)
    if (!texture) {
      throw new Error(`纹理池中没有找到'${textureName}'对应的纹理`)
    }

    return SpriteFrame.createByTexture(name, texture, source, rotated, originSize, offset)
  }

  static createByTexture(name: string, texture: Texture, source: Rect | null = null, rotated = false,
                         originSize: Size | null = null, offset: Vec2 | null = null): SpriteFrame {
    if (!source) {
      source = Rect.new(0, 0, texture.width, texture.height)
    }
    if (!originSize) {
      originSize = Size.new(source.width, source.height)
    }
    const frame = new SpriteFrame(name, texture, source, originSize)
    frame.rotated = rotated
    if (offset) {
      frame.offset = offset
    }
    return frame
  }
}
