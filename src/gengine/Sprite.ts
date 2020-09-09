import Texture from '@/gengine/Texture'
import ImagePool from '@/gengine/ImagePool'
import Rect from '@/gengine/types/Rect'
import Vec2 from '@/gengine/types/Vec2'
import { getClipRect } from '@/gengine/utils/ImageClipUtil'

export default class Sprite {
  public x = 0;
  public y = 0;

  public position: Vec2
  public sourceRect: Rect

  public visible = true
  public rotation = 0
  public shadow = false
  public alpha = 1

  constructor(public texture: Texture, public width: number = 0, public height: number = 0,
    sourceRect?: Rect) {
    if (!sourceRect) {
      this.sourceRect = Rect.new(0, 0, 0, 0)
    } else {
      this.sourceRect = sourceRect
    }
    this.position = Vec2.new(0, 0)
  }

  static async create(imagePath: string, width: number = 0, height: number = 0,
                sourceRect?: Rect | boolean): Promise<Sprite> {
    let texture: Texture = ImagePool.get(imagePath)!
    if (!texture) {
      try {
        texture = await Texture.load(imagePath)
      } catch (e) {
        // eslint-disable-next-line prefer-promise-reject-errors
        return Promise.reject('无法读取图片！path = ' + imagePath)
      }
      ImagePool.set(imagePath, texture)
    }
    return new Promise<Sprite>((resolve, reject) => {
      const sprite = new Sprite(texture, width, height)
      sprite.texture = texture
      // 裁剪明确为rect时
      if (sourceRect instanceof Rect) {
        sprite.sourceRect = sourceRect
        sprite.width = sprite.width ? sprite.width : sourceRect.width
        sprite.height = sprite.height ? sprite.height : sourceRect.height
      } else if (sourceRect === null || sourceRect === undefined) {
        sprite.width = sprite.width ? sprite.width : texture.bitmap.width
        sprite.height = sprite.height ? sprite.height : texture.bitmap.height
        sprite.sourceRect.width = texture.bitmap.width
        sprite.sourceRect.height = texture.bitmap.height
      } else if (sourceRect) {
        // 裁剪为true时
        sprite.sourceRect = getClipRect(texture.bitmap)
        sprite.width = sprite.width ? sprite.width : sprite.sourceRect.height
        sprite.height = sprite.height ? sprite.height : sprite.sourceRect.height
      }
      return resolve(sprite)
    })
  }

  static async createWithTexture(texture: Texture, width = 0, height = 0, sourceRect?: Rect): Promise<Sprite> {
    return new Promise<Sprite>((resolve, reject) => {
      const sprite = new Sprite(texture, width, height)
      if (sourceRect === null || sourceRect === undefined) {
        sprite.width = sprite.width ? sprite.width : texture.bitmap.width
        sprite.height = sprite.height ? sprite.height : texture.bitmap.height
        sprite.sourceRect.width = texture.bitmap.width
        sprite.sourceRect.height = texture.bitmap.height
      } else {
        sprite.sourceRect = sourceRect
        sprite.width = sprite.width ? sprite.width : sourceRect.width
        sprite.height = sprite.height ? sprite.height : sourceRect.height
      }
      return resolve(sprite)
    })
  }

  setPosition(x: number, y: number) {
    this.x = x
    this.y = y
  }
}
