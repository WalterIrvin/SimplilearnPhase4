import { Component, OnInit } from '@angular/core';
import { TaskService } from 'src/app/task.service';

@Component({
  selector: 'app-new-product',
  templateUrl: './new-product.component.html',
  styleUrls: ['./new-product.component.scss']
})
export class NewProductComponent implements OnInit {

  constructor(private taskService: TaskService) { }

  ngOnInit(): void {
  }
  createNewList(title: string, image:string, price:number, body:string){
    this.taskService.createProduct(title, image, price, body).subscribe((response: any) =>{
      console.log(response);
    });
  }
}
