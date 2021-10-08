import { FormBuilder, FormGroup } from '@angular/forms';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { CustomerService } from '../../Services/CustomerServices/Customer.service';
import { MergeCustomer } from '../../Models/Customer/CustomerRequestModel';

@Component({
  selector: 'app-MergeCustomer',
  templateUrl: './MergeCustomer.component.html',
  styleUrls: ['./MergeCustomer.component.scss']
})
export class MergeCustomerComponent implements OnInit {
  mergeForm : FormGroup;

  customerDataArr: any =[];

  constructor(
    public dialog: MatDialog,
    private customerService: CustomerService, 
    private fb : FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any
    ){
  
      this.mergeForm = this.fb.group({
        fromCustomerId: [''],  
        // toCustomerId: ['']
      });
   }

  ngOnInit() {
    this.customerDataArr = this.data;
  
  }

  onSelectCompleteStatus(value){
    
     value;
  }

  onMergingCustomer(){
    const params : MergeCustomer = 
    {
      "customerId": 0,
      "mergeCustomerId": [
        {
          "customerId": 0
        }
      ],
      "modifiedBy": "Michael"
    };

    console.log(params);
    
    // this.customerService.mergeCustomer(params).subscribe((res) =>{
    //    console.log(res);
    // });
  }

  closeDialog(): void {
    this.dialog.closeAll();
  }

}
