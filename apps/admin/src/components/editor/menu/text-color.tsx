import { useState } from 'react'
import { ColorPicker } from 'antd'
import type { Color } from 'antd/es/color-picker'
import { LuSquarePen, LuCircleX, LuPipette } from 'react-icons/lu'
import { useEditorContext, useEditorState, MenuButton } from '@ying/shared-react/editor'

export const MenuTextColor = () => {
  const [color, setColor] = useState<string>('#000000')
  const { editor } = useEditorContext()
  const { focusColor, canTextColor } = useEditorState({
    editor,
    selector: ctx => ({
      focusColor: ctx.editor.getAttributes('textStyle').color,
      canTextColor: ctx.editor.can().chain().setColor('').run() ?? false
    })
  })

  const toggleColor = () => {
    if (focusColor) {
      editor.chain().focus().unsetColor().run()
    } else {
      editor.chain().focus().setColor(color).run()
    }
  }

  const onChangeComplete = (color: Color) => {
    setColor(color.toHexString())
  }

  const getCurrentColor = () => {
    if (focusColor) setColor(focusColor)
  }

  return (
    <div className="flex">
      <MenuButton className="rounded-r-none" disabled={!canTextColor} onClick={toggleColor}>
        {focusColor ? <LuCircleX /> : <LuSquarePen />}
      </MenuButton>
      <MenuButton className="rounded-none border-l-0 border-r-0" disabled={!canTextColor}>
        <ColorPicker
          size="small"
          disabled={!canTextColor}
          allowClear
          value={color}
          onChangeComplete={onChangeComplete}
        />
      </MenuButton>
      <MenuButton className="rounded-l-none" disabled={!canTextColor} onClick={getCurrentColor}>
        <LuPipette />
      </MenuButton>
    </div>
  )
}
