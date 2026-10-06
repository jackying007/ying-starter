import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/$lang/auth')({
  beforeLoad: ({ context: { auth }, params }) => {
    if (auth.accessToken) {
      throw redirect({
        to: '/$lang',
        params
      })
    }
  },
  component: RouteComponent
})

function RouteComponent() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center">
      <Outlet />
    </div>
  )
}
