import Vue from 'vue'
import Vuex from 'vuex'

import { RootState } from './types'
import imageManager from './image-manager'

Vue.use(Vuex)

export default new Vuex.Store<RootState>({
  modules: {
    imageManager
  }
})
