import { Controller, Delete, Get, Inject, Param, Query } from '@nestjs/common'

import { ListFeedbackDto } from '@ying/shared'
import { pms } from '@ying/shared/permission'

import { AdminScope, PermissionDecorator } from '@/common/decorator'
import { FileServiceToken, AbstractFileService } from '@/common/modules/storage'
import { FeedbackService } from '@/business/modules/feedback'

@PermissionDecorator(pms.feedback)
@AdminScope()
@Controller('admin/feedback')
export class FeedbackController {
  constructor(
    @Inject(FileServiceToken)
    readonly fileService: AbstractFileService,
    readonly feedbackService: FeedbackService
  ) {}

  @Get('list')
  feedbackList(@Query() dto: ListFeedbackDto) {
    return this.feedbackService.list(dto)
  }

  @Get('list-count')
  feedbackListCount(@Query() dto: ListFeedbackDto) {
    return this.feedbackService.listCount(dto)
  }

  @PermissionDecorator(pms.feedback.delete)
  @Delete(':id')
  deleteFeedback(@Param('id') id: number) {
    return this.feedbackService.delete(id)
  }
}
