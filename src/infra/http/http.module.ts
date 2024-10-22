import { Module } from '@nestjs/common'
import { AuthenticateController } from './controllers/authenticate.controller'
import { ChangePasswordController } from './controllers/change-password.controller'
import { CreateCourierController } from './controllers/create-courier.controller'
import { FetchCouriersController } from './controllers/fetch-couriers.controller'
import { DatabaseModule } from '../database/database.module'
import { CreateCourierUseCase } from '@/domain/carrier/application/use-cases/create-courier'
import { FetchCouriersUseCase } from '@/domain/carrier/application/use-cases/fetch-couriers'
import { AuthenticateCourierUseCase } from '@/domain/carrier/application/use-cases/authenticate-courier'
import { ChangeCourierPasswordUseCase } from '@/domain/carrier/application/use-cases/change-courier-password'
import { CryptographyModule } from '../cryptography/cryptography.module'
import { FetchOrdersNearbyCourierLocationUseCase } from '@/domain/carrier/application/use-cases/fetch-orders-nearby-courier-location'
import { FetchOrdersNearbyCourierLocationController } from './controllers/fetch-orders-nearby-courier-location.controller'
import { FetchCourierOrdersUseCase } from '@/domain/carrier/application/use-cases/fetch-courier-orders'
import { FetchCourierOrdersController } from './controllers/fetch-courier-orders.controller'
import { DeleteCourierController } from './controllers/delete-courier.controller'
import { DeleteCourierUseCase } from '@/domain/carrier/application/use-cases/delete-courier'
import { EditCourierController } from './controllers/edit-courier.controller'
import { EditCourierUseCase } from '@/domain/carrier/application/use-cases/edit-courier'
import { GetCourierByCpfController } from './controllers/get-courier-by-cpf.controller'
import { GetCourierByCpfUseCase } from '@/domain/carrier/application/use-cases/get-courier-by-cpf'
import { CreateRecipientController } from './controllers/create-recipient.controller'
import { CreateRecipientUseCase } from '@/domain/carrier/application/use-cases/create-recipient'
import { DeleteRecipientController } from './controllers/delete-recipient.controller'
import { DeleteRecipientUseCase } from '@/domain/carrier/application/use-cases/delete-recipient'
import { EditRecipientController } from './controllers/edit-recipient.controller'
import { EditRecipientUseCase } from '@/domain/carrier/application/use-cases/edit-recipient'

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [
    CreateCourierController,
    AuthenticateController,
    ChangePasswordController,
    FetchCouriersController,
    FetchOrdersNearbyCourierLocationController,
    FetchCourierOrdersController,
    DeleteCourierController,
    EditCourierController,
    GetCourierByCpfController,

    CreateRecipientController,
    DeleteRecipientController,
    EditRecipientController,
  ],
  providers: [
    CreateCourierUseCase,
    AuthenticateCourierUseCase,
    ChangeCourierPasswordUseCase,
    FetchCouriersUseCase,
    FetchOrdersNearbyCourierLocationUseCase,
    FetchCourierOrdersUseCase,
    DeleteCourierUseCase,
    EditCourierUseCase,
    GetCourierByCpfUseCase,

    CreateRecipientUseCase,
    DeleteRecipientUseCase,
    EditRecipientUseCase,
  ],
})
export class HttpModule {
  //
}
