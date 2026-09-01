import { type CSSProperties, useMemo, useRef, useState } from 'react'
import { Empty, type GlobalToken, Input, type InputRef, Modal } from 'antd'
import match from 'autosuggest-highlight/match'
import parse from 'autosuggest-highlight/parse'
import Color from 'color'
import styled from 'styled-components'
import { useEvent, useKeyPressEvent, useLatest } from '@ying/frontend/hooks'
import { IconButton, Iconify } from '@/components/icon'
import { Scrollbar } from '@/components/scrollbar'
import { usePermissionRoutes, useRouter } from '@/router/hooks'
import { useThemeToken } from '@/hooks'

export function SearchBar() {
  const { replace } = useRouter()
  const panelRef = useRef<HTMLDivElement>(null as any)
  const inputRef = useRef<InputRef>(null as any)
  const listRef = useRef<HTMLDivElement>(null as any)

  const [open, setOpen] = useState(false)
  const themeToken = useThemeToken()

  const { routeMetas } = usePermissionRoutes()
  const routes = useMemo(
    () => routeMetas.filter(route => !route.disabled && !route.hideMenu && !route.hideTab),
    [routeMetas]
  )

  const [searchQuery, setSearchQuery] = useState('')
  const searchResult = useMemo(
    () =>
      routes.filter(
        item =>
          item.label.toLowerCase().indexOf(searchQuery.toLowerCase()) !== -1 ||
          item.key.toLowerCase().indexOf(searchQuery.toLowerCase()) !== -1
      ),
    [routes, searchQuery]
  )
  const searchResultRef = useLatest(searchResult)

  const [selectedItemIndex, setSelectedItemIndex] = useState(0)
  const selectedItemIndexRef = useLatest(selectedItemIndex)

  const tagStyle: CSSProperties = {
    color: themeToken.colorPrimary,
    backgroundColor: `${Color(themeToken.colorPrimary).alpha(0.2).toString()}`
  }

  const activeStyle: CSSProperties = {
    border: `1px dashed ${themeToken.colorPrimary}`,
    backgroundColor: `${Color(themeToken.colorPrimary).alpha(0.2).toString()}`
  }

  const handleOpen = () => {
    setOpen(true)
    setSearchQuery('')
    setSelectedItemIndex(0)
  }
  const handleCancel = () => {
    setOpen(false)
  }
  const handleAfterOpenChange = (open: boolean) => {
    if (open) inputRef.current?.focus()
  }

  const scrollSelectedItemIntoView = (index: number) => {
    if (listRef.current) {
      const selectedItem = listRef.current.children[index]
      selectedItem.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      })
    }
  }

  const handleSelect = (key: string) => {
    replace(key)
    handleCancel()
  }

  useEvent('keydown', event => {
    if (event.ctrlKey && event.key === 'k') {
      event.preventDefault()
      handleOpen()
    }
  })

  useKeyPressEvent(
    'ArrowUp',
    event => {
      event.preventDefault()
      let nextIndex = selectedItemIndexRef.current - 1
      if (nextIndex < 0) nextIndex = searchResultRef.current.length - 1
      setSelectedItemIndex(nextIndex)
      scrollSelectedItemIntoView(nextIndex)
    },
    { targetRef: panelRef }
  )

  useKeyPressEvent(
    'ArrowDown',
    event => {
      event.preventDefault()
      let nextIndex = selectedItemIndexRef.current + 1
      if (nextIndex > searchResultRef.current.length - 1) nextIndex = 0
      setSelectedItemIndex(nextIndex)
      scrollSelectedItemIntoView(nextIndex)
    },
    { targetRef: panelRef }
  )

  useKeyPressEvent(
    'Enter',
    event => {
      event.preventDefault()
      if (searchResultRef.current.length === 0) return
      const selectItem = searchResultRef.current[selectedItemIndexRef.current]?.key
      if (selectItem) handleSelect(selectItem)
    },
    { targetRef: panelRef }
  )

  return (
    <>
      <div className="flex items-center justify-center gap-x-1">
        <IconButton className="h-10 w-10" onClick={handleOpen}>
          <Iconify icon="akar-icons:search" size={20} />
        </IconButton>
        <div className="rounded-md bg-hover text-xs font-bold p-1 fc">CTRL+K</div>
      </div>
      <Modal
        panelRef={panelRef}
        open={open}
        onCancel={handleCancel}
        closeIcon={false}
        afterOpenChange={handleAfterOpenChange}
        centered
        styles={{
          body: {
            height: '400px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center'
          }
        }}
        title={
          <Input
            ref={inputRef}
            value={searchQuery}
            onChange={e => {
              setSearchQuery(e.target.value)
              setSelectedItemIndex(0)
            }}
            placeholder="搜索..."
            variant="borderless"
            suffix={
              <IconButton className="h-6 rounded-md bg-hover text-xs" onClick={handleCancel}>
                Esc
              </IconButton>
            }
          />
        }
        footer={
          <div className="flex flex-wrap">
            <div className="flex">
              <div className="h-6 rounded-md min-w-6 px-1.5 mx-1.5 fc" style={tagStyle}>
                ↑
              </div>
              <div className="h-6 rounded-md min-w-6 px-1.5 mx-1.5 fc" style={tagStyle}>
                ↓
              </div>
              <span>导航</span>
            </div>
            <div className="flex">
              <div className="h-6 rounded-md min-w-6 px-1.5 mx-1.5 fc" style={tagStyle}>
                ↵
              </div>
              <span>选择</span>
            </div>
            <div className="flex">
              <div className="h-6 rounded-md min-w-6 px-1.5 mx-1.5 fc" style={tagStyle}>
                ESC
              </div>
              <span>关闭</span>
            </div>
          </div>
        }
      >
        {searchResult.length === 0 ? (
          <Empty />
        ) : (
          <Scrollbar>
            <div ref={listRef} className="py-2">
              {searchResult.map(({ key, label }, index) => {
                const partsTitle = parse(label, match(label, searchQuery))
                const partsKey = parse(key, match(key, searchQuery))
                return (
                  <StyledListItemButton
                    key={key}
                    $themetoken={themeToken}
                    style={index === selectedItemIndex ? activeStyle : {}}
                    onClick={() => handleSelect(key)}
                    onMouseMove={() => setSelectedItemIndex(index)}
                  >
                    <div className="flex justify-between">
                      <div>
                        <div className="font-medium">
                          {partsTitle.map(item => (
                            <span
                              key={item.text}
                              style={{
                                color: item.highlight ? themeToken.colorPrimary : themeToken.colorText
                              }}
                            >
                              {item.text}
                            </span>
                          ))}
                        </div>
                        <div className="text-xs">
                          {partsKey.map(item => (
                            <span
                              key={item.text}
                              style={{
                                color: item.highlight ? themeToken.colorPrimary : themeToken.colorTextDescription
                              }}
                            >
                              {item.text}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </StyledListItemButton>
                )
              })}
            </div>
          </Scrollbar>
        )}
      </Modal>
    </>
  )
}

const StyledListItemButton = styled.div<{ $themetoken: GlobalToken }>`
  display: flex;
  flex-direction: column;
  cursor: pointer;
  width: 100%;
  padding: 8px 16px;
  border-radius: 8px;
  border-bottom: ${props => `1px dashed ${props.$themetoken.colorBorder}`};
  color: ${props => `${props.$themetoken.colorTextSecondary}`};
`
