import { CartItem } from './cart.interface';

export interface Order {
  _id: string;
  user: string;
  cartItems: CartItem[];
  shippingAddress: Address;
  phone: string;
  totalOrderPrice: number;
  paymentMethodType: string;
  isPaid: boolean;
  isDelivered: boolean;
  paidAt?: string;
  deliveredAt?: string;
  createdAt: string;
}

export interface Address {
  alias: string;
  details: string;
  phone: string;
  city: string;
  postalCode: string;
}

export interface CreateOrderRequest {
  shippingAddress: Address;
  phone: string;
  paymentMethodType: string;
} 