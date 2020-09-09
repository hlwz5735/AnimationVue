import Vue from 'vue'
import { ActionTree, MutationTree, GetterTree, Module } from 'vuex'
import { ImageFile } from '@/manager/ImageFile'
import { ImageManagerState, RootState } from '@/store/types'

const state: ImageManagerState = {
  cache: {}
}

const getters: GetterTree<ImageManagerState, RootState> = {
  fileNames: function (state: any): string[] {
    return Object.keys(state.cache)
  },
  exists: function (state: any) : (key: string) => boolean {
    return (key: string) => {
      const value = state.cache[key]
      return !!value
    }
  },
  get: function (state: any): (key: string) => ImageFile {
    return (key: string) => state.cache[key]
  }
}

const mutations: MutationTree<ImageManagerState> = {
  put: function (state: any, payload: ImageFile): void {
    Vue.set(state.cache, payload.name, payload)
  },
  remove: function (state: any, payload: string): void {
    Vue.delete(state.cache, payload)
  }
}

const actions: ActionTree<ImageManagerState, RootState> = {
}

export default {
  state,
  getters,
  mutations,
  actions,
  namespaced: true
} as Module<ImageManagerState, RootState>
