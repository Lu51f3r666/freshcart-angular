export interface CartItem {
  count: number;
  _id: string;
  price: number;
  product: {
    id?: string;
    _id?: string;
    title: string;
    imageCover: string;
    price: number;
    priceAfterDiscount?: number;
  };
  isLoadingUpdate?: boolean;
  isLoadingRemove?: boolean;
}

export interface Cart {
  _id: string;
  cartOwner: string;
  products: CartItem[];
  totalCartPrice: number;
  numOfCartItems: number;
  createdAt: string;
  updatedAt: string;
}

export interface AddToCartRequest {
  productId: string;
}

export interface UpdateCartItemRequest {
  count: number;
} 