<template>
  <a-layout>
    <a-layout-header :style="{ position: 'fixed', zIndex: 1, width: '100%' }">
      <a-menu
        mode="horizontal"
        theme="dark"
        :selected-keys="selectedMenuKey"
        :style="{ lineHeight: '64px' }"
      >
        <a-menu-item key="/animation-list">
          <router-link to="/animation-list">
            动画列表
          </router-link>
        </a-menu-item>
        <a-menu-item key="/texture-list">
          <router-link to="/texture-list">
            纹理列表
          </router-link>
        </a-menu-item>
      </a-menu>
    </a-layout-header>

    <a-layout-content :style="{ marginTop: '64px' }">
      <router-view />
    </a-layout-content>
  </a-layout>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'

@Component({
  name: 'IndexView'
})
export default class IndexView extends Vue {
  get selectedMenuKey() {
    return [this.$route.path]
  }
}
</script>

<style lang="less" scoped>

</style>
