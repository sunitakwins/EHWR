import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReportsService } from 'src/app/FeatureModules/Reports/Services/Reports.service';
import * as moment from 'moment';

@Component({
  selector: 'app-InvoiceSent',
  templateUrl: './InvoiceSent.component.html',
  styleUrls: ['./InvoiceSent.component.scss']
})


export class InvoiceSentComponent implements OnInit {
  @Input('invoiceSentBoolean') invoiceSentBoolean: any
  public JobTypePrintForm: FormGroup;
  // public printData: any;
  public invoiceSentArray: any = [];
  public invoiceSentValue1: boolean = false;
  public totalAmountPaid :any;
   public years : any = [];
   cusTypeId: any;
  
  // report list data
  displayData: any = [
    {
      column1: "Page No.",
      column2: "Invoice",
      column3: "Customer ",
      column4: "Job Date",
      column5: "Due Date",
      column6:  "Amount",
      column7: "Date Paid" ,
      column8: "Amt. Paid",
    }
  ]
  noFoundData: boolean;

  // months dropdown list 
  // months: months[] = [
  //   {value:0, viewValue: 'January'},
  //   {value:1, viewValue: 'February'},
  //   {value:2, viewValue: 'March'},
  //   {value:3, viewValue:'April'},
  //   {value:4, viewValue:'May'},
  //   {value:5, viewValue:'June'},
  //   {value:6, viewValue:'July'},
  //   {value:7, viewValue:'August'},
  //   {value:8, viewValue:'September'},
  //   {value:9, viewValue:'October'},
  //   {value:10, viewValue:'November'},
  //   {value:11, viewValue:'December'}
  // ];


  constructor(private fb: FormBuilder,
   
    private reportService: ReportsService) { }

  ngOnInit() {
   
    this.JobTypePrintForm = this.fb.group({
      from : [moment().startOf('month').format(),Validators.required],
      to: [new Date(), Validators.required],
      // month:[moment().format('MMMM,YYYYY')]
      // months:[],
      // years:[]
    })
    this.getYearsList();
    // console.log('Invoice Paid :',this.invoicePaidBoolean);
  }

  ngOnChanges(): void {
    
    this.invoiceSentValue1 = this.invoiceSentBoolean.invoiceSentValue;
    this.cusTypeId = this.invoiceSentBoolean.cusTypeId;
    // console.log('Invoice Sent :',this.invoiceSentBoolean);
  }
  
  // clear dates
  clearDate(){
    this.JobTypePrintForm.patchValue({
      from : [],
      to: [],
      // months:[]
    })
  }

  // get year 
  getYearsList(){
    let year = new Date().getFullYear();
    this.years.push(year);
    for (var i = 1; i < 25; i++) {
        this.years.push(year + i);
    }
    
  }

  
// print Function
  print() {
    
    const params = {
      CustomerTypeId:(this.cusTypeId != 5 && this.cusTypeId != undefined) ? this.cusTypeId : -1,
      ReportStartDate: moment(this.JobTypePrintForm.value.from).format('MM/DD/yyyy'),
      ReportEndDate: moment(this.JobTypePrintForm.value.to).format('MM/DD/yyyy')
     };

    if(this.JobTypePrintForm.valid){
      
      this.reportService.getInvoiceSent(params).subscribe(res => {
        // console.log(res);
        
        // if(res.length > 0){
          this.invoiceSentArray = res;
          console.log('invoice Sent :', this.invoiceSentArray);
          // this.totalAmountPaid = res[0].totalAmountPaid;
          // this.noFoundData = false;
        // }else{
        //   this.noFoundData = true;
        // } 
       
      }, error => {
        console.log(error);
      })
    }else{
      const controls = this.JobTypePrintForm.controls
      Object.keys(controls).forEach(controlName => controls[controlName].markAsTouched());
      return false;
    }
    

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
min-width: 280px;
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
.table-responsive .table{
width : 100% ;
}

.table-responsive .tableBodyScroll td {
border-right: 1px solid #ccc;
padding: 15px 15px;
border-top: none;
}
.table-responsive .tableBodyScroll tr:last-child td {
border-right: 1px solid #ccc;
padding: 15px 15px;
border-top: 1px solid #ccc;
}
.removeLastBorder.table-responsive .tableBodyScroll tr:last-child td {
border-top: none;
}
.table-responsive .tableBodyScroll th {
padding: 10px 15px;
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
.table-responsive table thead tr:first-child {
  background-color: #04773B;
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
