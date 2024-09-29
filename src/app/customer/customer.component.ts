import { Component } from '@angular/core';
import { CustomerService } from './customer.service';
import { Router } from '@angular/router';
import { Customer } from './customer.model';
import { delay } from 'rxjs';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrl: './customer.component.css'
})
export class CustomerComponent {
  customer: Customer = { name: '', email: '', address: '' };

  constructor(private customerService: CustomerService, private router: Router) { }

  

  onSubmit() {
    this.customerService.addCustomer(this.customer).pipe(
      delay(1000) // Delay for 1 second
    ).subscribe(
      response => {
        console.log('Customer saved, navigating to products...');
        localStorage.setItem('customerId', response.id);
        this.router.navigate(['/products']);
      },
      error => {
        alert('Error saving customer details: ' + error.message);
      }
    );
  }
}
