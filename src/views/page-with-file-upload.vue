<template>
  <a-layout style="height: 100vh;">
    <a-layout-header>
      <div class="top-layout-btn-ctrl-panel">
        <a-button-group>
          <a-button icon="border-left" />
          <a-button icon="border-bottom" />
          <a-button icon="border-right" />
        </a-button-group>
      </div>
    </a-layout-header>
    <a-layout style="flex-grow: 1;">
      <a-layout-sider theme="light">
        <a-card title="动画列表">
          hey
        </a-card>
      </a-layout-sider>
      <a-layout>
        <a-layout-content>
          <about />
<!--          <canvas ref="canvasRef" width="5000" height="5000" />-->
          <canvas ref="canvasRef" />
        </a-layout-content>
        <a-layout-footer>footer</a-layout-footer>
      </a-layout>
      <a-layout-sider theme="light">
        <a-card title="库">
          <a-button slot="extra" icon="plus" type="link" />
          hey
        </a-card>
      </a-layout-sider>
    </a-layout>
  </a-layout>
</template>

<script lang="ts">
import Vue from 'vue'
import About from '@/views/About.vue'

interface DataInterface {
  canvasRef: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D
}

const vm = Vue.extend({
  name: 'LayoutIndex',
  components: { About },
  data(): DataInterface {
    return {
      canvasRef: null!,
      ctx: null!
    }
  },
  mounted(): void {
    this.canvasRef = this.$refs.canvasRef as HTMLCanvasElement
    this.ctx = this.canvasRef.getContext('2d')!
  }
})
export default vm
</script>

<style lang="less" scoped>
.top-layout-btn-ctrl-panel {
  height: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
</style>
