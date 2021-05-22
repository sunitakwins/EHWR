import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-CustomerModal',
  templateUrl: './CustomerModal.component.html',
  styleUrls: ['./CustomerModal.component.scss']
})
export class CustomerModalComponent implements OnInit {

  constructor(

    public dialogRef: MatDialogRef<CustomerModalComponent>, private dialog: MatDialog,

    @Inject(MAT_DIALOG_DATA) public message: string) 
    { }

  ngOnInit() {
  }

  onNoClick(): void {
    this.dialogRef.close(false);
  }


  public closeDialog(): void {
    this.dialog.closeAll();
  }

  public onYesClick(){
    this.dialogRef.close(true);
  }
}
