import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Logout } from 'src/app/CoreModules/Models/Login.model';
import { LoginService } from 'src/app/CoreModules/Services/Login.service';
import { LocalStorageService } from '../../Services/Services/LocalStorage.service';

import { LogoutComponent } from '../Logout/Logout.component';
import { MatSnackBarComponent } from '../Mat-SnackBar/Mat-SnackBar.component';

@Component({
  selector: 'app-Header',
  templateUrl: './Header.component.html',
  styleUrls: ['./Header.component.scss']
})
export class HeaderComponent implements OnInit {

  public sidebar : boolean = false;
  constructor(public dialog: MatDialog,private router: Router, private snackBar : MatSnackBar,
    private localStorage: LocalStorageService, private loginService : LoginService) { }

  ngOnInit() {
  }

  public navToggleBtn(){
    this.sidebar = (this.sidebar==false) ? true : false;
  }

  logout(){
    // let requestParams : Logout ={
    //   "userName" :  "Micheal"
    // };{
    let UserId  = Number(this.localStorage.getUserId());
    let requestParams : Logout = {
      "userId": UserId,
      "actionPerformedBy": "Micheal"
    }
 
    const dialogRef = this.dialog.open(LogoutComponent, {
      width: '350px',
      data: "Are you sure you want to logout?"
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.loginService.onLogOut(requestParams).subscribe(res =>{
          let msg = res['responseMessage'];
          this.messages(msg);
          this.router.navigate(["login"]);
        },error =>{
           let msg = "Please try again."
           this.messages(msg);
        });
        
      }
    });
  }

  sendIndexVal(val){
    this.localStorage.storeHeaderName(val);
    ;
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
