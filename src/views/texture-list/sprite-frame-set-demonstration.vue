<template>
  <div
    v-if="currentSpriteFrameSet"
    class="demonstration"
    @click="selectingSpriteFrameName = ''"
  >
    <div class="box-positioner">
      <div
        v-for="spriteFrame in spriteFrameList"
        :key="spriteFrame.name"
        class="box"
        :class="{ selected: selectingSpriteFrameName === spriteFrame.name }"
        :style="generateStyleObj(spriteFrame.sourceRect)"
        @click.stop="selectingSpriteFrameName = spriteFrame.name"
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
import { Prop, Watch } from 'vue-property-decorator'
import SpriteFrame from '@/gengine/SpriteFrame'

const TextureListViewStore = namespace('textureListView')

@Component({
  name: 'SpriteFrameSetDemonstration'
})
export default class SpriteFrameSetDemonstration extends Vue {
  /** 因为使用了Map结构，所以 Vuex 不能响应数组内的变化，需要主动重新拉取数据 */
  @Prop({
    type: Boolean,
    default: false
  })
  private isDirty!: boolean

  @TextureListViewStore.Getter('currentSpriteFrameSet')
  private currentSpriteFrameSet!: SpriteFrameSet | null

  get selectingSpriteFrameName(): string | null | undefined {
    return this.$store.state.textureListView.selectingSpriteFrameName
  }

  set selectingSpriteFrameName(val: string | null | undefined) {
    this.$store.commit('textureListView/setSelectingSpriteFrameName', val)
  }

  public spriteFrameList: Array<SpriteFrame> = []

  mounted() {
    this.spriteFrameList = this.currentSpriteFrameSet?.spriteFrameList || []
  }

  @Watch('currentSpriteFrameSet')
  onCurrentSpriteFrameSetChanges(val: SpriteFrameSet | null) {
    if (!val) {
      this.spriteFrameList = []
    } else {
      this.spriteFrameList = val.spriteFrameList
    }
  }

  @Watch('isDirty')
  onDirtyChanges(val: boolean) {
    if (val) {
      const arr = this.currentSpriteFrameSet?.spriteFrameList || []
      this.spriteFrameList = [...arr]
    }
  }

  private generateStyleObj(sourceRect: Rect) {
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
  left: 10px;
  top: 10px;
  right: 10px;
  bottom: 10px;
  z-index: 100;

  .box-positioner {
    position: relative;

    .box {
      position: absolute;
      &:hover {
        border: 1px dashed #0f0;
      }
      &.selected, &:hover.selected {
        border: 1px dashed #f00;
      }
    }
  }
}
</style>
