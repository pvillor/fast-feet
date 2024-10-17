import { Module } from '@nestjs/common'
import { AuthenticateController } from './controllers/authenticate.controller'
import { ChangePasswordController } from './controllers/change-password.controller'
import { CreateCourierController } from './controllers/create-courier.controller'
import { FetchCouriersController } from './controllers/fetch-couriers.controller'
import { DatabaseModule } from '../database/database.module'
import { CreateCourierUseCase } from '@/domain/carrier/application/use-cases/create-courier'
import { FetchCouriersUseCase } from '@/domain/carrier/application/use-cases/fetch-couriers'

@Module({
  imports: [DatabaseModule],
  controllers: [
    CreateCourierController,
    AuthenticateController,
    ChangePasswordController,
    FetchCouriersController,
  ],
  providers: [CreateCourierUseCase, FetchCouriersUseCase],
})
export class HttpModule {
  //
}
