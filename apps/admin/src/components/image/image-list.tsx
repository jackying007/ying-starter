import { type Dispatch, type SetStateAction, useState } from 'react'
import { Pagination, Spin, Image, Popconfirm, Space, Select, Button, App } from 'antd'
import { EyeFilled, CheckCircleFilled, DeleteOutlined, CloseOutlined } from '@ant-design/icons'
import { Controller } from 'react-hook-form'

import type { ListFileDto } from '@ying/shared'
import type { FileEntity } from '@ying/shared'
import { FileType } from '@ying/shared'
import { cn } from '@ying/frontend/ui'

import { commonApi } from '@/api'
import { useTable } from '@/hooks/use-table'
import { useThemeToken } from '@/hooks'
import { PageQuery } from '@/layouts/page'
import { FileSourceTypeOptions } from '@/constant'
import { UploadImage } from './upload-image'

type ImageListProps = {
  selectedFiles?: FileEntity[]
  setSelectedFiles?: Dispatch<SetStateAction<FileEntity[]>>
  maxLength?: number
}

export const ImageList = ({ selectedFiles, setSelectedFiles, maxLength = 1 }: ImageListProps) => {
  const { message } = App.useApp()
  const token = useThemeToken()

  const { control, resetParams, list, listLoading, pagination, reload } = useTable<ListFileDto, FileEntity>({
    key: 'file-image',
    getList: commonApi.listFile,
    getListCount: commonApi.listFileCount,
    initialPageSize: 30,
    params: {
      type: FileType.Image
    }
  })

  const [previewUrl, setPreviewUrl] = useState('')
  const selectedFileIds = selectedFiles?.map(el => el.id) ?? []

  const onClick = (file: FileEntity) => {
    if (!setSelectedFiles) return
    const index = selectedFileIds.findIndex(id => id === file.id)
    // 选择新图片
    if (index === -1) {
      // 只能选一张图片时直接切换
      if (maxLength === 1) {
        return setSelectedFiles([file])
      }
      if (!selectedFiles) return
      if (selectedFiles.length >= maxLength) {
        return message.warning(`图片最多可选${maxLength}张`)
      }
      setSelectedFiles(prev => [...prev, file])
    } else {
      if (!selectedFiles) return
      setSelectedFiles(selectedFiles.filter((_, i) => i !== index))
    }
  }

  return (
    <>
      <PageQuery control={control} reset={resetParams}>
        <Controller
          name="from"
          control={control}
          render={({ field }) => (
            <Space.Compact>
              <Space.Addon>来源</Space.Addon>
              <Select
                style={{ width: 100 }}
                options={FileSourceTypeOptions}
                placeholder="选择来源"
                allowClear
                {...field}
              />
            </Space.Compact>
          )}
        />
        <Controller
          name="isExternal"
          control={control}
          render={({ field }) => {
            const hasVal = field.value !== undefined
            return (
              <Space.Compact>
                <Space.Addon>是否外部</Space.Addon>
                <Button
                  shape="circle"
                  type={hasVal && field.value ? 'primary' : 'default'}
                  onClick={() => field.onChange(true)}
                >
                  是
                </Button>
                <Button
                  shape="circle"
                  type={hasVal && !field.value ? 'primary' : 'default'}
                  onClick={() => field.onChange(false)}
                >
                  否
                </Button>
                <Button
                  shape="circle"
                  type={!hasVal ? 'primary' : 'default'}
                  icon={<CloseOutlined />}
                  onClick={() => field.onChange(undefined)}
                />
              </Space.Compact>
            )
          }}
        />
      </PageQuery>
      <Spin spinning={listLoading}>
        <div className="flex flex-wrap gap-4 mt-3">
          <UploadImage
            handleUpload={(file, fileInfo) => commonApi.uploadImage(file, fileInfo)}
            onSuccess={reload}
            willSetUrl={false}
          />
          {list?.map(el => {
            const isSelected = selectedFileIds.includes(el.id)
            return (
              <div
                key={el.id}
                className={cn(
                  'relative w-27.5 h-27.5 rounded-md transition-colors duration-300 outline-1 outline-transparent border border-border cursor-pointer overflow-hidden fc bg-hover',
                  isSelected && 'outline-primary border-primary'
                )}
              >
                <Image src={el.url} />
                {isSelected && (
                  <CheckCircleFilled
                    className="absolute left-2 bottom-2 text-base"
                    style={{ color: token.colorPrimary }}
                  />
                )}
                <div
                  className="w-full h-full absolute left-0 top-0 bg-black/20 opacity-0 hover:opacity-100 transition-opacity text-base text-white/90"
                  onClick={() => onClick(el)}
                >
                  <Popconfirm
                    title="确定删除？"
                    okText="确定"
                    cancelText="取消"
                    placement="left"
                    onPopupClick={e => e.stopPropagation()}
                    onConfirm={async () => {
                      await commonApi.deleteFile(el.id)
                      message.success('删除成功！')
                      reload()
                    }}
                  >
                    <DeleteOutlined
                      className=" absolute right-10 top-2 rounded-md p-1 bg-white/40 hover:bg-white/60"
                      onClick={e => e.stopPropagation()}
                    />
                  </Popconfirm>

                  <EyeFilled
                    className=" absolute right-2 top-2 rounded-md p-1 bg-white/40 hover:bg-white/60"
                    onClick={e => {
                      setPreviewUrl(el.url)
                      e.stopPropagation()
                    }}
                  />
                </div>
              </div>
            )
          })}
        </div>
        <div className="flex justify-end mt-4">
          <Pagination size="small" {...pagination} />
        </div>
        {previewUrl && (
          <Image
            style={{ display: 'none' }}
            src={previewUrl}
            preview={{
              open: !!previewUrl,
              onOpenChange: value => {
                if (!value) setPreviewUrl('')
              }
            }}
          />
        )}
      </Spin>
    </>
  )
}
