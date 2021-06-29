<template>
  <div
    class="draggable-panel"
    :style="rootContainerStyleObject"
  >
    <div
      class="draggable-panel-main"
      :style="mainContainerStyleObject"
    >
      <slot />
    </div>

    <div
      v-if="$slots.second"
      class="draggable-panel-second"
      :style="secondContainerStyleObject"
    >
      <div
        :class="[direction === 'horizontal' ? 'draggable-border-hori' : 'draggable-border-vert']"
        @mousedown="onMouseDown"
      />
      <slot name="second" />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { Prop } from 'vue-property-decorator'

// 定义面板模式
type PanelDirection = ('vertical' | 'horizontal')
type PanelSizingDest = ('main' | 'second')

@Component({
  name: 'DraggablePanel'
})
export default class DraggablePanel extends Vue {
  @Prop({
    default: 'vertical'
  })
  private direction!: PanelDirection

  @Prop({
    default: 'main'
  })
  private sizingDest!: PanelSizingDest

  @Prop({
    type: Number,
    default: 300
  })
  private defaultSizing!: number

  public dragging = false
  public mousePrevPos = { x: 0, y: 0 }
  public sizing = 300

  created() {
    this.sizing = this.defaultSizing
  }

  onMouseDown(e: MouseEvent) {
    this.dragging = true
    this.mousePrevPos = { x: e.clientX, y: e.clientY }

    document.onmousemove = (e) => { this.onMouseMoving(e) }
    document.onmouseup = () => { this.onMouseUp() }
  }

  onMouseMoving(e: MouseEvent) {
    if (!this.dragging) {
      return
    }
    let offset: number
    if (this.direction === 'horizontal') {
      if (this.sizingDest === 'main') {
        offset = e.clientX - this.mousePrevPos.x
      } else {
        offset = this.mousePrevPos.x - e.clientX
      }
    } else {
      if (this.sizingDest === 'main') {
        offset = e.clientY - this.mousePrevPos.y
      } else {
        offset = this.mousePrevPos.y - e.clientY
      }
    }
    this.sizing += offset
    this.mousePrevPos = { x: e.clientX, y: e.clientY }
}

  onMouseUp() {
    this.dragging = false

    document.onmousemove = null
    document.onmouseup = null
  }

  /** 根容器的样式对象 */
  get rootContainerStyleObject() {
    return {
      flexDirection: this.direction === 'horizontal' ? 'row' : 'column'
    }
  }

  get mainContainerStyleObject() {
    const styleObj = {
      flexBasis: 'auto',
      flexGrow: '1'
    }

    if (this.sizingDest === 'main') {
      styleObj.flexBasis = this.sizing + 'px'
      styleObj.flexGrow = '0'
    }

    return styleObj
  }

  get secondContainerStyleObject() {
    const styleObj = {
      flexBasis: 'auto',
      flexGrow: '1'
    }

    if (this.sizingDest === 'second') {
      styleObj.flexBasis = this.sizing + 'px'
      styleObj.flexGrow = '0'
    }

    return styleObj
  }
}
</script>

<style lang="less" scoped>
.draggable-panel {
  display: flex;

  .draggable-panel-main {
  }
  .draggable-panel-second {
    position: relative;
  }

  .draggable-border {
    background-color: #0000;
    position: absolute;
    z-index: 100;
  }
  .draggable-border-hori {
    .draggable-border();
    width: 5px;
    left: 0;
    top: 0;
    bottom: 0;
    cursor: col-resize;
  }

  .draggable-border-vert {
    .draggable-border();
    height: 5px;
    left: 0;
    right: 0;
    top: 0;
    cursor: row-resize;
  }
}
</style>
