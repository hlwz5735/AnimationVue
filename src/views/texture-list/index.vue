<template>
  <draggable-panel
    style="height: calc(100vh - 64px)"
    :default-sizing="300"
  >
    <div style="height: 100%; overflow: auto">
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
    </div>

    <draggable-panel
      slot="second"
      sizing-dest="second"
      :default-sizing="300"
      style="height: 100%"
    >
      <texture-preview
        style="overflow: auto; height: 100%"
        :show-color-selector="false"
        :texture="getCurrentTexture()"
      />
      <template #second>
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
      </template>
    </draggable-panel>

    <a-button
      v-if="rightPanelProps.collapsed"
      icon="menu-fold"
      type="primary"
      shape="circle"
      style="position: absolute; top: 50%; right: 12px"
      @click="rightPanelProps.collapsed = false"
    />
  </draggable-panel>
</template>

<script lang="ts">
import Component from 'vue-class-component'
import Vue from 'vue'
import { State } from 'vuex-class'
import TexturePreview from '@/components/texture-preview.vue'
import Texture from '@/gengine/Texture'
import TexturePool from '@/gengine/TexturePool'
import DraggablePanel from '@/components/draggable-panel.vue'

@Component({
  name: 'TextureListIndex',
  components: { DraggablePanel, TexturePreview }
})
export default class TextureListIndex extends Vue {
  @State(state => state.texture.textureNames)
  private textureNames!: Array<string>

  private currentTextureNames = [] as Array<string>

  public rightPanelProps = {
    collapsed: false
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

</style>
