import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth.service';

@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.scss']
})
export class AdminLoginComponent implements OnInit {
  public loginSucceeded = false;
  constructor(private authService: AuthService) { }

  ngOnInit(): void {
  }
  
  onLogInButtonClicked(email:string, password:string){
    this.authService.login(email, password).subscribe((res: HttpResponse<any>) => {
      if (res.status == 200){
        this.loginSucceeded = true;
      }
    });
  }
}
