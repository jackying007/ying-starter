import { Drawer } from 'antd'
import { useDialogOpen } from '@ying/shared-react/hooks'
import { IconButton, Iconify } from '@/components/icon'
import { useThemeToken } from '@/hooks'
import { NavVertical } from './nav-vertical'

export function NavDrawer() {
  const { colorBgLayout } = useThemeToken()
  const drawerProps = useDialogOpen()

  return (
    <>
      <IconButton onClick={() => drawerProps.onOpen(true)} className="h-10 w-10 md:hidden">
        <Iconify icon="duo-icons:menu" size={24} />
      </IconButton>
      <Drawer
        placement="left"
        size="auto"
        styles={{
          header: { display: 'none' },
          body: { padding: 0, overflow: 'hidden', background: colorBgLayout }
        }}
        closeIcon={false}
        {...drawerProps}
      >
        <NavVertical show onMenuClick={() => drawerProps.onClose()} />
      </Drawer>
    </>
  )
}
