import { Button, DatePicker, Space } from 'antd'
import { type Control, Controller, type UseFormReset } from 'react-hook-form'
import dayjs from 'dayjs'

import type { ListDto } from '@ying/shared/dto'

const { RangePicker } = DatePicker

type PageQueryProps = {
  control: Control<ListDto>
  reset: UseFormReset<ListDto>
  children?: React.ReactNode
  extras?: React.ReactNode
  createTimeHide?: boolean
}

export const PageQuery = ({ control, reset, children, extras, createTimeHide }: PageQueryProps) => {
  return (
    <div className="w-full flex flex-wrap gap-2">
      {children}
      {!createTimeHide && (
        <Controller
          name="date"
          control={control}
          render={({ field }) => (
            <Space.Compact>
              <Space.Addon className="whitespace-nowrap">创建时间</Space.Addon>
              <RangePicker
                value={field.value ? [dayjs(field.value[0]), dayjs(field.value[1])] : undefined}
                onChange={date => {
                  if (!date) return field.onChange(undefined)
                  field.onChange([
                    date[0]?.startOf('D').format('YYYY-MM-DD HH:mm:ss'),
                    date[1]?.endOf('D').format('YYYY-MM-DD HH:mm:ss')
                  ])
                }}
              />
            </Space.Compact>
          )}
        />
      )}
      <div className="flex-1 flex justify-end gap-2">
        <Button onClick={() => reset()}>重置</Button>
        {extras}
      </div>
    </div>
  )
}
