import Texture from '@/gengine/Texture'
import SpriteFrame from '@/gengine/SpriteFrame'

export class SpriteFrameSet {
  public texture: Texture
  public spriteFrameList: Array<SpriteFrame>

  constructor(texture: Texture, spriteFrameList: Array<SpriteFrame> = []) {
    this.texture = texture
    this.spriteFrameList = spriteFrameList
  }
}
