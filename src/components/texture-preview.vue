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

interface DataType {
  previewBackgroundColor: Color
}

/**
 * 用于大纹理预览的组件，自带一个颜色选择器
 */
const vm = Vue.extend({
  name: 'TexturePreview',
  props: {
    texture: { type: Texture, required: true },
    showColorSelector: { type: Boolean, default: true },
    defaultBackgroundColor: { type: Color, default: Color.WHITE }
  },
  data(): DataType {
    return {
      previewBackgroundColor: this.defaultBackgroundColor
    }
  },
  mounted() {
    this.drawLibTexture()
  },
  methods: {
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
})

export default vm
</script>

<style lang="less" scoped>

</style>
