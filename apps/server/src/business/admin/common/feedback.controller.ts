import { Controller, Delete, Get, Param, Query } from '@nestjs/common'

import { listFeedbackDto } from '@ying/shared'
import type { ListFeedbackDto } from '@ying/shared'
import { pms } from '@ying/shared/permission'

import { AdminScope, PermissionDecorator } from '@/common/decorator'
import { FeedbackService } from '@/business/modules/feedback'

@PermissionDecorator(pms.feedback)
@AdminScope()
@Controller('admin/feedback')
export class FeedbackController {
  constructor(readonly feedbackService: FeedbackService) {}

  @Get('list')
  feedbackList(@Query({ schema: listFeedbackDto }) dto: ListFeedbackDto) {
    return this.feedbackService.list(dto)
  }

  @Get('list-count')
  feedbackListCount(@Query({ schema: listFeedbackDto }) dto: ListFeedbackDto) {
    return this.feedbackService.listCount(dto)
  }

  @PermissionDecorator(pms.feedback.delete)
  @Delete(':id')
  deleteFeedback(@Param('id') id: number) {
    return this.feedbackService.delete(id)
  }
}
