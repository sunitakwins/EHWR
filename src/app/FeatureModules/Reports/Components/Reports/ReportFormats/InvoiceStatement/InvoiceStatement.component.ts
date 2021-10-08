import { map } from 'rxjs/operators';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CustomerRequestModel } from 'src/app/FeatureModules/Customer/Models/Customer/CustomerRequestModel';
import { ReportsService } from 'src/app/FeatureModules/Reports/Services/Reports.service';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material/core';
import * as _moment from 'moment';
import { Moment } from 'moment';
import { MatDatepicker } from '@angular/material/datepicker';
import { ExcelService } from 'src/app/FeatureModules/Reports/Services/Excel.service';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import { InvoiceService } from 'src/app/FeatureModules/Customer/Services/InvoiceService/Invoice.service';
import { MatSnackBarComponent } from 'src/app/SharedModules/Components/Mat-SnackBar/Mat-SnackBar.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgxSpinnerService } from 'ngx-spinner';
// const moment = _rollupMoment || _moment;
const moment = _moment;


// month year format
export const MY_FORMATS = {
  parse: {
    dateInput: 'MM/YYYY',
  },
  display: {
    dateInput: 'MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};


@Component({
  selector: 'app-InvoiceStatement',
  templateUrl: './InvoiceStatement.component.html',
  styleUrls: ['./InvoiceStatement.component.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})


export class InvoiceStatementComponent implements OnInit {
  @Input('invoiceStatementBoolean') invoiceStatementBoolean: any;
  public invoiceStatementValue1: boolean = false;
  public cusTypeId: any;

  public allCustomers: any;
  public customerOptions: any;

  public invoiceStatementData: any;
  invoiceStatementDataValue: boolean = false;
  isVerifyNullEmails: boolean = false;
  isSendstatement : boolean = false;
  public customerRequestModel = new CustomerRequestModel();

  JobTypePrintForm: FormGroup;

  dataArray = [{
    customerName: '',
    customerAddress: '',
    invoiceDetails: [{
      InvoiceId: '',
      DueDate: '',
      Amount: '',
      Ref: '',
      Address: '',
      TotalAmountDue: ''
    }],
    overDueDays: [{
      customerId:'',
      Current: '',
      Days30: '',
      Days60: '',
      Days90: '',
      More90Days: '',
      TotalDue: ''
    }]
  }];


  date = new FormControl(moment(), [Validators.required]);

  finalDate: string;
  startDate: string;
  startDate1: string;
  finalDate1: string;
  daysArray: any[];
  invoiceIdArray: any[];
  emailArr: any[];
  noEmailArr: any[];
  monthYear: any;


  constructor(private fb: FormBuilder, private excelService: ExcelService,
    private spinner: NgxSpinnerService, public snackBar: MatSnackBar,
    private reportService: ReportsService) {

  }

  ngOnInit() {

    this.JobTypePrintForm = this.fb.group({
      customerId: [''],
    })
    this.getCustomerBySearch();
  }


  ngOnChanges() {
    this.invoiceStatementValue1 = this.invoiceStatementBoolean.invoiceStatementValue;
    this.cusTypeId = this.invoiceStatementBoolean.custTypeId;
  }


  // Month year datepicker function
  chosenYearHandler(normalizedYear: Moment) {
    
    const ctrlValue = normalizedYear;
    ctrlValue.year(normalizedYear.year());
    this.date.setValue(ctrlValue);
  }

  chosenMonthHandler(normalizedMonth: Moment, datepicker: MatDatepicker<Moment>) {
    const ctrlValue = this.date.value;
    ctrlValue.month(normalizedMonth.month());
    this.date.setValue(ctrlValue);
    const _month = (normalizedMonth["_i"].month) + 1;
    this.startDate = normalizedMonth["_i"].year + "/" + _month + "/" + + normalizedMonth["_i"].date;
    const monthYear = normalizedMonth["_i"].year + "-" + _month;
    const days = moment(monthYear, "YYYY-MM").daysInMonth();
    this.finalDate = normalizedMonth["_i"].year + "/" + _month + "/" + days;
    datepicker.close();
  }


  //  get Customer List Data  ============================================
  public displayCustomer(result?: any): string | undefined {
    return result ? result.customerName : undefined;
  }

  public searchCustomer(val) {
    this.customerRequestModel.SearchValue = val;
    this.getCustomerBySearch();
  }

  private getCustomerBySearch() {
    this.customerRequestModel.CustomerId = -1;
    this.reportService.getCustomer(this.customerRequestModel).subscribe(res => {
      // console.log(res);
      this.allCustomers = res;
      this.customerOptions = res;
    }, error => {
      console.log(error);
    })
  }

  // clear dates
  clearDate() {

    this.JobTypePrintForm.patchValue({
      customerId: null,
    })
    this.date.setValue(moment());
  }

  clearFilter() {
    this.JobTypePrintForm.patchValue({
      customerId: null,
    });

    this.date.updateValueAndValidity;
    this.date.patchValue(null);
    // this.date.setValue('');
  }

  //=============== get Data from api =====================================
  getInvoiceStmtData() {

    // get date at the time of page initialilization
    if (this.date.value == null) {
      /// do nothing
    } else {
      const ctrlValue = this.date.value._d;

      let StartDate1 = ctrlValue.getFullYear() + '/' + (ctrlValue.getMonth() + 1) + '/' + '01';
      let month = ctrlValue.getMonth() + 1;
      // let days = moment(month, "YYYY-MM").daysInMonth();
      let days = new Date(ctrlValue.getFullYear(), month, 0).getDate();
      let finalDate1 = ctrlValue.getFullYear() + '/' + (ctrlValue.getMonth() + 1) + '/' + days;
        //
        if(month < 10){
          month = '0'+ month
        }else{
          month = month
        }
      this.monthYear =  (month) + '/' + ctrlValue.getFullYear();

     
      //  api request params 
      const customerId = this.JobTypePrintForm.controls.customerId.value === null ?  this.JobTypePrintForm.controls.customerId.value :this.JobTypePrintForm.controls.customerId.value.customerId;
      const params = {
        CustomerId: (customerId == null) ? -1 : customerId,
        CustomerTypeId: (this.cusTypeId != 5 && this.cusTypeId != undefined) ? this.cusTypeId : -1,
        StartDate: this.startDate == undefined ? StartDate1 : this.startDate,
        EndDate: this.finalDate == undefined ? finalDate1 : this.finalDate,
        SendStatement : (this.isSendstatement) ? true : false
      }

      if (this.JobTypePrintForm.valid) {
        
        this.reportService.getInvoiceStatement(params).subscribe((res: any) => {
          if (res.length > 0) {
            this.invoiceStatementData = res;
            this.bindDataInTable();
          }
            this.invoiceStatementDataValue = (res.length > 0) ? true : false;
        
        }, error => {
          console.log(error);
        });
      } else {
        const controls = this.JobTypePrintForm.controls
        Object.keys(controls).forEach(controlName => controls[controlName].markAsTouched());
        return false;
      }
    }
  }

  // Bind data in table
  bindDataInTable() {

    if (this.dataArray) {
      this.dataArray == null;
    }
    this.dataArray = [];
    this.emailArr = [];
    this.invoiceIdArray = [];
    this.invoiceStatementData.forEach(data => {
      let dataInvoiceDetail = JSON.parse(data.invoices);
      let daysData = JSON.parse(data.invoiceOverdue);
      let objData = {
        customerName: data.customerName,
        customerAddress: data.customerAddress,
        customerDetailAddress: data.customerDetailAddress,
        customerEmailId: data.customerEmailId,
        monthEnding: data.monthEnding,
        invoiceDetails: dataInvoiceDetail,
        overDueDays: daysData,
      };

      if (data.customerEmailId == null) {
        
        this.emailArr.push(data);
      } else {

      }
      this.dataArray.push(objData);
    });

  }


  // remove duplicate values from json array
  removeDuplicates(originalArray, prop) {
    var newArray = [];
    var lookupObject = {};
    for (var i in originalArray) {
      lookupObject[originalArray[i][prop]] = originalArray[i];
    }
    for (i in lookupObject) {
      newArray.push(lookupObject[i]);
    }
    return this.invoiceIdArray = newArray;
  }


  // send statement
  sendStatement() {
    if (this.date.value != null) {
      this.spinner.show();
      this.isSendstatement = true;
      this.getInvoiceStmtData();
      
      setTimeout(() => {
        // to send invoices to the customer
        if (this.invoiceStatementDataValue) {
          
          if (this.dataArray.length > 0) {
            if (this.emailArr.length > 0 && this.emailArr !== null) {
              this.isVerifyNullEmails  = true;
              this.dataArray = [];
              this.emailArr.forEach(data => {
                let dataInvoiceDetail = JSON.parse(data.invoices);
                let daysData = JSON.parse(data.invoiceOverdue);
              let objData = {
                customerName: data.customerName,
                customerAddress: data.customerAddress,
                customerDetailAddress: data.customerDetailAddress,
                customerEmailId: data.customerEmailId,
                monthEnding: data.monthEnding,
                invoiceDetails: dataInvoiceDetail,
                overDueDays: daysData,
              };
              this.dataArray.push(objData);
            });
            this.print2();
            }else{
              let msg ="Invoice Statement has sent through email.";
              this.openSnackBar(msg, 'hello');
            }
          } else {
            
            let msg ="No record found.";
            this.openSnackBar(msg, 'hello');
            setTimeout(() => {
              this.spinner.hide();
            },200);
          }
        }else{
        
          let msg ="No record found.";
          this.openSnackBar(msg, 'hello');
          setTimeout(() => {
            this.spinner.hide();
          },200);
        }
      }, 5000);
      setTimeout(() => {
        this.spinner.hide();
      },5300);
    }
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

  print2() { 
    // this.spinner.show();
    setTimeout(() => {
      if (this.invoiceStatementDataValue && this.isVerifyNullEmails) {
        setTimeout(function () {
          let printContents, popupWin, printbutton;
          printbutton = document.getElementById('inputprintbutton7').style.display = "none";
          printContents = document.getElementById('invoiceStatementPrintDiv').innerHTML;
          popupWin = window.open('', 'top=0,left=0,height=100%,width=auto');
          popupWin.document.open();
          popupWin.document.write(`
          <html>
            <head>
              <title>Print tab</title>
              <style>
              .pagebreak {page-break-after: always;}
              .statementTemplate{
                font-family: 'Lora', serif;
                box-sizing: border-box;
                // margin: 0 auto;
                display: flex;
                padding: 20px;
                background-color: #fff;
                box-shadow: 0 0 10px rgb(0 0 0 / 10%);
                font-size: 13px;
                flex-direction: column;
                position: relative;
                height:auto;
                padding-bottom:100px;
              }
              .statementTemplate table ,.statementTemplate table thead,.statementTemplate table tbody ,.statementTemplate table tr{		
                width: 100%;
              }
              .infoWrapper .logoImage{
                width: 150px;
              }
              .infoWrapper h5{
                font-size: 20px;
                margin: 5px 0;
                text-align: left;
                box-sizing: border-box;
              }
              .infoWrapper  p{
                    margin: 0;
                font-size: 14px;
                text-align: left;
                box-sizing: border-box;
                line-height: 16px;
              }
              .infoWrapper h4{
                box-sizing: border-box;
                color: #f00;
                margin: 0;
                display: flex;
                align-items: center;
                justify-content: flex-start;
                font-size: 18px;
                padding-left: 30px;
              }
              .infoWrapper h4 span{
                font-weight: 800;
                font-family: 'Roboto', sans-serif;
                font-size: 22px;
                margin: 0 5px;
              }
              .infoWrapper h6{
                margin: 0;
                font-size: 14px;
                font-weight: 600;
                text-shadow: 3px 3px 4px rgb(0 0 0 / 30%);
                color: #014711;
                box-sizing: border-box;
              }
              .addressWqrap {
                margin-top: 30px;
              }
              .addressCol{
                margin-top: 20px;
                width: 100%;
              }
              .addressCol table, .addressCol table tr{		
                width: 100%;
              }
              .addressCol table td{
                vertical-align: top;
              }
              .dateWraper {
                text-align: right;
              }
              .addressWqrap p{
                margin: 0;
                line-height: 18px;
                font-weight: 400;
                font-size: 14px;
                font-family: 'Roboto', sans-serif;
              }
              .dateWraper h1{
                margin: 0;
                font-size: 26px;
                text-transform: uppercase;
                font-family: 'Roboto', sans-serif;
              }
              .dateWraper p{
                margin: 0;
              }
              .dataTableWrap{
                margin-bottom: 10px;
                margin-top: 30px;
              }
              .dataTableWrap h3{
                margin-bottom: 10px;
                font-size: 18px;
                margin-top: 0;
              }
              .dataTableWrap table {
                border: 1px solid #ccc;
                width: 100%;
              }
              .dataTableWrap table th,.dataTableWrap table td{
                border-right: 1px solid #ccc;
                border-bottom: 1px solid #ccc;
                padding: 3px;
                font-size: 14px;
                text-align: center;
              }
              .dataTableWrap table tr:last-child td{
                border-bottom: none;
              }
              .dataTableWrap table tr td:last-child ,.dataTableWrap table tr th:last-child {
                border-right: none;
              }
              .tagLine{
                text-align: center;
                font-weight: 600;
                margin-top: 20px;
                font-size: 14px;
                width:100%;
              }
              .footerAddress{
                box-sizing: border-box;
                border-top: 1px solid #eee;
                margin-top:-100px;
                padding-top: 15px;
                width: 100%;
              }
              .footerAddress p{
                box-sizing: border-box;
                margin: 0 0 4px;
                font-size: 14px;
              }
            </style>
            </head>
        <body onload="window.print();window.close()">
    
        ${printContents}
    
        </body>
          </html>`
          );
          printbutton = document.getElementById('inputprintbutton7').style.display = "inline-block";
          popupWin.document.close();
        }, 2000);
      }
      this.spinner.hide();
    }, 500);
  }

  // ====================Print Data ===========================
  print() {
    
    if (this.JobTypePrintForm.valid && this.date.value != null) {
      this.spinner.show();
      this.isSendstatement = false;
      this.getInvoiceStmtData();
      setTimeout(() => {
        if (this.invoiceStatementDataValue) {
          setTimeout(function () {
            let printContents, popupWin, printbutton;
            printbutton = document.getElementById('inputprintbutton7').style.display = "none";
            printContents = document.getElementById('invoiceStatementPrintDiv').innerHTML;
            popupWin = window.open('', 'top=0,left=0,height=100%,width=auto');
            popupWin.document.open();
            popupWin.document.write(`
          <html>
            <head>
              <title>Print tab</title>
              <style>
              .pagebreak {page-break-after: always;}
              .statementTemplate{
                font-family: 'Lora', serif;
                box-sizing: border-box;
                // margin: 0 auto;
                display: flex;
                padding: 20px;
                background-color: #fff;
                box-shadow: 0 0 10px rgb(0 0 0 / 10%);
                font-size: 13px;
                flex-direction: column;
                position: relative;
                height:auto;
                padding-bottom:100px;
              }
              .statementTemplate table ,.statementTemplate table thead,.statementTemplate table tbody ,.statementTemplate table tr{		
                width: 100%;
              }
              .infoWrapper .logoImage{
                width: 150px;
              }
              .infoWrapper h5{
                font-size: 20px;
                margin: 5px 0;
                text-align: left;
                box-sizing: border-box;
              }
              .infoWrapper  p{
                    margin: 0;
                font-size: 14px;
                text-align: left;
                box-sizing: border-box;
                line-height: 16px;
              }
              .infoWrapper h4{
                box-sizing: border-box;
                color: #f00;
                margin: 0;
                display: flex;
                align-items: center;
                justify-content: flex-start;
                font-size: 18px;
                padding-left: 30px;
              }
              .infoWrapper h4 span{
                font-weight: 800;
                font-family: 'Roboto', sans-serif;
                font-size: 22px;
                margin: 0 5px;
              }
              .infoWrapper h6{
                margin: 0;
                font-size: 14px;
                font-weight: 600;
                text-shadow: 3px 3px 4px rgb(0 0 0 / 30%);
                color: #014711;
                box-sizing: border-box;
              }
              .addressWqrap {
                margin-top: 30px;
              }
              .addressCol{
                margin-top: 20px;
                width: 100%;
              }
              .addressCol table, .addressCol table tr{		
                width: 100%;
              }
              .addressCol table td{
                vertical-align: top;
              }
              .dateWraper {
                text-align: right;
              }
              .addressWqrap p{
                margin: 0;
                line-height: 18px;
                font-weight: 400;
                font-size: 14px;
                font-family: 'Roboto', sans-serif;
              }
              .dateWraper h1{
                margin: 0;
                font-size: 26px;
                text-transform: uppercase;
                font-family: 'Roboto', sans-serif;
              }
              .dateWraper p{
                margin: 0;
              }
              .dataTableWrap{
                margin-bottom: 10px;
                margin-top: 30px;
              }
              .dataTableWrap h3{
                margin-bottom: 10px;
                font-size: 18px;
                margin-top: 0;
              }
              .dataTableWrap table {
                border: 1px solid #ccc;
                width: 100%;
              }
              .dataTableWrap table th,.dataTableWrap table td{
                border-right: 1px solid #ccc;
                border-bottom: 1px solid #ccc;
                padding: 3px;
                font-size: 14px;
                text-align: center;
              }
              .dataTableWrap table tr:last-child td{
                border-bottom: none;
              }
              .dataTableWrap table tr td:last-child ,.dataTableWrap table tr th:last-child {
                border-right: none;
              }
              .tagLine{
                text-align: center;
                font-weight: 600;
                margin-top: 20px;
                font-size: 14px;
                width:100%;
              }
              .footerAddress{
                box-sizing: border-box;
                border-top: 1px solid #eee;
                margin-top:-100px;
                padding-top: 15px;
                width: 100%;
              }
              .footerAddress p{
                box-sizing: border-box;
                margin: 0 0 4px;
                font-size: 14px;
              }
            </style>
            </head>
        <body onload="window.print();window.close()">
    
        ${printContents}
    
        </body>
          </html>`
            );
            printbutton = document.getElementById('inputprintbutton7').style.display = "inline-block";
            popupWin.document.close();
          }, 2000);
          setTimeout(() => {
            this.spinner.hide()
          }, 300);
        } else {
          let msg = 'No Data found.'
          this.openSnackBar(msg, 'hello');
          setTimeout(() => {
            this.spinner.hide()
          }, 300);
        }
      }, 4200);

    } else {
      const controls = this.JobTypePrintForm.controls
      Object.keys(controls).forEach(controlName => controls[controlName].markAsTouched());
      return false;
    }
  }
}



