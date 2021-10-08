import { Component, Input, OnInit } from '@angular/core';
import { ExcelService } from 'src/app/FeatureModules/Reports/Services/Excel.service';

@Component({
  selector: 'app-InvoiceNotSent',
  templateUrl: './InvoiceNotSent.component.html',
  styleUrls: ['./InvoiceNotSent.component.scss']
})
export class InvoiceNotSentComponent implements OnInit {
  @Input('invoiceNotSentList') invoiceNotSentList: any;
  noDataFound: boolean;
  constructor(private excelService : ExcelService) { }

  ngOnInit() {
 
  }

  // ================Export to Excel Data =================================
  excelExport() {
    
    // setTimeout(() => {
      let element, fileName;
      fileName = 'invoiceNotSentData.xlsx';
      element = document.getElementById(`invoiceNotSentData`);
      this.excelService.exportexcel(element, fileName);
    // }, 2000);
  }

  print() {
    this.noDataFound = (this.invoiceNotSentList.length > 0) ? false : true;
    let printContents, popupWin, printbutton;
    printbutton = document.getElementById('inputprintbutton9').style.display = "none";
    printContents = document.getElementById('printDivInvoiceNotSent').innerHTML;
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
  border-bottom : 0.5px solid #ccc;
}

table {
  border-right: 1px solid #ccc;
}

.footerDate {
  border-top: 1px solid #eee;
    margin: 10px 0 0;
    padding-top: 10px;
}
.footerDate p {
    margin: 0 0 4px;
}

      </style>
      </head>
      <body onload="window.print();window.close()"> 

      ${printContents}
      
      </body>
      </html>`);

  //   popupWin.document.write(`
  //       <html>
  //       <head>
  //         <title>Print tab</title>
  //         <style media="print">
          
  //   * {
  //   -webkit-print-color-adjust: exact; /*Chrome, Safari */
  //   color-adjust: exact;  /*Firefox*/
  //   box-sizing: border-box;
  //   font-family: Roboto, "Helvetica Neue", sans-serif;
  //   }
        
  //   .page-break  { display: block; page-break-before: always; }
  //   .row {
  //     display: flex;
  //     flex-wrap: wrap;
  //   }
  //   .col-sm-12 {
  //     flex: 0 0 100%;
  //     max-width: 100%;
  //     position: relative;
  //   }
  //   .font-size{
  //     font-size: 13px;
  //     position: fixed;
  //     bottom: 0;
  //     padding-bottom: 2rem !important;
  //   }
    
  //   .mt-5, .my-5 {
  //     margin-top: 3rem !important;
  //   }
  //   .pb-3{
  //   padding-top: 2rem !important;
  //   padding-bottom: 4rem !important;
  //   }
  //   .pt-5{
  //   padding-top: 5rem !important;
  //   }
  //   .pagebreak {page-break-after: always;}
    
  //   table thead tr:first-child {
  //     background-color: #04773B;
  //     color: #fff;
  //   }
  //    table tbody td .alPrice h6 span {
  //     font-weight: normal;
  //     font-size: 18px;
  //     margin-left: 15px;
  //   }
  //   table{
  //     width : 100% ;
  //   }  
    
    
  //  table tr td:first-child {
  //     border-left: none;
  //     padding: 2px;
  //   }
  //   table th {        
  //     padding: 2px;
  //     border-top: none;
  //     border-left: 1px solid #ccc;
  //   }
    
  // table td  {        
  //      padding: 2px ;
  //     border-top: none;
  //     border-left: 1px solid #ccc;
  //   }
    
  //   table {
  //     border-right: 1px solid #ccc;
  //   }
    
  //         </style>
  //         </head>
  //         <body onload="window.print();window.close()"> 
    
  //         ${printContents}
          
  //         </body>
  //         </html>`)
    printbutton = document.getElementById('inputprintbutton9').style.display = "inline-block";
    popupWin.document.close();

  }

}
