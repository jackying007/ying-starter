import { useState } from 'react'
import { Card, DatePicker, Spin, Select, Space } from 'antd'
import type { Props } from 'react-apexcharts'

import dayjs from 'dayjs'
import { useQuery } from '@tanstack/react-query'

import { userApi } from '@/api'
import Chart from '@/components/chart/chart'
import useChart from '@/components/chart/useChart'

import { FORMAT_STR, RangePresets } from './constant'

const { RangePicker } = DatePicker

export function UserTrend() {
  const [type, setType] = useState<'hour' | 'day'>('day')

  const [date, setDate] = useState(dayjs())

  const [dateRange, setDateRange] = useState(RangePresets[2].value)

  const { data, isFetching: loading } = useQuery({
    queryKey: ['user-growth-trend', type, date, dateRange],
    queryFn: () => {
      if (!dateRange[0] || !dateRange[1]) return
      return userApi.getUserGrowthTrend({
        type,
        date:
          type === 'hour'
            ? [date.startOf('D').format(FORMAT_STR), date.endOf('D').format(FORMAT_STR)]
            : [dateRange[0].format(FORMAT_STR), dateRange[1].format(FORMAT_STR)]
      })
    },
    staleTime: 10 * 1000
  })

  const series: Props['series'] = data?.types || []
  const chartOptions = useChart({
    xaxis: {
      type: 'category',
      categories: data?.categories || []
    }
  })

  return (
    <Card
      title="注册用户增长趋势"
      variant="borderless"
      type="inner"
      styles={{ body: { padding: '10px', paddingBottom: 0 } }}
      extra={
        <Space>
          {type === 'hour' ? (
            <DatePicker
              allowClear={false}
              value={date}
              onChange={date => {
                if (!date) return
                setDate(date)
              }}
            />
          ) : (
            <RangePicker
              allowClear={false}
              presets={RangePresets}
              value={dateRange}
              onChange={dates => {
                if (!dates) return
                setDateRange(dates)
              }}
            />
          )}
          <Select
            style={{ width: 100 }}
            options={[
              { value: 'hour', label: '每小时' },
              { value: 'day', label: '每天' }
            ]}
            value={type}
            onChange={value => {
              setType(value)
            }}
          />
        </Space>
      }
    >
      <Spin spinning={loading}>
        <Chart type="area" series={series} options={chartOptions} height={400} />
      </Spin>
    </Card>
  )
}
