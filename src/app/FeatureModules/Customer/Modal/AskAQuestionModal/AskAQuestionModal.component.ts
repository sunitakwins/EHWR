import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-AskAQuestionModal',
  templateUrl: './AskAQuestionModal.component.html',
  styleUrls: ['./AskAQuestionModal.component.scss']
})
export class AskAQuestionModalComponent implements OnInit {
  askQuestionForm : FormGroup;

  constructor( public dialog: MatDialog,  private fb: FormBuilder,) { }

  ngOnInit() {

    this.askQuestionForm = this.fb.group({
      question: ['']
    });
  }
  
  closeDialog(){
    this.dialog.closeAll();
  }

  sendQuestion(){ 
      // let params = {
      //   question: this.askQuestionForm.value.notes,
      //   createdBy:'Michael'
      // }
      // 
      // this.invoiceService.saveNotes(params).subscribe(res => {
      //   //console.log(res); 
      //   this.savedNotesMessage()
      //   this.dialog.closeAll();
      // });
    }
}
