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
      <toolbar />
      <!-- 右侧主体部分 -->
      <draggable-panel
        sizing-dest="second"
        :default-sizing="300"
        style="height: calc(100% - 50px)"
      >
        <!-- 纹理预览和属性面板 -->
        <texture-preview
          ref="texturePreviewRef"
          style="overflow: auto; height: 100%"
          :is-dirty.sync="isCurrentTextureDirty"
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
              type="close"
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
import Vue from 'vue'
import Component from 'vue-class-component'
import { namespace, State } from 'vuex-class'
import Texture from '@/gengine/Texture'
import TexturePool from '@/gengine/TexturePool'
import TexturePacker from '@/gengine/utils/TexturePacker'
import DraggablePanel from '@/components/draggable-panel.vue'
import TexturePreview from '@/components/texture-preview.vue'
import Toolbar from './toolbar.vue'

const TextureListViewStore = namespace('textureListView')

@Component({
  name: 'TextureListIndex',
  components: { Toolbar, DraggablePanel, TexturePreview }
})
export default class TextureListIndex extends Vue {
  @State(state => state.texture.textureNames)
  private textureNames!: Array<string>

  @TextureListViewStore.Getter('currentTextureName')
  private currentTextureName!: string | null

  @TextureListViewStore.Getter('currentTexturePacker')
  private currentTexturePacker!: TexturePacker | null

  get currentTextureNames() {
    return this.$store.state.textureListView.currentTextureNames
  }

  set currentTextureNames(val: Array<string>) {
    this.$store.commit('textureListView/setCurrentTextureNames', val)
  }

  get isPropertiesPanelCollapsed() {
    return this.$store.state.textureListView.isPropertiesPanelCollapsed
  }

  set isPropertiesPanelCollapsed(val: boolean) {
    this.$store.commit('textureListView/setPropertiesPanelCollapsed', val)
  }

  get isCurrentTextureDirty() {
    return this.$store.state.textureListView.isCurrentTextureDirty
  }

  set isCurrentTextureDirty(val: boolean) {
    this.$store.commit('textureListView/setCurrentTextureDirty', val)
  }

  /** 根据纹理名称，从纹理池中获取对应的纹理对象 */
  getCurrentTexture(): Texture | null | undefined {
    if (!this.currentTextureName) {
      return null
    }
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
</style>
