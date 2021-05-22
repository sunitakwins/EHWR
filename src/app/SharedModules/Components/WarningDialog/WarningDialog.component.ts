import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-WarningDialog',
  templateUrl: './WarningDialog.component.html',
  styleUrls: ['./WarningDialog.component.scss']
})
export class WarningDialogComponent implements OnInit {

  constructor(

    public dialogRef: MatDialogRef<WarningDialogComponent>, private dialog: MatDialog,

    @Inject(MAT_DIALOG_DATA) public message: string) 
    { }


  ngOnInit() {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  public closeDialog(): void {
    this.dialog.closeAll();
  }

}
