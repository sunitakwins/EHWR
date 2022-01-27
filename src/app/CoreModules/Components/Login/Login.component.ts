import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { MatSnackBarComponent } from 'src/app/SharedModules/Components/Mat-SnackBar/Mat-SnackBar.component';
import { LocalStorageService } from 'src/app/SharedModules/Services/Services/LocalStorage.service';

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


  constructor(private fb: FormBuilder, private loginService: LoginService, 
    private snackBar: MatSnackBar  , public localstorage  : LocalStorageService,
    private router: Router) {


  }

  ngOnInit() {
    this.loginForm = this.fb.group({
      // 'username': ['ByronFreemantle', Validators.required],
      'username': ['Micheal', Validators.required],
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
        
        if(res['responseCode'] === 200){ 
          let LoggedInId = res['keyId'];
          this.localstorage.setUserId(LoggedInId);
          let msg = res['responseMessage'];
          this.messages(msg);
          this.router.navigate(["dashboard"]);
        }else {
          let msg = res['responseMessage'];
          this.messages(msg);
          this.router.navigate(["login"]);
        }
        
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


  public messages(message) {
    this.openSnackBar(message, 'hello');
  }

  openSnackBar(message: string, panelClass: string) {
    this.snackBar.openFromComponent(MatSnackBarComponent, {
      data: message,
      panelClass: panelClass,
      duration: 2000
    });
  }


}
