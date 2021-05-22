import { Component, OnInit } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-MaintenanceDetail',
  templateUrl: './MaintenanceDetail.component.html',
  styleUrls: ['./MaintenanceDetail.component.scss']
})
export class MaintenanceDetailComponent implements OnInit {

  constructor(private spinner: NgxSpinnerService) { }

  ngOnInit() {
    // this.spinner.show();
  }

  ngAfterViewInit(){
    setTimeout(() => {
      this.spinner.hide();
      }, 500);
  }

  public tabChanged(tabChangeEvent: MatTabChangeEvent): void {
    this.spinner.show();
    setTimeout(() => {
      this.spinner.hide();
      }, 500);
  }

}
