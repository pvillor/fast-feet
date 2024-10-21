import {
  FindManyNearbyParams,
  RecipientsRepository,
} from '@/domain/carrier/application/repositories/recipient-repository'
import { Recipient } from '@/domain/carrier/enterprise/entities/recipient'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { PrismaRecipientMapper } from '../mappers/prisma-recipient-mapper'

@Injectable()
export class PrismaRecipientsRepository implements RecipientsRepository {
  constructor(private prisma: PrismaService) {
    //
  }

  async findById(id: string) {
    const recipient = await this.prisma.recipient.findUnique({
      where: {
        id,
      },
    })

    if (!recipient) {
      return null
    }

    return PrismaRecipientMapper.toDomain(recipient)
  }

  async findManyNearby({ latitude, longitude }: FindManyNearbyParams) {
    const recipients = await this.prisma.$queryRaw<Recipient[]>`
      SELECT * FROM recipients
      WHERE ( 6371 * acos( cos( radians(${latitude}) ) * cos( radians( latitude ) ) * cos( radians( longitude ) - radians(${longitude}) ) + sin( radians(${latitude}) ) * sin( radians( latitude ) ) ) ) <= 10
    `

    return recipients
  }

  async save(recipient: Recipient) {
    const data = PrismaRecipientMapper.toPrisma(recipient)

    await this.prisma.recipient.update({
      where: {
        id: data.id,
      },
      data,
    })
  }

  async create(recipient: Recipient) {
    const data = PrismaRecipientMapper.toPrisma(recipient)

    await this.prisma.recipient.create({ data })
  }

  async delete(recipient: Recipient) {
    const data = PrismaRecipientMapper.toPrisma(recipient)

    await this.prisma.recipient.delete({
      where: {
        id: data.id,
      },
    })
  }
}
