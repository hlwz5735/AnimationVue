import Texture from '@/gengine/Texture'
import TexturePool from '@/gengine/TexturePool'
import SpriteFramePool from '@/gengine/SpriteFramePool'
import Rect from '@/gengine/types/Rect'
import Vec2 from '@/gengine/types/Vec2'
import SpriteFrame from './SpriteFrame'
import misc from '@/gengine/utils/misc'
import Size from '@/gengine/types/Size'
import { v4 as uuid } from 'uuid'

export default class Sprite {
  #spriteFrame: SpriteFrame | null = null
  #position: Vec2 = Vec2.ZERO()
  #scale: Vec2 = Vec2.ZERO()
  #angle: number = 0
  #anchor: Vec2 = Vec2.new(0.5, 0.5)
  #visible: boolean = true

  constructor(frame: SpriteFrame | null = null) {
    this.#spriteFrame = frame
  }

  // <editor-fold desc="属性封装">
  get spriteFrame() {
    return this.#spriteFrame
  }

  set spriteFrame(val) {
    this.#spriteFrame = val
  }

  get position() {
    return this.#position
  }

  set position(val: Vec2) {
    this.#position = val
  }

  get scaleX() {
    return this.#scale.x
  }

  set scaleX(val) {
    val = misc.clampf(val, Number.EPSILON, Number.MAX_SAFE_INTEGER)
    this.#scale.x = val
  }

  get scaleY() {
    return this.#scale.y
  }

  set scaleY(val) {
    val = misc.clampf(val, Number.EPSILON, Number.MAX_SAFE_INTEGER)
    this.#scale.y = val
  }

  get scale() {
    return this.#scale
  }

  set scale(val) {
    this.scaleX = val.x
    this.scaleY = val.y
  }

  get angle() {
    return this.#angle
  }

  set angle(val) {
    if (val <= -360 || val >= 360) {
      let times = Math.floor(Math.floor(val) / 360)
      if (times < 0) {
        times += 1
      }
      val -= times * 360
    }
    if (val > 180) {
      val = val - 360
    }
    if (val < -180) {
      val = val + 360
    }
    this.#angle = val
  }

  get anchor() {
    return this.#anchor
  }

  set anchor(val) {
    this.#anchor = val
  }

  get visible() {
    return this.#visible
  }

  set visible(val) {
    this.#visible = val
  }

  get width() {
    return this.#spriteFrame?.originSize.width
  }

  get height() {
    return this.#spriteFrame?.originSize.height
  }
  // </editor-fold>

  setPosition(x: number, y: number) {
    this.#position.x = x
    this.#position.y = y
  }

  setScale(factor: number) {
    this.scaleX = factor
    this.scaleY = factor
  }

  rotate(angle: number) {
    this.angle = this.angle + angle
  }

  moveBy(pos: Vec2) {
    this.position = this.position.add(pos)
  }

  scaleBy(factorX: number, factorY: number): void;
  scaleBy(factor: number): void {
    if (arguments.length === 1) {
      this.scaleX = this.scaleX * factor
      this.scaleY = this.scaleY * factor
    } else {
      this.scaleX = this.scaleX * arguments[0]
      this.scaleY = this.scaleY * arguments[1]
    }
  }

  static createEmpty() {
    return new Sprite()
  }

  /**
   * 直接通过图片路径创建精灵对象
   *
   * @param path 图片路径
   * @param source 来源矩形框
   * @param rotated 是否顺时针旋转
   * @param originSize 原始大小
   * @param offset 图片偏移
   */
  static async createByPath(path: string, source: Rect | null = null, rotated = false,
                      originSize: Size | null = null, offset: Vec2 | null = null): Promise<Sprite> {
    // 先尝试从纹理池中获取纹理对象，如果找不到再加载之
    let texture: Texture = TexturePool.get(path)!
    if (!texture) {
      try {
        texture = await Texture.createByPath(path)
      } catch (e) {
        return Promise.reject(new Error('无法读取图片！path = ' + path))
      }
      TexturePool.set(path, texture)
    }

    const spriteFrame = SpriteFrame.createByTexture(path, texture, source, rotated, originSize, offset)
    return new Sprite(spriteFrame)
  }

  static async createByFile(file: File, source: Rect | null = null, rotated = false,
                            originSize: Size | null = null, offset: Vec2 | null = null): Promise<Sprite> {
    // 先尝试从纹理池中获取纹理对象，如果找不到再加载之
    let texture: Texture = TexturePool.get(file.name)!
    if (!texture) {
      try {
        texture = await Texture.createByFile(file)
      } catch (e) {
        return Promise.reject(new Error('无法从用户选择的文件中读取图片！'))
      }
      TexturePool.set(file.name, texture)
    }

    const spriteFrame = SpriteFrame.createByTexture(file.name, texture, source, rotated, originSize, offset)
    return new Sprite(spriteFrame)
  }

  static createByTexture(texture: Texture, source: Rect | null = null, rotated = false,
                         originSize: Size | null = null, offset: Vec2 | null = null): Sprite {
    const spriteFrame = SpriteFrame.createByTexture(uuid(), texture, source, rotated, originSize, offset)
    return new Sprite(spriteFrame)
  }

  static createFromTexturePool(textureName: string, source: Rect | null = null, rotated = false,
                               originSize: Size | null = null, offset: Vec2 | null = null): Sprite {
    const texture: Texture = TexturePool.get(textureName)!
    if (!texture) {
      throw new Error(`找不到名字为'${textureName}'的纹理。`)
    }
    const spriteFrame = SpriteFrame.createByTexture(uuid(), texture, source, rotated, originSize, offset)
    return new Sprite(spriteFrame)
  }

  static createBySpriteFrame(spriteFrame: SpriteFrame) {
    return new Sprite(spriteFrame)
  }

  static createFromSpriteFramePool(spriteFrameName: string) {
    const spriteFrame = SpriteFramePool.get(spriteFrameName)!
    if (!spriteFrame) {
      throw new Error(`找不到名字为'${spriteFrameName}'的精灵帧对象。`)
    }
    return new Sprite(spriteFrame)
  }
}
