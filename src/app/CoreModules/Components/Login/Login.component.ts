import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

/*Models */
import { Login } from '../../Models/Login.model';

/*Services */
import { LoginService } from '../../Services/Login.service';


@Component({
  selector: 'app-Login',
  templateUrl: './Login.component.html',
  styleUrls: ['./Login.component.scss']
})
export class LoginComponent implements OnInit {

  public loginForm: FormGroup;


  constructor(private fb: FormBuilder, private loginService: LoginService, private router: Router) {


  }

  ngOnInit() {
    this.loginForm = this.fb.group({
      'username': ['ByronFreemantle', Validators.required],
      'password': ['Welcome@1', Validators.required]
    })
  }

  onLogin() {
    // console.log(this.loginForm.status);

    if (this.loginForm.valid) {

      const requestParams: Login = {
        UserName: this.loginForm.value.username,
        password: this.loginForm.value.password,
        returnUrl: "/dashboard"
      };

      this.loginService.onLogin(requestParams).subscribe(res => {
        //console.log(res);
        this.router.navigate(["dashboard"]);
      }, error => {
        console.log(error);
      })

    }
    else {
      const controls = this.loginForm.controls
      Object.keys(controls).forEach(controlName => controls[controlName].markAsTouched());
      return false;
    }

  }




}
