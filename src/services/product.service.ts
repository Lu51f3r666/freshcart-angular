import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product, ProductResponse, Category, Brand } from '../interfaces/product.interface';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private baseUrl = 'https://ecommerce.routemisr.com/api/v1';

  constructor(private http: HttpClient) { }

  getProducts(page: number = 1, limit: number = 10): Observable<ProductResponse> {
    return this.http.get<ProductResponse>(`${this.baseUrl}/products?page=${page}&limit=${limit}`);
  }

  getProductById(id: string): Observable<{ data: Product }> {
    return this.http.get<{ data: Product }>(`${this.baseUrl}/products/${id}`);
  }

  getProductsByCategory(categoryId: string, page: number = 1, limit: number = 10): Observable<ProductResponse> {
    return this.http.get<ProductResponse>(`${this.baseUrl}/products?category=${categoryId}&page=${page}&limit=${limit}`);
  }

  getProductsByBrand(brandId: string, page: number = 1, limit: number = 10): Observable<ProductResponse> {
    return this.http.get<ProductResponse>(`${this.baseUrl}/products?brand=${brandId}&page=${page}&limit=${limit}`);
  }

  getCategories(): Observable<{ data: Category[] }> {
    return this.http.get<{ data: Category[] }>(`${this.baseUrl}/categories`);
  }

  getBrands(): Observable<{ data: Brand[] }> {
    return this.http.get<{ data: Brand[] }>(`${this.baseUrl}/brands`);
  }

  searchProducts(query: string, page: number = 1, limit: number = 10): Observable<ProductResponse> {
    return this.http.get<ProductResponse>(`${this.baseUrl}/products?keyword=${query}&page=${page}&limit=${limit}`);
  }
} 