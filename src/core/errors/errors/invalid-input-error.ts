import { UseCaseError } from '@/core/errors/use-case-error'

export class InvalidInputError extends Error implements UseCaseError {
  constructor() {
    super('Invalid input')
  }
}
