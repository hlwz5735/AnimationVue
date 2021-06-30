<template>
  <draggable-panel
    style="height: calc(100vh - 64px)"
    :default-sizing="300"
  >
    <!-- 左侧菜单部分 -->
    <div class="menu-container">
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
    <template #second>
      <!-- 工具栏 -->
      <div class="toolbar">
        <a-space>
          <a-tooltip
            title="打开新纹理"
            placement="bottom"
          >
            <a-button
              icon="folder-open"
            />
          </a-tooltip>
          <a-tooltip
            title="新建纹理"
            placement="bottom"
          >
            <a-button
              icon="file-add"
            />
          </a-tooltip>
          <a-tooltip
            title="添加精灵帧"
            placement="bottom"
          >
            <a-button
              icon="download"
            />
          </a-tooltip>
        </a-space>
        <div class="text-right">
          <a-checkbox v-model="isPropertiesPanelCollapsed" />
        </div>
      </div>
      <!-- 右侧主体部分 -->
      <draggable-panel
        sizing-dest="second"
        :default-sizing="300"
        style="height: calc(100% - 50px)"
      >
        <!-- 纹理预览和属性面板 -->
        <texture-preview
          style="overflow: auto; height: 100%"
          :show-color-selector="false"
          :texture="getCurrentTexture()"
        />
        <template
          v-if="isPropertiesPanelCollapsed"
          #second
        >
          <a-card
            title="纹理属性"
            class="side-panel no-text-select"
            size="small"
          >
            <a-icon
              slot="extra"
              type="menu-unfold"
              @click="isPropertiesPanelCollapsed = false"
            />
            <div style="width: 260px">
              <p>card content</p>
              <p>card content</p>
              <p>card content</p>
              <p>card content</p>
              <p>card content</p>
              <p>card content</p>
              <p>card content</p>
              <p>card content</p>
              <p>card content</p>
            </div>
          </a-card>
        </template>
      </draggable-panel>
    </template>
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

  /** 用于左侧菜单选择的变量，实际只会包含1个元素 */
  private currentTextureNames = [] as Array<string>

  /** 纹理属性面板是否折叠 */
  public isPropertiesPanelCollapsed = true

  /** 获取当前选择的纹理名称 */
  get currentTextureName() {
    return this.currentTextureNames[0]
  }

  /** 根据纹理名称，从纹理池中获取对应的纹理对象 */
  getCurrentTexture(): Texture | null | undefined {
    return TexturePool.get(this.currentTextureName)
  }
}
</script>

<style lang="less" scoped>
@border-color-base: #e8e8e8;

.menu-container {
  background-color: white;
  height: 100%;
  overflow: auto;
  border-right: 3px solid @border-color-base;
}
.toolbar {
  background-color: white;
  border-width: 1px;
  border-style: none none solid none;
  border-color: @border-color-base;
  height: 48px;

  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 1em;
}
</style>
