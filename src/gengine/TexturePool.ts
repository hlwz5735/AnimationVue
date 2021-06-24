import Texture from '@/gengine/Texture'

export class TexturePool {
  innerPool = new Map<string, Texture>()

  get(textureName: string) {
    return this.innerPool.get(textureName)
  }

  /**
   * 将纹理放入纹理缓存池，并设置纹理在缓存中的名字
   * @param name 缓存名
   * @param texture 纹理对象
   */
  set(name: string, texture: Texture): void {
    this.innerPool.set(name, texture)
  }

  /**
   * 将纹理放入缓存池，会以纹理对象的 path 作为纹理在缓存中的名字
   * @param texture 纹理对象
   */
  setWithDefaultName(texture: Texture): void {
    this.innerPool.set(texture.path, texture)
  }
}

const instance = new TexturePool()

export default instance
