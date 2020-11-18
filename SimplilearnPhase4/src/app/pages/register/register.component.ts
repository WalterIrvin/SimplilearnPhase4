import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  public registerSucceeded = false;
  constructor(private authService: AuthService) { }

  ngOnInit(): void {
  }
  onRegisterButtonClicked(email: string, password:string){
    this.authService.register(email, password).subscribe((res: HttpResponse<any>) => {
      if (res.status == 200){
        this.registerSucceeded = true;
      }
    });
  }
}
