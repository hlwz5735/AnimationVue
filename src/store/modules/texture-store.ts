import { ActionTree, Module, MutationTree } from 'vuex'
import { RootState } from '@/store/types'
import TexturePool from '@/gengine/TexturePool'

const state = {
  textureNames: [] as Array<string>
}

const mutations: MutationTree<typeof state> = {
  setTextureNames(state, payload) {
    state.textureNames = payload
  }
}

const actions: ActionTree<typeof state, RootState> = {
  syncPool({ commit }) {
    commit('setTextureNames', TexturePool.keys())
  }
}

export default {
  namespaced: true,
  state,
  actions,
  mutations
} as Module<typeof state, RootState>
