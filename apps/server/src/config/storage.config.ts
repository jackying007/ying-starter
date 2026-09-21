export const storageConfig = (() => {
  if (!process.env.STORAGE_MODE) {
    throw new Error('STORAGE_MODE is not exist')
  }
  if (process.env.STORAGE_MODE !== 'local' && process.env.STORAGE_MODE !== 'minio') {
    throw new Error('STORAGE_MODE must be local or minio')
  }
  if (process.env.STORAGE_MODE === 'minio') {
    if (!process.env.MINIO_HOST) {
      throw new Error('MINIO_HOST is not exist')
    }
    if (!process.env.MINIO_BUCKET) {
      throw new Error('MINIO_BUCKET is not exist')
    }
    if (!process.env.MINIO_ACCESS_KEY) {
      throw new Error('MINIO_ACCESS_KEY is not exist')
    }
    if (!process.env.MINIO_SECRET_KEY) {
      throw new Error('MINIO_SECRET_KEY is not exist')
    }
  }

  return {
    mode: process.env.STORAGE_MODE as 'local' | 'minio',
    host: process.env.MINIO_HOST ?? '',
    port: process.env.MINIO_PORT ? +process.env.MINIO_PORT : undefined,
    bucket: process.env.MINIO_BUCKET ?? '',
    accessKey: process.env.MINIO_ACCESS_KEY ?? '',
    secretKey: process.env.MINIO_SECRET_KEY ?? ''
  }
})()
