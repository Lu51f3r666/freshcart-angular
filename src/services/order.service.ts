import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Order } from '../interfaces/order.interface';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private baseUrl = 'https://ecommerce.routemisr.com/api/v1';

  constructor(private http: HttpClient) {}

  getAllOrders(userId: string): Observable<any> {
    console.log('=== ORDER SERVICE GET ALL ORDERS ===');
    console.log('OrderService.getAllOrders called with userId:', userId);
    console.log('Base URL:', this.baseUrl);
    console.log('Full API URL:', `${this.baseUrl}/orders/user/${userId}`);
    console.log('Making HTTP GET request...');
    
    // Use simple GET request without any headers (exactly like React)
    return this.http.get(`${this.baseUrl}/orders/user/${userId}`);
  }

  getOrderById(orderId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/orders/${orderId}`);
  }

  createCashOrder(cartId: string, shippingAddress: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/orders/${cartId}`, {
      shippingAddress
    });
  }

  createCreditOrder(cartId: string, shippingAddress: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/orders/checkout-session/${cartId}`, {
      shippingAddress
    });
  }
}
