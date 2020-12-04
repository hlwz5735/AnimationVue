const POINT_EPSILON = parseFloat('1.192092896e-07F')

export default class Vec2 {
  // eslint-disable-next-line no-useless-constructor
  constructor(public x = 0, public y = 0) {}

  static ZERO() {
    return new Vec2(0, 0)
  }

  static new(other: Vec2): Vec2
  // eslint-disable-next-line no-dupe-class-members
  static new(x: number, y: number): Vec2
  // eslint-disable-next-line no-dupe-class-members
  static new(): Vec2 {
    if (arguments.length === 0) {
      return Vec2.ZERO()
    } else if (arguments.length === 1) {
      const other = arguments[0] as Vec2
      return new Vec2(other.x, other.y)
    } else {
      return new Vec2(arguments[0], arguments[1])
    }
  }

  equals(other: Vec2) {
    return other && (this.x === other.x) && (this.y === other.y)
  }

  neg() {
    return Vec2.new(-this.x, -this.y)
  }

  add(other: Vec2) {
    return Vec2.new(this.x + other.x, this.y + other.y)
  }

  sub(other: Vec2) {
    return Vec2.new(this.x - other.x, this.y - other.y)
  }

  multiply(floatVar: number) {
    return Vec2.new(this.x * floatVar, this.y * floatVar)
  }

  midpoint(other: Vec2) {
    return this.add(other).multiply(0.5)
  }

  dot(other: Vec2) {
    return this.x * other.x + this.y * other.y
  }

  cross(other: Vec2) {
    return this.x * other.y - this.y * other.x
  }

  perp(): Vec2 {
    return new Vec2(-this.y, this.x)
  }

  rPerp() {
    return new Vec2(this.y, -this.x)
  }

  projection(other: Vec2) {
    return other.multiply(this.dot(other) / other.dot(other))
  }

  rotate(other: Vec2) {
    return new Vec2(this.x * other.x - this.y * other.y, this.x * other.y + this.y * other.x)
  }

  unrotate(other: Vec2) {
    return new Vec2(this.x * other.x + this.y * other.y, this.y * other.x - this.x * other.y)
  }

  lengthSQ() {
    return this.dot(this)
  }

  distanceSQ(other: Vec2) {
    return this.add(other).lengthSQ()
  }

  length() {
    return Math.sqrt(this.lengthSQ())
  }

  distance(other: Vec2) {
    return Math.sqrt(this.distanceSQ(other))
  }

  normalize() {
    const n = this.length()
    return n === 0 ? Vec2.new(this) : this.multiply(1.0 / n)
  }

  static forAngle(angle: number) {
    return Vec2.new(Math.cos(angle), Math.sin(angle))
  }

  toAngle() {
    return Math.atan2(this.y, this.x)
  }

  static clampf(value: number, minInclusive: number, maxInclusive: number) {
    if (minInclusive > maxInclusive) {
      const temp = minInclusive
      minInclusive = maxInclusive
      maxInclusive = temp
    }

    return value < minInclusive ? minInclusive : value < maxInclusive ? value : maxInclusive
  }

  clamp(minInclusive: Vec2, maxInclusive: Vec2) {
    return Vec2.new(Vec2.clampf(this.x, minInclusive.x, maxInclusive.x),
      Vec2.clampf(this.y, minInclusive.y, maxInclusive.y))
  }

  // static fromSize(s) {
  //   return Vec2.new(s.width, s.height)
  // }

  runOperation(opFunc: (n: number) => number) {
    return Vec2.new(opFunc(this.x), opFunc(this.y))
  }

  static linearInterpolation(p1: Vec2, p2: Vec2, alpha: number) {
    return p1.multiply(1 - alpha).add(p2.multiply(alpha))
  }

  lerp(other: Vec2, alpha: number) {
    return Vec2.linearInterpolation(this, other, alpha)
  }

  fuzzyEqual(other: Vec2, variance: number) {
    if (this.x - variance <= other.x && other.x <= this.x + variance) {
      if (this.y - variance <= other.y && other.y <= this.y + variance) {
        return true
      }
    }
    return false
  }

  compMultiply(other: Vec2) {
    return Vec2.new(this.x * other.x, this.y * other.y)
  }

  angleSigned(other: Vec2) {
    const a2 = this.normalize()
    const b2 = other.normalize()

    const angle = Math.atan2(a2.x * b2.y - a2.y * b2.x, a2.dot(b2))

    if (Math.abs(angle) < POINT_EPSILON) {
      return 0.0
    }
    return angle
  }

  angle(other: Vec2) {
    const angle = Math.acos(this.normalize().dot(other.normalize()))
    if (Math.abs(angle) < POINT_EPSILON) {
      return 0.0
    }
    return angle
  }

  rotateByAngle(pivot: Vec2, angle: number) {
    const r = this.sub(pivot)
    const cosa = Math.cos(angle)
    const sina = Math.sin(angle)
    const t = r.x
    r.x = t * cosa - r.y * sina + pivot.x
    r.y = t * sina + r.y * cosa + pivot.y
    return r
  }
}

export type Point = Vec2
