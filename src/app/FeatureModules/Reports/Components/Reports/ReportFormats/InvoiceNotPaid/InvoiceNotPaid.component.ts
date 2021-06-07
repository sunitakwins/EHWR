import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import * as moment from 'moment';
import { ExcelService } from 'src/app/FeatureModules/Reports/Services/Excel.service';
import { ReportsService } from 'src/app/FeatureModules/Reports/Services/Reports.service';

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
  selector: 'app-InvoiceNotPaid',
  templateUrl: './InvoiceNotPaid.component.html',
  styleUrls: ['./InvoiceNotPaid.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class InvoiceNotPaidComponent implements OnInit {
  @Input('invoiceNotPaidBoolean') invoiceNotPaidBoolean: any
  public JobTypePrintForm: FormGroup;
  public printData: any =[];
  
  public invoiceNotPaidValue1: boolean = false;
  public years : any = [];
   cusTypeId: any;
   totalAmount: any;
   totalAmountPaid: any;


  // report list data
  displayData: any = [
    {
      column1: "Page No.",
      column2: "Invoice",
      column3: "Customer Name",
      column4:  "Job Date",
      column5: "Due Date",
      column6: "Invoice Amount",
      column7: "Outstanding Amount",
    }
  ]
  noDatafound: boolean = false;
 
  constructor(private fb: FormBuilder, private reportService: ReportsService, private excelService: ExcelService) { }

  ngOnInit() {
    this.JobTypePrintForm = this.fb.group({
      from : [moment().startOf('month').format(),Validators.required],
      to: [new Date(), Validators.required],
    }) 
  }

  ngOnChanges(): void {
    
    this.invoiceNotPaidValue1 = this.invoiceNotPaidBoolean.invoiceNotPaidValue;
    this.cusTypeId = this.invoiceNotPaidBoolean.custTypeId;
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
  clearDate(){
    this.JobTypePrintForm.patchValue({
      from : [],
      to: [],
      // months:[]
    })
  }
// get Data from api
getInvoiceNotPaidData(){
        
  const params = {
    CustomerTypeId: (this.cusTypeId != 5 && this.cusTypeId != undefined) ? this.cusTypeId : -1,
    ReportStartDate: moment(this.JobTypePrintForm.value.from).format('MM/DD/yyyy'),
    ReportEndDate: moment(this.JobTypePrintForm.value.to).format('MM/DD/yyyy')
  }
  if(this.JobTypePrintForm.valid){
    this.reportService.getInvoiceNotPaid(params).subscribe(res => {
      // console.log(res);
      
      this.printData = res;
      this.noDatafound = (this.printData.length > 0) ? true : false;
      if(this.printData.length > 0){
      this.totalAmountPaid =res[0].totalAmountPaid;
      this.totalAmount = res[0].totalAmount;
      }
    }, error => {
      // console.log(error);
    })
  }else{
    const controls = this.JobTypePrintForm.controls
    Object.keys(controls).forEach(controlName => controls[controlName].markAsTouched());
    return false;
  }
}

   // Export to Excel
   excelExport(){
  if(this.JobTypePrintForm.valid){
    this.getInvoiceNotPaidData();
    setTimeout(() => {
    let element, fileName;
    fileName = 'InvoiceNotPaidData.xlsx';
    element = document.getElementById(`InvoiceNotPaidData`);
    this.excelService.exportexcel(element , fileName);
    }, 2000);
  }else{
    const controls = this.JobTypePrintForm.controls
    Object.keys(controls).forEach(controlName => controls[controlName].markAsTouched());
    return false;
  }
 
 }

    // print Function
    print() {
      this.getInvoiceNotPaidData();
      setTimeout(() => {
        let printContents, popupWin, printbutton;
        printbutton = document.getElementById('inputprintbutton6').style.display = "none";
        printContents = document.getElementById('InvoiceNotPaidPrintDiv').innerHTML;
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
    .font-size{
      font-size: 13px;
      position: fixed;
      bottom: 0;
      padding-bottom: 2rem !important;
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
    .pagebreak {page-break-after: always;}
    
    table thead tr:first-child {
      background-color: #04773B;
      color: #fff;
    }
     table tbody td .alPrice h6 span {
      font-weight: normal;
      font-size: 18px;
      margin-left: 15px;
    }
    table{
      width : 100% ;
    }  
    
    
   table tr td:first-child {
      border-left: none;
      padding: 2px;
    }
    table th {        
      padding: 2px;
      border-top: none;
      border-left: 1px solid #ccc;
    }
    
  table td  {        
       padding: 2px ;
      border-top: none;
      border-left: 1px solid #ccc;
    }
    
    table {
      border-right: 1px solid #ccc;
    }
    
          </style>
          </head>
          <body onload="window.print();window.close()"> 
    
          ${printContents}
          
          </body>
          </html>`)

        printbutton = document.getElementById('inputprintbutton6').style.display = "inline-block";
        popupWin.document.close();
  
      }, 2000)
       
    }
  
}
