import { Either, left, right } from '@/core/either'
import { CouriersRepository } from '../repositories/courier-repository'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'

interface DeleteCourierUseCaseRequest {
  courierId: string
}

type DeleteCourierUseCaseResponse = Either<ResourceNotFoundError, object>

export class DeleteCourierUseCase {
  constructor(private couriersRepository: CouriersRepository) {
    //
  }

  async execute({
    courierId,
  }: DeleteCourierUseCaseRequest): Promise<DeleteCourierUseCaseResponse> {
    const courier = await this.couriersRepository.findById(courierId)

    if (!courier) {
      return left(new ResourceNotFoundError())
    }

    await this.couriersRepository.delete(courier)

    return right({})
  }
}
