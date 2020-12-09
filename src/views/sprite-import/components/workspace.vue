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
        :sprite="tempSprite"
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
import SpriteThumb from '@/components/sprite-thumb.vue'
import TexturePacker from '@/gengine/textures/TexturePacker'
import Rect from '@/gengine/types/Rect'
import TextureFilledException from '@/gengine/exceptions/TextureFilledException'

@Component({
  components: { SpriteThumb }
})
export default class Workspace extends Vue {
  @Prop({
    type: Texture,
    required: true
  })
  private libTexture!: Texture | null

  @Prop({
    type: TexturePacker,
    required: true
  })
  private texturePacker!: TexturePacker | null

  private tempSprite: Sprite | null = null
  private textureList = [] as Array<Texture>

  async onFileSelected (file: File, fileList: Array<File>) {
    const texture = await Texture.createFromFile(file, true, true)
    this.textureList.push(texture)
    if (this.textureList.length === fileList.length) {
      this.textureList.sort((a, b) => {
        return b.width * b.height - a.width * a.height
      })
      if (this.texturePacker) {
        for (const elem of this.textureList) {
            let sourceRect: Rect
            try {
              sourceRect = this.texturePacker.putSubTexture(elem)
              this.tempSprite = await Sprite.createWithTexture(this.libTexture!, 0, 0, sourceRect)
            } catch (ex) {
              if (ex instanceof TextureFilledException) {
                console.log(file.name + '超限，开始扩大纹理大小')
                this.texturePacker.resize(2)
                sourceRect = this.texturePacker.putSubTexture(elem)
                this.tempSprite = await Sprite.createWithTexture(this.libTexture!, 0, 0, sourceRect)
              }
            }
        }
      }
      this.textureList = []
    }
  }

  private showRegionDebug() {
    if (this.texturePacker) {
      const canvas = this.texturePacker.debugPrint()
      document.body.appendChild(canvas)
    }
  }
}
</script>
