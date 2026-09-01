import { testAPI } from '@/api'
import { BaseHttpError } from '@jying/http'
import { Button } from '@ying/frontend/ui'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/$lang/test')({
  component: RouteComponent
})

function RouteComponent() {
  const { data } = useQuery({
    queryKey: ['test'],
    queryFn: testAPI.gtest
  })

  const fuck = async () => {
    try {
      const a = await testAPI.ptest({
        email: '123@gmail.com',
        password: 'Test.123'
      })
      console.log(a, 'a')
    } catch (error) {
      console.log(error instanceof BaseHttpError)
    }
  }

  return (
    <div>
      data: {data}
      <Button onClick={fuck}>fuck</Button>
    </div>
  )
}
