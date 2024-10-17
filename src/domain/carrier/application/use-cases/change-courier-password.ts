import { Either, left, right } from '@/core/either'
import { Courier } from '../../enterprise/entities/courier'
import { CouriersRepository } from '../repositories/courier-repository'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'

interface ChangeCourierPasswordUseCaseRequest {
  courierId: string
  password: string
}

type ChangeCourierPasswordUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    courier: Courier
  }
>

export class ChangeCourierPasswordUseCase {
  constructor(private couriersRepository: CouriersRepository) {
    //
  }

  async execute({
    courierId,
    password,
  }: ChangeCourierPasswordUseCaseRequest): Promise<ChangeCourierPasswordUseCaseResponse> {
    const courier = await this.couriersRepository.findById(courierId)

    if (!courier) {
      return left(new ResourceNotFoundError())
    }

    await courier.setPasswordHash(password)

    await this.couriersRepository.save(courier)

    return right({
      courier,
    })
  }
}
