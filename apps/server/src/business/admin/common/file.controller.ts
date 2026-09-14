import {
  Body,
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  Inject,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Post,
  Query,
  UploadedFile,
  UseInterceptors
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'

import { FileSourceType, FileType } from '@ying/shared'
import { ListFileDto } from '@ying/shared'
import { pms } from '@ying/shared/permission'

import { AdminScope, PermissionDecorator, UID } from '@/common/decorator'
import { FileServiceToken, AbstractFileService } from '@/common/modules/storage'

@PermissionDecorator(pms.file)
@AdminScope()
@Controller('admin/file')
export class FileController {
  constructor(
    @Inject(FileServiceToken)
    readonly fileService: AbstractFileService
  ) {}

  @Get('list')
  fileList(@Query() dto: ListFileDto) {
    return this.fileService.list(dto)
  }

  @Get('list-count')
  fileListCount(@Query() dto: ListFileDto) {
    return this.fileService.listCount(dto)
  }

  @PermissionDecorator(pms.file.delete)
  @Delete(':id')
  deleteFile(@Param('id') id: number) {
    return this.fileService.deleteFileById(id)
  }

  @PermissionDecorator(pms.file.create)
  @Post('image')
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
      from: FileSourceType.Admin,
      userId,
      extra: JSON.parse(body.extra) as object
    })
  }
}
