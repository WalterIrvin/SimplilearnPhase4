import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.scss']
})
export class ShoppingCartComponent implements OnInit {
  public shopping_cart = [];
  public totalCost = 0;
  constructor() {}
  clearCart(){
    localStorage.removeItem('shopping_cart');
    localStorage.removeItem('shopping_total');
    window.location.reload();
  }
  addProductToCart(){
    try{
      this.totalCost = Number(localStorage.getItem('shopping_total'));
      this.shopping_cart = JSON.parse(localStorage.getItem('shopping_cart'));
      if(this.shopping_cart == null){
        this.shopping_cart = [];
      }
      if (this.totalCost == null){
        this.totalCost = 0;
      }
      let productName = localStorage.getItem('currentProductTitle');
      let productImg = localStorage.getItem('currentProductImg');
      let productPrice = localStorage.getItem('currentProductPrice');
      let productBody = localStorage.getItem('currentProductBody');
      let str_0 = "";
      str_0 += productName;
      let str_1 = "";
      str_1 += productImg;
      let str_2 = "";
      str_2 += productPrice;
      let str_3 = "";
      str_3 += productBody;
      if (str_0 === "null" || str_1 === "null" || str_2 === "null" || str_3 === "null"){
        console.log('empty');
        return;
      }
      let product = [str_0, str_1, str_2, str_3];
      this.shopping_cart.push(product);
      localStorage.removeItem('currentProductTitle');
      localStorage.removeItem('currentProductImg');
      localStorage.removeItem('currentProductPrice');
      localStorage.removeItem('currentProductBody');
      this.totalCost += Number(productPrice);
      localStorage.setItem('shopping_cart', JSON.stringify(this.shopping_cart));
      localStorage.setItem('shopping_total', this.totalCost.toString());
      console.log(this.shopping_cart.length);
    }catch(e){
      console.log(e);
    }
    
  }
  ngOnInit(): void {
    this.addProductToCart();
  }

}
