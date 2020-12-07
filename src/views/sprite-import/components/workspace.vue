<template>
  <div>
    <a-space>
      <a-upload
        name="file"
        :multiple="true"
        :before-upload="onFileSelected"
        :custom-request="() => {}"
        :show-upload-list="false"
      >
        <a-button>
          <a-icon type="upload" />选择图片
        </a-button>
      </a-upload>
      <a-button>从合图导入</a-button>
    </a-space>

    <sprite-thumb
      v-if="tempSprite"
      :sprite="tempSprite"
    />
  </div>
</template>

<script lang="ts">
import Sprite from '@/gengine/Sprite'
import Texture from '@/gengine/Texture'
import { Component, Inject, Vue } from 'vue-property-decorator'
import Rect from '@/gengine/types/Rect'
import SpriteThumb from '@/components/sprite-thumb.vue'
import TexturePacker from '@/gengine/textures/TexturePacker'

@Component({
  components: { SpriteThumb }
})
export default class Workspace extends Vue {
  @Inject()
  getLibTexture!: () => Texture

  private tempSprite: Sprite | null = null

  private texturePacker!: TexturePacker

  private getTexturePacker(): TexturePacker | null {
    const libTexture = this.getLibTexture()
    if (!libTexture) {
      return null
    }
    if (!this.texturePacker) {
      this.texturePacker = new TexturePacker(libTexture)
    }
    return this.texturePacker
  }

  async onFileSelected (file: File, fileList: Array<File>) {
    const texture = await Texture.createFromFile(file, true, true)
    const texturePacker = this.getTexturePacker()
    if (texturePacker) {
      const sourceRect = await texturePacker.putSubTexture(texture)
      this.tempSprite = await Sprite.createWithTexture(this.getLibTexture(), 0, 0, sourceRect)
    }
  }

  async createBindSprite(sourceTexture: Texture): Promise<Sprite> {
    const libTexture = this.getLibTexture()

    const canvas = document.createElement('canvas') as HTMLCanvasElement
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D

    canvas.width = libTexture.bitmap.width
    canvas.height = libTexture.bitmap.height
    ctx.drawImage(libTexture.bitmap, 0, 0)
    ctx.drawImage(sourceTexture.bitmap, 20, 20)
    libTexture.bitmap = await createImageBitmap(canvas)

    const sourceRect = Rect.new(20, 20, sourceTexture.bitmap.width, sourceTexture.bitmap.height)
    return Sprite.createWithTexture(libTexture, 0, 0, sourceRect)
  }
}
</script>
