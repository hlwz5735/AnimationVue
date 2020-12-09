import Color from '@/gengine/types/Color'
import { getClipRect } from '@/gengine/utils/ImageClipUtil'

export function removeBackgroundColor(bitmap: ImageBitmap, bgColor: Color | null = null): HTMLCanvasElement {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')!
  canvas.width = bitmap.width
  canvas.height = bitmap.height

  ctx.drawImage(bitmap, 0, 0)

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
  const pixelArr = imageData.data

  if (bgColor === null) {
    bgColor = new Color()
    Color.fromArray(pixelArr, bgColor)
  }

  for (let i = 0; i < pixelArr.length; i += 4) {
    const color = new Color()
    Color.fromArray(pixelArr, color, i)
    if (color.equals(bgColor)) {
      pixelArr[i] = 0
      pixelArr[i + 1] = 0
      pixelArr[i + 2] = 0
      pixelArr[i + 3] = 0
    }
  }

  ctx.putImageData(imageData, 0, 0)

  return canvas
}

export function clipBitmap(bitmap: ImageBitmap) {
  const clipRect = getClipRect(bitmap)
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')!
  canvas.width = clipRect.width
  canvas.height = clipRect.height
  ctx.drawImage(bitmap, clipRect.x, clipRect.y, clipRect.width, clipRect.height,
    0, 0, clipRect.width, clipRect.height)
  return canvas
}
