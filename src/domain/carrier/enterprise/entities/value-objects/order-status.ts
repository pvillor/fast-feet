export enum Status {
  Processing = 'processing',
  Dispatched = 'dispatched',
  Awaiting = 'awaiting',
  Collected = 'collected',
  Delivered = 'delivered',
  Returned = 'returned',
}

export class OrderStatus {
  public value: Status

  constructor(value: Status) {
    this.value = value
  }
}
