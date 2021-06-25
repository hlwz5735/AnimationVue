<template>
  <div>
    <a-space>
      <a-upload
        name="file"
        :multiple="true"
        :before-upload="onFileSelected"
        :custom-request="() => {}"
        :show-upload-list="false"
      >
        <a-button>
          <a-icon type="upload" />选择图片
        </a-button>
      </a-upload>
      <a-button>从合图导入</a-button>
      <a-button @click="showRegionDebug">
        调试显示分区信息
      </a-button>
    </a-space>
    <div>
      <sprite-thumb
        v-if="tempSprite"
        :sprite-frame="tempSprite.spriteFrame"
        :width="tempSprite.width"
        :height="tempSprite.height"
      />
    </div>
  </div>
</template>

<script lang="ts">
import Sprite from '@/gengine/Sprite'
import Texture from '@/gengine/Texture'
import { Component, Inject, Prop, Vue } from 'vue-property-decorator'
import SpriteThumb from '@/components/sprite-frame-thumb.vue'
import TexturePacker from '@/gengine/utils/TexturePacker'
import Rect from '@/gengine/types/Rect'
import TextureFilledException from '@/gengine/exceptions/TextureFilledException'

@Component({
  components: { SpriteThumb }
})
export default class Workspace extends Vue {
  @Prop({
    required: true
  })
  private libTexture!: Texture | null

  @Prop({
    required: true
  })
  private texturePacker!: TexturePacker | null

  /** 展示当前导入的图片的精灵 */
  private tempSprite: Sprite | null = null
  /** 待处理的图片纹理列表 */
  private textureList = [] as Array<Texture>

  /**
   * 选择了图片文件之后的回调
   */
  async onFileSelected (file: File, fileList: Array<File>) {
    // 读取选择的文件列表，创建纹理
    const texture = await Texture.createByFile(file, true, true)
    // 将纹理加入到待处理纹理列表中
    this.textureList.push(texture)
    // 如果待处理纹理列表的长度和文件列表相等（即所有文件都作为文件处理了）
    if (this.textureList.length === fileList.length) {
      // 基于高度对纹理排序（目前来看，在导入期间基于高度进行排序，图集排列是最优的）
      this.textureList.sort((a, b) => {
        return b.height - a.height
      })
      if (this.texturePacker) {
        // 将待处理纹理列表中的纹理放入合图纹理之中
        for (const elem of this.textureList) {
          try {
            const sourceRect = this.texturePacker.putSubTexture(elem)
            this.tempSprite = await Sprite.createByTexture(this.libTexture!, sourceRect)
          } catch (ex) {
            if (ex instanceof TextureFilledException) {
              console.log(file.name + '超限，开始扩大纹理大小')
              this.texturePacker.resize(2)
              const sourceRect = this.texturePacker.putSubTexture(elem)
              this.tempSprite = await Sprite.createByTexture(this.libTexture!, sourceRect)
            }
          }
        }
      }
      // 复位纹理列表
      this.textureList = []
    }
  }

  /**
   * 打印纹理打包器的区划信息
   * @private
   */
  private showRegionDebug() {
    if (this.texturePacker) {
      const canvas = this.texturePacker.debugPrint()
      document.body.appendChild(canvas)
    }
  }
}
</script>
