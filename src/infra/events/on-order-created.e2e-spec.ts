import { DomainEvents } from '@/core/events/domain-events'
import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import { Role } from '@prisma/client'
import request from 'supertest'
import { RecipientFactory } from 'test/factories/make-recipient'
import { waitFor } from 'test/utils/wait-for'

describe('On order created (E2E)', () => {
  let app: INestApplication
  let recipientFactory: RecipientFactory
  let prisma: PrismaService
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [RecipientFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)
    recipientFactory = moduleRef.get(RecipientFactory)
    jwt = moduleRef.get(JwtService)

    DomainEvents.shouldRun = true

    await app.init()
  })

  it('should send a notification when order is created', async () => {
    const admin = await prisma.user.create({
      data: {
        name: 'admin',
        cpf: '123456789100',
        password: '1234',
        role: Role.ADMIN,
      },
    })

    const accessToken = jwt.sign({ sub: admin.id, role: admin.role })

    const newRecipient = await recipientFactory.makePrismaRecipient()

    await request(app.getHttpServer())
      .post('/orders')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        recipientId: newRecipient.id.toString(),
      })

    await waitFor(async () => {
      const notificationOnDatabase = await prisma.notification.findFirst({
        where: {
          recipientId: newRecipient.id.toString(),
        },
      })

      expect(notificationOnDatabase).not.toBeNull()
    })
  })
})
