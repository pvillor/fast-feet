import { AppModule } from '@/infra/app.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import { Role } from '@prisma/client'
import request from 'supertest'

describe('Create account (E2E)', () => {
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

  test('[POST] /accounts', async () => {
    const admin = await prisma.user.create({
      data: {
        name: 'admin',
        cpf: '123456789100',
        password: '1234',
        role: Role.ADMIN,
      },
    })

    const accessToken = jwt.sign({ sub: admin.id, role: admin.role })

    const response = await request(app.getHttpServer())
      .post('/accounts')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'John Doe',
        cpf: '12345678910',
        password: '1234',
        role: Role.COURIER,
      })

    expect(response.statusCode).toBe(201)

    const userOnDatabase = await prisma.user.findUnique({
      where: {
        cpf: '12345678910',
      },
    })

    expect(userOnDatabase).toBeTruthy()
  })
})
