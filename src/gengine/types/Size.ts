export default class Size {
  private constructor(public width: number = 0, public height: number = 0) {}

  static new(other: Size): Size
  static new(width: number, height: number): Size
  static new(): Size {
    if (arguments.length === 1) {
      return new Size(arguments[0].width, arguments[0].height)
    } else {
      return new Size(arguments[0], arguments[1])
    }
  }

  equals(other: Size) {
    return other && (this.width === other.width) && (this.height === other.height)
  }
}
