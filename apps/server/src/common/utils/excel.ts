import ExcelJS, { type Buffer as XLSXBuffer } from 'exceljs'

export type XslxData<T> = {
  sheet: string
  columns: Partial<ExcelJS.Column>[]
  rows: T[]
}

export async function parseXLSXDefaultSheet<T extends object>(fileBuffer: Buffer): Promise<T[]> {
  const workbook = new ExcelJS.Workbook()
  await workbook.xlsx.load(fileBuffer as unknown as XLSXBuffer)
  const worksheet = workbook.worksheets[0]

  const data: T[] = []
  const keys: string[] = []
  worksheet.eachRow((row, rowNumber) => {
    const obj = {} as T
    row.eachCell((cell, cellNumber) => {
      if (rowNumber === 1) {
        keys[cellNumber] = cell.value as string
        return
      }
      obj[keys[cellNumber]] = cell.value
    })
    if (rowNumber !== 1) data.push(obj)
  })
  return data
}

export function dataToXLSXDefaultSheetAndGetBuffer<T extends object>(columns: Partial<ExcelJS.Column>[], data: T[]) {
  const workbook = new ExcelJS.Workbook()
  const worksheet = workbook.addWorksheet('Sheet1')

  worksheet.columns = columns
  worksheet.addRows(data)

  return workbook.xlsx.writeBuffer()
}

export function dataToXLSXAndGetBuffer<T extends object>(xslxData: XslxData<T>[]) {
  const workbook = new ExcelJS.Workbook()

  xslxData.forEach(el => {
    const worksheet = workbook.addWorksheet(el.sheet)
    worksheet.columns = el.columns
    worksheet.addRows(el.rows)
  })

  return workbook.xlsx.writeBuffer()
}
