import { Component } from '@angular/core';
import { CustomerService } from './customer.service';
import { Router } from '@angular/router';
import { Customer } from './customer.model';
import { delay } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrl: './customer.component.css'
})
export class CustomerComponent {
  customer: Customer = { name: '', email: '', address: '' };

  constructor(private customerService: CustomerService, private router: Router,private toastr: ToastrService) { }

  

  onSubmit() {
    this.customerService.addCustomer(this.customer).pipe(
      delay(1000) // Delay for 1 second
    ).subscribe(
      response => {
        console.log('Customer saved, navigating to products...');
        this.toastr.info('Customer saved, navigating to products...', 'Customer Info');
        localStorage.setItem('customerId', response.id);
        this.router.navigate(['/products']);
      },
      error => {
        alert('Error saving customer details: ' + error.message);
        this.toastr.error('Error saving customer details: ' + error.message, 'Customer');
      }
    );
  }

  showSuccess() {
    this.toastr.success('Success Message', 'Title');
  }

  showError() {
    this.toastr.error('Error Message', 'Title');
  }

  showInfo() {
    this.toastr.info('Info Message', 'Title');
  }

  showWarning() {
    this.toastr.warning('Warning Message', 'Title');
  }
}
