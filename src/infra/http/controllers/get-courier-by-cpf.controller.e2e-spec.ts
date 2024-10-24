import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import { Role } from '@prisma/client'
import request from 'supertest'
import { CourierFactory } from 'test/factories/make-courier'

describe('Get courier by CPF (E2E)', () => {
  let app: INestApplication
  let courierFactory: CourierFactory
  let prisma: PrismaService
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [CourierFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)
    courierFactory = moduleRef.get(CourierFactory)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[GET] /couriers/:cpf', async () => {
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

    const courier = await courierFactory.makePrismaCourier({})

    const response = await request(app.getHttpServer())
      .get(`/couriers/${courier.cpf}`)
      .set('Authorization', `Bearer ${accessToken}`)

    expect(response.statusCode).toBe(200)
  })
})
