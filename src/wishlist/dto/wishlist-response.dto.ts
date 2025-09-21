export class WishlistItemResponseDto {
  id: number;
  product: {
    id: number;
    name_ru: string;
    name_en: string;
    slug: string;
    base_price: number;
    stock_quantity: number;
    is_active: boolean;
    category: {
      id: number;
      name_ru: string;
      name_en: string;
    };
    brand: {
      id: number;
      name: string;
    };
  };
  created_at: Date;

  constructor(partial: Partial<WishlistItemResponseDto>) {
    Object.assign(this, partial);
  }
}

export class ComparisonItemResponseDto {
  id: number;
  product: {
    id: number;
    name_ru: string;
    name_en: string;
    slug: string;
    base_price: number;
    stock_quantity: number;
    category: {
      id: number;
      name_ru: string;
      name_en: string;
    };
    brand: {
      id: number;
      name: string;
    };
  };
  created_at: Date;

  constructor(partial: Partial<ComparisonItemResponseDto>) {
    Object.assign(this, partial);
  }
}
