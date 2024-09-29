import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  private apiUrl = 'https://localhost:7138/api/Customers';  

  constructor(private http: HttpClient) { }

  addCustomer(customer: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, customer);
  }

  getCustomerEmail(customerId: string): Observable<{ email: string }> {
    return this.http.get<{ email: string }>(`${this.apiUrl}/${customerId}/email`);
  }
}