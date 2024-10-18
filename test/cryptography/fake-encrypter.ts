import { Encrypter } from '@/domain/carrier/application/cryptography/encrypter'

export class FakeEncrypter implements Encrypter {
  async encrypt(payload: Record<string, unknown>) {
    return JSON.stringify(payload)
  }
}
