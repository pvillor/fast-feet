import { Entity } from '@/core/entities/entity'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { hash } from 'bcryptjs'

export interface CourierProps {
  name: string
  cpf: string
  passwordHash: string
}

export class Courier extends Entity<CourierProps> {
  get name() {
    return this.props.name
  }

  set name(name: string) {
    this.props.name = name
  }

  get cpf() {
    return this.props.cpf
  }

  set cpf(cpf: string) {
    if (cpf.length !== 11) {
      throw new Error('Invalid cpf length.')
    }

    this.props.cpf = cpf
  }

  get passwordHash() {
    return this.props.passwordHash
  }

  async setPasswordHash(password: string) {
    this.props.passwordHash = await hash(password, 6)
  }

  static async create(props: CourierProps, id?: UniqueEntityId) {
    if (props.cpf.length !== 11) {
      throw new Error('Invalid cpf length.')
    }

    const { passwordHash: password, ...propsWithoutPassword } = props

    const courier = new Courier(
      {
        passwordHash: await hash(password, 6),
        ...propsWithoutPassword,
      },
      id,
    )

    return courier
  }
}
