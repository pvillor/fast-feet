export abstract class HasherComparer {
  abstract compare(plain: string, hash): Promise<boolean>
}
