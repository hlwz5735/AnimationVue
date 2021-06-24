import Texture from '@/gengine/Texture'
import TexturePool from '@/gengine/TexturePool'
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

  /**
   * 直接通过图片路径创建精灵对象
   *
   * @param imagePath 图片路径
   * @param width 图片宽度
   * @param height 图片高度
   * @param sourceRect 来源矩形框
   */
  static async create(imagePath: string, width: number = 0, height: number = 0,
                      sourceRect?: Rect | boolean): Promise<Sprite> {
    // 先尝试从纹理池中获取纹理对象，如果找不到再加载之
    let texture: Texture = TexturePool.get(imagePath)!
    if (!texture) {
      try {
        texture = await Texture.load(imagePath)
      } catch (e) {
        // eslint-disable-next-line prefer-promise-reject-errors
        return Promise.reject('无法读取图片！path = ' + imagePath)
      }
      TexturePool.set(imagePath, texture)
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
        sprite.width = sprite.width || texture.width
        sprite.height = sprite.height || texture.height
        sprite.sourceRect.width = texture.width
        sprite.sourceRect.height = texture.height
      } else if (sourceRect) {
        // 裁剪为true时
        sprite.sourceRect = getClipRect(texture.getCanvas())
        sprite.width = sprite.width || sprite.sourceRect.height
        sprite.height = sprite.height || sprite.sourceRect.height
      }
      return resolve(sprite)
    })
  }

  static async createWithTexture(texture: Texture, width = 0, height = 0,
                                 sourceRect?: Rect): Promise<Sprite> {
    return new Promise<Sprite>((resolve, reject) => {
      const sprite = new Sprite(texture, width, height)
      if (sourceRect === null || sourceRect === undefined) {
        sprite.width = sprite.width || texture.width
        sprite.height = sprite.height || texture.height
        sprite.sourceRect.width = texture.width
        sprite.sourceRect.height = texture.height
      } else {
        sprite.sourceRect = sourceRect
        sprite.width = sprite.width || sourceRect.width
        sprite.height = sprite.height || sourceRect.height
      }
      return resolve(sprite)
    })
  }

  /**
   * 设置精灵的位置
   * @param x x坐标
   * @param y y坐标
   */
  setPosition(x: number, y: number) {
    this.x = x
    this.y = y
  }
}
