import Vec2 from '@/gengine/types/Vec2'

export default class Rect {
  // eslint-disable-next-line no-useless-constructor
  private constructor(public x = 0, public y = 0, public width: number = 0, public height: number = 0) {}

  static new(x = 0, y = 0, width = 0, height = 0) {
    return new Rect(x, y, width, height)
  }

  equals(other: Rect) {
    return other && (this.x === other.x) && (this.y === other.y) &&
        (this.width === other.width) && (this.height === other.height)
  }

  private _equalsToZero() {
    return (this.x === 0) && (this.y === 0) && (this.width === 0) && (this.height === 0)
  }

  get minX() {
    return this.x
  }

  get minY() {
    return this.y
  }

  get midX() {
    return this.x + this.width / 2
  }

  get midY() {
    return this.y + this.height / 2
  }

  get maxX() {
    return this.x + this.width
  }

  get maxY() {
    return this.y + this.height
  }

  contains(other: Rect) {
    if (!other) {
      return false
    }
    return !((this.x >= other.x) || (this.y >= other.y) ||
        (this.maxX <= other.maxX) || (this.maxY <= other.maxY))
  }

  containsPoint(p: Vec2) {
    return (p.x >= this.minX) && (p.x <= this.maxX) && (p.y >= this.minY) && (p.y <= this.maxY)
  }

  intersects(other: Rect) {
    return !(this.maxX < other.x || other.maxX < this.x || this.maxY < other.y || other.maxY < this.y)
  }

  union(other: Rect) {
    const rect = new Rect()
    rect.x = Math.min(this.x, other.x)
    rect.y = Math.min(this.y, other.y)
    rect.width = Math.max(this.maxX, other.maxX) - rect.x
    rect.height = Math.max(this.maxY, other.maxY) - rect.y
    return rect
  }

  intersection(other: Rect) {
    const intersection = new Rect(
      Math.max(this.minX, other.minX),
      Math.max(this.minY, other.minY),
      0, 0
    )
    intersection.width = Math.min(this.maxX, other.maxX) - intersection.minX
    intersection.height = Math.min(this.maxY, other.maxY) - intersection.minY
    return intersection
  }
}
