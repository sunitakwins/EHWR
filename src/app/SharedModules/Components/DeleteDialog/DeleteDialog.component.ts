import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-DeleteDialog',
  templateUrl: './DeleteDialog.component.html',
  styleUrls: ['./DeleteDialog.component.scss']
})
export class DeleteDialogComponent implements OnInit {

  constructor(

    public dialogRef: MatDialogRef<DeleteDialogComponent>, private dialog: MatDialog,

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
