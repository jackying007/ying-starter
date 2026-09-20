import {
  Body,
  Controller,
  FileTypeValidator,
  Get,
  Inject,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseInterceptors
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'

import { FileSourceType, FileType } from '@ying/shared'
import { createFeedbackDto, createVisitorDto, noticeSubscribeDto } from '@ying/shared'
import type { CreateFeedbackDto, CreateVisitorDto, NoticeSubscribeDto } from '@ying/shared'

import { ClientScope, Public, UID } from '@/common/decorator'
import { FileServiceToken, AbstractFileService } from '@/common/modules/storage'

import { FeedbackService } from '@/business/modules/feedback'
import { VisitorService } from '@/business/modules/notification'
import { PushRecordService } from '@/business/modules/notification'

@ClientScope()
@Controller('client')
export class CommonController {
  constructor(
    @Inject(FileServiceToken)
    readonly fileService: AbstractFileService,
    readonly feedbackService: FeedbackService,
    readonly visitorService: VisitorService,
    readonly pushRecordService: PushRecordService
  ) {}

  @Post('feedback')
  @Public()
  createFeedback(@Body({ schema: createFeedbackDto }) dto: CreateFeedbackDto) {
    return this.feedbackService.create(dto)
  }

  @Post('file/image')
  @UseInterceptors(FileInterceptor('file'))
  upload(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({
            maxSize: 6 * 1024 * 1024,
            message: 'size must less than 6MB'
          }),
          new FileTypeValidator({ fileType: /^image\// })
        ]
      })
    )
    file: MulterFile,
    @Body() body: { extra: string },
    @UID() userId: number
  ) {
    return this.fileService.uploadFile({
      file,
      fileType: FileType.Image,
      from: FileSourceType.Client,
      userId,
      extra: JSON.parse(body.extra) as object
    })
  }

  @Public()
  @Post('visitor')
  async createVisitor(@Body({ schema: createVisitorDto }) dto: CreateVisitorDto) {
    return this.visitorService.createVisitor(dto)
  }

  @Public()
  @Post('visitor/subscribe')
  async subscribe(@Body({ schema: noticeSubscribeDto }) dto: NoticeSubscribeDto) {
    return this.visitorService.subscribe(dto)
  }

  @Get('visitor/:id/bind')
  async bindUser(@Param('id') id: string, @UID() uid: number) {
    return this.visitorService.bindUser(id, uid)
  }

  @Public()
  @Get('notice/:pushRecordId/click')
  async click(@Param('pushRecordId') pushRecordId: string) {
    return this.pushRecordService.click(pushRecordId)
  }
}
