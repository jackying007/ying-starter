import { Like, Repository } from 'typeorm'
import { PushRecordEntity, PushTaskEntity, PushRecordStatus, type TaskStatus } from '@ying/shared'
import type { ListPushTaskDto } from '@ying/shared'
import { BaseService } from '@/common/service/base.service'
import { dataSource } from '@/common/modules/db'

export class PushTaskService extends BaseService<PushTaskEntity> {
  private readonly pushRecordRepository: Repository<PushRecordEntity>
  constructor() {
    super(dataSource.getRepository(PushTaskEntity))
    this.pushRecordRepository = dataSource.getRepository(PushRecordEntity)
  }

  detail(id: number) {
    return this.repository.findOne({
      where: { id },
      relations: {
        pushTemplate: true
      }
    })
  }

  buildListQuery(dto: ListPushTaskDto) {
    const listQuery = super.buildListQuery(dto)
    const { name } = dto
    Object.assign(listQuery.where, {
      name: name ? Like(`%${name}%`) : undefined
    })
    return listQuery
  }

  async list(dto: ListPushTaskDto) {
    const { where, take, skip } = this.buildListQuery(dto)

    const pushTasks = await this.repository.find({
      where,
      skip,
      take,
      order: {
        createAt: 'DESC'
      },
      relations: {
        pushTemplate: true
      }
    })

    return Promise.all(
      pushTasks.map(async el => {
        const taskStatus: TaskStatus = {
          success: await this.pushRecordRepository.countBy({
            pushTaskId: el.id,
            status: PushRecordStatus.Success
          }),
          fail: await this.pushRecordRepository.countBy({
            pushTaskId: el.id,
            status: PushRecordStatus.Fail
          }),
          pushing: await this.pushRecordRepository.countBy({
            pushTaskId: el.id,
            status: PushRecordStatus.Pushing
          }),
          click: await this.pushRecordRepository.countBy({
            pushTaskId: el.id,
            clicked: 1
          })
        }
        el.taskStatus = taskStatus
        return el
      })
    )
  }

  listCount(dto: ListPushTaskDto) {
    const { where } = this.buildListQuery(dto)
    return this.repository.countBy(where)
  }
}
