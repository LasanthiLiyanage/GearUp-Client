import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, catchError, Observable, Subject, tap, throwError } from 'rxjs';
import { CartItem } from './cartItem.model';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private apiUrl = 'https://localhost:7138/api/Cart';
  private cartItems: CartItem[] = [];
  private cartCountSubject = new BehaviorSubject<number>(0);
  cartCount$ = this.cartCountSubject.asObservable();

  constructor(private http: HttpClient) {}
  cartChanged = new Subject<void>();
  
  addItemToCart(item: { customerId: string, productId: number, quantity: number }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/add`, item).pipe(
      tap(() => this.cartChanged.next()),  
      catchError(this.handleError) 
    );
  }

  // updateCartItemQuantity(
  //   cartItemId: number,
  //   productId: number,
  //   quantity: number
  // ): Observable<any> {
  //   const customerId = localStorage.getItem('customerId');
  //   return this.http.post<any>(`${this.apiUrl}/update-quantity`, {
  //     customerId,
  //     productId,
  //     quantity,
  //     cartItemId,
  //   });
  // }

  updateCartItemQuantity(
    cartItemId: number,
    productId: number,
    quantity: number): Observable<any> {
    const customerId = localStorage.getItem('customerId');
    return this.http.post<any>(`${this.apiUrl}/update-quantity`, {
      customerId,
      productId,
      quantity,
      cartItemId,
    }).pipe(
      tap(() => this.cartChanged.next()),  
      catchError(this.handleError)  
    );
  }

  removeItemFromCart(cartItem: { customerId: string, productId: number }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/remove`, cartItem).pipe(
      tap(() => this.cartChanged.next()),  
      catchError(this.handleError)  
    );
  }

  getCart(customerId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${customerId}`).pipe(
      catchError(this.handleError)  
    );
  }

  addToCart(item: CartItem): void {
    const existingItem = this.cartItems.find(
      (cartItem) => cartItem.productId === item.productId
    );
    if (existingItem) {
      existingItem.quantity += item.quantity; 
    } else {
      this.cartItems.push(item); 
    }
  } 

  confirmCart(confirmCartDto: { email: string; cartItems: CartItem[] }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/confirm`, confirmCartDto).pipe(
      catchError(this.handleError)  
    );
  }

  clearCart(customerId: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/clear`, { customerId }).pipe(
      tap(() => this.cartChanged.next()),  
      catchError(this.handleError)  
    );
  }

  updateCartCount(newCount: number): void {
    this.cartCountSubject.next(newCount);  
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
     
      errorMessage = `Error: ${error.error.message}`;
    } else {
     
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(() => new Error(errorMessage));
  }
}
