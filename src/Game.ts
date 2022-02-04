export type Position = [number, number]
export type PositionObserver = ((position: Position) => void) | null

export type NullablePosition = [number, number] | null
export type NullablePositionObserver = ((position: NullablePosition) => void) | null

export class Game {
  public knightPosition: Position = [1, 7]
  public cursorPosition: NullablePosition = null
  private observers: PositionObserver[] = []
  private cursorObservers: NullablePositionObserver[] = []

  public observe(o: PositionObserver): () => void {
    this.observers.push(o)
    this.emitChange()

    return (): void => {
      this.observers = this.observers.filter((t) => t !== o)
    }
  }

  public observeCursor(o: NullablePositionObserver): () => void {
    this.cursorObservers.push(o)
    this.emitCursorChange()

    return (): void => {
      this.cursorObservers = this.cursorObservers.filter((t) => t !== o)
    }
  }

  public moveKnight(toX: number, toY: number): void {
    this.knightPosition = [toX, toY]
    this.emitChange()
  }

  public canMoveKnight(toX: number, toY: number): boolean {
    const [x, y] = this.knightPosition
    const dx = toX - x
    const dy = toY - y

    return (
      (Math.abs(dx) === 2 && Math.abs(dy) === 1) ||
      (Math.abs(dx) === 1 && Math.abs(dy) === 2)
    )
  }

  public setCursorPosition(pos: NullablePosition): void {
    this.cursorPosition = pos
    this.emitCursorChange()
  }

  private emitChange() {
    const pos = this.knightPosition
    this.observers.forEach((o) => o && o(pos))
  }

  private emitCursorChange() {
    const pos = this.cursorPosition
    this.cursorObservers.forEach((o) => o && o(pos))
  }
}
