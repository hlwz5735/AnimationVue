<template>
  <div>
    <a-upload
      name="file"
      :multiple="true"
      :before-upload="onFileSelected"
      :custom-request="() => {}"
      :show-upload-list="false"
    >
      <a-button>
        <a-icon type="upload" />
        添加图片
      </a-button>
    </a-upload>

    <a-slider v-model="thumbWidth" />

    <div class="thumb-list">
      <template v-for="sprite in sprites">
        <sprite-thumb
          :key="sprite.texture.path"
          :sprite="sprite"
          :width="thumbWidth"
          :height="thumbWidth"
        />
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import SpriteThumb from '@/components/sprite-thumb.vue'
import Sprite from '@/gengine/Sprite'
import Texture from '@/gengine/Texture'

@Component({
  components: {
    SpriteThumb
  }
})
export default class About extends Vue {
  private data = [] as string[]

  private sprites = [] as Sprite[]
  private thumbWidth = 100

  mounted() {

  }

  initImageData() {

  }

  async onFileSelected(file: File, fileList: Array<File>) {
    // for (file of fileList) {
    // const reader = new FileReader()
    // reader.readAsDataURL(file)
    // reader.onloadend = async () => {
    //   // const sprite = await Sprite.create(reader.result as string, 0, 0)
    //   const sprite = await Sprite.create(reader.result as string, 0, 0, true)
    //   this.sprites.push(sprite)
    // }
    const texture = await Texture.createFromFile(file, true, true)
    const sprite = await Sprite.createWithTexture(texture, 0, 0)
    this.sprites.push(sprite)
  }
  // }
}
</script>

<style lang="less" scoped>
  .thumb-list {
    display: flex;
    flex-wrap: wrap;
  }
</style>
