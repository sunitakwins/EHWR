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

  public customerRequestModel = new CustomerRequestModel();

  JobTypePrintForm: FormGroup;

  date = new FormControl(moment());
  finalDate: string;
  startDate: string;
  startDate1: string;
  finalDate1: string;

  constructor(private fb: FormBuilder, private excelService: ExcelService,
    private reportService: ReportsService) {

  }

  ngOnInit() {

    this.JobTypePrintForm = this.fb.group({
      // from : [moment().startOf('month').format(),Validators.required],
      // to: [new Date(), Validators.required],
      // date: new FormControl(moment()),
      customerId: [''],
    })
    this.getCustomerBySearch();


  }


  ngOnChanges() {
    this.invoiceStatementValue1 = this.invoiceStatementBoolean.invoiceStatementValue;
    this.cusTypeId = this.invoiceStatementBoolean.custTypeId;
    //console.log('Invoice Paid :',this.jobByEmployeeBoolean);
  }


  // Month year datepicker function
  chosenYearHandler(normalizedYear: Moment) {
    const ctrlValue = this.date.value;
    ctrlValue.year(normalizedYear.year());
    this.date.setValue(ctrlValue);
  }


  chosenMonthHandler(normalizedMonth: Moment, datepicker: MatDatepicker<Moment>) {
    const ctrlValue = this.date.value;
    ctrlValue.month(normalizedMonth.month());
    this.date.setValue(ctrlValue);
    const _month = (normalizedMonth["_i"].month) + 1;
    this.startDate = normalizedMonth["_i"].date + "/" + _month + "/" + normalizedMonth["_i"].year;
    const monthYear = normalizedMonth["_i"].year + "-" + _month;
    const days = moment(monthYear, "YYYY-MM").daysInMonth();
    this.finalDate = days + "/" + _month + "/" + normalizedMonth["_i"].year;
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
      // from: [],
      // to: [],
      // EmployeeId:[],
      // months:[]
    })
  }

  clearFilter() {
    this.JobTypePrintForm.patchValue({
      customer: [],
    })
    this.date = null;
  }

  // get Data

  getInvoiceStmtData(){
        // get date at the time of page initialilization
        const ctrlValue = this.date.value._d;
        let StartDate1 = ctrlValue.getFullYear() + '/' + (ctrlValue.getMonth() + 1) + '/' + '01';
        let days = moment(ctrlValue.getMonth(), "YYYY-MM").daysInMonth();
        let finalDate1 = ctrlValue.getFullYear() + '/' + (ctrlValue.getMonth() + 1) + '/' + days;
    
    
        //  api request params 
        const customerId = this.JobTypePrintForm.value.customerId.customerId;
        const params = {
          CustomerId: (customerId == null) ? -1 : customerId,
          CustomerTypeId: (this.cusTypeId != 5 && this.cusTypeId != undefined) ? this.cusTypeId : -1,
          StartDate: this.startDate == undefined ? StartDate1 : this.startDate,
          EndDate: this.finalDate == undefined ? finalDate1 : this.finalDate
        }
    
        console.log(params);
        if (this.JobTypePrintForm.valid) {
          this.reportService.getInvoiceStatement(params).subscribe(res => {
            console.log('Invoice Stmt :', res);
            this.invoiceStatementData = res;
          }, error => {
            console.log(error);
          });
        } else {
          const controls = this.JobTypePrintForm.controls
          Object.keys(controls).forEach(controlName => controls[controlName].markAsTouched());
          return false;
        }
  }

  // export to excel
  // ================Export to Excel Data =================================
 excelExport(){
  debugger
 this.getInvoiceStmtData();
 setTimeout(() => {
 let element, fileName;
 fileName = 'InvoiceStatementData.xlsx';
 element = document.getElementById(`InvoiceStatementExcelData`);
 this.excelService.exportexcel(element , fileName);
 }, 2000);
}

  // Print Data
  print() {
   this.getInvoiceStmtData();
    setTimeout(function () {
      let printContents, popupWin, printbutton;
      printbutton = document.getElementById('inputprintbutton1').style.display = "none";
      printContents = document.getElementById('printDiv').innerHTML;
      popupWin = window.open('', 'top=0,left=0,height=100%,width=100%');
      popupWin.document.open();
      popupWin.document.write(`
      <html>
        <head>
      
          <title>Print tab</title>
          <style media="print">dis

          *{
            font-family: Roboto, sans-serif ;
            box-sizing: border-box;
          }
          
          .page-break { display:block; page-break-after: always; }

          .taxInvoice {   
              margin: 0 auto;
              display: flex;
              padding: 10px ;
              background-color: #fff;
              box-shadow: 0 0 10px rgb(0 0 0 / 10%);
              font-size: 11px;
              flex-direction: column;
              width: 100%;
              justify-content: flex-start;          
          }
          .taxInvoice th,.taxInvoice td {
              vertical-align: top;
          }
          .taxInvoice table, .taxInvoice table thead, .taxInvoice table tbody, .taxInvoice table tr {
              width: 100%;
          }
          .tiLeftCol {
              width: 100%;
            padding-right: 6px;
          }
          .tiLeftCol h5 {
              font-size: 18px;
              margin: 0;
            text-align: right;
            padding-right: 20px;
          }
          .tiLeftCol h6 {
              margin: 0;
              font-size: 14px;
              text-align: right;
              font-weight: 500;
              text-shadow: 3px 3px 4px rgb(0 0 0 / 80%);
            padding-right: 10px;
            color:#014711;
          }
          .tiWrapper {
              display: flex;
              flex-direction: row;
              align-items: center;
             width: 100%;
            //  padding-left: 25px;
          }
          .tiRighttCol {
            width: 190px;
            // margin-top: -20px;
          }
          .tiLeftInnerWrap {
              display: flex;
          }
          .printTableWrapper {
            width: 100%;
          }
          .tiContent p {
              margin: 0;
              font-size: 13px;
            text-align: left;
            white-space: nowrap;
          }
          .tiContent {
              padding-left: 5px;
          }
          .tiContentWrap .tiPriceMatch {
              margin-left: 10px;
          }
          .redColor{
            color:#f00;
          }
          .tiRighttCol p {
              font-size: 12px;
              font-weight: 500;
            margin: 2px 0;
          }
          .tiLeftInnerWrap .tiContentWrap {
              display: flex;
              flex-direction: row;
              align-items: center;
          }
          .taxInvoice .mdText {
            margin: 10px 0 0;
            font-size: 18px;
            height: 40px;
            display: block;
            text-align: left;
            width:100%;
            float:left;
          }
          .mdText span{
            position: relative;
            top: -10px !important;
            display:inline-block;
            margin-top: -10px !important;
            left:20px !important;
          }
          .mdText img{
            position: relative;
            top: 10px !important;
            display:inline-block;
            margin-top: 10px !important;
            margin-left: 23px;
          }
          
          .tableBodyContent {
              display: flex;
            justify-content: space-between;
          }
          .tableBodyContent .tbRightCol,.tableBodyContent .tbLeftCol{
              display: flex;
            width:100%;
            flex-direction: column;
          }
          
          .dateWrapper {
              margin-top: 60px;
          }
          .invoiveIdWrapper {
              display: flex;
              flex-direction: column;
              justify-content: flex-end;
              width: 100%;
              align-items: flex-end;
          }
          .invoiveIdWrapper h1 {
              margin: 0;
              font-size: 26px;
              text-transform: uppercase;
          }
          .invoiveIdWrapper p{
             margin: 0px;
          }
          .jobAddressWrapper {
              margin-top: 12px;
          }
          .addressWrapper {
              margin-top: 15px;
          }
          .addressWrapper p {
              margin: 0;
              line-height: 18px;
              font-weight: 400;
              font-size: 15px;
          }
          .jobAddressWrapper p.textJustify {
              font-size: 15px;
          }
          .smSpace {
              margin: 0 15px;
          }
          .workComplete {
              margin-top: 30px;
          }
          .workComplete .smCaption {
              margin-bottom: 0;
          }
          .workComplete p {
              margin: 0;
          }
          table.taxInvoiceTable {
              margin-top: 30px;
              position:relative;
              top:30px;
              width:auto;
              display:block !important;
          }
          
          .taxInvoiceTable table, .taxInvoiceTable table thead, .taxInvoiceTable table tbody, 
          .taxInvoiceTable table tr,.fullwidthCol,.taxInvoiceTable{
            width: auto;
          }
          .taxInvoiceTable th {
              text-align: left;
              font-size: 15px;
              vertical-align: middle;
              text-transform: uppercase;
          }
          
          
          
          .taxInvoiceTable th,.taxInvoiceTable td{
            padding: 10px;
            text-align: right;
          }
          .taxInvoiceTable th:first-child {
            text-align: left;
          }
          .taxInvoiceTable td:first-child {
            text-align: left;
          }
          ul.amountTotal {
              padding: 10px 0 0;
              margin: 0;
              list-style: none;
              border-top: 1px solid #eee;
              width: 300px;
              float: right;
          }   
          ul.amountTotal li{
             display: flex;
              justify-content: space-between;
            padding: 5px 10px;
          }
              
          ul.amountTotal li strong,ul.amountTotal li span {
              width: 100%;
              text-align: right;
          }
          ul.amountTotal li strong{
              text-transform: uppercase;
          }
          .dueBalance {
            background: #f5f5f5 !important;
            padding: 10px;
            box-shadow: inset 0px 0px 70px rgb(0 0 0 / 10%) !important;
          }
          .banlDetails {
            border-top: 1px solid #eee;
              margin: 10px 0 0;
              padding-top: 10px;
          }
          .banlDetails p {
              margin: 0 0 4px;
          }
          .table-responsive table thead tr { 
            background-color: #f5f5f5 ;
            background: #f5f5f5 ;
            box-shadow: inset 0px 0px 70px rgb(0 0 0 / 10%) !important;
          }

</style>
        </head>
    <body onload="window.print();window.close()"> 

    ${printContents}
    
    </body>
      </html>`
      );
      printbutton = document.getElementById('inputprintbutton1').style.display = "inline-block";
      popupWin.document.close();
    }, 2000);
  }
}
