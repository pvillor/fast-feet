import { AppModule } from '@/infra/app.module'
import { PrismaService } from '@/infra/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import { Role } from '@prisma/client'
import request from 'supertest'

describe('Fetch couriers (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[POST] /couriers', async () => {
    const admin = await prisma.user.create({
      data: {
        name: 'admin',
        cpf: '123456789100',
        password: '1234',
        role: Role.ADMIN,
      },
    })

    await prisma.user.createMany({
      data: [
        {
          name: 'John Doe',
          cpf: '12345678911',
          password: '1234',
          role: Role.COURIER,
        },
        {
          name: 'John Doe 2',
          cpf: '12345678912',
          password: '1234',
          role: Role.COURIER,
        },
        {
          name: 'John Doe 3',
          cpf: '12345678913',
          password: '1234',
          role: Role.COURIER,
        },
      ],
    })

    const accessToken = jwt.sign({ sub: admin.id, role: admin.role })

    const response = await request(app.getHttpServer())
      .get('/couriers')
      .set('Authorization', `Bearer ${accessToken}`)

    expect(response.statusCode).toBe(200)
    expect(response.body.couriers).toHaveLength(3)
  })
})
