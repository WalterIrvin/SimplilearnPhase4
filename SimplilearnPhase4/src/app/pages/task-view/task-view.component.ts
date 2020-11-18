import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { TaskService } from 'src/app/task.service';

@Component({
  selector: 'app-task-view',
  templateUrl: './task-view.component.html',
  styleUrls: ['./task-view.component.scss']
})
export class TaskViewComponent {
  our_products: any[];
  our_companies: any[];
  public logged_in = false;
  constructor(private taskService: TaskService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.params.subscribe(
      (params: Params) => {
        console.log(params);
      }
    );
    this.taskService.getCompanies().subscribe(
      (companies: any[]) => {
        console.log(companies);
        this.our_companies = companies;
      }
    );
    this.taskService.getProducts().subscribe(
      (products: any[]) =>{
        
        this.our_products = products;
      }
      );
  }

  onCompanyClicked(title:string, img:string, body:string){
    localStorage.setItem('companyTitle', title);
    localStorage.setItem('companyLogo', img);
    localStorage.setItem('companyText', body);
  }
  
  
}
