import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { GetAllInvoicesModel } from '../../Models/Invoice/Invoice/InvoiceRequest.model';
import * as moment from 'moment';

// Service
import { InvoiceService } from '../../Services/InvoiceService/Invoice.service';
import { MatSnackBarComponent } from 'src/app/SharedModules/Components/Mat-SnackBar/Mat-SnackBar.component';
import { MatSnackBar } from '@angular/material/snack-bar';

import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import * as _moment from 'moment';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { NgxSpinnerService } from 'ngx-spinner';

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
  selector: 'InvoiceModal',
  templateUrl: './InvoiceModal.component.html',
  styleUrls: ['./InvoiceModal.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class InvoiceModalComponent implements OnInit {

  displayedColumns: string[] = ['print', 'invoiceNo', 'pageNo', 'customer', 'amount'];

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
  ) { }

  ngOnInit(): void {
    
    this.InvoicesForm = this.fb.group({
      'customer': ['Customer'],
      'allCustomer': ['AllCustomer'],
      'datePrint': [((new Date()).toISOString())],
      'dateOverDue': [''],
    })

    this.getBtnValue(1);
  }

  closeDialog(): void {
    this.dialog.closeAll();
  }

  // Check Radion btn value
  public getBtnValue(value) {
    
    this.invoiceDataList = [];
    if (value == 1) {
      this.requestModel.Printtype = this.InvoicesForm.value.customer;
      this.requestModel.CustomerId = (this.data.cusId ? this.data.cusId : 0);
      this.requestModel.InvoiceId = -1;
      this.requestModel.Dayoverdue = "";
      this.requestModel.Dateprinted = "";
      this.checkBox = false;
      this.check = false;
    } else if (value == 2) {
      this.requestModel.Printtype = this.InvoicesForm.value.allCustomer;
      this.requestModel.CustomerId = -1;
      this.requestModel.InvoiceId = 0;
      this.requestModel.Dayoverdue = "";
      this.requestModel.Dateprinted = "";
      this.checkBox = false;
      this.check = false;

    } else if (value == 3) {
      
      this.requestModel.Printtype = "PrintedDate";
      this.requestModel.CustomerId = -1;
      this.requestModel.InvoiceId = -1;
      this.requestModel.Dayoverdue = "";
      this.requestModel.Dateprinted = moment(this.InvoicesForm.value.datePrint).format('MM-DD-YYYY');
      this.checkBox = false;
      this.check = false;
    } else {
      this.requestModel.Printtype = "DayOverDue";
      this.requestModel.CustomerId = -1;
      this.requestModel.InvoiceId = -1;
      this.requestModel.Dayoverdue = this.InvoicesForm.value.dateOverDue;
      this.requestModel.Dateprinted = "";
    }
    this.getPrintAllInvoices();
    // this.printAllCheckbox = true;
  }

  dateEvent(type: string, event: MatDatepickerInputEvent<Date>) {
    
    this.printDateRadio = event.value ? false : true;
  }

  public dayEvent(value) {
    
    this.dueDateRadio = value ? false : true;
  }

  // Get all print Invoices
  public getPrintAllInvoices() {
    
    this.invoiceDataList =[];
    this.invoiceService.getPrintAllInvoices(this.requestModel).subscribe(res => {
      this.dataSource = null;
       (res !=null) ? this.dataSource = res : this.notFoundData = true; 
      this.notFoundData = res.length > 0 ? false : true;
      this.spinner.show();
      if(res.length > 0){
      res.map(data => {
        data.checkbox = false;
        return;
      })
      // this.dataSource = res;
      this.storeInvoiceData = res;
     }
      //this.allCheckBox(Event);
      setTimeout(() => {
        this.spinner.hide();
      }, 500);
    }, error => {
      setTimeout(() => {
        this.spinner.hide();
      }, 200);
    })
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
      // this.invoiceDataList = this.storeInvoiceData;
      // this.invoiceDataListNew = this.removeDuplicates(this.invoiceDataList, "customerId");
      // this.invoiceDataList = [];
      // this.invoiceDataList =  this.invoiceDataListNew;
      this.checkBox = false;
    }

  }


  // Checkbox click
  listCheckbox(index: number, value: any, invoiceId: number) {
    if (value.checked == true) {
      
      this.checkBox = value.checked;
      this.dataSource[index].checkbox = value.checked;
      const ind = this.storeDeletedIndex.findIndex(x => x.invoiceId == invoiceId);
      if (ind > -1) {
        this.invoiceDataList.push(this.storeDeletedIndex[ind]);
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
      this.storeDeletedIndex.push(this.invoiceDataList[index]);
      this.invoiceDataList.splice(index, 1);
      if(this.invoiceDataList.length < 0){
        this.checkBox = false;
      }
      //this.invoiceDataList = this.removeDuplicates(this.invoiceDataList, "customerId");
    }
    // this.checkBox = !this.checkBox;
    // this.invoiceDataList;
  }


  print(){
    // console.log(this.storeInvoiceData);
    
    if(this.invoiceDataList.length > 0 && this.checkBox ){

      this.invoiceDataListNew = this.removeDuplicates(this.invoiceDataList, "customerId");
      // this.invoiceDataList = [];
      this.invoiceDataList =  this.invoiceDataListNew;
      this.printData()
    }else{
        const message = "Please select record to be printed";
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

  // Print function
  printData(): void {
   
    let printContents, popupWin, printbutton;
    printbutton = document.getElementById('inputprintbuttonModal').style.display = "none";
    printContents = document.getElementById('printDivModal').innerHTML;
    popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
    popupWin.document.open();
    popupWin.document.write(`
      <html>
      <head>

      <title>Print tab</title>
      <style media="print">
      
      * {
      -webkit-print-color-adjust: exact; /*Chrome, Safari */
      color-adjust: exact; /*Firefox*/
      box-sizing: border-box;
      font-family: Roboto, "Helvetica Neue", sans-serif;
      }
      .row{
      display:flex;
      flex-direction:row;
      width:100%;
      justify-content:space-arround;
      border-bottom: 1px solid #ccc;
      padding-bottom:20px;
      margin-bottom:20px;
      }
      .row h1 ,.row h2 ,.row h3,.row h4{
      font-size:25px;
      }
      h3{
      text-align: center;
      }
      .row .col-md-6{
      width:50%;
      border-bottom: none;
      border-top: none;
      }
      
      table{
      width:100%;
      margin-top:50px;
      }
      table tr:nth-child(even) {
      background: #f5f5f5;
      }
      table thead tr th {
      font-size: 12px;
      text-align:left;
      background-color:#000;
      color:#fff;
      padding:10px;
      }
      table tbody tr td {
      padding:10px;
      font-size: 12px;
      }
      .csRadioBtn {
      flex-flow: wrap;
      position: relative;
      margin-top:-10px;
      }
      .csRadioBtn.invoiceMethod .radioBtn {
      min-width: 90px;
      padding-left: 22px;
      }
      .csRadioBtn .radioBtn {
      line-height: 24px;
      }
      .radioBtn {
      display: block;
      position: relative;
      padding-left: 25px;
      cursor: pointer;
      -webkit-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
      user-select: none;
      }
      .radioBtn input {
      position: absolute;
      opacity: 0;
      cursor: pointer;
      }
      .radioBtn input:checked ~ .checkmark {
      background-color: #04773B;
      }
      .radioBtn input:checked ~ .checkmark:after {
      display: block;
      }
      
      .radioBtn .checkmark {
      position: absolute;
      top: 3px;
      left: 0;
      height: 16px;
      width: 16px;
      background-color: #ddd;
      border-radius: 50%;
      }
      .radioBtn .checkmark:after {
      top: 5px;
      left: 5px;
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: white;
      content: "";
      position: absolute;
      display: none;
      }
      .radioBtn.checkBox .checkmark {
      height: 15px;
      width: 15px;
      border-radius: 0;
      }
      .radioBtn.checkBox .checkmark:after {
      top: 3px;
      left: 3px;
      width: 8px;
      height: 3px;
      border-radius: 0;
      border-bottom: 2px solid #fff;
      border-left: 2px solid #fff;
      transform: rotate(-45deg);
      -webkit-transform: rotate(-45deg);
      -moz-transform: rotate(-45deg);
      -ms-transform: rotate(-45deg);
      background-color: transparent;
      }
      
      
      </style>
      </head>
    <body onload="window.print();window.close()"> 

    ${printContents}</body>
      </html>`
    );
    printbutton = document.getElementById('inputprintbuttonModal').style.display = "inline-block";
    popupWin.document.close();
  }

}
