<template>
  <div class="toolbar">
    <a-space>
      <a-tooltip
        title="新建纹理"
        placement="bottom"
      >
        <a-button
          icon="file-add"
          @click="newTexture"
        />
      </a-tooltip>
      <a-divider type="vertical" />
      <a-tooltip
        title="打开纹理"
        placement="bottom"
      >
        <a-button
          icon="folder-open"
        />
      </a-tooltip>
      <a-tooltip
        title="导入图集信息"
        placement="bottom"
      >
        <a-button
          icon="book"
        />
      </a-tooltip>
      <a-divider type="vertical" />
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
          icon="file-sync"
        />
      </a-tooltip>
    </a-space>
    <div class="text-right">
      <a-icon
        :type="isPropertiesPanelCollapsed ? 'menu-unfold' : 'menu-fold'"
        @click="isPropertiesPanelCollapsed = !isPropertiesPanelCollapsed"
      />
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
import { SpriteFrameSet } from '@/gengine/SpriteFrameSet'

const TextureListViewStore = namespace('textureListView')
const SpriteFrameSetModule = namespace('spriteFrameSet')

@Component({
  name: 'Toolbar'
})
export default class Toolbar extends Vue {
  @TextureListViewStore.Getter('currentTextureName')
  private currentTextureName!: string | null

  @TextureListViewStore.Getter('currentTexturePacker')
  private currentTexturePacker!: TexturePacker | null

  @TextureListViewStore.Getter('currentSpriteFrameSet')
  private currentSpriteFrameSet!: SpriteFrameSet | null

  @SpriteFrameSetModule.State('spriteFrameSetMap')
  private spriteFrameSetMap!: Map<string, SpriteFrameSet>

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

  /** 待处理的图片纹理列表 */
  private tempTextureList = [] as Array<Texture>

  /** 新建纹理 */
  newTexture() {
    const texture = Texture.createEmpty(1024, 1024, new Color(0, 0, 0, 0))
    TexturePool.set(texture.path, texture)
    const spriteFrameSet = new SpriteFrameSet(texture)
    this.spriteFrameSetMap.set(texture.path, spriteFrameSet)
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
        const spriteFrame = SpriteFrame.createByTexture(elem.path, texture, sourceRect)
        // eslint-disable-next-line no-unused-expressions
        this.currentSpriteFrameSet?.spriteFrameList.push(spriteFrame)
        SpriteFramePool.setWithDefaultName(spriteFrame)
      } catch (ex) {
        if (ex instanceof TextureFilledException) {
          console.log(elem.path + '超限，开始扩大纹理大小')
          this.currentTexturePacker.resize(2)
          const sourceRect = this.currentTexturePacker.putSubTexture(elem)
          const spriteFrame = SpriteFrame.createByTexture(elem.path, texture, sourceRect)
          // eslint-disable-next-line no-unused-expressions
          this.currentSpriteFrameSet?.spriteFrameList.push(spriteFrame)
          SpriteFramePool.setWithDefaultName(spriteFrame)
        }
      }
    }
    // 复位纹理列表
    this.tempTextureList = []
    // 告知父组件当前纹理已得更新
    this.isCurrentTextureDirty = true
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
