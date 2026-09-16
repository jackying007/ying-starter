import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common'

import {
  listVisitorDto,
  listPushTemplateDto,
  createOrUpdatePushTemplateDto,
  sendPushTemplateDto,
  listPushTaskDto,
  createOrUpdatePushTaskDto,
  listPushRecordDto,
  setPushTaskDto
} from '@ying/shared'
import type {
  ListVisitorDto,
  ListPushTemplateDto,
  CreateOrUpdatePushTemplateDto,
  SendPushTemplateDto,
  ListPushTaskDto,
  CreateOrUpdatePushTaskDto,
  ListPushRecordDto,
  SetPushTaskDto
} from '@ying/shared'
import { pms } from '@ying/shared/permission'

import { AdminScope, PermissionDecorator } from '@/common/decorator'
import {
  VisitorService,
  PushTemplateService,
  PushTaskService,
  PushRecordService,
  NotificationService
} from '@/business/modules/notification'

@AdminScope()
@Controller('admin')
export class NotificationController {
  constructor(
    readonly visitorService: VisitorService,
    readonly pushTemplateService: PushTemplateService,
    readonly pushTaskService: PushTaskService,
    readonly pushRecordService: PushRecordService,
    readonly notificationService: NotificationService
  ) {}

  @PermissionDecorator(pms.notification.visitor)
  @Get('visitor/list')
  listVisitor(@Query({ schema: listVisitorDto }) dto: ListVisitorDto) {
    return this.visitorService.list(dto)
  }

  @PermissionDecorator(pms.notification.visitor)
  @Get('visitor/list-count')
  listVisitorCount(@Query({ schema: listVisitorDto }) dto: ListVisitorDto) {
    return this.visitorService.listCount(dto)
  }

  @PermissionDecorator(pms.notification.visitor.delete)
  @Delete('visitor/:id')
  deleteVisitor(@Param('id') visitorId: string) {
    return this.visitorService.delete({ visitorId })
  }

  @PermissionDecorator(pms.notification.pushTemplate)
  @Get('push-template/list')
  listPushTemplate(@Query({ schema: listPushTemplateDto }) dto: ListPushTemplateDto) {
    return this.pushTemplateService.list(dto)
  }

  @PermissionDecorator(pms.notification.pushTemplate)
  @Get('push-template/list-count')
  listPushTemplateCount(@Query({ schema: listPushTemplateDto }) dto: ListPushTemplateDto) {
    return this.pushTemplateService.listCount(dto)
  }

  @PermissionDecorator(pms.notification.pushTemplate.create)
  @Post('push-template')
  createPushTemplate(@Body({ schema: createOrUpdatePushTemplateDto }) dto: CreateOrUpdatePushTemplateDto) {
    return this.pushTemplateService.createOrUpdate(dto)
  }

  @PermissionDecorator(pms.notification.pushTemplate.update)
  @Put('push-template')
  updatePushTemplate(@Body({ schema: createOrUpdatePushTemplateDto }) dto: CreateOrUpdatePushTemplateDto) {
    return this.pushTemplateService.createOrUpdate(dto)
  }

  @PermissionDecorator(pms.notification.pushTemplate.delete)
  @Delete('push-template/:id')
  deletePushTemplate(@Param('id') id: number) {
    return this.pushTemplateService.delete(id)
  }

  @PermissionDecorator(pms.notification.pushTemplate.send)
  @Post('push-template/send')
  async send(@Body({ schema: sendPushTemplateDto }) dto: SendPushTemplateDto) {
    return this.notificationService.sendNotification(dto)
  }

  @PermissionDecorator(pms.notification.pushTask)
  @Get('push-task/list')
  listPushTask(@Query({ schema: listPushTaskDto }) dto: ListPushTaskDto) {
    return this.pushTaskService.list(dto)
  }

  @PermissionDecorator(pms.notification.pushTask)
  @Get('push-task/list-count')
  listPushTaskCount(@Query({ schema: listPushTaskDto }) dto: ListPushTaskDto) {
    return this.pushTaskService.listCount(dto)
  }

  @PermissionDecorator(pms.notification.pushTask.create)
  @Post('push-task')
  createPushTask(@Body({ schema: createOrUpdatePushTaskDto }) dto: CreateOrUpdatePushTaskDto) {
    return this.pushTaskService.createOrUpdate(dto)
  }

  @PermissionDecorator(pms.notification.pushTask.update)
  @Put('push-task')
  updatePushTask(@Body({ schema: createOrUpdatePushTaskDto }) dto: CreateOrUpdatePushTaskDto) {
    return this.pushTaskService.createOrUpdate(dto)
  }

  @PermissionDecorator(pms.notification.pushTask.delete)
  @Delete('push-task/:id')
  deletePushTask(@Param('id') id: number) {
    return this.pushTaskService.delete(id)
  }

  @PermissionDecorator(pms.notification.pushTask.setUp)
  @Post('push-task/set-up')
  setPushTask(@Body({ schema: setPushTaskDto }) dto: SetPushTaskDto) {
    return this.notificationService.setPuskTask(dto)
  }

  @PermissionDecorator(pms.notification.pushTask.stopTiming)
  @Get('push-task/:id/stop-timing')
  stopTimingPushTask(@Param('id') id: number) {
    return this.notificationService.stopTimingPushTask(id)
  }

  @PermissionDecorator(pms.notification.pushRecord)
  @Get('push-record/list')
  listPushRecord(@Query({ schema: listPushRecordDto }) dto: ListPushRecordDto) {
    return this.pushRecordService.list(dto)
  }

  @PermissionDecorator(pms.notification.pushRecord)
  @Get('push-record/list-count')
  listPushRecordCount(@Query({ schema: listPushRecordDto }) dto: ListPushRecordDto) {
    return this.pushRecordService.listCount(dto)
  }
}
