import { AppModule } from '@/infra/app.module'
import { PrismaService } from '@/infra/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import { Role } from '@prisma/client'
import { compare } from 'bcryptjs'
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

  test('[PATCH] /accounts/:userId/password', async () => {
    const admin = await prisma.user.create({
      data: {
        name: 'admin',
        cpf: '123456789100',
        password: '1234',
        role: Role.ADMIN,
      },
    })

    const courier = await prisma.user.create({
      data: {
        name: 'John Doe',
        cpf: '123456789101',
        password: '1234',
        role: Role.COURIER,
      },
    })

    const accessToken = jwt.sign({ sub: admin.id, role: admin.role })

    const response = await request(app.getHttpServer())
      .patch(`/accounts/${courier.id}/password`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        password: '123456',
      })

    expect(response.statusCode).toBe(204)

    const courierWithPasswordChanged = await prisma.user.findUnique({
      where: {
        cpf: '123456789101',
      },
    })

    expect(await compare('123456', courierWithPasswordChanged!.password)).toBe(
      true,
    )
  })
})
