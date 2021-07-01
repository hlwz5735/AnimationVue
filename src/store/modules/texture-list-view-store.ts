import { ActionTree, GetterTree, Module, MutationTree } from 'vuex'
import { TextureType } from '@/gengine/Texture'
import TexturePool from '@/gengine/TexturePool'
import TexturePacker from '@/gengine/utils/TexturePacker'
import { RootState } from '@/store/types'
import { SpriteFrameSet } from '@/gengine/SpriteFrameSet'

const state = {
  /** 纹理属性面板是否折叠 */
  isPropertiesPanelCollapsed: true,
  /** 用于左侧菜单选择的变量，实际只会包含1个元素 */
  currentTextureNames: [] as Array<string>,
  /** 当前的纹理是否需要刷新 */
  isCurrentTextureDirty: false,
  /** 纹理打包器列表 */
  texturePackerMap: new Map<string, TexturePacker>()
}

export type TextureListViewState = typeof state

const getters: GetterTree<TextureListViewState, RootState> = {
  /** 获取当前选择的纹理名称 */
  currentTextureName(state: TextureListViewState): string | null {
    if (state.currentTextureNames.length < 1) {
      return null
    }
    return state.currentTextureNames[0]
  },
  currentSpriteFrameSet(state: TextureListViewState, getters, rootState): SpriteFrameSet | null {
    const currentTextureName = getters.currentTextureName
    if (!currentTextureName) {
      return null
    }
    return rootState.spriteFrameSet.spriteFrameSetMap.get(currentTextureName) || null
  },
  currentTexturePacker(state: TextureListViewState, getters): TexturePacker | null {
    const textureName = getters.currentTextureName
    if (!textureName) {
      return null
    }
    let packer = state.texturePackerMap.get(textureName)
    const currentTexture = TexturePool.get(textureName)
    // 如果没找到 packer 对象，且纹理确实属于精灵帧集合纹理，则创建一个 packer 对象
    if (!packer && currentTexture?.type === TextureType.CANVAS) {
      packer = new TexturePacker(currentTexture)
      state.texturePackerMap.set(textureName, packer)
    }
    return (packer || null)
  }
}

const mutations: MutationTree<TextureListViewState> = {
  setPropertiesPanelCollapsed(state: TextureListViewState, payload: boolean) {
    state.isPropertiesPanelCollapsed = payload
  },
  setCurrentTextureNames(state: TextureListViewState, payload: Array<string>) {
    state.currentTextureNames = payload
  },
  setCurrentTextureDirty(state: TextureListViewState, payload: boolean) {
    state.isCurrentTextureDirty = payload
  }
}

const actions: ActionTree<TextureListViewState, RootState> = {

}

export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters
} as Module<TextureListViewState, RootState>
