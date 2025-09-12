import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Cart, AddToCartRequest, UpdateCartItemRequest } from '../interfaces/cart.interface';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private baseUrl = 'https://ecommerce.routemisr.com/api/v1';
  private cartSubject = new BehaviorSubject<Cart | null>(null);
  public cart$ = this.cartSubject.asObservable();

  constructor(private http: HttpClient) { }

  getCart(): Observable<{ data: Cart }> {
    return this.http.get<{ data: Cart }>(`${this.baseUrl}/cart`);
  }

  addToCart(productId: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/cart`, { productId });
  }

  updateCartItem(itemId: string, count: number): Observable<any> {
    return this.http.put(`${this.baseUrl}/cart/${itemId}`, { count });
  }

  removeFromCart(itemId: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/cart/${itemId}`);
  }

  clearCart(): Observable<any> {
    return this.http.delete(`${this.baseUrl}/cart`);
  }

  updateCartData(cart: Cart | null) {
    this.cartSubject.next(cart);
  }

  getCartData(): Cart | null {
    return this.cartSubject.value;
  }
} 