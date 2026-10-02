import { useState } from 'react'
import { ColorPicker } from 'antd'
import type { Color } from 'antd/es/color-picker'
import { FaFillDrip } from 'react-icons/fa'
import { LuCircleX, LuPipette } from 'react-icons/lu'
import { useEditorContext, useEditorState, MenuButton } from '@ying/shared-react/editor'

export const MenuBgColor = () => {
  const [color, setColor] = useState<string>('#000000')

  const { editor } = useEditorContext()
  const { focusColor, canBgColor } = useEditorState({
    editor,
    selector: ctx => ({
      focusColor: ctx.editor.getAttributes('textStyle').backgroundColor,
      canBgColor: ctx.editor.can().chain().setBackgroundColor('').run() ?? false
    })
  })

  const toggleColor = () => {
    if (focusColor) {
      editor.chain().focus().unsetBackgroundColor().run()
    } else {
      editor.chain().focus().setBackgroundColor(color).run()
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
      <MenuButton className="rounded-r-none" disabled={!canBgColor} onClick={toggleColor}>
        {focusColor ? <LuCircleX /> : <FaFillDrip />}
      </MenuButton>
      <MenuButton className="rounded-none border-l-0 border-r-0" disabled={!canBgColor}>
        <ColorPicker size="small" disabled={!canBgColor} allowClear value={color} onChangeComplete={onChangeComplete} />
      </MenuButton>
      <MenuButton className="rounded-l-none" disabled={!canBgColor} onClick={getCurrentColor}>
        <LuPipette />
      </MenuButton>
    </div>
  )
}
