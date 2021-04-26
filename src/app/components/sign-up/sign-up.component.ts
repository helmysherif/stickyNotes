import { Component, OnInit } from '@angular/core';
import {FormGroup,FormControl,Validators} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/Services/auth.service';
@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {
  isClicked = false;
  responseMessage = "";
  isSuccess = false;
  isUniqueEmailMsg = "";
  isUniqueEmail = false;
  isStyleInvalid = {'background-color':'grey','border-color':'grey'};
  isStyleValid = {'background-color':'#17a2b8','border-color':'#17a2b8'};
  constructor(private _Router:Router , private _AuthService:AuthService) {
    if(this._AuthService.isLoggedIn())
    {
      this._Router.navigate(['/profile']);
    }
   }
  signUp = new FormGroup({
    first_name : new FormControl('',[Validators.required,Validators.pattern(/^([a-zA-Z]+[,.]?[a-z]+['-]?)+$/)]),
    last_name : new FormControl('',[Validators.required,Validators.pattern(/^([a-zA-Z]+[,.]?[a-z]+['-]?)+$/)]),
    email : new FormControl('',[Validators.required,Validators.email]),
    age : new FormControl('',Validators.required),
    password : new FormControl('',Validators.required)
  })
  formData()
  {
    this.isClicked = true;
    if(this.signUp.valid)
    {
      this._AuthService.signup(this.signUp.value).subscribe(res => {
        if(res.message == "success")
        {
          this.isClicked = false;
          this.isSuccess = true;
          this.isUniqueEmail = false;
          this.responseMessage = res.message;
          this.signUp.reset();
          this._Router.navigate(['/signin']);
          
        } else {
          this.isSuccess = false;
          this.isClicked = false;
          this.isUniqueEmail = true;
          this.isUniqueEmailMsg = res.errors.email.message;
        }
      })
    }
  }
  ngOnInit(): void {
  }
}