import { Either, left, right } from '@/core/either'
import { CouriersRepository } from '../repositories/courier-repository'
import { HashComparer } from '../cryptography/hash-comparer'
import { InvalidCredentialsError } from './errors/wrong-credentials-error'
import { Encrypter } from '../cryptography/encrypter'
import { Injectable } from '@nestjs/common'

interface AuthenticateCourierUseCaseRequest {
  cpf: string
  password: string
}

type AuthenticateCourierUseCaseResponse = Either<
  InvalidCredentialsError,
  {
    accessToken: string
  }
>

@Injectable()
export class AuthenticateCourierUseCase {
  constructor(
    private couriersRepository: CouriersRepository,
    private hashComparer: HashComparer,
    private encrypter: Encrypter,
  ) {
    //
  }

  async execute({
    cpf,
    password,
  }: AuthenticateCourierUseCaseRequest): Promise<AuthenticateCourierUseCaseResponse> {
    const courier = await this.couriersRepository.findByCpf(cpf)

    if (!courier) {
      return left(new InvalidCredentialsError())
    }

    const doesPasswordMatch = await this.hashComparer.compare(
      password,
      courier.password,
    )

    if (!doesPasswordMatch) {
      return left(new InvalidCredentialsError())
    }

    const accessToken = await this.encrypter.encrypt({
      sub: courier.id.toString(),
      role: courier.role,
    })

    return right({ accessToken })
  }
}
