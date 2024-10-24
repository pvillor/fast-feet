import { Entity } from '@/core/entities/entity'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'

export enum Role {
  ADMIN = 'ADMIN',
  COURIER = 'COURIER',
}

export interface CourierProps {
  name: string
  cpf: string
  password: string
  role: Role
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

  get password() {
    return this.props.password
  }

  set password(password: string) {
    this.props.password = password
  }

  get role() {
    return this.props.role
  }

  set role(role: Role) {
    this.props.role = role
  }

  static create(props: CourierProps, id?: UniqueEntityId) {
    if (props.cpf.length !== 11) {
      throw new Error('Invalid cpf length.')
    }

    const courier = new Courier(
      {
        ...props,
      },
      id,
    )

    return courier
  }
}
