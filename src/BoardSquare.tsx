import { FC, ReactNode, useState } from 'react'
import { useDrop } from 'react-dnd'
import { Square } from './Square'
import { ItemTypes } from './ItemTypes'
import { Overlay, OverlayType } from './Overlay'
import { Game, NullablePosition } from './Game'
export interface BoardSquareProps {
  x: number
  y: number
  isHighlighted: boolean
  isOver: boolean
  children?: ReactNode
  game: Game
}

export const BoardSquare: FC<BoardSquareProps> = ({
  x,
  y,
  isOver,
  isHighlighted,
  children,
  game
}: BoardSquareProps) => {
  const [ canDrop, setCanDrop ] = useState<boolean>(false);

  const [_, drop] = useDrop(
    () => ({
      accept: ItemTypes.KNIGHT,
      canDrop: () => game.canMoveKnight(x, y),
      drop: () => game.moveKnight(x, y),
      collect: (monitor) => {

        if (canDrop !== !!monitor.canDrop()) {        
          setCanDrop(!!monitor.canDrop());
        }

        const isDragging = (monitor as any).internalMonitor.isDragging();

        if (isOver && !isDragging) {
          console.log(`setting cursor position to null from ${x}_${y}`);
          game.setCursorPosition(null);
        } else if (!!monitor.isOver() && !isOver && isDragging) {
          console.log(`setting cursor position to ${x}_${y} from ${x}_${y}`);
          game.setCursorPosition([x,y]);
        }

        
      },
    }),
    [game, canDrop, isOver],
  )

  if (x===1 && y===1) {
    // console.log(`Redrawing ${x} ${y}. Cursor position is ${cursorPosition?.[0]} ${cursorPosition?.[1]}`)
    console.log(`Redrawing ${x} ${y}. isOver ${isOver}`)
  }

  const black = (x + y) % 2 === 1

  return (
    <div
      ref={drop}
      role="Space"
      data-testid={`(${x},${y})`}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
      }}
    >
      <Square black={black}>{children}</Square>
      {isOver && !canDrop && <Overlay type={OverlayType.IllegalMoveHover} />}
      {!isOver && canDrop && <Overlay type={OverlayType.PossibleMove} />}
      {isOver && canDrop && <Overlay type={OverlayType.LegalMoveHover} />}
      {isHighlighted && <Overlay type={OverlayType.Highlighted} />}
    </div>
  )
}
