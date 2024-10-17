import { Module } from '@nestjs/common'
import { AuthenticateController } from './controllers/authenticate.controller'
import { ChangePasswordController } from './controllers/change-password.controller'
import { CreateAccountController } from './controllers/create-account.controller'
import { FetchCouriersController } from './controllers/fetch-couriers.controller'
import { DatabaseModule } from '../database/database.module'

@Module({
  imports: [DatabaseModule],
  controllers: [
    CreateAccountController,
    AuthenticateController,
    ChangePasswordController,
    FetchCouriersController,
  ],
  providers: [],
})
export class HttpModule {
  //
}
