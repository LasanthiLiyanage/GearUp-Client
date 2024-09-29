import { NgModule } from "@angular/core";
import { AppComponent } from "./app.component";


import { BrowserModule } from "@angular/platform-browser";
import { AppRoutingModule } from './app.routes';
import { FormsModule } from "@angular/forms";
import { CustomerComponent } from "./customer/customer.component";
import { ProductsComponent } from "./products/products.component";
import { CommonModule } from "@angular/common";
import { provideHttpClient } from "@angular/common/http";
import { CartComponent } from "./cart/cart.component";
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HeaderComponent } from "./header/header.component";



@NgModule({
    declarations: [
        AppComponent,
        CustomerComponent,
        ProductsComponent,
        CartComponent,
        HeaderComponent
    ],
    imports: [
    // RouterModule.forRoot(appRoutes),
    BrowserModule,
    FormsModule,
    CommonModule,
    AppRoutingModule,
    MatSnackBarModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot({
        timeOut: 3000,
        positionClass: 'toast-top-right',
        preventDuplicates: true
    }),    
],
        providers: [provideHttpClient(), provideAnimationsAsync('noop')],
    bootstrap: [AppComponent]
})
export class AppModule{}