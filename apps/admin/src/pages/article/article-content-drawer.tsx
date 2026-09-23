import { useEffect, useMemo, useRef, useState } from 'react'
import { App, Drawer, Button, Space } from 'antd'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery } from '@tanstack/react-query'
import { uniqueBy } from '@ying/utils'
import { clientLanguagesConfig, type LngKeys } from '@ying/shared'
import { updateArticleContentDto, type UpdateArticleContentDto } from '@ying/shared'
import { useDialogOpen } from '@ying/frontend/hooks'
import {
  editorEmitter,
  generateJSON,
  defaultExtensions,
  findNodes,
  type LazyImageAttr,
  type LazyImageListAttr
} from '@ying/frontend/editor'
import type { FileVo } from '@ying/server/types-admin'
import { type EditorHandle, FullScreenEditor } from '@/components/editor'
import { IntlSwitch } from '@/components/intl'
import { articleApi } from '@/api'
import { useThemeToken } from '@/hooks'

const { fallbackLng } = clientLanguagesConfig

type ArticleContentDrawerProps = ReturnType<typeof useDialogOpen<number>> & {
  onSuccess?: VoidFunction
}

export function ArticleContentDrawer({ open, formValue, onSuccess, onClose }: ArticleContentDrawerProps) {
  const title = `编辑文章内容`
  const { message } = App.useApp()
  const { colorBgLayout, colorBgContainer } = useThemeToken()
  const {
    handleSubmit,
    formState: { isDirty, isSubmitting },
    reset,
    getValues,
    setValue
  } = useForm({
    resolver: zodResolver(updateArticleContentDto)
  })

  const { data: article, isFetching: loading } = useQuery({
    queryKey: ['article-detail', formValue],
    queryFn: () => articleApi.detail(formValue!),
    enabled: !!formValue,
    refetchOnWindowFocus: false
  })

  const [newAssociatedFiles, setNewAssociatedFiles] = useState<FileVo[]>()
  const associatedFiles = useMemo(
    () => uniqueBy([...(article?.associatedFiles ?? []), ...(newAssociatedFiles ?? [])], 'id'),
    [article, newAssociatedFiles]
  )

  useEffect(() => {
    if (article) {
      reset({
        id: article.id,
        content: article.content,
        associatedFileIds: article.associatedFiles?.map(el => el.id)
      })
    } else {
      reset({})
    }
  }, [article, reset])

  useEffect(() => {
    function onAddNewAssociatedFiles(files: FileVo[]) {
      setNewAssociatedFiles(files)
    }
    editorEmitter.on('add-associated-files', onAddNewAssociatedFiles)
    return () => editorEmitter.off('add-associated-files', onAddNewAssociatedFiles)
  }, [])

  const processingAssociatedFileIds = () => {
    const { content } = getValues()
    if (!content) return

    const fileIdSet = new Set<number>()
    Object.values(content).forEach(value => {
      if (!value) return
      const json = generateJSON(value, defaultExtensions)
      const nodes = findNodes(json, ['lazyImage', 'lazyImageList'])
      nodes.forEach(el => {
        if (el.type === 'lazyImage') {
          const { id } = el.attrs as LazyImageAttr
          fileIdSet.add(id)
        } else if (el.type === 'lazyImageList') {
          const { ids } = el.attrs as LazyImageListAttr
          ids.forEach(id => fileIdSet.add(id))
        }
      })
    })
    const fileIds = [...fileIdSet]

    setValue('associatedFileIds', fileIds)
  }
  const handlePost = async (value: UpdateArticleContentDto) => {
    await articleApi.updateContent(value)
    message.success(`${title}成功`)
    onSuccess?.()
    onClose()
  }
  const submit = handleSubmit(handlePost)
  const comfirm = () => {
    processingAssociatedFileIds()
    submit()
  }

  const editorRef = useRef<EditorHandle>(null)
  const [currentLng, setCurrentLng] = useState<LngKeys>(fallbackLng)
  const onChangeLng = (val: LngKeys) => {
    if (!editorRef.current) return
    const { content } = getValues()
    const targetContent = content?.[val]
    if (targetContent) editorRef.current.setContent(targetContent)
    else editorRef.current.setContent('')
    setCurrentLng(val)
  }

  return (
    <Drawer
      title={title}
      open={open}
      closeIcon={null}
      onClose={onClose}
      loading={loading}
      size="100%"
      placement="top"
      styles={{
        body: {
          padding: 12,
          background: colorBgLayout
        }
      }}
      extra={
        <Space>
          <Button onClick={onClose}>取消</Button>
          <Button type="primary" disabled={!isDirty} loading={isSubmitting} onClick={comfirm}>
            确认
          </Button>
        </Space>
      }
    >
      <FullScreenEditor
        ref={editorRef}
        key={article?.id}
        defaultValue={article?.content?.[currentLng]}
        onChange={val => setValue(`content.${currentLng}`, val, { shouldDirty: true })}
        associatedFiles={associatedFiles}
        emitter={editorEmitter}
        rightToolExtra={
          <div
            className="rounded-md shadow-xs p-2 flex flex-col items-center gap-1"
            style={{
              background: colorBgContainer
            }}
          >
            <div>语言</div>
            <IntlSwitch className="gap-y-0!" vertical optionType="default" value={currentLng} onChange={onChangeLng} />
          </div>
        }
      />
    </Drawer>
  )
}
