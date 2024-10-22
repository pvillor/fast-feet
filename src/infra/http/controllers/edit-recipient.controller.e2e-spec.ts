import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import { Role } from '@prisma/client'
import request from 'supertest'
import { RecipientFactory } from 'test/factories/make-recipient'

describe('Edit recipient (E2E)', () => {
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

    await app.init()
  })

  test('[PUT] /recipients/:recipientId', async () => {
    const admin = await prisma.user.create({
      data: {
        name: 'admin',
        cpf: '12345678910',
        password: '1234',
        role: Role.ADMIN,
      },
    })

    const accessToken = jwt.sign({
      sub: admin.id.toString(),
      role: Role.ADMIN,
    })

    const recipient = await recipientFactory.makePrismaRecipient({})

    const response = await request(app.getHttpServer())
      .put(`/recipients/${recipient.id}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'John Doe',
        latitude: -3.1031296,
        longitude: -59.962163214,
      })

    expect(response.statusCode).toBe(204)

    const recipientUpdated = await prisma.user.findUnique({
      where: {
        id: recipient.id.toString(),
      },
    })

    expect(recipientUpdated?.name).not.toEqual(recipient.name)
  })
})
