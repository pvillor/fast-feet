import { PaginationParams } from '@/core/repositories/pagination-params'
import { Courier } from '../../enterprise/entities/courier'

export abstract class CouriersRepository {
  abstract findById(id: string): Promise<Courier | null>
  abstract findByCpf(cpf: string): Promise<Courier | null>
  abstract findMany(page: PaginationParams): Promise<Courier[]>
  abstract save(courier: Courier): Promise<void>
  abstract create(courier: Courier): Promise<void>
  abstract delete(courier: Courier): Promise<void>
}
