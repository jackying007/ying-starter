import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { FeedbackEntity } from '@ying/db-typeorm'

import { FeedbackService } from './feedback.service'

@Module({
  imports: [TypeOrmModule.forFeature([FeedbackEntity])],
  providers: [FeedbackService],
  exports: [FeedbackService]
})
export class FeedbackModule {}
