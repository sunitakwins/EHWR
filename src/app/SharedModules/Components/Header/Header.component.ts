import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { LocalStorageService } from '../../Services/Services/LocalStorage.service';

import { LogoutComponent } from '../Logout/Logout.component';

@Component({
  selector: 'app-Header',
  templateUrl: './Header.component.html',
  styleUrls: ['./Header.component.scss']
})
export class HeaderComponent implements OnInit {

  public sidebar : boolean = false;
  constructor(public dialog: MatDialog,private router: Router, private localStorage: LocalStorageService) { }

  ngOnInit() {
  }

  public navToggleBtn(){
    this.sidebar = (this.sidebar==false) ? true : false;
  }

  logout(){
    const dialogRef = this.dialog.open(LogoutComponent, {
      width: '350px',
      data: "Are you sure you want to logout?"
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        console.log('run');
        this.router.navigate(["login"])
      }
    });
  }

  sendIndexVal(val){
    this.localStorage.storeHeaderName(val);
    ;
  }

}
