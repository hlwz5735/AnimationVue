import { ActionTree, Module, MutationTree } from 'vuex'
import { RootState } from '@/store/types'
import TexturePool from '@/gengine/TexturePool'

const state = {
  textureNames: [] as Array<string>
}

export type TextureState = typeof state

const mutations: MutationTree<TextureState> = {
  setTextureNames(state: TextureState, payload) {
    state.textureNames = payload
  }
}

const actions: ActionTree<TextureState, RootState> = {
  syncPool({ commit }) {
    commit('setTextureNames', TexturePool.keys())
  }
}

export default {
  namespaced: true,
  state,
  actions,
  mutations
} as Module<TextureState, RootState>
