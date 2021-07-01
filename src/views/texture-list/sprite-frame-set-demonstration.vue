<template>
  <div
    v-if="currentSpriteFrameSet"
    class="demonstration"
  >
    <div class="box-positioner">
      <div
        v-for="spriteFrame in currentSpriteFrameSet.spriteFrameList"
        :key="spriteFrame.name"
        class="box"
        :style="generateStyleObj(spriteFrame.sourceRect)"
      />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { namespace } from 'vuex-class'
import { SpriteFrameSet } from '@/gengine/SpriteFrameSet'
import Rect from '@/gengine/types/Rect'

const TextureListViewStore = namespace('textureListView')

@Component({
  name: 'SpriteFrameSetDemonstration'
})
export default class SpriteFrameSetDemonstration extends Vue {
  @TextureListViewStore.Getter('currentSpriteFrameSet')
  private currentSpriteFrameSet!: SpriteFrameSet | null

  generateStyleObj(sourceRect: Rect) {
    return {
      left: sourceRect.x + 'px',
      top: sourceRect.y + 'px',
      width: sourceRect.width + 'px',
      height: sourceRect.height + 'px'
    }
  }
}
</script>

<style lang="less" scoped>
.demonstration {
  position: absolute;
  top: 10px;
  left: 10px;
  z-index: 100;

  .box-positioner {
    position: relative;

    .box {
      border: 1px dashed #f00a;
      position: absolute;
    }
  }
}
</style>
