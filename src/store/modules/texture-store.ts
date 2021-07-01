import { ActionTree, Module, MutationTree } from 'vuex'
import { RootState } from '@/store/types'
import TexturePool from '@/gengine/TexturePool'

const state = {
  textureNames: [] as Array<string>
}

export type State = typeof state

const mutations: MutationTree<State> = {
  setTextureNames(state: State, payload) {
    state.textureNames = payload
  }
}

const actions: ActionTree<State, RootState> = {
  syncPool({ commit }) {
    commit('setTextureNames', TexturePool.keys())
  }
}

export default {
  namespaced: true,
  state,
  actions,
  mutations
} as Module<State, RootState>
