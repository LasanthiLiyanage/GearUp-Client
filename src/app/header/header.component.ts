import { Component, OnInit } from '@angular/core';
import { CartItem } from '../cart/cartItem.model';
import { CartService } from '../cart/cart.service';
import { Router } from '@angular/router';

declare var bootstrap: any;

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'] // Correct plural key
})
export class HeaderComponent implements OnInit {
  cartItems: CartItem[] = [];
  cartCount: number = 0;
  private cartModel: any;

  constructor(private cartService: CartService, private router: Router) {}

  ngOnInit(): void {
    this.updateCartCount();

    
    const cartModalElement = document.getElementById('cartModal');
    if (cartModalElement) {
      this.cartModel = new bootstrap.Modal(cartModalElement);
    }

   
    this.cartService.cartChanged.subscribe(() => {
      this.updateCartCount();
      this.loadCartItems();
    });

    
    this.cartService.cartCount$.subscribe(count => {
      this.cartCount = count;
    });
  }

  updateCartCount(): void {
    const customerId = localStorage.getItem('customerId');
    if (customerId) {
      this.cartService.getCart(customerId).subscribe((cartItems: CartItem[]) => {
        this.cartCount = cartItems.reduce((acc: number, item: CartItem) => acc + item.quantity, 0);
      });
    }
  }

  loadCartItems(): void {
    const customerId = localStorage.getItem('customerId');
    if (customerId) {
      this.cartService.getCart(customerId).subscribe(cartItems => {
        this.cartItems = cartItems;
        if (this.cartModel) {
          this.cartModel.show();        
        }
      });
    }
  }

  openCartModal(event: Event): void {
    event.preventDefault();  
    this.loadCartItems();
  }

  closeCartModal(): void {
    if (this.cartModel) {
      this.cartModel.hide(); 
    }
  }
  
  goToCart(): void {
    this.router.navigate(['/cart']);
  }

}
