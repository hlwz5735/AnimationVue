import { ImageFile } from '@/manager/ImageFile'

export interface RootState {
}

export interface ImageManagerState {
  cache: {[key: string]: ImageFile}
}
