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

  dataArray = [{
    customerName: '',
    customerAddress: '',
    invoiceDetails: [{
      InvoiceId: '',
      // InvoiceTo: '',
      // SendDate: '',
      DueDate: '',
      Amount: '',
      Ref: '',
      Address: '',
      TotalAmountDue: ''
    }]
  }];


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
    this.startDate =normalizedMonth["_i"].year  + "/" + _month + "/" + + normalizedMonth["_i"].date;
    const monthYear = normalizedMonth["_i"].year + "-" + _month;
    const days = moment(monthYear, "YYYY-MM").daysInMonth();
    this.finalDate = normalizedMonth["_i"].year  + "/" + _month + "/" +days ;

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
      customer: [],
    })
    this.date.setValue(new Date());
  }

  //=============== get Data from api =====================================

  getInvoiceStmtData() {
    // get date at the time of page initialilization
    
    const ctrlValue = this.date.value._d;

    // let sDay, sMonth, fDay, fMonth;

    // if(normalizedMonth["_i"].date < 10){
    //   sDay = '0'+ normalizedMonth["_i"].date
    // }else{
    //   sDay = normalizedMonth["_i"].date
    // }

    // if(_month < 10){
    //   sMonth = '0'+ _month
    // }else{
    //   sMonth = _month
    // }

    // this.startDate1 = sMonth + '/'+ sDay +'/'+ normalizedMonth["_i"].year
    
    // const monthYear = normalizedMonth["_i"].year + "-" + _month;
    // fDay = moment(monthYear, "YYYY-MM").daysInMonth();

    // if(_month < 10){
    //   fMonth = '0'+ _month
    // }else{
    //   fMonth = _month
    // }

    // this.finalDate1 = fMonth + '/'+ fDay +'/'+ normalizedMonth["_i"].year;


    let StartDate1 = ctrlValue.getFullYear() + '/' + (ctrlValue.getMonth() + 1) + '/' + '01';
    let month = ctrlValue.getMonth() +1;
    // let days = moment(month, "YYYY-MM").daysInMonth();
    let days = new Date(ctrlValue.getFullYear(), month, 0).getDate();
    let finalDate1 = ctrlValue.getFullYear() + '/' + (ctrlValue.getMonth() + 1) + '/' + days;
    
    //  api request params 
    const customerId = this.JobTypePrintForm.value.customerId.customerId;
    const params = {
      CustomerId: (customerId == null) ? -1 : customerId,
      CustomerTypeId: (this.cusTypeId != 5 && this.cusTypeId != undefined) ? this.cusTypeId : -1,
      StartDate: this.startDate == undefined ? StartDate1 : this.startDate,
      EndDate: this.finalDate == undefined ? finalDate1 : this.finalDate
    }
    // console.log(params);

    if (this.JobTypePrintForm.valid) {
      this.reportService.getInvoiceStatement(params).subscribe(res => {
        console.log('Invoice Stmt :', res);
        this.invoiceStatementData = res;
        this.bindDataInTable();
      }, error => {
        console.log(error);
      });
    } else {
      const controls = this.JobTypePrintForm.controls
      Object.keys(controls).forEach(controlName => controls[controlName].markAsTouched());
      return false;
    }
  }


  // Bind data in table
  bindDataInTable() {
    
    const data = this.invoiceStatementData;
    this.dataArray = [];
    this.invoiceStatementData.forEach(data => {
      let dataInvoiceDetail = JSON.parse(data.invoices);
      let objData = {
        customerName: data.customerName,
        customerAddress: data.customerAddress,
        invoiceDetails: dataInvoiceDetail
      };
      this.dataArray.push(objData);
    });
  }


  // ================Export to Excel Data =================================

  // excelExport() {
  //   this.getInvoiceStmtData();
  //   setTimeout(() => {
  //     const json  = this.invoiceStatementData;
  //     let element, fileName;
  //     fileName = 'InvoiceStatementData.xlsx';
  //     element = document.getElementById(`InvoiceStatementExcelData`);
  //     this.excelService.exportexcel(element, fileName);
  //     // ==========================================
  //   // const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
  //   // console.log('worksheet',worksheet);
  //   // const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
  //   // const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  //   // this.saveAsExcelFile(excelBuffer, fileName);
  //   }, 2000);
  // }

  // =========== save excel file ========================
  // private saveAsExcelFile(buffer: any, fileName: string): void {
  //   const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  //   const EXCEL_EXTENSION = '.xlsx';
  //   const data: Blob = new Blob([buffer], {
  //     type: EXCEL_TYPE
  //   });
  //   FileSaver.saveAs(data, fileName + EXCEL_EXTENSION);
  // }


  // ====================Print Data ===========================
  print() {

    if(this.JobTypePrintForm.valid){
    this.getInvoiceStmtData();

    // if(this.invoiceStatementData.length > 0){
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
            <style media="print">
  
  * {
  -webkit-print-color-adjust: exact; /*Chrome, Safari */
  color-adjust: exact; /*Firefox*/
  box-sizing: border-box;
  font-family: Roboto, "Helvetica Neue", sans-serif;
  }
  .pagebreak {page-break-after: always;}
  
  .page-break { display: block; page-break-before: always; }
  .row {
  display: flex;
  flex-wrap: wrap;
  }
  .ehwrLogo{
    margin-top:35px;
  }
  .col-sm-12 {
  flex: 0 0 100%;
  max-width: 100%;
  position: relative;
  }
  .col-md-6 {
  flex: 0 0 50%;
  max-width: 50%;
  position: relative;
  }
  header {
  background-color: transparent;
  }
  .loginWrapper {
  background-color: rgba(255, 255, 255, 0.97);
  box-shadow: none;
  padding: 0px;
  border-radius: 5px;
  margin-bottom: 50px;
  }
  .headerWrapper {
  padding: 15px;
  }
  h4.logoText {
  margin: 0 !important;
  line-height: 20px !important;
  font-size: 2.2rem;
  padding: 0 !important;
  color:#f00;
  }
  h4.logoText span {
  font-size: 20px;
  font-weight: normal;
  line-height: 18px !important;
  color:#000;
  }
  h6 {
  font-size: 20px;
  font-weight: normal;
  line-height: 18px !important;
  margin: 0 0 20px !important;
  padding: 0 !important;
  }
  .headerWrapper .invoiceRecipt {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  margin-top: 25px;
  float:right;
  }
  td.minWidth {
  min-width: 400px;
  }
  td.minWidth h6{
  text-align: center;
  margin-top:8px;
  }
  td.minWidth img{
  width:250px;
  }
  .colWidth{
    width:250px;
  }
  .footerNote{
  position: fixed;
  bottom: 0;
  padding-bottom: 2rem !important;
  }
  .footerNote p{
    font-size: 13px;
    font-family: Roboto, "Helvetica Neue", sans-serif;
    
    }
  
  .addressWrapper p ,.addressWrapper2 p{
  font-size: 17px;
  margin: 0 !important;
  line-height: 20px !important;
  padding: 0 !important;
  }
  .addressWrapper2 {
  width: 450px;
  text-align: center !important;
  margin-top: -50px;
  }
  .invoiceRecipt{
  margin-top: 40px;
  }
  
  .queryContent thead th{
  text-align:left;
  }
  
  .table-responsive .table{
  width : 100% ;
  }
  
  .table-responsive .tableBodyScroll td {
  border-right: 1px solid #ccc;
  padding: 15px 15px;
  }
  .table-responsive .tableBodyScroll th {
  padding: 10px 15px;
  }
  .text-center {
  text-align: center !important;
  }
  .text-center h6 {
  text-align: center !important;
  margin: 0 0 !important;
  padding: 0 !important;
  }
  .addressWrapper1 {
  margin-top:20px;
  margin-bottom:30px;
  }
  .addressWrapper1 h4{
  font-size:25px;
  line-height:25px;
  margin:0;
  padding:0;
  }
  .invoiceRecipt td {
  border: 1px solid #ccc;
  padding: 5px 10px;
  }
  .invoiceRecipt th {
  text-align:enter;
  padding: 5px 10px 20px;
  font-size:25px;
  }
  .invoiceRecipt td {
  border: 1px solid #ccc;
  padding: 5px 10px;
  }
  .borderBox {
  display: inline-block;
  border: 1px solid #ccc;
  padding: 10px 15px;
  min-width: 260px;
  }
  .borderBox p {
  font-size: 16px;
  margin: 0 !important;
  line-height: 18px !important;
  padding: 0 !important;
  }
  
  .invoiceRecipt {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  width:240px;
  }
  .dueDateCol .invoiceRecipt {
  width:240px;
  display: block;
  float:right;
  }
  .dueDateCol .invoiceRecipt table{
  width:100%;
  }
  .invoiceRecipt ul {
  padding: 0;
  list-style: none;
  }
  .invoiceRecipt ul li strong {
  min-width: 70px;
  display: inline-block;
  }
  .dueDateCol .addressWrapper {
  display: flex;
  align-items: flex-end;
  flex-direction: column;
  }
  .table-responsive table thead {
  background-color: #095239;
  color: #fff;
  }
  .table-responsive table thead th.comWidth {
  min-width: 120px;
  }
  .table-responsive table tbody td .alPrice h6 span {
  font-weight: normal;
  font-size: 18px;
  margin-left: 15px;
  }
  .table-responsive table tbody td .tgInclusive {
  border-top: 1px solid #eee;
  padding-top: 8px;
  }
  
  .statementWrapper{
    width:200px;
    text-align:center;
    margin-left:60px;
    margin-top:15px;
  }
  .statementWrapper h5{
    font-size:22px;
    margin:0;
  }
  .statementWrapper h5.monthYearWrap{
    margin-left:80px;
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
    // }else{
    //   alert('hii');
    // }
  }else{
    const controls = this.JobTypePrintForm.controls
    Object.keys(controls).forEach(controlName => controls[controlName].markAsTouched());
    return false;
  }
 }
}
