
export interface Product {
  product_id: number;
  product_name: string;
  product_price: number;
  product_image: string;
  product_state: string;
}

export interface Category {
  category_id: number;
  category_name: string;
  category_state: string;
}

export interface Provider {
  provider_id: number;
  provider_name: string;
  provider_last_name: string;
  provider_mail: string;
  provider_state: string;
}
