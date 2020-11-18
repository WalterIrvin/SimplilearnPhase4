import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminLoginComponent } from './pages/admin-login/admin-login.component';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { NewProductComponent } from './pages/new-product/new-product.component';
import { ProductPageComponent } from './pages/product-page/product-page.component';
import { ProductViewComponent } from './pages/product-view/product-view.component';
import { RegisterComponent } from './pages/register/register.component';
import { ShoppingCartComponent } from './pages/shopping-cart/shopping-cart.component';
import { TaskViewComponent } from './pages/task-view/task-view.component';

const routes: Routes = [
  {path: '', redirectTo: 'products', pathMatch: 'full'},
  {path: 'new-product', component: NewProductComponent},
  {path: 'products/:productId', component: ProductViewComponent},
  {path: 'companies/:companyId', component: ProductPageComponent},
  {path: 'products', component: TaskViewComponent},
  {path: 'login', component: LoginPageComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'admin', component: AdminLoginComponent},
  {path: 'checkout', component: ShoppingCartComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
