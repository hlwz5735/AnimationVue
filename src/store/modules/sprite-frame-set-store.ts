import { ActionTree, GetterTree, Module, MutationTree } from 'vuex'
import { RootState } from '@/store/types'
import { SpriteFrameSet } from '@/gengine/SpriteFrameSet'

const state = {
  spriteFrameSetMap: new Map<string, SpriteFrameSet>()
}

export type SpriteFrameSetState = typeof state

const mutations: MutationTree<SpriteFrameSetState> = {
}

const actions: ActionTree<SpriteFrameSetState, RootState> = {
}

const getters: GetterTree<SpriteFrameSetState, RootState> = {
}

export default {
  namespaced: true,
  state,
  actions,
  getters,
  mutations
} as Module<SpriteFrameSetState, RootState>
