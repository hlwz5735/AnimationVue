<template>
<div>
  <a-space>
    <a-upload name="file" :multiple="true"
        :before-upload="onFileSelected"
        :custom-request="() => {}"
        :show-upload-list="false">
      <a-button>
        <a-icon type="upload" />选择图片
      </a-button>
    </a-upload>
    <a-button>从合图导入</a-button>
  </a-space>

  <sprite-thumb :sprite="tempSprite" v-if="tempSprite" />
</div>
</template>

<script lang="ts">
import Sprite from '@/gengine/Sprite'
import Texture from '@/gengine/Texture'
import { Component, Inject, Vue } from 'vue-property-decorator'
import Rect from '@/gengine/types/Rect'
import SpriteThumb from '@/components/sprite-thumb.vue'

@Component({
  components: { SpriteThumb }
})
export default class Workspace extends Vue {
  @Inject()
  getLibTexture!: () => Texture

  private tempSprite: Sprite | null = null

  async onFileSelected (file: File, fileList: Array<File>) {
    console.log(file)
    const texture = await Texture.createFromFile(file, true, true)
    this.tempSprite = await this.createBindSprite(texture)
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
