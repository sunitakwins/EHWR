import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-ConfirmationBox',
  templateUrl: './ConfirmationBox.component.html',
  styleUrls: ['./ConfirmationBox.component.scss']
})
export class ConfirmationBoxComponent implements OnInit {

  constructor(

    public dialogRef: MatDialogRef<ConfirmationBoxComponent>, private dialog: MatDialog,

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

  onYesClick(){
    
    this.dialogRef.close(true);
  }

}
