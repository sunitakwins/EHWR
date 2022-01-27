import { FormBuilder, FormGroup } from '@angular/forms';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { CustomerService } from '../../Services/CustomerServices/Customer.service';
import { MergeCustomer } from '../../Models/Customer/CustomerRequestModel';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSnackBarComponent } from 'src/app/SharedModules/Components/Mat-SnackBar/Mat-SnackBar.component';

@Component({
  selector: 'app-MergeCustomer',
  templateUrl: './MergeCustomer.component.html',
  styleUrls: ['./MergeCustomer.component.scss']
})
export class MergeCustomerComponent implements OnInit {
  mergeForm : FormGroup;

  customerDataArr: any =[];
  customerAddress : string ='';
  showCustomerAddress : boolean = false;
  selectedCustomerid : number = 0;
  mergeCustomerArray :any[];
  constructor(
    public dialog: MatDialog,
    private customerService: CustomerService, 
    private fb : FormBuilder,
    private snackBar: MatSnackBar,
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

  onSelectCompleteStatus(id : number){
    debugger
    this.selectedCustomerid = id;
    this.showCustomerAddress = true;
    let selectedData = this.customerDataArr.filter(x => x.customerId == id);
    this.customerAddress = selectedData[0].address1 + ', '+ selectedData[0].suburbName + ', ' +selectedData[0].state + ' - ' + selectedData[0].postCode;
  }

  onMergingCustomer(){
    debugger
    let getSelectedCustomer = this.customerDataArr.filter(x => x.customerId == this.selectedCustomerid);
    var unSelectedCustomer = this.customerDataArr.filter(function(record){  
      return record.customerId != getSelectedCustomer[0].customerId;  
   }); 
   var results= unSelectedCustomer.map(function(res) {  
    return  res.customerId;  
 })
 this.mergeCustomerArray = [];
 results.forEach(ele => {
   let dataObj = { customerId: ele}
  this.mergeCustomerArray.push(dataObj)
})
    const params : MergeCustomer = 
    {
      "customerId": getSelectedCustomer[0].customerId,
      "mergeCustomerId": this.mergeCustomerArray,
      "modifiedBy": "Michael",
      "address1": getSelectedCustomer[0].address1,
      "suburbId": 0,
      "state": getSelectedCustomer[0].state,
      "postCode" : getSelectedCustomer[0].postCode,
    };

    debugger
    this.customerService.mergeCustomer(params).subscribe((res) =>{
      this.openSnackBar(res.responseMessage, 'hello');
       console.log(res);
    });
  }

  closeDialog(): void {
    this.dialog.closeAll();
  }

  openSnackBar(message: string, panelClass: string) {
    this.snackBar.openFromComponent(MatSnackBarComponent, {
      data: message,
      panelClass: panelClass,
      duration: 2000
    });

  }
}
