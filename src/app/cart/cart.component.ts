import { Component, OnInit } from '@angular/core';
import { CartService } from './cart.service';
import { CartItem } from './cartItem.model';
import { Router } from '@angular/router';
import { CustomerService } from '../customer/customer.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
})
export class CartComponent implements OnInit {
  cartItems: CartItem[] = [];
  selectedItem: CartItem | null = null;
  customerEmail: string = '';

  constructor(private cartService: CartService,private customerService: CustomerService, private router: Router, private snackBar: MatSnackBar, private toastr: ToastrService) {}

  ngOnInit(): void {
    this.loadCart(); 
    this.loadCustomerEmail(); 
  }

  getTotalPrice(): number {
    return this.cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  }


  addToCart(product: any) {
    const customerId = localStorage.getItem('customerId'); 
    if (customerId) {
      this.cartService
        .addItemToCart({ customerId, productId: product.id, quantity: 1 })
        .subscribe({
          next: () => this.loadCart(),
          error: (err) => alert('Error adding item to cart: ' + err.message),
        });
    } else {
      alert('Customer not found');
      this.toastr.error('Customer not found.', 'Title');
    }
  }

  updateQuantity(cartItemId: number,productId: number, quantity: number): void {
    this.cartService.updateCartItemQuantity(cartItemId, productId, quantity).subscribe(
      response => {
        alert('Quantity updated successfully.');
        this.toastr.success('Quantity updated successfully.', 'Success');
        this.loadCart();
      },
      error => {
        alert('Error updating quantity: ' + error.message);
        this.toastr.error('Error updating quantity: ' + error.message, 'Error');
      }
    );
  }

  removeFromCart(productId: number) {
    const customerId = localStorage.getItem('customerId');
    if (customerId) {
      this.cartService
        .removeItemFromCart({ customerId, productId })
        .subscribe(() => {
          this.loadCart(); 
        });
    }
  }

  
  loadCart() {
    const customerId = localStorage.getItem('customerId');
    if (customerId) {
      this.cartService.getCart(customerId).subscribe({
        next: (cartItems) => (this.cartItems = cartItems),
        error: (err) => console.error('Error loading cart: ' + err.message),
      });
    } else {
      alert('Customer not found');
      this.toastr.error('Customer not found.', 'Error');
    }
  }

  closeCart(): void {    
    this.router.navigate(['/products']);
  }
  
  loadCustomerEmail(): void {
    const customerId = localStorage.getItem('customerId');
    if (customerId) {
      this.customerService.getCustomerEmail(customerId).subscribe(response => {
        this.customerEmail = response.email;
      });
    }
  }

  confirmCart(): void {
    const confirmCartDto = {
      email: this.customerEmail,
      cartItems: this.cartItems
    };

    this.cartService.confirmCart(confirmCartDto).subscribe({
      next: () => {
        this.toastr.success('Order confirmed and email sent', 'Success');
        this.clearCart();
        this.router.navigate(['/products']);  
      },
      error: (err) => {
        this.toastr.error('Error confirming cart: ' + err.message);        
      }
    });   
  }

  clearCart(): void {
    const customerId = localStorage.getItem('customerId');
    if (customerId) {
      this.cartService.clearCart(customerId).subscribe(() => {
        this.cartItems = [];  
        alert('Cart has been cleared');
        this.toastr.success('Cart has been cleared.', 'Success');
      });
    }
  }

  showSuccessMessage(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      panelClass: ['success-snackbar']
    });
  }

  showErrorMessage(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      panelClass: ['error-snackbar']
    });
  }
  
}
