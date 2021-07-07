<template>
  <div v-if="spriteFrame">
    精灵帧名：{{ spriteFrame.name }}
    <a-divider />
    所属纹理：{{ spriteFrame.texture.path }}
  </div>
  <a-empty v-else />
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { Prop } from 'vue-property-decorator'
import SpriteFrame from '../../gengine/SpriteFrame'

@Component({
  name: 'SpriteFrameInfo'
})
export default class SpriteFrameInfo extends Vue {
  @Prop({
    type: Object,
    default: null
  })
  private spriteFrame!: SpriteFrame | null | undefined
}
</script>

<style lang="less" scoped>

</style>
