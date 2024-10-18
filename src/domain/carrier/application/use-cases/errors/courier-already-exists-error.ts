import { UseCaseError } from '@/core/errors/use-case-error'

export class CourierAlreadyExistsError extends Error implements UseCaseError {
  constructor(identifier: string) {
    super(`Courier "${identifier}" already exists`)
  }
}
