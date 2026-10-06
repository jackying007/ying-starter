import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'

import { CardWrapper } from './-components/card-wrapper'

export const Route = createFileRoute('/$lang/_protected')({
  beforeLoad: ({ context: { auth }, params }) => {
    if (!auth.accessToken) {
      throw redirect({
        to: '/$lang/auth/login',
        params
      })
    }
  },
  component: RouteComponent
})

function RouteComponent() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center">
      <CardWrapper>
        <Outlet />
      </CardWrapper>
    </div>
  )
}
