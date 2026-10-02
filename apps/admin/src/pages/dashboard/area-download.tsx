import { Card, Select } from 'antd'
import { useState } from 'react'
import type { Props } from 'react-apexcharts'

import Chart from '@/components/chart/chart'
import useChart from '@/components/chart/useChart'

export default function AreaDownload() {
  const [year, setYear] = useState('2023')
  const series: Record<string, Props['series']> = {
    '2022': [
      { name: 'China', data: [10, 41, 35, 51, 49, 61, 69, 91, 148, 35, 51] },
      { name: 'America', data: [10, 34, 13, 56, 77, 88, 99, 45, 13, 56, 77] }
    ],
    '2023': [
      { name: 'China', data: [51, 35, 41, 10, 91, 69, 62, 148, 91, 35, 51] },
      { name: 'America', data: [56, 13, 34, 10, 77, 99, 88, 45, 13, 56, 77] }
    ]
  }
  return (
    <Card
      className="flex-col"
      title="Area Installed"
      extra={
        <Select
          size="small"
          defaultValue={year}
          onChange={value => setYear(value)}
          options={[
            { value: 2023, label: '2023' },
            { value: 2022, label: '2022' }
          ]}
        />
      }
      bordered={false}
      type="inner"
    >
      <ChartArea series={series[year]} />
    </Card>
  )
}

function ChartArea({ series }: { series: Props['series'] }) {
  const chartOptions = useChart({
    xaxis: {
      type: 'category',
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jut', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    },
    tooltip: {}
  })

  return <Chart type="area" series={series} options={chartOptions} height={300} />
}
