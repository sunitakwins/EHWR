import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatSnackBarComponent } from 'src/app/SharedModules/Components/Mat-SnackBar/Mat-SnackBar.component';
import { GetAllInvoicesModel } from '../../Models/Invoice/Invoice/InvoiceRequest.model';
import { InvoiceService } from '../../Services/InvoiceService/Invoice.service';

@Component({
  selector: 'app-SendAllUnsentInvoicesModal',
  templateUrl: './SendAllUnsentInvoicesModal.component.html',
  styleUrls: ['./SendAllUnsentInvoicesModal.component.scss']
})
export class SendAllUnsentInvoicesModalComponent implements OnInit {
 

    displayedColumns: string[] = ['print','invoiceNo', 'pageNo', 'customer', 'amount'];
  
    InvoicesForm: FormGroup;
  
    dataSource = new MatTableDataSource();
  
    public requestModel = new GetAllInvoicesModel();
    public notFoundData: boolean = true;
    public printDateRadio: boolean = true;
    public dueDateRadio: boolean = true;
    public checkBox: boolean = false;
    public printAllCheckbox: boolean = true;
  
    public storeInvoiceData: any;
    public invoiceDataList: any = [];
    public invoiceDataListNew: any = [];
    public storeDeletedIndex = [];
  
    public check:boolean = false;
  
    constructor(
      private fb: FormBuilder,
      public dialog: MatDialog,  private spinner: NgxSpinnerService,
      private invoiceService: InvoiceService,
      @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
      public snackBar: MatSnackBar
    ) { 
      this.getPrintAllInvoices();
      // this.check = true;
      // this.checkBox = true;
    }

  
    ngOnInit(): void {
      
      this.InvoicesForm = this.fb.group({
        'customer': ['Customer'],
        'allCustomer': ['AllCustomer'],
        'datePrint': [((new Date()).toISOString())],
        'dateOverDue': [''],
      })
      
    }
  
    closeDialog(): void {
      this.dialog.closeAll();
    }
  
    
    // Get all print Invoices
    public getPrintAllInvoices() {
      
    this.requestModel.Printtype = 'AllCustomer';
    this.requestModel.CustomerId = -1;
    this.requestModel.InvoiceId = 0;
    
    this.spinner.show();
    this.invoiceService.getPrintAllInvoices(this.requestModel).subscribe((res)=>{
     this.notFoundData = res.length > 0 ? false : true;
     
     if(res.length > 0){
      res.map(data => {
        data.checkbox = false;
        return;
      })
      this.dataSource = res;
      this.storeInvoiceData = res;
     }
      //this.allCheckBox(Event);
      setTimeout(() => {
        this.spinner.hide();
      }, 500);
    },error=>{
      setTimeout(()=>{
        this.spinner.hide();
      },200);
    });
  }

  
    public allCheckBox(value) {
      
      this.check = !this.check;
      if (this.check == true) {
  
        this.checkBox = true;
        this.invoiceDataList = this.storeInvoiceData;
        this.invoiceDataListNew = this.removeDuplicates(this.invoiceDataList, "customerId");
        this.invoiceDataList = [];
        this.invoiceDataList =  this.invoiceDataListNew;
      }else{
        this.invoiceDataList = [];
        this.checkBox = false;
      }
  
    }
  
  
    // Checkbox click
    listCheckbox(index: number, value: any, invoiceId: number) {
      debugger
      if (value.checked == true) {
        //ss
        this.checkBox = value.checked;
        this.dataSource[index].checkbox = value.checked;
        const ind = this.storeInvoiceData.findIndex(x => x.invoiceId == invoiceId);
        if (ind > -1) {
          this.invoiceDataList.push(this.storeInvoiceData[ind]);
          this.invoiceDataListNew = this.removeDuplicates(this.invoiceDataList, "customerId");
          this.invoiceDataList = [];
          this.invoiceDataList.push(this.invoiceDataListNew);
          
        } else {
          this.invoiceDataList.push(this.storeInvoiceData[index]);
          this.invoiceDataListNew = this.removeDuplicates(this.invoiceDataList, "customerId");
          // this.invoiceDataList = [];
          // this.invoiceDataList = this.invoiceDataListNew;
        }
        
      } else {

        this.storeInvoiceData.push(this.invoiceDataList[index]);
        this.invoiceDataList.splice(index, 1);
        if(this.invoiceDataList.length < 0){
          this.checkBox = false;
        }
        //this.invoiceDataList = this.removeDuplicates(this.invoiceDataList, "customerId");
      }
      // this.checkBox = !this.checkBox;
      // this.invoiceDataList;
    }
  

  // Send all Unsent Invoices method
    Send(){
      
      // console.log(this.storeInvoiceData);
      if(this.invoiceDataList.length > 0 && this.checkBox ){
        this.invoiceDataListNew = this.removeDuplicates(this.invoiceDataList, "customerId");
        this.invoiceDataList =  this.invoiceDataListNew;
         let newArray = []; let data;
         debugger
         this.invoiceDataList.forEach(ele => {
           if(ele.length == 1){
             data = {
              invoiceId: ele[0].invoiceId
            } 
           }else{
            data = {
              invoiceId: ele.invoiceId
            }
           }
         
          newArray.push(data);
        });
         
        const InvoiceData = {
          "invoiceIds" : newArray
        };
        
        console.log(InvoiceData);
        this.spinner.show();
        this.invoiceService.resendInvoice(InvoiceData).subscribe(res => {
         if(res) {
           let msg = "Invoice has been sent to through email.";
           this.openSnackBar(msg, 'hello');
           setTimeout(() => {
             this.spinner.hide();
           }, 500);
         }
        },error => {
          setTimeout(() => {
            this.spinner.hide();
          }, 500);
        })
      }else{
          const message = "Please select record to be sent.";
          this.messages(message);
      }
      
    }


    removeDuplicates(originalArray, prop) {
      var newArray = [];
      var lookupObject = {};
      for (var i in originalArray) {
        lookupObject[originalArray[i][prop]] = originalArray[i];
      }
      for (i in lookupObject) {
        newArray.push(lookupObject[i]);
      }
      return newArray;
    }


    public messages(message) {
      this.openSnackBar(message, 'hello');
    }

  
    openSnackBar(message: string, panelClass: string) {
      this.snackBar.openFromComponent(MatSnackBarComponent, {
        data: message,
        panelClass: panelClass,
        duration: 2000
      });
    }
 
}

