import { Component, OnInit } from '@angular/core';
import { ProductService } from './product.service';
import { Product } from './product.model';
import { Cart } from '../cart/cart.model';
import { CartService } from '../cart/cart.service';
import { CartItem } from '../cart/cartItem.model';


@Component({
  selector: 'app-products',
  templateUrl: './products.component.html'
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];
  selectedProduct: Product | null = null; 
  cart: Cart[] = [];

  constructor(private productService: ProductService, private cartService: CartService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.productService.getProducts().subscribe(
      data => {
        this.products = data;
      },
      error => {
        console.error('Error fetching products', error);
      }
    );
  }  

  openModal(product: Product): void {
    this.selectedProduct = product;
  }

  // Close the modal and clear the selected product
  closeModal(): void {
    this.selectedProduct = null;
  }

  // addToCart(product: Product): void {
  //   const cartItem = new CartItem(product.id, product.name, product.price, 1);
  //   this.cartService.addToCart(cartItem);
  //   alert(`${product.name} added to cart`);
  // }

  addToCart(product: Product): void {
    const customerId = localStorage.getItem('customerId'); // Get the customer ID from localStorage
    if (customerId) {
      const cartItem = {
        customerId: customerId,
        productId: product.id,
        quantity: 1,
      };

      this.cartService.addItemToCart(cartItem).subscribe({
        next: () => {
          alert(`${product.name} added to cart`);
          this.updateCartCount();
        },
        error: (err) => {
          alert('Error adding to cart: ' + err.message);
        }
      });
    } else {
      alert('Customer ID not found!');
    }    
  }

  updateCartCount(): void {
    const customerId = localStorage.getItem('customerId');
    if (customerId) {
      this.cartService.getCart(customerId).subscribe(cartItems => {
        const cartCount = cartItems.reduce((acc: any, item: { quantity: any; }) => acc + item.quantity, 0);
        this.cartService.updateCartCount(cartCount);  
      });
    }
  }
}
