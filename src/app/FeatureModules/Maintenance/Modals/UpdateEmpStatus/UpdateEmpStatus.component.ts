import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-UpdateEmpStatus',
  templateUrl: './UpdateEmpStatus.component.html',
  styleUrls: ['./UpdateEmpStatus.component.scss']
})
export class UpdateEmpStatusComponent implements OnInit {

  constructor(

    public dialogRef: MatDialogRef<UpdateEmpStatusComponent>, private dialog: MatDialog,

    @Inject(MAT_DIALOG_DATA) public data: any) 
    {
      // console.log(data);
    }


  ngOnInit() {
  }

  onNoClick() {
    this.dialogRef.close(false);
  }

  onYesClick(){
    this.dialogRef.close(true);

  }

  public closeDialog() {
    this.dialog.closeAll();
  }

}
