<template>
  <a-layout style="height: calc(100vh - 64px)">
    <a-layout-sider
      theme="light"
      style="height: 100%; overflow: auto"
    >
      <a-menu
        v-model="currentTextureNames"
      >
        <a-menu-item
          v-for="textureName in textureNames"
          :key="textureName"
        >
          {{ textureName }}
        </a-menu-item>
      </a-menu>
    </a-layout-sider>

    <a-layout-content style="overflow-x: auto">
      <texture-preview
        :show-color-selector="false"
        :texture="getCurrentTexture()"
      />
    </a-layout-content>

    <a-layout-sider
      collapsible
      style="height: 100%; overflow: auto; position: relative; transition: none"
      theme="light"
      :width="rightPanelProps.width"
      :collapsed="rightPanelProps.collapsed"
      :collapsed-width="0"
      :trigger="null"
    >
      <div
        class="draggable-border-lv"
        @mousedown="onMouseDown"
      />
      <a-card
        title="Default size card"
        style="user-select: none"
      >
        <a-icon
          slot="extra"
          type="menu-unfold"
          @click="rightPanelProps.collapsed = true"
        />
        <p>card content</p>
        <p>card content</p>
        <p>card content</p>
      </a-card>
    </a-layout-sider>

    <a-button
      v-if="rightPanelProps.collapsed"
      icon="menu-fold"
      type="primary"
      shape="circle"
      style="position: absolute; top: 50%; right: 12px"
      @click="rightPanelProps.collapsed = false"
    />
  </a-layout>
</template>

<script lang="ts">
import Component from 'vue-class-component'
import Vue from 'vue'
import { State } from 'vuex-class'
import TexturePreview from '@/components/texture-preview.vue'
import Texture from '@/gengine/Texture'
import TexturePool from '@/gengine/TexturePool'

@Component({
  name: 'TextureListIndex',
  components: { TexturePreview }
})
export default class TextureListIndex extends Vue {
  @State(state => state.texture.textureNames)
  private textureNames!: Array<string>

  private currentTextureNames = [] as Array<string>

  public rightPanelProps = {
    collapsed: false,
    dragging: false,
    mousePrevPos: { x: 0, y: 0 },
    width: 300
  }

  onMouseDown(e: MouseEvent) {
    console.log(e)
    this.rightPanelProps.dragging = true
    this.rightPanelProps.mousePrevPos = { x: e.clientX, y: e.clientY }

    document.onmousemove = (e) => { this.onMouseMoving(e) }
    document.onmouseup = () => { this.onMouseUp() }
  }

  onMouseMoving(e: MouseEvent) {
    if (!this.rightPanelProps.dragging) {
      return
    }
    const offsetWidth = e.clientX - this.rightPanelProps.mousePrevPos.x
    this.rightPanelProps.width -= offsetWidth
    this.rightPanelProps.mousePrevPos = { x: e.clientX, y: e.clientY }
  }

  onMouseUp() {
    this.rightPanelProps.dragging = false

    document.onmousemove = null
    document.onmouseup = null
  }

  get currentTextureName() {
    return this.currentTextureNames[0]
  }

  getCurrentTexture(): Texture | null | undefined {
    return TexturePool.get(this.currentTextureName)
  }
}
</script>

<style lang="less" scoped>
.draggable-border-lv {
  width: 5px;
  background-color: #0000;
  position: absolute;
  z-index: 100;
  left: 0;
  top: 0;
  bottom: 0;
  cursor: col-resize;
}
</style>
