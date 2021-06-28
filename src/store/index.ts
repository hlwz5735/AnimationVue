import Vue from 'vue'
import Vuex from 'vuex'

import { RootState } from './types'

import TextureModule from './modules/texture-store'

Vue.use(Vuex)

export default new Vuex.Store<RootState>({
  modules: {
    texture: TextureModule
  }
})
