<template>
  <div class="padding-thin">
    <div v-show="showColorSelector">
      颜色选择：
      <input
        v-model="previewBackgroundColor"
        type="color"
        @change="drawLibTexture"
      >
    </div>
    <canvas
      ref="libTextureCanvas"
      style="border: 1px dashed black"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Texture from '@/gengine/Texture'
import Color from '@/gengine/types/Color'
import Component from 'vue-class-component'
import { Prop, Watch } from 'vue-property-decorator'

/**
 * 用于大纹理预览的组件，自带一个颜色选择器
 */
@Component({
  name: 'texture-preview'
})
export default class TexturePreview extends Vue {
  @Prop({
    type: Texture,
    required: false
  })
  private texture!: Texture | null

  @Prop({
    type: Boolean,
    default: true
  })
  private showColorSelector!: boolean

  @Prop({
    type: Color,
    default: () => Color.WHITE
  })
  private defaultBackgroundColor!: Color

  public previewBackgroundColor!: Color

  created() {
    this.previewBackgroundColor = this.defaultBackgroundColor
  }

  mounted() {
    this.drawLibTexture()
  }

  @Watch('texture')
  onTextureChange() {
    this.drawLibTexture()
  }

  drawLibTexture() {
    if (!this.texture) {
      return
    }

    const { width, height } = this.texture

    const canvas = this.$refs.libTextureCanvas as HTMLCanvasElement
    const ctx = canvas.getContext('2d')!

    canvas.width = width
    canvas.height = height

    ctx.fillStyle = this.previewBackgroundColor.toString()
    ctx.fillRect(0, 0, width, height)
    const imageData = this.texture.getImageData()!
    if (imageData) {
      ctx.drawImage(imageData, 0, 0)
    }
  }
}
</script>

<style lang="less" scoped>

</style>
