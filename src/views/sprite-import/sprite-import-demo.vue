<template>
  <div>
    <a-tabs @change="onTabChange">
      <a-tab-pane
        key="sprite-set"
        tab="工作区"
      >
        <workspace />
      </a-tab-pane>
      <a-tab-pane
        key="lib-texture"
        tab="图集预览"
      >
        <texture-preview
          ref="libTexturePreview"
          :texture="libTexture"
          :default-background-color="libTexturePreviewBackgroundColor"
        />
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import TexturePreview from '@/components/texture-preview.vue'
import Workspace from './components/workspace.vue'
import Texture from '@/gengine/Texture'
import Color from '@/gengine/types/Color'

interface DataType {
  /** 保存所有精灵用的库纹理 */
  libTexture: Texture,
  libTexturePreviewBackgroundColor: Color
}

interface ProvideType {
  /** 获取库纹理 */
  getLibTexture: () => Texture
}

const vm = Vue.extend({
  name: 'SpriteImportDemo',
  components: { TexturePreview, Workspace },
  data(): DataType {
    return {
      libTexture: null!,
      libTexturePreviewBackgroundColor: Color.WHITE
    }
  },

  async created() {
     this.libTexture = await Texture.createEmpty(1024, 1024, new Color(0, 0, 0, 0))
  },

  provide(): ProvideType {
    return {
      getLibTexture: () => this.libTexture
    }
  },

  methods: {
    onTabChange(key: string) {
      switch (key) {
        case 'lib-texture':
          if (this.$refs.libTexturePreview) {
            (this.$refs.libTexturePreview as any).drawLibTexture()
          }
          break
        case 'sprite-set':
        default:
          break
      }
    }
  }
})

export default vm
</script>

<style lang="less" scoped>

</style>
