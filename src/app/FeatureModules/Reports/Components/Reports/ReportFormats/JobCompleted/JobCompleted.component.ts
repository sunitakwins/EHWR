/*Core Modules*/
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import * as moment from 'moment';
import { NgxSpinnerService } from 'ngx-spinner';
import { ExcelService } from 'src/app/FeatureModules/Reports/Services/Excel.service';

/* Service */
import { ReportsService } from 'src/app/FeatureModules/Reports/Services/Reports.service';

import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import { MatSnackBarComponent } from 'src/app/SharedModules/Components/Mat-SnackBar/Mat-SnackBar.component';
import { MatSnackBar } from '@angular/material/snack-bar';

interface months {
  value: number;
  viewValue: string;
}

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
  selector: 'app-JobCompleted',
  templateUrl: './JobCompleted.component.html',
  styleUrls: ['./JobCompleted.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})


export class JobCompletedComponent implements OnInit {
  @Input('jobCompletedboolean') jobCompletedboolean: any
  public JobTypePrintForm: FormGroup;
  public printData: any;
  public JobCompletedArray: any = [];
  public jobCompValue1: boolean = false;
  jobCompletedDataValue: boolean = false;
  public years: any = [];
  cusTypeId: any;
  totalAmount: any;
  totalAmountPaid: any;

  noRecordFound: boolean = false;
  initialDate: any;
  endDate: any;
  todayDate: Date;


  constructor(private fb: FormBuilder, private excelService: ExcelService, private spinner: NgxSpinnerService,
    public snackBar: MatSnackBar,
    private reportService: ReportsService) { }

  ngOnInit() {
    this.JobTypePrintForm = this.fb.group({
      from: [moment().startOf('month').format(), Validators.required],
      to: [new Date(), Validators.required],
    })
    this.getYearsList();
  }

  ngOnChanges(): void {
    this.jobCompValue1 = this.jobCompletedboolean.jobCompValue;
    this.cusTypeId = this.jobCompletedboolean.custTypeId;
    // console.log('Job comp :',this.jobCompletedboolean);
  }


  // On month year change
  onMonthYearChange(event: any) {
    let startDate = new Date(event.StartDate);
    let finalDate = new Date(event.FinalDate);
    this.JobTypePrintForm.patchValue({
      from: startDate,
      to: finalDate,
    });
  }

  // clear dates
  clearDate() {
    this.JobTypePrintForm.patchValue({
      from: [],
      to: [],
    })
  }

  // clear filters
  //  clearFilter() {
  //   
  //   this.JobTypePrintForm.patchValue({
  //     customerId: null,
  //   })

  //   //  this.date.patchValue('mm/YYYY');
  // }

  // get year 
  getYearsList() {
    let year = new Date().getFullYear();
    this.years.push(year);
    for (var i = 1; i < 25; i++) {
      this.years.push(year + i);
    }
    //  console.log(this.years);
    let years = this.years;
  }

  // get Data from Api 
  getJobCompletedData() {

    const params = {
      CustomerTypeId: (this.cusTypeId != 5 && this.cusTypeId != undefined) ? this.cusTypeId : -1,
      ReportStartDate: moment(this.JobTypePrintForm.value.from).format('MM/DD/yyyy'),
      ReportEndDate: moment(this.JobTypePrintForm.value.to).format('MM/DD/yyyy')
    }
    if (this.JobTypePrintForm.valid) {
      this.reportService.getJobCompleted(params).subscribe((res: any) => {
        this.JobCompletedArray = res;
        this.noRecordFound = (this.JobCompletedArray.length > 0) ? false : true;
        this.initialDate = moment(this.JobTypePrintForm.value.from).format('DD-MM-yyyy');
        this.endDate = moment(this.JobTypePrintForm.value.to).format('DD-MM-yyyy');
        this.todayDate = new Date();
        if (res.length > 0) {
          this.jobCompletedDataValue = true;
          this.printData = res;
        } else return
        setTimeout(() => {
        }, 500);
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
    if (this.JobTypePrintForm.valid) {
      this.getJobCompletedData();
      setTimeout(() => {
        if (this.jobCompletedDataValue) {
          this.spinner.show();
          let element, fileName;
          fileName = 'JobCompletedData.xlsx';
          element = document.getElementById(`JobCompletedExcelData`);

          this.excelService.exportexcel(element, fileName);
          this.spinner.hide();
        }else{
          let msg = 'No Data found.'
          this.openSnackBar(msg, 'hello');
          setTimeout(() => {
            this.spinner.hide()
          }, 300);
        }
      }, 5000);
      this.spinner.show();
      setTimeout(() => {
    
      }, 2000);
    } else {
      const controls = this.JobTypePrintForm.controls
      Object.keys(controls).forEach(controlName => controls[controlName].markAsTouched());
      return false;
    }

  }

  // ================ print Function======================================
  print() {
    
    if (this.JobTypePrintForm.valid) {
      this.getJobCompletedData();
      //  if(this.printData.length > 0){
      this.spinner.show();
      setTimeout(() => {
        if(this.jobCompletedDataValue){
          let printContents, popupWin, printbutton;
          printbutton = document.getElementById('inputprintbutton3').style.display = "none";
          printContents = document.getElementById('jobCompPrintDiv').innerHTML;
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
              </html>`)
          printbutton = document.getElementById('inputprintbutton3').style.display = "inline-block";
          popupWin.document.close();
          this.spinner.hide();
        }else{
          let msg = 'No Data found.'
          this.openSnackBar(msg, 'hello');
          setTimeout(() => {
            this.spinner.hide()
          }, 300);
        }
      }, 2000)
    } else {
      const controls = this.JobTypePrintForm.controls
      Object.keys(controls).forEach(controlName => controls[controlName].markAsTouched());
      return false;
    }
  }


  openSnackBar(message: string, panelClass: string) {
    this.snackBar.openFromComponent(MatSnackBarComponent, {
      data: message,
      panelClass: panelClass,
      duration: 2000
    });
  }
}
