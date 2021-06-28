import Color from '@/gengine/types/Color'
import Rect from '@/gengine/types/Rect'

export function getClipRect(image: HTMLImageElement | HTMLCanvasElement | ImageBitmap): Rect {
  let canvas: HTMLCanvasElement
  let ctx: CanvasRenderingContext2D
  if (image instanceof HTMLImageElement || image instanceof ImageBitmap) {
    canvas = document.createElement('canvas')
    canvas.width = image.width
    canvas.height = image.height
    ctx = canvas.getContext('2d')!
    ctx.drawImage(image, 0, 0)
  } else {
    canvas = image
    ctx = canvas.getContext('2d')!
  }

  const colorArr = ctx.getImageData(0, 0, canvas.width, canvas.height).data

  const bgColor = new Color()
  Color.fromArray(colorArr, bgColor, 0)

  let minX = canvas.width
  let minY = canvas.height
  let maxX = 0
  let maxY = 0

  for (let x = 0; x < canvas.width; x++) {
    for (let y = 0; y < canvas.height; y++) {
      const color = new Color()
      Color.fromArray(colorArr, color, (y * canvas.width + x) * 4)

      if (!color.equals(bgColor)) {
        if (minX > x) {
          minX = x
        }
        if (maxX < x) {
          maxX = x
        }
        if (minY > y) {
          minY = y
        }
        if (maxY < y) {
          maxY = y
        }
      }
    }
  }
  // 因为下标从0开始，所以应该是结尾像素点位置+1得到宽度
  return Rect.new(minX, minY, maxX - minX + 1, maxY - minY + 1)
}

/**
 * 计算该图像的纹理在目标canvas中的自适应位置
 *
 * @param sourceRect 源纹理的位置矩形
 * @param destWidth 目标宽度
 * @param destHeight 目标高度
 */
export function centerRect(sourceRect: Rect, destWidth: number, destHeight: number): Rect {
  if (sourceRect.width <= destWidth && sourceRect.height <= destHeight) {
    return Rect.new((destWidth - sourceRect.width) / 2, (destHeight - sourceRect.height) / 2,
      sourceRect.width, sourceRect.height)
  } else {
    const widthRatio = destWidth / sourceRect.width
    const heightRatio = destHeight / sourceRect.height

    let x, y, width, height: number
    // 宽大于高，x顶格，y下移居中，宽填满，高按比例缩小
    if (widthRatio < heightRatio) {
      x = 0
      width = destWidth
      height = Math.ceil(sourceRect.height * widthRatio)
      y = (destHeight - height) / 2
    } else {
      y = 0
      width = Math.ceil(sourceRect.width * heightRatio)
      height = destHeight
      x = (destWidth - width) / 2
    }
    return Rect.new(x, y, width, height)
  }
}
