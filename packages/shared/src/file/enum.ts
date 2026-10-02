export enum FileType {
  Image = 'image',
  Video = 'video'
}

export enum FileSourceType {
  Admin = 'admin',
  Client = 'client'
}

export type TFileExtra = {
  size: number
  type: string
  width?: number
  height?: number
}
