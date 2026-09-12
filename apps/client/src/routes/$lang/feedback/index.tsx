import { createFileRoute } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import { classValidatorResolver } from '@hookform/resolvers/class-validator'
import { toast } from 'sonner'
import { useTranslation } from 'react-i18next'

import { CreateFeedbackDto } from '@ying/shared'
import { Card, CardContent, Input, Textarea, Button } from '@ying/frontend/ui'

import { MaxWidthWrapper } from '@/layouts/max-width-wrapper'
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/form'
import FeedbackSVG from '@/svgs/feedback.svg?react'

import { commonAPI, HttpError } from '@/api'

export const Route = createFileRoute('/$lang/feedback/')({
  component: RouteComponent
})

function RouteComponent() {
  const { t } = useTranslation('auth')
  const form = useForm<CreateFeedbackDto>({
    resolver: classValidatorResolver(CreateFeedbackDto),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      content: ''
    }
  })

  const {
    formState: { isSubmitting },
    handleSubmit,
    reset
  } = form

  const disabled = isSubmitting

  const submit = async (values: CreateFeedbackDto) => {
    try {
      await commonAPI.createFeedback(values)
      toast.success(t('submit_success'))
      reset()
    } catch (err) {
      if (err instanceof HttpError) toast.error(t(err.message))
    }
  }

  return (
    <MaxWidthWrapper className="my-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 my-6 items-center">
        <FeedbackSVG className="text-primary w-full h-full" />
        <Card>
          <CardContent>
            <Form className="space-y-2" onSubmit={handleSubmit(submit)} {...form}>
              <div className="flex flex-col lg:flex-row gap-2">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>{t('text.first_name')}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t('text.please_enter_first_name')}
                          disabled={disabled}
                          clearable
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>{t('text.last_name')}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t('text.please_enter_last_name')}
                          disabled={disabled}
                          clearable
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel aria-required>{t('text.email')}</FormLabel>
                    <FormControl>
                      <Input placeholder={t('text.please_enter_email')} disabled={disabled} clearable {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel aria-required>{t('text.content')}</FormLabel>
                    <FormControl>
                      <Textarea placeholder={t('text.please_enter_content')} disabled={disabled} clearable {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end gap-x-2">
                <Button disabled={disabled} loading={isSubmitting} type="submit">
                  {t('text.send')}
                </Button>
              </div>
            </Form>
          </CardContent>
        </Card>
      </div>
    </MaxWidthWrapper>
  )
}
