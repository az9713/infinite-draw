import {
  DefaultColorStyle,
  HTMLContainer,
  Rectangle2d,
  ShapeUtil,
  T,
  getDefaultColorTheme,
  resizeBox,
  useIsDarkMode,
  type RecordProps,
  type TLBaseShape,
  type TLDefaultColorStyle,
  type TLResizeInfo,
} from 'tldraw'
import { resolveIcon } from '@/icons/lucide-catalog'

export type IconShape = TLBaseShape<
  'icon',
  {
    w: number
    h: number
    name: string
    color: TLDefaultColorStyle
    strokeWidth: number
  }
>

export class IconShapeUtil extends ShapeUtil<IconShape> {
  static override type = 'icon' as const
  static override props: RecordProps<IconShape> = {
    w: T.number,
    h: T.number,
    name: T.string,
    // Using tldraw's enum so the built-in color picker updates this prop live.
    color: DefaultColorStyle,
    strokeWidth: T.number,
  }

  override getDefaultProps(): IconShape['props'] {
    return {
      w: 96,
      h: 96,
      name: 'Sparkles',
      color: 'black',
      strokeWidth: 2,
    }
  }

  override canResize = () => true
  override canEdit = () => false
  override isAspectRatioLocked = () => true

  override getGeometry(shape: IconShape) {
    return new Rectangle2d({
      width: shape.props.w,
      height: shape.props.h,
      isFilled: true,
    })
  }

  override component(shape: IconShape) {
    return <IconShapeComponent shape={shape} />
  }

  override indicator(shape: IconShape) {
    return <rect width={shape.props.w} height={shape.props.h} rx={4} ry={4} />
  }

  override onResize = (shape: IconShape, info: TLResizeInfo<IconShape>) => {
    return resizeBox(shape, info)
  }
}

function IconShapeComponent({ shape }: { shape: IconShape }) {
  const isDarkMode = useIsDarkMode()
  const theme = getDefaultColorTheme({ isDarkMode })
  const LucideComp = resolveIcon(shape.props.name)
  const colorHex = theme[shape.props.color]?.solid ?? theme.black.solid

  return (
    <HTMLContainer
      id={shape.id}
      style={{
        width: shape.props.w,
        height: shape.props.h,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        pointerEvents: 'all',
      }}
    >
      {LucideComp ? (
        <LucideComp
          width="100%"
          height="100%"
          color={colorHex}
          strokeWidth={shape.props.strokeWidth}
          absoluteStrokeWidth
        />
      ) : (
        <div
          style={{
            width: '100%',
            height: '100%',
            border: '2px dashed rgba(255,255,255,0.2)',
            borderRadius: 8,
          }}
        />
      )}
    </HTMLContainer>
  )
}
