<template>
  <div>
    <a-upload name="file" :multiple="true"
        :before-upload="onFileSelected"
        :custom-request="() => {}"
        :show-upload-list="false">
      <a-button>
        <a-icon type="upload" />选择图片
      </a-button>
    </a-upload>

    <div ref="container"></div>
    <canvas ref="baseCanvas" width="800" height="800"></canvas>
  </div>
</template>

<script lang="ts">
import Component from 'vue-class-component'
import Vue from 'vue'
import { ImageFile } from '@/manager/ImageFile'
import { State, Getter, Mutation, namespace } from 'vuex-class'

const imageManagerModule = namespace('imageManager')

@Component
export default class Home extends Vue {
  private canvas: HTMLCanvasElement = null!
  private graphics: CanvasRenderingContext2D = null!

  mounted () {
    this.canvas = this.$refs.baseCanvas as HTMLCanvasElement
    this.graphics = this.canvas.getContext('2d')!
  }

  @State(state => state.imageManager.cache)
  imageCache!: {[key: string]: ImageFile}

  @imageManagerModule.Getter('exists')
  imageExists!: (filename: string) => boolean

  @imageManagerModule.Getter('fileNames')
  imageNames!: () => string[]

  @imageManagerModule.Mutation('put')
  putImage!: (filename: string, bitmap: ImageBitmap) => void

  async onFileSelected (file: File, fileList: Array<File>) {
    for (file of fileList) {
      if (!this.imageExists(file.name)) {
        const bitmap = await createImageBitmap(file)
        this.putImage(file.name, bitmap)
      }
    }
  }
}
</script>
