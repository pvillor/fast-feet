import { CouriersRepository } from '../repositories/courier-repository'
import { Courier } from '../../enterprise/entities/courier'
import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { Injectable } from '@nestjs/common'

interface GetCourierByCpfUseCaseRequest {
  cpf: string
}

type GetCourierByCpfUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    courier: Courier
  }
>

@Injectable()
export class GetCourierByCpfUseCase {
  constructor(private couriersRepository: CouriersRepository) {
    //
  }

  async execute({
    cpf,
  }: GetCourierByCpfUseCaseRequest): Promise<GetCourierByCpfUseCaseResponse> {
    const courier = await this.couriersRepository.findByCpf(cpf)

    if (!courier) {
      return left(new ResourceNotFoundError())
    }

    return right({ courier })
  }
}
