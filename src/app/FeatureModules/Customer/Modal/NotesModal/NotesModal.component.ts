import { Component, Inject, OnInit, Optional, Output, EventEmitter, Input } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSnackBarComponent } from 'src/app/SharedModules/Components/Mat-SnackBar/Mat-SnackBar.component';

// Service
import { InvoiceService } from '../../Services/InvoiceService/Invoice.service';

import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';

import * as _moment from 'moment';

export const MY_FORMATS = {
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM-YYYY',
  },
};

@Component({
  selector: 'NotesModal',
  templateUrl: './NotesModal.component.html',
  styleUrls: ['./NotesModal.component.scss'],
  providers: [
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ],
})
export class NotesModal implements OnInit {
  public notesForm: FormGroup;
  public message:any;
  constructor(
    public dialog: MatDialog,
    private fb: FormBuilder,
    private invoiceService: InvoiceService,
    public snackBar: MatSnackBar,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any
  ){
    this.notesForm = this.fb.group({
      notes: [''],
      date: ['']
    })
  }

  reloadData: any;

  ngOnInit() {
    // this.notesForm.get('date').patchValue(new Date, 'MM/DD/YYYY');
    this.notesForm.patchValue({
      date:_moment()
    })

  }
  
  closeDialog(){
    this.dialog.closeAll();
  }

  public onSubmitNotes(){
    
    let params = {
      invoiceId: this.data.id,
      date: this.notesForm.value.date,
      notes: this.notesForm.value.notes,
      createdBy:'Michael'
    }
    // 
    this.invoiceService.saveNotes(params).subscribe(res => {
      //console.log(res); 
      this.savedNotesMessage()
      this.dialog.closeAll();
    })
  }

  public savedNotesMessage(){
    this.message = "Note Saved Successfully";
    this.openSnackBar(this.message, 'hello');
  }

  public openSnackBar(message: string, panelClass: string) {
    this.snackBar.openFromComponent(MatSnackBarComponent, {
      data: message,
      panelClass: panelClass,
      duration: 2000
    });
  }

}
