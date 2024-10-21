export enum Status {
  Processing = 'PROCESSING',
  Dispatched = 'DISPATCHED',
  Awaiting = 'AWAITING',
  Collected = 'COLLECTED',
  Delivered = 'DELIVERED',
  Returned = 'RETURNED',
}

export class OrderStatus {
  public value: Status

  constructor(value: Status) {
    this.value = value
  }
}
