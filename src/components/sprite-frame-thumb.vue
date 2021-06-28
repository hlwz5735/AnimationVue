<template>
  <div class="canvas-wrapper">
    <canvas ref="canvasRef" />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import SpriteFrame from '@/gengine/SpriteFrame'
import { centerRect } from '@/gengine/utils/ImageUtil'

@Component
export default class SpriteFrameThumb extends Vue {
  @Prop()
  private spriteFrame!: SpriteFrame

  @Prop({
    default: 64
  })
  private width!: number

  @Prop({
    default: 64
  })
  private height!: number

  canvasRef!: HTMLCanvasElement
  ctx!: CanvasRenderingContext2D

  mounted() {
    this.canvasRef = this.$refs.canvasRef as HTMLCanvasElement
    this.ctx = this.canvasRef.getContext('2d')!

    this.canvasRef.width = this.width
    this.canvasRef.height = this.height

    this.drawThumb()
  }

  drawThumb(): void {
    this.ctx.clearRect(0, 0, this.canvasRef.width, this.canvasRef.height)
    const imageData = this.spriteFrame.texture.getImageData()
    if (!imageData) {
      return
    }
    // 计算原图片缩放到缩略图大小所使用的包围框
    const destRect = centerRect(this.spriteFrame.sourceRect, this.canvasRef.width, this.canvasRef.height)
    const { minX: sx, minY: sy, width: sw, height: sh } = this.spriteFrame.sourceRect
    this.ctx.drawImage(imageData, sx, sy, sw, sh,
      destRect.minX, destRect.minY, destRect.width, destRect.height)
  }

  @Watch('spriteFrame')
  onSpriteChange() {
    this.drawThumb()
  }

  @Watch('width')
  onWidthChange(val: number) {
    this.canvasRef.width = val
    this.drawThumb()
  }

  @Watch('height')
  onHeightChange(val: number) {
    this.canvasRef.height = val
    this.drawThumb()
  }
}
</script>

<style lang="less" scoped>
  .canvas-wrapper {
    padding: 5px;
    border: 1px dashed gray;
    display: inline-block;
  }
</style>
