import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-EmailModal',
  templateUrl: './EmailModal.component.html',
  styleUrls: ['./EmailModal.component.scss']
})
export class EmailModalComponent implements OnInit {
  emailForm : FormGroup;
  constructor(private dialog : MatDialog, private fb: FormBuilder,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any ) { }

  ngOnInit() {
    console.log(this.data);
    this.emailForm = this.fb.group({
       email : ['',[Validators.required, Validators.email]]
     })
  }


  sendEmail(){

  }

  closeDialog(){
    this.dialog.closeAll();
  }
}
