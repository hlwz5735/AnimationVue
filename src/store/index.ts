import Vue from 'vue'
import Vuex from 'vuex'

import { RootState } from './types'

import TextureModule from './modules/texture-store'
import SpriteFrameSetModule from './modules/sprite-frame-set-store'

import TextureListViewStore from './modules/texture-list-view-store'

Vue.use(Vuex)

export default new Vuex.Store<RootState>({
  modules: {
    texture: TextureModule,
    spriteFrameSet: SpriteFrameSetModule,
    textureListView: TextureListViewStore
  }
})
