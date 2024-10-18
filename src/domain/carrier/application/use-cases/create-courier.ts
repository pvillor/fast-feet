import { CouriersRepository } from '../repositories/courier-repository'
import { Courier } from '../../enterprise/entities/courier'
import { Either, left, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { HashGenerator } from '../cryptography/hash-generator'
import { CourierAlreadyExistsError } from './errors/courier-already-exists-error'

interface CreateCourierUseCaseRequest {
  name: string
  cpf: string
  password: string
}

type CreateCourierUseCaseResponse = Either<
  CourierAlreadyExistsError,
  {
    courier: Courier
  }
>

@Injectable()
export class CreateCourierUseCase {
  constructor(
    private couriersRepository: CouriersRepository,
    private hashGenerator: HashGenerator,
  ) {
    //
  }

  async execute({
    name,
    cpf,
    password,
  }: CreateCourierUseCaseRequest): Promise<CreateCourierUseCaseResponse> {
    const courierWithSameCpf = await this.couriersRepository.findByCpf(cpf)

    if (courierWithSameCpf) {
      return left(new CourierAlreadyExistsError(cpf))
    }

    const hashedPassword = await this.hashGenerator.hash(password)

    const courier = Courier.create({
      name,
      cpf,
      password: hashedPassword,
    })

    await this.couriersRepository.create(courier)

    return right({ courier })
  }
}
