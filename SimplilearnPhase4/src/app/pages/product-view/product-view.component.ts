import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-product-view',
  templateUrl: './product-view.component.html',
  styleUrls: ['./product-view.component.scss']
})
export class ProductViewComponent implements OnInit {
  public productName: string;
  public productImg: string;
  public productPrice: string;
  public productBody: string;
  constructor() { }
  getProductData(){
    this.productName = localStorage.getItem('currentProductTitle');
    this.productImg = localStorage.getItem('currentProductImg');
    this.productPrice = localStorage.getItem('currentProductPrice');
    this.productBody = localStorage.getItem('currentProductBody');
  }
  ngOnInit(): void {
    this.getProductData();
  }

}
