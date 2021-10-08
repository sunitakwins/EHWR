import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-AddPaymentModal',
  templateUrl: './AddPaymentModal.component.html',
  styleUrls: ['./AddPaymentModal.component.scss']
})
export class AddPaymentModalComponent implements OnInit {

  constructor( private dialog: MatDialog) { }

  ngOnInit() {
  }

  public closeDialog(): void {
    this.dialog.closeAll();
  }

}
