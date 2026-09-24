import { LuLogOut, LuAlignJustify } from 'react-icons/lu'
import { useTranslation } from 'react-i18next'
import { linkOptions, useLocation, useParams, Link as TanstackLink, useMatches } from '@tanstack/react-router'

import {
  cn,
  buttonVariants,
  Avatar,
  AvatarFallback,
  AvatarImage,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
  Sheet,
  SheetTitle,
  SheetDescription,
  SheetContent,
  SheetTrigger
} from '@ying/shared-react/ui'

import { Link } from '@/components/link'
import { useAuthStore, logout, useHasAuth, useUserAvatar } from '@/store/auth-store'

import { MaxWidthWrapper } from './max-width-wrapper'
import { Brand } from './brand'

export const Navbar = () => {
  const params = useParams({ from: '/$lang' })
  const { pathname } = useLocation()
  const userInfo = useAuthStore(state => state.userInfo)
  const avatar = useUserAvatar()

  const MenuItems = linkOptions([
    {
      name: 'article',
      to: '/$lang/article',
      params
    },
    {
      name: 'feedback',
      to: '/$lang/feedback',
      params
    }
  ])

  const { t } = useTranslation('auth')
  const matches = useMatches()
  const isLanding = matches[matches.length - 1].routeId === '/$lang/'

  const hasAuth = useHasAuth()

  return (
    <div
      className={cn(
        'h-16 border-b sticky top-0 bg-background z-50',
        isLanding && 'bg-transparent backdrop-blur-sm border-b-0'
      )}
    >
      <MaxWidthWrapper className="flex justify-between items-start">
        <div className="h-full flex">
          <Sheet key={pathname}>
            <SheetTrigger>
              <LuAlignJustify className="text-xl mr-2 sm:hidden" />
            </SheetTrigger>
            <SheetContent side="left">
              <SheetTitle />
              <SheetDescription />
              <div className="flex flex-col items-center gap-4 pt-8">
                {MenuItems.map(item => (
                  <Link
                    key={item.to}
                    className="pb-2 border-b-4 border-transparent transition-colors data-[status=active]:border-primary"
                    {...item}
                  >
                    {t(item.name)}
                  </Link>
                ))}
              </div>
            </SheetContent>
          </Sheet>
          <Brand className="mr-4" />
          <div className="hidden sm:flex gap-4">
            {MenuItems.map(item => (
              <Link
                key={item.to}
                className="border-b-4 border-transparent transition-colors data-[status=active]:border-primary"
                {...item}
              >
                {t(item.name)}
              </Link>
            ))}
          </div>
        </div>

        {userInfo && (
          <div className="h-full flex items-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar
                  className="cursor-pointer transition-shadow border-2 border-primary/50 hover:ring-ring/50 hover:ring-1"
                  size="lg"
                >
                  <AvatarImage src={avatar} />
                  <AvatarFallback>User</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>
                  <p className="font-bold">{userInfo.name}</p>
                  <p className="font-bold">{userInfo.email}</p>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <TanstackLink to="/$lang/profile" params={params} replace>
                  <DropdownMenuItem className="cursor-pointer">{t('text.profile')}</DropdownMenuItem>
                </TanstackLink>
                <TanstackLink to="/$lang/reset-password" params={params} replace>
                  <DropdownMenuItem className="cursor-pointer">{t('text.reset_password')}</DropdownMenuItem>
                </TanstackLink>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer" onClick={logout}>
                  {t('text.logout')}
                  <DropdownMenuShortcut>
                    <LuLogOut className="text-lg" />
                  </DropdownMenuShortcut>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
        {!hasAuth && (
          <div className="h-full flex items-center gap-2">
            <Link
              className={buttonVariants({ variant: 'outline' })}
              to="/$lang/auth/login"
              params={params}
              activeProps={{ className: cn(buttonVariants({ variant: 'secondary' })) }}
            >
              {t('text.login')}
            </Link>
            <Link
              className={buttonVariants({ variant: 'outline' })}
              to="/$lang/auth/register"
              params={params}
              activeProps={{ className: cn(buttonVariants({ variant: 'secondary' })) }}
            >
              {t('text.register')}
            </Link>
          </div>
        )}
      </MaxWidthWrapper>
    </div>
  )
}
