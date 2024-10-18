import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UnauthorizedException,
} from '@nestjs/common'
import { z } from 'zod'
import { AuthenticateCourierUseCase } from '@/domain/carrier/application/use-cases/authenticate-courier'
import { InvalidCredentialsError } from '@/domain/carrier/application/use-cases/errors/wrong-credentials-error'

const authenticateBodySchema = z.object({
  cpf: z.string().length(11),
  password: z.string(),
})

const bodyValidationPipe = new ZodValidationPipe(authenticateBodySchema)

type AuthenticateBodySchema = z.infer<typeof authenticateBodySchema>

@Controller('/sessions')
export class AuthenticateController {
  constructor(private authenticateCourier: AuthenticateCourierUseCase) {
    //
  }

  @Post()
  async handle(@Body(bodyValidationPipe) body: AuthenticateBodySchema) {
    const { cpf, password } = body
    console.log(body)
    const result = await this.authenticateCourier.execute({
      cpf,
      password,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case InvalidCredentialsError:
          throw new UnauthorizedException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }

    const { accessToken } = result.value

    return { access_token: accessToken }
  }
}
