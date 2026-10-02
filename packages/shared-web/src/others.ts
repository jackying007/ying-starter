export function copyText(str: string) {
  if (navigator.clipboard) {
    return navigator.clipboard.writeText(str)
  } else {
    return new Promise((reslove, reject) => {
      try {
        const textarea = document.createElement('textarea')
        document.body.appendChild(textarea)
        textarea.style.position = 'fixed'
        textarea.style.clip = 'rect(0 0 0 0)'
        textarea.style.top = '10px'
        textarea.value = str
        textarea.select()
        document.execCommand('copy', true)
        document.body.removeChild(textarea)
        reslove(str)
      } catch (error) {
        reject(error)
      }
    })
  }
}

export function doDownload(url: string, fileName: string) {
  const a = document.createElement('a')
  a.download = fileName
  a.href = url
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
}

export function getScrollbarThickness() {
  const div = document.createElement('div')
  div.style.width = '100px'
  div.style.height = '100px'
  div.style.overflow = 'scroll'
  div.style.position = 'absolute'
  div.style.top = '-9999px'
  document.body.appendChild(div)
  const scrollbarWidth = div.offsetWidth - div.clientWidth
  div.remove()
  return scrollbarWidth
}

export function selectFile(accept?: string, multiple?: false): Promise<File>
export function selectFile(accept?: string, multiple?: true): Promise<File[]>
export function selectFile(accept = '*', multiple = false): Promise<File[] | File> {
  return new Promise((resolve, reject) => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = accept
    input.multiple = multiple
    input.onchange = () => {
      const files = input.files
      if (files) {
        if (files.length > 0) {
          resolve(multiple ? Array.from(files) : files[0]!)
        } else {
          reject(new Error('未选择文件'))
        }
      } else {
        reject(new Error('文件不存在'))
      }
    }
    input.click()
  })
}
