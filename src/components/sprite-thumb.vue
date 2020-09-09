<template>
  <div class="canvas-wrapper">
    <canvas ref="canvasRef"/>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Sprite from '@/gengine/Sprite'
import Rect from '@/gengine/types/Rect'

interface ComponentData {
  canvasRef: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D
}

const component = Vue.extend({
  name: 'SpriteThumb',
  props: {
    sprite: { type: Sprite },
    width: {
      type: Number,
      default: 64
    },
    height: {
      type: Number,
      default: 64
    }
  },
  data(): ComponentData {
    return {
      canvasRef: null!,
      ctx: null!
    }
  },
  mounted(): void {
    this.canvasRef = this.$refs.canvasRef as HTMLCanvasElement
    this.ctx = this.canvasRef.getContext('2d')!

    this.canvasRef.width = this.width
    this.canvasRef.height = this.height

    this.drawThumb()
  },
  watch: {
    width(val) {
      this.canvasRef.width = val
      this.drawThumb()
    },
    height(val) {
      this.canvasRef.height = val
      this.drawThumb()
    }
  },
  methods: {
    drawThumb(): void {
      this.ctx.clearRect(0, 0, this.canvasRef.width, this.canvasRef.height)

      const { minX: sx, minY: sy, width: sw, height: sh } = this.sprite.sourceRect

      const destRect = centerRect(this.sprite.sourceRect, this.canvasRef.width, this.canvasRef.height)

      this.ctx.drawImage(this.sprite.texture.bitmap, sx, sy, sw, sh,
        destRect.minX, destRect.minY, destRect.width, destRect.height)
    }
  }
})

function centerRect(sourceRect: Rect, destWidth: number, destHeight: number): Rect {
  if (sourceRect.width <= destWidth && sourceRect.height <= destHeight) {
    return Rect.new((destWidth - sourceRect.width) / 2, (destHeight - sourceRect.height) / 2,
      sourceRect.width, sourceRect.height)
  } else {
    const widthRatio = destWidth / sourceRect.width
    const heightRatio = destHeight / sourceRect.height

    // 宽大于高，x顶格，y下移居中，宽填满，高按比例缩小
    if (widthRatio < heightRatio) {
      const x = 0
      const width = destWidth
      const height = Math.ceil(sourceRect.height * widthRatio)
      const y = (destHeight - height) / 2

      return Rect.new(x, y, width, height)
    } else {
      const y = 0
      const width = Math.ceil(sourceRect.width * heightRatio)
      const height = destHeight
      const x = (destWidth - width) / 2

      return Rect.new(x, y, width, height)
    }
  }
}

export default component
</script>

<style lang="less" scoped>
  .canvas-wrapper {
    padding: 5px;
    border: 1px dashed gray;
  }
</style>
