import { useRef, type FC } from 'react'
import { Color } from './color'
import { Handler, Transform } from './components'
import { useColorDrag } from './hooks'
import { calculateColor } from './utils'

const Palette: FC<{
  color: Color
  onChange?: (color: Color) => void
}> = ({ color }) => {
  const transformRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const [offset, dragStartHandle] = useColorDrag({
    containerRef,
    targetRef: transformRef,
    onDragChange: (offsetValue) => {
      const newColor = calculateColor({
        offset: offsetValue,
        containerRef,
        targetRef: transformRef,
        color
      })
      onChange?.(newColor)
      console.log(offsetValue)
    }
  })

  return (
    <div
      ref={containerRef}
      className="color-picker-panel-palette"
      onMouseDown={dragStartHandle}
    >
      <Transform
        ref={transformRef}
        offset={{ x: offset.x, y: offset.y }}
      >
        <Handler color={color.toRgbString()} />
      </Transform>
      <div
        className="color-picker-panel-palette-main border "
        style={{
          backgroundColor: `hsl(${color.toHsl().h},100%, 50%)`,
          backgroundImage:
            'linear-gradient(0deg, #000, transparent),linear-gradient(90deg, #fff, hsla(0, 0%, 100%, 0))'
        }}
      />
    </div>
  )
}

export default Palette
