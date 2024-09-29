export class CartItem {
  constructor(
    public id: number,
    public productId: number,
    public productName: string,
    public price: number,
    public quantity: number
  ) {}
}