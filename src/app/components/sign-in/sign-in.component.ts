import { Component, OnInit } from '@angular/core';
import {FormGroup,FormControl,Validators} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/Services/auth.service';
@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent implements OnInit {
  responseMessage = "";
  isNotEmail = false;
  constructor(private _AuthService:AuthService , private _Router:Router) {
    if(this._AuthService.isLoggedIn())
    {
      this._Router.navigate(['/profile']);
    }
  }
  isClicked = false;
  isStyleInvalid = {'background-color':'grey','border-color':'grey'};
  isStyleValid = {'background-color':'#17a2b8','border-color':'#17a2b8'};
  signIn = new FormGroup({
    email : new FormControl('',[Validators.required,Validators.email]),
    password : new FormControl('',Validators.required)
  })
  login()
  {
    if(this.signIn.valid)
    {
      this._AuthService.signin(this.signIn.value).subscribe(res => {
        if(res.message == "success")
        {
          localStorage.setItem('UserName' , res.user.email);
          this.isClicked = false;
          this.isNotEmail = false;
          this._Router.navigate(['/profile']);
          localStorage.setItem('TOKEN' , res.token);
        } else {
          this.isClicked = true;
          this.isNotEmail = true;
          this.responseMessage = res.message;
        }
      })
    }
  }
  ngOnInit(): void {
  }
}