import dayjs from 'dayjs'
import { get, set } from 'lodash-es'

import { doDownload } from '@ying/frontend/utils'

export function timeDataTransform<T extends object>(data: T, fields: (keyof T)[] | keyof T) {
  if (fields) {
    fields = Array.isArray(fields) ? fields : [fields]
  } else {
    fields = []
  }

  for (const field of fields) {
    const timeData = get(data, field)
    if (timeData) {
      if (Array.isArray(timeData)) {
        set(data, field, [dayjs(timeData[0]).toISOString(), dayjs(timeData[1]).toISOString()])
      } else {
        set(data, field, dayjs(timeData as string).toISOString())
      }
    }
  }

  return data
}

export async function downloadExcel(response: Response) {
  const contentDisposition = response.headers.get('Content-Disposition')
  let fileName = 'excel'
  if (contentDisposition) {
    const fileNameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/)
    if (fileNameMatch && fileNameMatch[1]) {
      const encodedName = fileNameMatch[1].replace(/['"]/g, '')
      try {
        fileName = decodeURIComponent(encodedName)
      } catch (e) {
        console.error('文件名解码失败:', e)
      }
    }
  }
  const url = URL.createObjectURL(await response.blob())
  doDownload(url, fileName)
  URL.revokeObjectURL(url)
}
