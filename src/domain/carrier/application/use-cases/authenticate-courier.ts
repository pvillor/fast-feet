import { Either, left, right } from '@/core/either'
import { Courier } from '../../enterprise/entities/courier'
import { CouriersRepository } from '../repositories/courier-repository'
import { InvalidCredentialsError } from '@/core/errors/errors/invalid-credentials-error'

interface AuthenticateCourierUseCaseRequest {
  cpf: string
  password: string
}

type AuthenticateCourierUseCaseResponse = Either<
  InvalidCredentialsError,
  {
    courier: Courier
  }
>

export class AuthenticateCourierUseCase {
  constructor(private couriersRepository: CouriersRepository) {
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

    const doesPasswordMatch = password === courier.password

    if (!doesPasswordMatch) {
      return left(new InvalidCredentialsError())
    }

    return right({ courier })
  }
}
