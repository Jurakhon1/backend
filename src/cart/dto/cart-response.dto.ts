export class CartItemResponseDto {
  id: number;
  product: {
    id: number;
    name_ru: string;
    name_en: string;
    slug: string;
    base_price: number;
    stock_quantity: number;
    brand: {
      id: number;
      name_ru: string;
      name_en: string;
    };
    images: {
      id: number;
      image_url: string;
      alt_text_ru: string;
      alt_text_en: string;
      sort_order: number;
      is_primary: boolean;
    }[];
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
