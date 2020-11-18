import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TaskViewComponent } from './pages/task-view/task-view.component';
import {HttpClientModule} from '@angular/common/http';
import { NewProductComponent } from './pages/new-product/new-product.component';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { RegisterComponent } from './pages/register/register.component';
import { ShoppingCartComponent } from './pages/shopping-cart/shopping-cart.component';
import { ProductPageComponent } from './pages/product-page/product-page.component';
import { AdminLoginComponent } from './pages/admin-login/admin-login.component';
import { ProductViewComponent } from './pages/product-view/product-view.component';
@NgModule({
  declarations: [
    AppComponent,
    TaskViewComponent,
    NewProductComponent,
    LoginPageComponent,
    RegisterComponent,
    ShoppingCartComponent,
    ProductPageComponent,
    AdminLoginComponent,
    ProductViewComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
