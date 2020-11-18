import { Injectable } from '@angular/core';
import { WebRequestService } from './web-request.service';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  constructor(private webReqService: WebRequestService) {}

  createProduct(title: string, image:string, price:number, body:string){
    //send web request to create a list
    return this.webReqService.post('products', {title, image, price, body});
  }

  getProducts(){
    return this.webReqService.get('products');
  }

  getCompanies(){
    return this.webReqService.get('companies');
  }
  
  getCompanyProducts(){
    return this.webReqService.get('companies/:companyId');
  }
}
