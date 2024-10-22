import { OrderPhoto } from '@/domain/carrier/enterprise/entities/order-photo'
import { Prisma } from '@prisma/client'

export class PrismaOrderPhotoMapper {
  static toPrisma(photo: OrderPhoto): Prisma.PhotoUncheckedCreateInput {
    return {
      id: photo.id.toString(),
      orderId: photo.orderId.toString(),
      title: photo.title,
      link: photo.url,
    }
  }
}
