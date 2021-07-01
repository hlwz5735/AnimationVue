<template>
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
          @click="newTexture"
        />
      </a-tooltip>
      <a-tooltip
        title="添加精灵帧"
        placement="bottom"
      >
        <a-upload
          name="file"
          :multiple="true"
          :before-upload="onFileSelected"
          :custom-request="() => {}"
          :show-upload-list="false"
        >
          <a-button
            icon="download"
          />
        </a-upload>
      </a-tooltip>
      <a-tooltip
        title="整理精灵帧"
        placement="bottom"
      >
        <a-button
          icon="reload"
        />
      </a-tooltip>
    </a-space>
    <div class="text-right">
      <a-checkbox v-model="isPropertiesPanelCollapsed" />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { namespace } from 'vuex-class'
import Color from '@/gengine/types/Color'
import SpriteFrame from '@/gengine/SpriteFrame'
import SpriteFramePool from '@/gengine/SpriteFramePool'
import Texture from '@/gengine/Texture'
import TexturePool from '@/gengine/TexturePool'
import TexturePacker from '@/gengine/utils/TexturePacker'
import TextureFilledException from '@/gengine/exceptions/TextureFilledException'

const TextureListViewStore = namespace('textureListView')

@Component({
  name: 'Toolbar'
})
export default class Toolbar extends Vue {
  @TextureListViewStore.Getter('currentTextureName')
  private currentTextureName!: string | null

  @TextureListViewStore.Getter('currentTexturePacker')
  private currentTexturePacker!: TexturePacker | null

  get isPropertiesPanelCollapsed() {
    return this.$store.state.textureListView.isPropertiesPanelCollapsed
  }

  set isPropertiesPanelCollapsed(val: boolean) {
    this.$store.commit('textureListView/setPropertiesPanelCollapsed', val)
  }

  /** 待处理的图片纹理列表 */
  private tempTextureList = [] as Array<Texture>

  /** 新建纹理 */
  newTexture() {
    const texture = Texture.createEmpty(1024, 1024, new Color(0, 0, 0, 0))
    TexturePool.set(texture.path, texture)
    this.$store.dispatch('texture/syncPool')
  }

  /**
   * 选择了图片文件之后的回调
   */
  async onFileSelected (file: File, fileList: Array<File>) {
    // 读取选择的文件列表，创建纹理
    const tempTexture = await Texture.createByFile(file, true, true)
    // 将纹理加入到待处理纹理列表中
    this.tempTextureList.push(tempTexture)
    // 如果待处理纹理列表的长度和文件列表相等（即所有文件都作为文件处理了）
    if (this.tempTextureList.length === fileList.length) {
      this.onAllImageLoaded()
    }
  }

  private onAllImageLoaded() {
    const texture = this.getCurrentTexture()
    if (!texture || !this.currentTexturePacker) {
      return
    }
    // 基于高度对纹理排序（目前来看，在导入期间基于高度进行排序，图集排列是最优的）
    this.tempTextureList.sort((a, b) => {
      return b.height - a.height
    })
    // 将待处理纹理列表中的纹理放入合图纹理之中
    for (const elem of this.tempTextureList) {
      try {
        const sourceRect = this.currentTexturePacker.putSubTexture(elem)
        SpriteFramePool.setWithDefaultName(SpriteFrame.createByTexture(elem.path, texture, sourceRect))
      } catch (ex) {
        if (ex instanceof TextureFilledException) {
          console.log(elem.path + '超限，开始扩大纹理大小')
          this.currentTexturePacker.resize(2)
          const sourceRect = this.currentTexturePacker.putSubTexture(elem)
          SpriteFramePool.setWithDefaultName(SpriteFrame.createByTexture(elem.path, texture, sourceRect))
        }
      }
    }
    // 复位纹理列表
    this.tempTextureList = []
    // 告知父组件当前纹理已得更新
    this.$emit('update-texture')
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
