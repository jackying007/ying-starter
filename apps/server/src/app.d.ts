type AuthVariables = {
  userId: number
}

type UploadVariables = {
  uploadedFile: File
  uploadBody: {
    [x: string]: string | File
  }
}
