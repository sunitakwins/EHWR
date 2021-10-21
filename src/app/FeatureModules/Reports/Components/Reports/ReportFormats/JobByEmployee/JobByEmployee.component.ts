import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material/core';
import * as moment from 'moment';
import { EmployeeRequestModel } from 'src/app/FeatureModules/Customer/Models/Jobs/EmployeeRequestModel.model';
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
  selector: 'app-JobByEmployee',
  templateUrl: './JobByEmployee.component.html',
  styleUrls: ['./JobByEmployee.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class JobByEmployeeComponent implements OnInit {
  @Input('jobByEmployeeBoolean') jobByEmployeeBoolean: any
  public jobByEmpValue1: boolean = false;
  public cusTypeId: any;

  public allEmployees: any;
  public employeeOptions: any;

  public jobsByEmployeeData: any;

  public employeeRequestModel = new EmployeeRequestModel();
  noDataFound : boolean = false;


  // =-====
  JobTypePrintForm: FormGroup;
  constructor(private fb: FormBuilder, private excelService: ExcelService,
    private reportService: ReportsService) { }

  ngOnInit() {
    this.JobTypePrintForm = this.fb.group({
      from: [moment().startOf('month').format(), Validators.required],
      to: [new Date(), Validators.required],
      EmployeeId: [''],
    })
    this.getEmployeeBySearch();

  }

  ngOnChanges() {
    this.jobByEmpValue1 = this.jobByEmployeeBoolean.jobByEmployeeValue;
    this.cusTypeId = this.jobByEmployeeBoolean.custTypeId;
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
      // EmployeeId:[],
      // months:[]
    })
  }

  clearFilter() {
    this.JobTypePrintForm.patchValue({
      from: [],
      to: [],
      EmployeeId: [],
      // months:[]
    })
  }


  // get employees
  public displayEmployee(result?: any): string | undefined {
    ;
    return result ? result.employeeName : undefined;
  }

  public searchEmployee(val) {
    this.employeeRequestModel.SearchValue = val;
    this.getEmployeeBySearch();
  }

  // public filterEmployee(val) {
  //   const filterValue = val.toUpperCase();
  //   console.log(filterValue);
  //   this.allEmployees = this.employeeOptions.filter(option => option.employeeName.indexOf(filterValue) === 0);
  // }

  private getEmployeeBySearch() {

    this.reportService.getEmployees(this.employeeRequestModel).subscribe(res => {
      
      this.allEmployees = res;
      this.employeeOptions = res;
    }, error => {
      console.log(error);
    })
  }

  // get Data 
  getJobByEmployeeData() {
    const employeeId = this.JobTypePrintForm.value.EmployeeId.employeeId;

    const params = {
      EmployeeId: (employeeId == null) ? -1 : employeeId,
      CustomerTypeId: (this.cusTypeId != 5 && this.cusTypeId != undefined) ? this.cusTypeId : -1,
      ReportStartDate: moment(this.JobTypePrintForm.value.from).format('MM/DD/yyyy'),
      ReportEndDate: moment(this.JobTypePrintForm.value.to).format('MM/DD/yyyy')
    }

    // console.log(params);
    if (this.JobTypePrintForm.valid) {
      this.reportService.getJobsByEmployee(params).subscribe(res => {

        //  console.log(res);
        this.jobsByEmployeeData = res;
        this.noDataFound = (this.jobsByEmployeeData.length > 0) ? false : true;
       

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
      this.getJobByEmployeeData();
    setTimeout(() => {
      let element, fileName;
      fileName = 'jobsByEmployeeData.xlsx';
      element = document.getElementById(`jobsByEmployeeData`);
      this.excelService.exportexcel(element, fileName);
    }, 2000);
    }else{
      const controls = this.JobTypePrintForm.controls
      Object.keys(controls).forEach(controlName => controls[controlName].markAsTouched());
      return false; 
    }
   
  }


  // Print  =====================================================================
  print() {

    this.getJobByEmployeeData();

    setTimeout(() => {
      let printContents, popupWin, printbutton;
      printbutton = document.getElementById('inputprintbutton12').style.display = "none";
      printContents = document.getElementById('printDivJobsByEmployee').innerHTML;
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
      printbutton = document.getElementById('inputprintbutton12').style.display = "inline-block";
      popupWin.document.close();
    }, 2000)

  }



}
