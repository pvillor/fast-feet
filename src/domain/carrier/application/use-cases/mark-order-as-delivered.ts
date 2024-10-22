import { Either, left, right } from '@/core/either'
import { Order } from '../../enterprise/entities/order'
import { OrdersRepository } from '../repositories/order-repository'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { CouriersRepository } from '../repositories/courier-repository'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { OrderPhoto } from '../../enterprise/entities/order-photo'
import { Injectable } from '@nestjs/common'
import { InvalidAttachmentTypeError } from './errors/invalid-attachment-type'
import { OrderPhotosRepository } from '../repositories/order-photo-repository'
import { Uploader } from '../storage/uploader'

interface MarkOrderAsDeliveredUseCaseRequest {
  orderId: string
  courierId: string
  fileName: string
  fileType: string
  body: Buffer
}

type MarkOrderAsDeliveredUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    order: Order
  }
>

@Injectable()
export class MarkOrderAsDeliveredUseCase {
  constructor(
    private ordersRepository: OrdersRepository,
    private couriersRepository: CouriersRepository,
    private orderPhotosRepository: OrderPhotosRepository,
    private uploader: Uploader,
  ) {
    //
  }

  async execute({
    orderId,
    courierId,
    fileName,
    fileType,
    body,
  }: MarkOrderAsDeliveredUseCaseRequest): Promise<MarkOrderAsDeliveredUseCaseResponse> {
    const order = await this.ordersRepository.findById(orderId)

    if (!order) {
      return left(new ResourceNotFoundError())
    }

    const courier = await this.couriersRepository.findById(courierId)

    if (!courier) {
      return left(new ResourceNotFoundError())
    }

    if (order.courierId?.toString() !== courierId) {
      return left(new NotAllowedError())
    }
    if (!/^(image\/(jpeg|png))$|^application\/pdf$/.test(fileType)) {
      return left(new InvalidAttachmentTypeError(fileType))
    }

    const { url } = await this.uploader.upload({
      fileName,
      fileType,
      body,
    })

    const photo = OrderPhoto.create({
      title: fileName,
      url,
      orderId: order.id,
    })

    order.deliver(photo.id)

    await this.orderPhotosRepository.create(photo)
    await this.ordersRepository.save(order)

    return right({ order })
  }
}
