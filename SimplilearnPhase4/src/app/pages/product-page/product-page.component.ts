import { Component, LOCALE_ID, OnInit } from '@angular/core';
import { TaskService } from 'src/app/task.service';

@Component({
  selector: 'app-product-page',
  templateUrl: './product-page.component.html',
  styleUrls: ['./product-page.component.scss']
})
export class ProductPageComponent implements OnInit {
  public our_products: any[];
  public companyTitle: string;
  public companyLogo: string;
  public companyText: string;
  constructor(private taskService: TaskService) { }
  getCompanyData(){
    this.companyTitle = localStorage.getItem('companyTitle');
    this.companyLogo = localStorage.getItem('companyLogo');
    this.companyText = localStorage.getItem('companyText');
  }
  onProductClicked(title: string, img: string, price:string, body:string) {
    localStorage.setItem('currentProductTitle', title);
    localStorage.setItem('currentProductImg', img);
    localStorage.setItem('currentProductPrice', price);
    localStorage.setItem('currentProductBody', body);
  }
  ngOnInit(): void {
    this.taskService.getCompanyProducts().subscribe((products: any[]) => {
      this.our_products = products;
      console.log(products);
    });
    this.getCompanyData();
  }

  

}
