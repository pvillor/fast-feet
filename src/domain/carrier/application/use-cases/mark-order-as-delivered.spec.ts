import { InMemoryOrdersRepository } from 'test/repositories/in-memory-orders-repository'
import { makeOrder } from 'test/factories/make-order'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'

import { MarkOrderAsDeliveredUseCase } from './mark-order-as-delivered'
import {
  OrderStatus,
  Status,
} from '../../enterprise/entities/value-objects/order-status'
import { InMemoryCouriersRepository } from 'test/repositories/in-memory-couriers-repository'
import { makeCourier } from 'test/factories/make-courier'
import { InMemoryOrderPhotosRepository } from 'test/repositories/in-memory-order-photos-repository'
import { FakeUploader } from 'test/storage/fake-uploader'

let inMemoryOrdersRepository: InMemoryOrdersRepository
let inMemoryCouriersRepository: InMemoryCouriersRepository
let inMemoryOrderPhotosRepository: InMemoryOrderPhotosRepository
let fakeUploader: FakeUploader
let sut: MarkOrderAsDeliveredUseCase

describe('Mark Order As Delivered', () => {
  beforeEach(() => {
    inMemoryOrdersRepository = new InMemoryOrdersRepository()
    inMemoryCouriersRepository = new InMemoryCouriersRepository()
    inMemoryOrderPhotosRepository = new InMemoryOrderPhotosRepository()
    fakeUploader = new FakeUploader()
    sut = new MarkOrderAsDeliveredUseCase(
      inMemoryOrdersRepository,
      inMemoryCouriersRepository,
      inMemoryOrderPhotosRepository,
      fakeUploader,
    )
  })

  it('should be able to mark an order as delivered', async () => {
    const newCourier = await makeCourier({}, new UniqueEntityId('courier-1'))
    const newOrder = makeOrder(
      {
        courierId: new UniqueEntityId('courier-1'),
      },
      new UniqueEntityId('order-1'),
    )

    await inMemoryCouriersRepository.create(newCourier)
    await inMemoryOrdersRepository.create(newOrder)

    const result = await sut.execute({
      orderId: newOrder.id.toString(),
      courierId: newCourier.id.toString(),
      fileName: 'pvillor.png',
      fileType: 'image/png',
      body: Buffer.from(''),
    })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(result.value).toEqual({
        order: expect.objectContaining({
          status: new OrderStatus(Status.Delivered),
        }),
      })
    }
  })
})
