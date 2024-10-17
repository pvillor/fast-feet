import { Module } from '@nestjs/common'
import { AuthenticateController } from './controllers/authenticate.controller'
import { ChangePasswordController } from './controllers/change-password.controller'
import { CreateAccountController } from './controllers/create-account.controller'
import { FetchCouriersController } from './controllers/fetch-couriers.controller'
import { PrismaService } from '../prisma/prisma.service'

@Module({
  controllers: [
    CreateAccountController,
    AuthenticateController,
    ChangePasswordController,
    FetchCouriersController,
  ],
  providers: [PrismaService],
})
export class HttpModule {
  //
}
