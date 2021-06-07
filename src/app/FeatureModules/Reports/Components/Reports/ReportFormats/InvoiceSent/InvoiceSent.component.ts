import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReportsService } from 'src/app/FeatureModules/Reports/Services/Reports.service';
import * as moment from 'moment';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material/core';
import { ExcelService } from 'src/app/FeatureModules/Reports/Services/Excel.service';


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
  selector: 'app-InvoiceSent',
  templateUrl: './InvoiceSent.component.html',
  styleUrls: ['./InvoiceSent.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})


export class InvoiceSentComponent implements OnInit {
  @Input('invoiceSentBoolean') invoiceSentBoolean: any
  public JobTypePrintForm: FormGroup;
  // public printData: any;
  public invoiceSentArray: any = [];
  public invoiceSentValue1: boolean = false;
  public totalAmountPaid: any;
  public years: any = [];
  cusTypeId: any;
  noDataFound : boolean = false;
  // report list data
  displayData: any = [
    {
      column1: "Page No.",
      column2: "Invoice",
      column3: "Customer ",
      column4: "Job Date",
      column5: "Due Date",
      column6: "Amount",
      column7: "Date Paid",
      column8: "Amt. Paid",
    }
  ]
  noFoundData: boolean;


  constructor(private fb: FormBuilder, private excelService: ExcelService,

    private reportService: ReportsService) { }

  ngOnInit() {

    this.JobTypePrintForm = this.fb.group({
      from: [moment().startOf('month').format(), Validators.required],
      to: [new Date(), Validators.required],
    })
    this.getYearsList();
    
  }

  ngOnChanges(): void {

    this.invoiceSentValue1 = this.invoiceSentBoolean.invoiceSentValue;
    this.cusTypeId = this.invoiceSentBoolean.cusTypeId;
    // console.log('Invoice Sent :',this.invoiceSentBoolean);
  }

  // On month year change
  onMonthYearChange(event : any){
    let startDate = new Date(event.StartDate);
    let finalDate = new Date(event.FinalDate);
    this.JobTypePrintForm.patchValue({
      from : startDate,
      to : finalDate,
    });
  }
  
  // clear dates
  clearDate() {
    this.JobTypePrintForm.patchValue({
      from: [],
      to: [],
      // months:[]
    })
  }

  // get year 
  getYearsList() {
    let year = new Date().getFullYear();
    this.years.push(year);
    for (var i = 1; i < 25; i++) {
      this.years.push(year + i);
    }

  }

  // get Data
  getInvoiceSentData() {
    const params = {
      CustomerTypeId: (this.cusTypeId != 5 && this.cusTypeId != undefined) ? this.cusTypeId : -1,
      ReportStartDate: moment(this.JobTypePrintForm.value.from).format('MM/DD/yyyy'),
      ReportEndDate: moment(this.JobTypePrintForm.value.to).format('MM/DD/yyyy')
    };

    if (this.JobTypePrintForm.valid) {

      this.reportService.getInvoiceSent(params).subscribe(res => {

        this.invoiceSentArray = res;
        this.noDataFound = (this.invoiceSentArray.length > 0) ? false : true;

      }, error => {
        console.log(error);
      })
    } else {
      const controls = this.JobTypePrintForm.controls
      Object.keys(controls).forEach(controlName => controls[controlName].markAsTouched());
      return false;
    }

  }

  // ================Export to Excel Data =================================
  excelExport() {
    if(this.JobTypePrintForm.valid){
      this.getInvoiceSentData();
      setTimeout(() => {
        let element, fileName;
        fileName = 'invoiceSentData.xlsx';
        element = document.getElementById(`invoiceSentData`);
        this.excelService.exportexcel(element, fileName);
      }, 2000);
    }else{
      const controls = this.JobTypePrintForm.controls
      Object.keys(controls).forEach(controlName => controls[controlName].markAsTouched());
      return false;
    }
  }

  
  // print Function
  print() {
    this.getInvoiceSentData();

    setTimeout(() => {
      let printContents, popupWin, printbutton;
      printbutton = document.getElementById('inputprintbutton10').style.display = "none";
      printContents = document.getElementById('invoiceSentPrintDiv').innerHTML;
      popupWin = window.open('', 'top=0,left=0,height=100%,width=auto');
      popupWin.document.open();
      popupWin.document.write(`
      <html>
      <head>
        <title>Print tab</title>
        <style media="print">
        
  * {
  -webkit-print-color-adjust: exact; /*Chrome, Safari */
  color-adjust: exact;  /*Firefox*/
  box-sizing: border-box;
  font-family: Roboto, "Helvetica Neue", sans-serif;
  }
  .pagebreak {page-break-after: always;}
  
  .table-responsive table thead tr:first-child {
    background-color: #04773B;
    color: #fff;
  }
  .table-responsive table tbody td .alPrice h6 span {
    font-weight: normal;
    font-size: 18px;
    margin-left: 15px;
  }
  .table-responsive .table{
    width : 100% ;
    }
    .removeLastBorder.table-responsive .tableBodyScroll tr:last-child td {
      border-top: none;
      }
      
      .table-responsive table thead th.comWidth {
        min-width: 120px;
      }
      
  .table-responsive table tbody td .tgInclusive {
    border-top: 1px solid #eee;
    padding-top: 8px;
  }
  .table-responsive .tableBodyScroll th {
    border-right: 1px solid #ccc;
  padding: 5px;
  border-top: none;
  }
  .table-responsive .tableBodyScroll tr:last-child td {
    border-right: 1px solid #ccc;
    padding: 5px;
    border-top: 1px solid #ccc;
  }
  .table-responsive .tableBodyScroll td {
      border-right: 1px solid #ccc;
      padding: 5px ;
      border-top: none;
  }
    .page-break  { display: block; page-break-before: always; }
  .row {
    display: flex;
    flex-wrap: wrap;
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
    padding: 0px;
    border-radius: 5px;
    margin-top: 0px !important;
  }
  .headerWrapper {
    padding: 15px;
  }
  h4.logoText {
  margin: 0 !important;
  line-height: 20px !important;
  font-size: 1.25rem;
  padding: 0 !important;
  }
  h4.logoText span {
  font-size: 16px;
  font-weight: normal;
  line-height: 18px !important;
  position: relative;
  top: 10px;        
  }
  span.mickyLogo img {
  width: 58px;
  }
  h6 {
  font-size: 16px;
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
  }
  td.minWidth {
  // min-width: 280px;
  }
  .font-size{
  font-size: 13px;
  position: fixed;
  bottom: 0;
  padding-bottom: 2rem !important;
  }
  
  .addressWrapper p ,.addressWrapper2 p{
  font-size: 13px;
  margin: 0 !important;
  line-height: 18px !important;
  padding: 0 !important;
  }
  .addressWrapper2 {
  max-width: 470px;
  text-align: center !important;
  margin-top: 15px;
  }
  .invoiceRecipt{
  margin-top: 80px;
  }
  
  .table-responsive{
  overflow-x: hidden;
  }
  .lgTable.table-responsive{
  overflow-x: auto;
  }
  
  
  
  
  .text-center {
  text-align: center !important;
  }
  .text-center h6 {
  text-align: center !important;
  margin: 0 0  !important;
  padding: 0 !important;
  }
  .invoiceRecipt td {
    border: 1px solid #ccc;
    padding: 5px 10px;
  }
  .invoiceRecipt th {
  padding: 5px 10px 0px;
  font-size:20px;
  line-height:20px;
  }
  
  .invoiceRecipt td {
  border: 1px solid #ccc;
  padding: 5px 10px;
  }
  .invoiceRecipt td.dynamicDate {
  border: none;
  text-align: right;
  }
  .borderBox {
  display: inline-block;
  border: 1px solid #ccc;
  padding: 10px 15px;
  min-width: 260px;
  border-radius: 5px;
  }
  .borderBox p {
  font-size: 16px;
  margin: 0 0 5px!important;
  line-height: 18px !important;
  padding: 0 !important;
  }
  .text-right {
  text-align: right !important;
  }
  .invoiceRecipt {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
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
  
  
  .mt-5, .my-5 {
    margin-top: 3rem !important;
  }
  .pb-3{
  padding-top: 2rem !important;
  padding-bottom: 4rem !important;
  }
  .pt-5{
  padding-top: 5rem !important;
  }
  
        </style>
        </head>
        <body onload="window.print();window.close()"> 
  
        ${printContents}
        
        </body>
        </html>`)
      printbutton = document.getElementById('inputprintbutton10').style.display = "inline-block";
      popupWin.document.close();

    }, 2000)

  }

}
