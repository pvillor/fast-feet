import { AppModule } from '@/infra/app.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { Role } from '@prisma/client'
import { hash } from 'bcryptjs'
import request from 'supertest'

describe('Authenticate (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)

    await app.init()
  })

  test('[POST] /sessions', async () => {
    await prisma.user.create({
      data: {
        name: 'John Doe',
        cpf: '12345678910',
        password: await hash('1234', 8),
        role: Role.COURIER,
      },
    })

    const response = await request(app.getHttpServer()).post('/sessions').send({
      cpf: '12345678910',
      password: '1234',
    })
    console.log(response.body)
    expect(response.statusCode).toBe(201)
    expect(response.body).toEqual({
      access_token: expect.any(String),
    })
  })
})
