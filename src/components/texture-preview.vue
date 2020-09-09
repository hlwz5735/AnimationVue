<template>
  <div class="padding-thin">
    <div>
      颜色选择：
      <input type="color" v-model="previewBackgroundColor" @change="drawLibTexture">
    </div>
    <canvas ref="libTextureCanvas" style="border: 1px dashed black"/>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Texture from '@/gengine/Texture'
import Color from '@/gengine/types/Color'

interface DataType {
  previewBackgroundColor: Color
}

const vm = Vue.extend({
  name: 'texture-preview',
  data(): DataType {
    return {
      previewBackgroundColor: Color.WHITE
    }
  },
  props: {
    texture: { type: Texture }
  },
  mounted() {
    this.drawLibTexture()
  },
  methods: {
    drawLibTexture() {
      if (!this.texture) {
        return
      }

      const { width, height } = this.texture.bitmap

      const canvas = this.$refs.libTextureCanvas as HTMLCanvasElement
      const ctx = canvas.getContext('2d')!

      canvas.width = width
      canvas.height = height

      ctx.fillStyle = this.previewBackgroundColor.toString()
      ctx.fillRect(0, 0, width, height)
      ctx.drawImage(this.texture.bitmap, 0, 0)
    }
  }
})

export default vm
</script>

<style lang="less" scoped>

</style>
