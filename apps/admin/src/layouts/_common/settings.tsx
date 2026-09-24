import { CloseOutlined, LeftOutlined, QuestionCircleOutlined, RightOutlined } from '@ant-design/icons'
import { Button, Card, Drawer, Switch, Tooltip } from 'antd'
import Color from 'color'
import { type CSSProperties, useState } from 'react'
import { MdCircle } from 'react-icons/md'
import { useFullscreen } from '@ying/shared-react/hooks'
import CyanBlur from '@/assets/images/background/cyan-blur.png'
import RedBlur from '@/assets/images/background/red-blur.png'
import { IconButton, Iconify } from '@/components/icon'
import { useSettings, setSettings } from '@/store'
import { colorPresets } from '@/theme/config'
import { useThemeToken } from '@/hooks'
import { ThemeColorPresets, ThemeNavLayout, ThemeMode } from '@/types/enum'

export function Settings() {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const { colorPrimary, colorBgBase, colorTextSecondary, colorTextTertiary, colorBgContainer } = useThemeToken()

  const settings = useSettings()
  const { themeMode, themeColorPresets, themeLayout, themeStretch, breadCrumb, multiTab } = settings

  const setThemeMode = (themeMode: ThemeMode) => {
    setSettings({
      ...settings,
      themeMode
    })
  }

  const setThemeColorPresets = (themeColorPresets: ThemeColorPresets) => {
    setSettings({
      ...settings,
      themeColorPresets
    })
  }

  const setThemeLayout = (themeLayout: ThemeNavLayout) => {
    setSettings({
      ...settings,
      themeLayout
    })
  }

  const setThemeStretch = (themeStretch: boolean) => {
    setSettings({
      ...settings,
      themeStretch
    })
  }

  const setBreadCrumn = (checked: boolean) => {
    setSettings({
      ...settings,
      breadCrumb: checked
    })
  }

  const setMultiTab = (checked: boolean) => {
    setSettings({
      ...settings,
      multiTab: checked
    })
  }

  const style: CSSProperties = {
    backdropFilter: 'blur(20px)',
    backgroundImage: `url("${CyanBlur}"), url("${RedBlur}")`,
    backgroundRepeat: 'no-repeat, no-repeat',
    backgroundColor: Color(colorBgContainer).alpha(0.9).toString(),
    backgroundPosition: 'right top, left bottom',
    backgroundSize: '50, 50%'
  }

  const layoutBackground = (layout: ThemeNavLayout) =>
    themeLayout === layout ? `linear-gradient(135deg, ${colorBgBase} 0%, ${colorPrimary} 100%)` : '#919eab'

  const { isFullscreen, toggleFullscreen } = useFullscreen()

  return (
    <>
      <IconButton className="h-10 w-10 animate-spin-slow" onClick={() => setDrawerOpen(true)}>
        <Iconify icon="solar:settings-bold-duotone" size="24" />
      </IconButton>
      <Drawer
        placement="right"
        title="设置"
        onClose={() => setDrawerOpen(false)}
        open={drawerOpen}
        closable={false}
        size={280}
        style={style}
        styles={{ body: { padding: 0 }, mask: { background: 'transparent' } }}
        extra={
          <IconButton onClick={() => setDrawerOpen(false)} className="h-9 w-9 hover:scale-105">
            <CloseOutlined />
          </IconButton>
        }
        footer={
          <Button type="dashed" block size="large" onClick={toggleFullscreen}>
            <div className="flex items-center justify-center">
              {isFullscreen ? (
                <>
                  <Iconify icon="solar:quit-full-screen-bold-duotone" />
                  <span className="ml-2">退出全屏</span>
                </>
              ) : (
                <>
                  <Iconify icon="solar:full-screen-bold-duotone" />
                  <span className="ml-2 text-gray">进入全屏</span>
                </>
              )}
            </div>
          </Button>
        }
      >
        <div className="flex flex-col gap-6 p-6">
          {/* theme mode */}
          <div>
            <div className="mb-3 text-base font-semibold" style={{ color: colorTextSecondary }}>
              主题
            </div>
            <div className="flex flex-row gap-4">
              <Card
                onClick={() => setThemeMode(ThemeMode.Light)}
                className="flex h-20 w-full cursor-pointer items-center justify-center"
              >
                <Iconify
                  icon="solar:sun-2-bold-duotone"
                  size="24"
                  color={themeMode === ThemeMode.Light ? colorPrimary : ''}
                />
              </Card>
              <Card
                onClick={() => setThemeMode(ThemeMode.Dark)}
                className="flex h-20 w-full cursor-pointer items-center justify-center"
              >
                <Iconify
                  icon="solar:cloudy-moon-bold-duotone"
                  size="24"
                  color={themeMode === ThemeMode.Dark ? colorPrimary : ''}
                />
              </Card>
            </div>
          </div>

          {/* theme layout */}
          <div>
            <div className="mb-3 text-base font-semibold" style={{ color: colorTextSecondary }}>
              布局
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Card
                onClick={() => setThemeLayout(ThemeNavLayout.Vertical)}
                className="h-20 cursor-pointer"
                style={{ flexGrow: 1, flexShrink: 0 }}
                styles={{
                  body: {
                    padding: 0,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100%'
                  }
                }}
              >
                <div className="flex h-full w-7 shrink-0 flex-col gap-1 p-1">
                  <div
                    className="h-2 w-2 shrink-0 rounded"
                    style={{
                      background: layoutBackground(ThemeNavLayout.Vertical)
                    }}
                  />
                  <div
                    className="h-1 w-full shrink-0 rounded opacity-50"
                    style={{
                      background: layoutBackground(ThemeNavLayout.Vertical)
                    }}
                  />
                  <div
                    className="h-1 max-w-3 shrink-0 rounded opacity-20"
                    style={{
                      background: layoutBackground(ThemeNavLayout.Vertical)
                    }}
                  />
                </div>
                <div className="h-full w-full flex-1 grow p-1">
                  <div
                    className="h-full w-full rounded opacity-20"
                    style={{
                      background: layoutBackground(ThemeNavLayout.Vertical)
                    }}
                  />
                </div>
              </Card>
              <Card
                onClick={() => setThemeLayout(ThemeNavLayout.Horizontal)}
                className="h-20 cursor-pointer"
                style={{ flexGrow: 1, flexShrink: 0 }}
                styles={{
                  body: {
                    padding: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100%'
                  }
                }}
              >
                <div className="flex h-4 w-full items-center gap-1  p-1">
                  <div
                    className="h-2 w-2 shrink-0 rounded"
                    style={{
                      background: layoutBackground(ThemeNavLayout.Horizontal)
                    }}
                  />
                  <div
                    className="h-1 w-4 shrink-0 rounded opacity-50"
                    style={{
                      background: layoutBackground(ThemeNavLayout.Horizontal)
                    }}
                  />
                  <div
                    className="h-1 w-3 shrink-0 rounded opacity-20"
                    style={{
                      background: layoutBackground(ThemeNavLayout.Horizontal)
                    }}
                  />
                </div>
                <div className="h-full w-full flex-1 grow p-1">
                  <div
                    className="h-full w-full rounded opacity-20"
                    style={{
                      background: layoutBackground(ThemeNavLayout.Horizontal)
                    }}
                  />
                </div>
              </Card>
            </div>
          </div>

          {/* theme stretch */}
          <div>
            <div className="mb-3 text-base font-semibold" style={{ color: colorTextSecondary }}>
              <span className="mr-2">页面拉伸</span>
              <Tooltip title="仅适用于页面大于 1600 像素 (xl)">
                <QuestionCircleOutlined />
              </Tooltip>
            </div>

            <Card
              onClick={() => setThemeStretch(!themeStretch)}
              className="flex h-20 w-full cursor-pointer items-center justify-center"
              styles={{
                body: {
                  width: '50%',
                  padding: 0,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center'
                }
              }}
            >
              {themeStretch ? (
                <div
                  className="flex w-full items-center justify-between"
                  style={{
                    color: colorPrimary,
                    transition: 'width 300ms 0ms'
                  }}
                >
                  <LeftOutlined />
                  <div className="flex grow border-b border-dashed" />
                  <RightOutlined />
                </div>
              ) : (
                <div
                  className="flex w-1/2 items-center justify-between"
                  style={{
                    transition: 'width 300ms 0ms'
                  }}
                >
                  <RightOutlined />
                  <div className="grow border-b border-dashed" />
                  <LeftOutlined />
                </div>
              )}
            </Card>
          </div>

          {/* theme presets */}
          <div>
            <div className="mb-3 text-base font-semibold" style={{ color: colorTextSecondary }}>
              预设
            </div>
            <div className="grid grid-cols-3 gap-x-4 gap-y-3">
              {Object.entries(colorPresets).map(([preset, color]) => (
                <Card
                  key={preset}
                  className="flex h-14 w-full cursor-pointer items-center justify-center"
                  style={{
                    backgroundColor: themeColorPresets === preset ? `${color}14` : ''
                  }}
                  onClick={() => setThemeColorPresets(preset as ThemeColorPresets)}
                >
                  <div style={{ color }}>
                    <MdCircle
                      style={{
                        fontSize: themeColorPresets === preset ? 24 : 12
                      }}
                    />
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Page config */}
          <div>
            <div className="mb-3 text-base font-semibold" style={{ color: colorTextSecondary }}>
              页面
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between" style={{ color: colorTextTertiary }}>
                <div>面包屑</div>
                <Switch size="small" checked={breadCrumb} onChange={checked => setBreadCrumn(checked)} />
              </div>
              <div className="flex items-center justify-between" style={{ color: colorTextTertiary }}>
                <div>多标签页缓存</div>
                <Switch size="small" checked={multiTab} onChange={checked => setMultiTab(checked)} />
              </div>
            </div>
          </div>
        </div>
      </Drawer>
    </>
  )
}
