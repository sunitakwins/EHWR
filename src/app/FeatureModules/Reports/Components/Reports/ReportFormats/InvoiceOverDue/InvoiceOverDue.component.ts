import { Component, Input, OnInit } from '@angular/core';
import { ExcelService } from 'src/app/FeatureModules/Reports/Services/Excel.service';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
// import * as _ from 'underscore';
// import  {_.keyBy, _.mapValues }from 'Lodash';

@Component({
  selector: 'app-InvoiceOverDue',
  templateUrl: './InvoiceOverDue.component.html',
  styleUrls: ['./InvoiceOverDue.component.scss']
})
export class InvoiceOverDueComponent implements OnInit {
  grandTotalOfAmountDue1: any;
  grandTotalOfAmountPaid1: any;

  @Input('invoiceOverDueList') invoiceOverDueList: any;
  dataArray = [{
    days: '',
    totalAmountDue: '',
    totalAmountPaid: '',
    grandTotalOfAmountDue: '',
    grandTotalOfAmountPaid: '',
    invoiceDetails: [{
      InvoiceId: '',
      PageNo: '',
      CustomerName: '',
      JobAddress: '',
      JobDate: '',
      DateDue: '',
      AmountDue: '',
      Notes: [{
        // Date: '',
        // Notes: ''
      }]
    }]
  }];
  flatArray: any[];


  constructor(private excelService: ExcelService) { }

  ngOnInit() {

  }

  // get Data from api
  getInvoiceOverDueData() {

    const data = this.invoiceOverDueList;
    this.dataArray = [];

    this.invoiceOverDueList.forEach(data => {
      let objData = {
        days: data.dueGroup,
        totalRecords : data.totalRecords,
        totalAmountDue: data.totalAmountDue,
        totalAmountPaid: data.totalAmountPaid,
        grandTotalOfAmountDue: data.grandTotalAmountDue,
        grandTotalOfAmountPaid: data.grandTotalAmountPaid,
        invoiceDetails: [],
        // notes :[],
      };
      let dataInvoiceDetail = JSON.parse(data.invoiceDetails);
      dataInvoiceDetail.forEach(dataInvocies => {
        objData.invoiceDetails.push(dataInvocies);
      });
      //  let invoiceNotes = JSON.parse(dataInvoiceDetail.Notes);
      //  invoiceNotes.forEach(dataNotes => {
      //       objData.notes.push(dataNotes);
      //   });
      this.dataArray.push(objData);

    });

  }

// flat nested json
flatNestedJson(){
  let data = this.invoiceOverDueList;
  this.flatArray =[];
    data.flatMap(x=>x.invoiceDetails ? JSON.parse(x.invoiceDetails).forEach(detail=>{
      detail['NoteId'] = '';
      detail['Date']  = '';
      detail['Invoice Notes'] = '';
     
      if(detail.Notes){ JSON.parse(detail.Notes).forEach(note=>{
        if(note.NoteId) 
        {
          detail['NoteId'] = note.NoteId;
          detail['Date']  = note.Date;
          detail['Invoice Notes'] = note.Notes;
          
         }
         this.flatArray.push(detail);
         delete detail.Notes;
         
      });
      }else{
        this.flatArray.push(detail);
      }
      }) : null)

}

  // ================Export to Excel Data =================================
  excelExport() {
   
    this.getInvoiceOverDueData();
   
    this.flatNestedJson();

    setTimeout(() => {
       let fileName;
       fileName = 'invoiceOverDueData.xlsx';

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.flatArray);
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, fileName);
    }, 2000);
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE
    });
    FileSaver.saveAs(data, fileName);
  }

  // =================  Print functionality ========================
  print() {

    this.getInvoiceOverDueData();
    setTimeout(() => {
      let printContents, popupWin, printbutton;
      printbutton = document.getElementById('inputprintbutton5').style.display = "none";
      printContents = document.getElementById('printDivInvoiceOverDue').innerHTML;
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
     printbutton = document.getElementById('inputprintbutton5').style.display = "inline-block";
      popupWin.document.close();
    }, 1000);
  }

}
