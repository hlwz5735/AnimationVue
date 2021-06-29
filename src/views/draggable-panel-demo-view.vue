<template>
  <div>
    <a-checkbox v-model="mode" />{{ mode ? 'horizontal' : 'vertical' }}
    <draggable-panel
      :direction="mode ? 'horizontal' : 'vertical'"
    >
      <div>
        我是主体
      </div>
      <template #second>
        <div>
          我是次要体
        </div>
      </template>
    </draggable-panel>
  </div>
</template>

<script>
import DraggablePanel from '@/components/draggable-panel'

export default {
  name: 'DraggablePanelDemoView',
  components: { DraggablePanel },
  data() {
    return {
      mode: false
    }
  }
}
</script>

<style lang="less" scoped>

</style>
