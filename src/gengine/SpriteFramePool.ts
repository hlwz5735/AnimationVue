import SpriteFrame from '@/gengine/SpriteFrame'

export class SpriteFramePool {
  innerPool = new Map<string, SpriteFrame>()

  get(name: string) {
    return this.innerPool.get(name)
  }

  /**
   * 将精灵帧对象放入精灵帧缓存池，并设置精灵帧在缓存中的名字
   * @param name 缓存名
   * @param spriteFrame 精灵帧对象
   */
  set(name: string, spriteFrame: SpriteFrame): void {
    this.innerPool.set(name, spriteFrame)
  }

  /**
   * 将精灵帧放入缓存池，会以精灵帧的名字作为其在缓存池中的名字
   * @param spriteFrame 精灵帧对象
   */
  setWithDefaultName(spriteFrame: SpriteFrame): void {
    this.innerPool.set(spriteFrame.name, spriteFrame)
  }
}

const instance = new SpriteFramePool()

export default instance
