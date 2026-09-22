type AuthVariables = {
  userId: number
}

type UploadVariables = {
  uploadedFile: File
  uploadBody: {
    [x: string]: string | File
  }
}

type HcJsonRes<T extends (...args: any[]) => any> = Awaited<ReturnType<Awaited<ReturnType<T>>['json']>>
