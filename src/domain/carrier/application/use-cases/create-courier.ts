import { CouriersRepository } from '../repositories/courier-repository'
import { Courier } from '../../enterprise/entities/courier'
import { hash } from 'bcryptjs'
import { Either, left, right } from '@/core/either'
import { AlreadyExistsError } from '@/core/errors/errors/already-exists-error'
import { Injectable } from '@nestjs/common'

interface CreateCourierUseCaseRequest {
  name: string
  cpf: string
  password: string
}

type CreateCourierUseCaseResponse = Either<
  AlreadyExistsError,
  {
    courier: Courier
  }
>

@Injectable()
export class CreateCourierUseCase {
  constructor(private couriersRepository: CouriersRepository) {
    //
  }

  async execute({
    name,
    cpf,
    password,
  }: CreateCourierUseCaseRequest): Promise<CreateCourierUseCaseResponse> {
    const courierWithSameCpf = await this.couriersRepository.findByCpf(cpf)

    if (courierWithSameCpf) {
      return left(new AlreadyExistsError())
    }

    const courier = await Courier.create({
      name,
      cpf,
      passwordHash: await hash(password, 6),
    })

    await this.couriersRepository.create(courier)

    return right({ courier })
  }
}
