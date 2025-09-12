import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {
  private baseUrl = 'https://ecommerce.routemisr.com/api/v1';
  private wishlistProductsIdSubject = new BehaviorSubject<string[]>([]);
  private wishlistCounterSubject = new BehaviorSubject<number>(0);
  
  public wishlistProductsId$ = this.wishlistProductsIdSubject.asObservable();
  public wishlistCounter$ = this.wishlistCounterSubject.asObservable();

  constructor(private http: HttpClient) { 
    this.loadWishlistIds();
  }

  // Get current wishlist product IDs
  getWishlistProductsId(): string[] {
    return this.wishlistProductsIdSubject.value;
  }

  // Update wishlist product IDs
  updateWishlistProductsId(productIds: string[]) {
    this.wishlistProductsIdSubject.next(productIds);
    this.wishlistCounterSubject.next(productIds.length);
  }

  // Load wishlist from API to get product IDs
  loadWishlistIds(): void {
    this.getWishlist().subscribe({
      next: (response) => {
        const productIds = response.data?.map((product: any) => product._id) || [];
        this.updateWishlistProductsId(productIds);
      },
      error: () => {
        this.updateWishlistProductsId([]);
      }
    });
  }

  // Get full wishlist with product details
  getWishlist(): Observable<any> {
    return this.http.get(`${this.baseUrl}/wishlist`);
  }

  // Add product to wishlist
  addToWishlist(productId: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/wishlist`, { productId });
  }

  // Remove product from wishlist
  removeFromWishlist(productId: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/wishlist/${productId}`);
  }

  // Check if product is in wishlist
  isInWishlist(productId: string): boolean {
    return this.getWishlistProductsId().includes(productId);
  }
}
