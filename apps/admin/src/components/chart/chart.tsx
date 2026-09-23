import { memo } from 'react'
import ApexChart from 'react-apexcharts'
import type { Props as ApexChartProps } from 'react-apexcharts'

import { useSettings } from '@/store'
import { useThemeToken } from '@/hooks'

import { StyledApexChart } from './styles'

export default memo(function Chart(props: ApexChartProps) {
  const { themeMode } = useSettings()
  const theme = useThemeToken()
  return (
    <StyledApexChart $thememode={themeMode} $theme={theme}>
      <ApexChart {...props} />
    </StyledApexChart>
  )
})
