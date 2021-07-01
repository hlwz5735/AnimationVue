// eslint-disable-next-line @typescript-eslint/no-empty-interface
import { TextureState } from '@/store/modules/texture-store'
import { SpriteFrameSetState } from '@/store/modules/sprite-frame-set-store'
import { TextureListViewState } from '@/store/modules/texture-list-view-store'

export interface RootState {
  texture: TextureState;
  spriteFrameSet: SpriteFrameSetState;
  textureListView: TextureListViewState;
}
