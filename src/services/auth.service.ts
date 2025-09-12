import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User, LoginRequest, RegisterRequest, ForgotPasswordRequest, ResetPasswordRequest } from '../interfaces/user.interface';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser: Observable<User | null>;
  private baseUrl = 'https://ecommerce.routemisr.com/api/v1';

  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<User | null>(this.getUserFromToken());
    this.currentUser = this.currentUserSubject.asObservable();
    
    // Initialize userId in localStorage if token exists
    this.initializeUserId();
  }

  private initializeUserId(): void {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    
    console.log('initializeUserId - token exists:', !!token);
    console.log('initializeUserId - existing userId:', userId);
    
    if (token && !userId) {
      console.log('initializeUserId - need to extract userId from token');
      const user = this.getUserFromToken();
      console.log('initializeUserId - extracted user:', user);
      if (user && user.id) {
        localStorage.setItem('userId', user.id);
        console.log('initializeUserId - saved userId to localStorage:', user.id);
      }
    }
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  login(loginData: LoginRequest): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/signin`, loginData)
      .pipe(map((response: any) => {
        if (response && response.token) {
          localStorage.setItem('token', response.token);
          const user = this.getUserFromToken();
          if (user && user.id) {
            localStorage.setItem('userId', user.id);
          }
          this.currentUserSubject.next(user);
        }
        return response;
      }));
  }

  register(registerData: RegisterRequest): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/signup`, registerData);
  }

  forgotPassword(data: ForgotPasswordRequest): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/forgotPasswords`, data);
  }

  verifyResetCode(code: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/verifyResetCode`, { resetCode: code });
  }

  resetPassword(data: ResetPasswordRequest): Observable<any> {
    return this.http.put(`${this.baseUrl}/auth/resetPassword`, data);
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    this.currentUserSubject.next(null);
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    if (!token) return false;
    
    try {
      const decoded: any = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      return decoded.exp > currentTime;
    } catch {
      return false;
    }
  }

  getUserId(): string | null {
    console.log('=== GET USER ID ===');
    const userId = localStorage.getItem('userId');
    console.log('getUserId - userId from localStorage:', userId);
    
    if (userId) {
      console.log('getUserId - returning userId from localStorage:', userId);
      return userId;
    }
    
    // Fallback: try to get from current user
    const user = this.currentUserValue;
    console.log('getUserId - current user fallback:', user);
    const userIdFromToken = user ? user.id : null;
    console.log('getUserId - userId from token:', userIdFromToken);
    
    return userIdFromToken;
  }

  private getUserFromToken(): User | null {
    const token = localStorage.getItem('token');
    if (!token) return null;
    
    try {
      const decoded: any = jwtDecode(token);
      return {
        id: decoded.id,
        name: decoded.name,
        email: decoded.email,
        phone: decoded.phone,
        role: decoded.role
      };
    } catch {
      return null;
    }
  }
} 