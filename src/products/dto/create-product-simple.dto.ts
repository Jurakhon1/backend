export class CreateProductDto {
  name_ru: string;
  name_en: string;
  slug: string;
  category_id: number;
  brand_id: number;
  base_price: number;
  stock_quantity?: number;
  is_active?: boolean;
}
