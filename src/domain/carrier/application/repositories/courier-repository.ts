import { Courier } from '../../enterprise/entities/courier'

export interface CouriersRepository {
  findById(id: string): Promise<Courier | null>
  findByCpf(cpf: string): Promise<Courier | null>
  save(courier: Courier): Promise<void>
  create(courier: Courier): Promise<void>
  delete(courier: Courier): Promise<void>
}
