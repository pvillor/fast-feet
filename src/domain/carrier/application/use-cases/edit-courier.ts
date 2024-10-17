import { Either, left, right } from '@/core/either'
import { CouriersRepository } from '../repositories/courier-repository'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'

interface EditCourierUseCaseRequest {
  courierId: string
  name: string
  cpf: string
}

type EditCourierUseCaseResponse = Either<ResourceNotFoundError, object>

export class EditCourierUseCase {
  constructor(private couriersRepository: CouriersRepository) {
    //
  }

  async execute({
    courierId,
    name,
    cpf,
  }: EditCourierUseCaseRequest): Promise<EditCourierUseCaseResponse> {
    const courier = await this.couriersRepository.findById(courierId)

    if (!courier) {
      return left(new ResourceNotFoundError())
    }

    const courierWithSameCpf = await this.couriersRepository.findByCpf(cpf)

    if (courierWithSameCpf) {
      return left(new ResourceNotFoundError())
    }

    courier.name = name
    courier.cpf = cpf

    await this.couriersRepository.save(courier)

    return right({})
  }
}
