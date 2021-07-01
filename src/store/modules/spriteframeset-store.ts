import { ActionTree, Module, MutationTree } from 'vuex'
import SpriteFrame from '@/gengine/SpriteFrame'
import { RootState } from '@/store/types'

const state = {
  spriteFrameSetMap: new Map<string, SpriteFrame>()
}

export type State = typeof state

const mutations: MutationTree<State> = {

}

const actions: ActionTree<State, RootState> = {

}

export default {
  namespaced: true,
  state,
  actions,
  mutations
} as Module<State, RootState>
