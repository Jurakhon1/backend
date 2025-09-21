export class CartItemResponseDto {
  id: number;
  product: {
    id: number;
    name_ru: string;
    name_en: string;
    slug: string;
    base_price: number;
    stock_quantity: number;
  };
  quantity: number;
  price: number;
  total_price: number;
  created_at: Date;
  updated_at: Date;

  constructor(partial: Partial<CartItemResponseDto>) {
    Object.assign(this, partial);
  }
}

export class CartResponseDto {
  items: CartItemResponseDto[];
  total_items: number;
  total_amount: number;

  constructor(items: CartItemResponseDto[]) {
    this.items = items;
    this.total_items = items.reduce((sum, item) => sum + item.quantity, 0);
    this.total_amount = items.reduce((sum, item) => sum + item.total_price, 0);
  }
}
