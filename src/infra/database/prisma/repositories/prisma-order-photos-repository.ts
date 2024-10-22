import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { OrderPhoto } from '@/domain/carrier/enterprise/entities/order-photo'
import { OrderPhotosRepository } from '@/domain/carrier/application/repositories/order-photo-repository'
import { PrismaOrderPhotoMapper } from '../mappers/prisma-order-photo-mapper'

@Injectable()
export class PrismaOrderPhotosRepository implements OrderPhotosRepository {
  constructor(private prisma: PrismaService) {
    //
  }

  async create(orderPhoto: OrderPhoto) {
    const data = PrismaOrderPhotoMapper.toPrisma(orderPhoto)

    await this.prisma.photo.create({ data })
  }
}
