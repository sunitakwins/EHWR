import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-Logout',
  templateUrl: './Logout.component.html',
  styleUrls: ['./Logout.component.scss']
})
export class LogoutComponent implements OnInit {

  constructor( public dialogRef: MatDialogRef<LogoutComponent>, private dialog: MatDialog,

    @Inject(MAT_DIALOG_DATA) public message: string) { }

  ngOnInit() {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  public closeDialog(): void {
    this.dialog.closeAll();
  }

}
